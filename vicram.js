const puppeteer = require('puppeteer');
const renderer = require('./page-renderer');
const pageSegmenter = require('./page-segmenter');
const logger = require('./logger');
const urlValidator = require('valid-url');

function calculateVicram(body, callback) {
	let url = body.url;
	let width = +body.width ? body.width : 1920;
	let height = +body.height ? body.height : 1080;
	let errorMessage = null;

	if(! urlValidator.isWebUri(url)){
		logger.error("Invalid url:" + url);
		return callback("Invalid url!", null);
	}

	if(width < 0){
		logger.error("Invalid width:" + width);
		return callback("Invalid width!", null);
	}

	if(height < 0){
		logger.error("Invalid height:" + height);
		return callback("Invalid height!", null);
	}

	const t0 = Date.now();

	retrieve(url, width, height, body, function(error, vicramScore) {
		if (error) {
			return callback(error, null);
		}

		const t1 = Date.now();

		let blockTree = null;
		const nodeTree = vicramScore.nodeTree;

		if(nodeTree){
			blockTree = pageSegmenter.segment(nodeTree, width, height);
		}

		let numberOfBlocks = blockTree.getOverallBlockCount();
		let numberOfLeaves = blockTree.getOverallLeafCount();
		let depth = blockTree.getDepth();

		if(errorMessage){
			return callback(errorMessage, null);
		}

		const tlc = vicramScore.tlc;
		const wordCount = vicramScore.wordCount;
		const imageCount  = vicramScore.imageCount;

		const t2 = Date.now();

		callback(null, {
			vicram: calculateVcs(tlc, wordCount, imageCount),
			numberOfBlocks: calculateVcs(numberOfBlocks, wordCount, imageCount),
			numberOfLeaves: calculateVcs(numberOfLeaves, wordCount, imageCount),
			depth: calculateVcs(depth, wordCount, imageCount),
			renderingTime: t1 - t0,
			segmentationTime: t2 - t1
		});
	});
}

function calculateVcs(block, wordCount, imageCount){
	let vcs = (1.743 + 0.097 * (block) + 0.053 * (wordCount) + 0.003 * (imageCount)) / 10;

	if(vcs > 10){
		return 10.0;
	}

	return vcs;
}

async function retrieve(url, width, height, options, cb) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({
		width: width,
		height: height
	});

	if (options.pageLogs) {
		page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
	}

	const pageConfig = {
		timeout: options.timeout,
		waitUntil: options.waitUntil
	};

	page.goto(url, pageConfig)
	.then(async (result) => {
		if (options.waitForTimeout && options.waitForTimeout > 0) {
			await page.waitForTimeout(options.waitForTimeout);
		}

		if (options.screenshot) {
			await page.screenshot({
				path: 'images\\' + options.screenshotFileName + '.png',
				fullPage: options.fullPage,
				captureBeyondViewport: false
			});
		}

		const vicramScore = await page.evaluate(process);
		vicramScore.nodeTree = await page.evaluate(renderer.preprocess);

		await browser.close();

		cb(null, vicramScore);
	}).catch(async (err) => {
		await browser.close();

		cb(err.message, null);
	});;
}

function process() {
	let links;
	let imageCount;
	let tables;
	let paragraphs;
	let formCount;
	let rows;
	let columns;
	let lists;
	let listItems;
	let wordCount;
	let blocks;
	let tlc;
	let insideList = false;
	let display;
	let layoutTable;
	let div;
	let findName = true;
	let isLayout;
	let dataTables;
	let isTLC = false;
	let blockChild;
	let headingTLC;
	let singlesChildren;
	let lastIsImg;
	let len;
	let borderWidth;
	let visibleBorder;

	return calculateVicramScore(document);

	function calculateVicramScore(root) {
		if (!root) {
			return {
				"err": "doc is null"
			};
		} else {
			let body = getBodyNode(root);

			if (!body) {
				return {
					"err": "body is null"
				};
			}

			// reset variables to zero/false appropriately
			links = 0;
			lists = 0;
			imageCount = 0;
			wordCount = 0;
			blocks = 0;
			tlc = 0;
			tables = 0;
			layoutTable = 0;
			div = 0;
			dataTables = 0;
			isTLC = false;
			headingTLC = false;
			singlesChildren = false;
			lastIsImg = false;
			visibleBorder = false;

			listItems = 0;
			paragraphs = 0;
			formCount = 0;
			rows = 0;
			columns = 0;

			// Elements Counter
			countElements(body);

			// Block Counter
			for (let i = 0; i < body.childNodes.length; i++) {
				findName = true;
				singlesChildren = false;
				isTLC = false;
				headingTLC = false;
				countTLC(body.childNodes[i]);
			}

			/*
			 * Visual Complexity Score calculation
			 */
			/*console.log('tlc: ' + tlc);
            console.log('word count: ' + wordCount);
            console.log('image count: ' + imageCount);

            console.log('links: ' + links);
            console.log('tables: ' + tables);
            console.log('paragraphs: ' + paragraphs);
            console.log('formCount: ' + formCount);
            console.log('rows: ' + rows);
            console.log('columns: ' + columns);
            console.log('lists: ' + lists);
            console.log('list items: ' + listItems);
            console.log('blocks: ' + blocks);*/

			return {
				tlc: tlc,
				wordCount: wordCount,
				imageCount: imageCount
			};
		}
	}

	function getBodyNode(root) {
		for (let i = 0; i < root.childNodes.length; i++) {
			const child = root.childNodes[i];

			for (let j = 0; j < child.childNodes.length; j++) {
				const childChild = child.childNodes[j];

				if (isTextEqualTo(childChild.nodeName, 'body')) {
					return childChild;
				}
			}
		}

		return null;
	}


	function countElements(el) {
		if (!el || el.nodeType === Node.COMMENT_NODE) {
			return;
		}

		const type = el.nodeType;

		if (type === Node.DOCUMENT_NODE) {
			// recurse through the node to find the rest of the counters
			for (let i = 0; i < el.childNodes.length; i++) {
				if (el.childNodes[i].nodeType === Node.ELEMENT_NODE) {
					countElements(el.childNodes[i]);
				}
			}
		} else if (type === Node.ELEMENT_NODE) {
			// checks and counts the type of element
			const nodeName = el.nodeName;
			if (isTextEqualTo(nodeName, 'a')) {
				links++;
			} else if (isTextEqualTo(nodeName, 'p')) {
				paragraphs++;
			} else if (isTextEqualTo(nodeName, 'img')) {
				imageCount++;
			} else if (isTextEqualTo(nodeName, 'form')) {
				formCount++;
			} else if (isTextEqualTo(nodeName, 'div')) {
				div++;
			} else if (isTextEqualTo(nodeName, 'table')) {
				tables++;
			} else if (isTextEqualTo(nodeName, 'ul') || isTextEqualTo(nodeName, 'ol')) {
				lists++;
				insideList = true;
			} else if (isTextEqualTo(nodeName, 'li')) {
				listItems++;
			}

			// recurse through the node to find the rest of the counters
			if (!isTextEqualTo(nodeName, 'head') && !isTextEqualTo(nodeName, 'title') &&
				!isTextEqualTo(nodeName, 'script') && !isTextEqualTo(nodeName, 'style') &&
				!isTextEqualTo(nodeName, 'noscript')) {
				for (let j = 0; j < el.childNodes.length; j++) {
					countElements(el.childNodes[j]);
				}
			}
		} else if (+type === +Node.TEXT_NODE) {
			const content = el.textContent;

			if (content && content.trim() !== '') {
				wordCount += getTokenCount(content);

				//console.log(wordCount + ' -> ' + content);
			}
		}// ends if (type == Node.TEXT_NODE)
	}

	function getTokenCount(textContent) {
		if (textContent) {
			let count = 0;
			const segments = textContent.split(/[\s\.\?!@#\$&\*\/\-,:<>\(\)"'~;=_\|]/);

			segments.forEach(function (segment) {
				if (segment !== '') {
					count++;
				}
			});

			return count;
		}

		return 0;
	}

	function singleChildren(node, length) {
		const nodeLength = length;

		// need to check all the node/tree
		if (nodeLength === 1 || nodeLength === 0) {
			if (!isTextEqualTo(node.nodeName, 'table') && !isTextEqualTo(node.nodeName, 'tbody')) {
				// if singlesChildren == true then need to check if the display
				// is block if its zero
				if (nodeLength === 0 && isTextEqualTo(display, 'block')) {
					singlesChildren = true;
				} else if (nodeLength === 1) {
					singlesChildren = true;
				} else {
					singlesChildren = nodeLength === 0 && isTextEqualTo(node.nodeName, 'img');
				}
			}
		}

		return singlesChildren;
	}

	function getComputedStyleOfElement(node) {
		if (node) {
			const name = node.nodeName;

			if (name === '#document' || name === '#text' ||  name === '#comment' || name === 'html') {
				return null;
			} else {
				return window.getComputedStyle(node);
			}
		}

		return null;
	}

	/*
	 * boolean tableCellLayout(node) This method is a help method for
	 * calculateTLC(). It determines the number of column and rows a node that
	 * identidied as table has and returns true if the table is used for layout
	 */

	function tableCellLayout(node) {
		isLayout = false;
		let tableRows = 0,
			tableCols = 0;

		// table-->tbody-->tr-->td
		// get the children nodes of the tbody
		let tbody = node.childNodes[0];
		if (tbody) {
			let tbodyNodes = tbody.childNodes;
			// System.out.println(childNodes);
			for (let i = 0; i < tbodyNodes.length; i++) {
				const trNode = tbodyNodes[i];
				if (isTextEqualTo(trNode.nodeName, "tr")) {
					rows++;
					tableRows++;
				}// ends if

				// get the children of TR to find TD count
				const trChildNodes = trNode.childNodes;
				for (let j = 0; j < trChildNodes.length; j++) {
					const trNode = trChildNodes[j];
					if (isTextEqualTo(trNode.nodeName, "td")) {
						tableCols++;
						columns++;
					}
				}// ends j-for
			}// ends i-for
		}

		if (tableRows === 1 || tableCols === 1) {
			layoutTable++;
			isLayout = true;
		} else if (tableRows === tableCols) {
			if (tableRows !== 0 && tableCols !== 0) {
				layoutTable++;
				isLayout = true;
			}
		}

		return isLayout;
	}// ends tableCellLayout

	function isTextEqualTo(sourceText, targetText) {
		if (sourceText && targetText) {
			return sourceText.trim().toLowerCase() === targetText.trim().toLowerCase();
		}

		return false;
	}

	function countTLC(node) {
		if (!node) {
			return 0;
		}

		const type = node.nodeType;
		let px;

		if (+type === +Node.DOCUMENT_NODE || isTextEqualTo(node.nodeName, 'html') ||
			isTextEqualTo(node.nodeName, 'body')) {
			for (let i = 0; i < node.childNodes.length; i++) {
				if (node.childNodes[i].nodeType === Node.ELEMENT_NODE) {
					countTLC(node.childNodes[i]);
				}
			}
		} else if (+type === +Node.ELEMENT_NODE) {
			if (isTextEqualTo(node.nodeName, 'head')) {
				return 0;
			}

			const style = getComputedStyleOfElement(node);

			if (style) {
				display = style.display;
				borderWidth = parseInt(style.borderLeftWidth) +
					parseInt(style.borderRightWidth) +
					parseInt(style.borderTopWidth) +
					parseInt(style.borderBottomWidth);

				// STEP 1. <div> elements If the node is a <div> element & has a
				// visible border => we flag that the node has a visibleBorder:
				// 1. Get border attributes: borderWidth returns medium or Npx
				// (N=number) need to check if the borderWidth is a number and
				// is >0
				//
				// 2. If border width contains a number of pixels as Npx, we use
				// StringTokenizer to get the string that contains the string
				// part with the px string in it some elements have different px
				// for left/right etc (e.g - borderWidth = medium medium 5px)

				if (isTextEqualTo(node.nodeName, "div")) {
					px = +borderWidth;
					visibleBorder = px > 0;
				}
			}// ends style info extraction

			if (!display) {
				display = "";
			}

			// STEP 2. Node is display=block && has no block children (this step
			// is to flag elements such as standaline images) => lastIsImg flag
			// 1. Get the NodeList of the current node and find the number of
			// children that are type=1 ONLY
			//
			// 2. If there is only one type 1 child, we check if it is an <img>
			// and we flag as true

			const children = node.childNodes;
			len = 0;
			for (let j = 0; j < children.length; j++) {
				if (children[j].nodeType === 1) {
					len++;
				}
			}

			blockChild = false;
			lastIsImg = false;
			const nodeName = node.nodeName;
			if (len === 1) {
				for (let k = 0; k < children.length; k++) {
					if (isTextEqualTo(children[k].nodeName, 'img')) {
						lastIsImg = true;
					}
				}
			}// ends if len==1

			// STEP 3. blockChild: Determine if the node has only one child
			// (singleChildren - method) and if it is displayed as block or
			// table:
			//
			// 1. Determine if it is a singleChildren (see respective method)
			//
			// 2. Determine if it is a blockChild, that is displayed as a block
			// or table no matter of the output of singleChildren
			//
			// 3. If display=block && blockChild==false => tlc
			//
			// 4. else If singleChild==true && isTLC==false => tlc
			//
			// We need to follow these steps because if the last child is an
			// image then it is a tlc BUT then might have multiple TLCs! So, we
			// need to check that the img is the ONLY children and that the tag
			// is a series of singles children
			//
			// NOTE: this needs to be visited only once per node so we use a
			// boolean flag findName which needs to be reset to true on the main
			// method.
			//
			// Also, isTLC is used to make sure that a node is only once
			// identified as tlc and avoid duplicates

			if (findName) {
				if (children && children.length > 0) {
					singleChildren(node, len);
					for (let l = 0; l < len; l++) {
						// need to check each child's display attribute and
						// whether is a singleChildren
						// insert a flag - if there is at least one block level
						// element child then flag as true
						// blockChild are blocks!
						const childNode = children[l];
						//NodeList childNodeList = childNode.getChildNodes();
						//int length = childNodeList.getLength();
						singleChildren(node, len);

						const childStyle = getComputedStyleOfElement(childNode);
						if (childStyle) {
							const displayChild = childStyle.display;
							if (isTextEqualTo(displayChild, "block") ||
								isTextEqualTo(display, "table")) {
								//console.log('1 ' + node.nodeName);
								blockChild = true;
							}
						}
					}// end for-loop
				}// end if not null children

				if (isTextEqualTo(display, "block") && !blockChild) {
					//console.log('1 ' + node.nodeName);
					tlc++;
					isTLC = true;
				} else if (singlesChildren && !isTLC) {
					//console.log('2 ' + node.nodeName);
					tlc++;
					isTLC = true;
				}
				findName = false;
			}// ends if findName == true

				// STEP 4. <div> element and a visible border => tlc We run this
				// step here and not earlier to avoid duplicates. A <div> with
				// visible border could contain an img as a singleChildren or is
			// displayed as block element (see Step 3)

			else if (isTextEqualTo(nodeName, "div")) {
				if (visibleBorder) {
					//console.log('3 ' + node.nodeName);
					tlc++;
					isTLC = true;
				}
			}// ends if <div> and visible border

				// STEP 5. If a block displayed element has block-displayed children
				// THis step leads to a set of substeps described where appropriate
				// (5a-5c).
				//
				// Step 5 is also recursive for some substeps (5c and 5c):
				//
				// (i). Node is displayed as block/table or display starts with
				// table
				//
				// (ii). If the node is a <div> element, has visible border and is
				// not used for Layout => tlc
				//
				// (iii). else if the node is a heading <h1> or <h2> => tlc && flag
				// that is identified as heading
				//
				// (iv). else if <h3> && headingTLC==false => tlc
				//
				// (v). else if <h4> && headintTLC==false => tlc
				//
				// (vi). else if the node is a table and has visible border need to
				// make sure if the table is used for data or layout if the table
				// has a caption or a theading => then it would be a data table
				// which we count as one tlc if the table has only visible border
				// for now we count it as a tlc tlc++ if (one of those else if
				// statements): a. dataTable==true && isTLC==false
				//
				// b. dataTalbe==false && isLayout==true (table is used for layout
				// see respective method)
				//
				// c. isLayout == false && blockChilNodes==true
				//
			// d. nodeName.equalsIgnoreCase("div")


			else if (display && (isTextEqualTo(display, "block") || isTextEqualTo(display, "table") ||
				display.indexOf("table") === 0)) {

				// step 5(ii)
				if (isTextEqualTo(nodeName, "div")) {
					if (visibleBorder && !isLayout) {
						//console.log('4 ' + node.nodeName);
						tlc++;
						isTLC = true;
					}
				}
					// step 5(iii) --flag that already identified tlc based on
				// headings
				else if (isTextEqualTo(nodeName, "h1") || isTextEqualTo(nodeName, "h2")) {
					//console.log('5 ' + node.nodeName);
					tlc++;
					isTLC = true;
					headingTLC = true;
				}
				// step 5(iv)
				else if (!headingTLC && isTextEqualTo(nodeName, "h3")) {
					//console.log('6 ' + node.nodeName);
					tlc++;
					isTLC = true;
				}
				// step 5(v)
				else if (!headingTLC && isTextEqualTo(nodeName, "h4")) {
					//console.log('7 ' + node.nodeName);
					tlc++;
					isTLC = true;
				}

				// step 5(vi)
				else if (isTextEqualTo(nodeName, "table") || display.indexOf("table") > -1) {
					let dataTable = false;
					let blockChildNodes = false;

					const tChildren = node.childNodes;
					if (tChildren) {
						for (let m = 0; m < tChildren.length; m++) {
							// need to check if the table's children are thead
							// or caption

							const tChild = tChildren[m];
							if (isTextEqualTo(tChild.nodeName, "thead") ||
								isTextEqualTo(tChild.nodeName, "caption")) {
								dataTable = true;
								dataTables++;
							}

							// check if there are block level child nodes
							const childStyle = getComputedStyleOfElement(tChild);
							if (childStyle) {
								const displayChild = childStyle.display;
								if (isTextEqualTo(displayChild, "block") ||
									isTextEqualTo(display, "table")) {
									blockChildNodes = true;
								}
							}
						}// ends for-loop
					}

					if (!isTLC && dataTable) {
						//console.log('8 ' + node.nodeName);
						tlc++;
						isTLC = true;
					} else if (!dataTable) {
						tableCellLayout(node);
						if (isLayout) {
							if (!isTLC) {
								//console.log('9 ' + node.nodeName);
								tlc++;
								isTLC = true;
							}
						} else if (!isLayout && blockChildNodes) {
							//console.log('10 ' + node.nodeName);
							tlc++;
							isTLC = true;
						} else if (isTextEqualTo(nodeName, "div")) {
							//console.log('11 ' + node.nodeName);
							tlc++;
							isTLC = true;
						}
					}// ends if dataTable=false
				}// ends else-if table
			}// ends else-if block

			// Recurse through the rest of the childrenNodes
			for (let w = 0; w < node.childNodes.length; w++) {
				visibleBorder = false;
				countTLC(node.childNodes[w]);
			}

		}// end if element node

		return tlc;
	}
}

module.exports.calculateVicram = calculateVicram;
module.exports.calculateVcs = calculateVcs;
