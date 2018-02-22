var links, imageCount, tables, paragraphs, formCount,
	rows, columns, lists,
	listItems, wordCount, blocks, TLC;
	
var insideLink = false,
	insideList = false,
	insideTableRow = false,
	insideTableCol = false;
var backgroundColor;
var display;
var backgroundColorParent;
var layoutTable;
var div;
var findName = true;
var isLayout;
var dataTables;
var isTLC = false;
var backgroundDif;
var backgroundColorGrandParent;
var blockChild;
var headingTLC;
var singlesChildren;
var lastIsImg;
var len;
var borderWidth;
var borderLen;
var visibleBorder;

function calculateVicramScore(root) {
	if (root == null) {
		return "doc is null";
	} else {
		// reset variables to zero/false appropriately
		links = 0;
		lists = 0;
		imageCount = 0;
		wordCount = 0;
		blocks = 0;
		TLC = 0;
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
		countElements(root);
		
		// Block Counter
		for (var i = 0; i < root.childNodes.length; i++){
			findName = true;
			singlesChildren = false;
			isTLC = false;
			headingTLC = false;
			countTLC(root.childNodes[i]);
		}
		
		/*
		 * Visual Complexity Score calculation
		 */
		 
		 console.log('TLC: ' + TLC);
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
		 console.log('blocks: ' + blocks);
		 
		 
		var VCS = (1.743 + 0.097 * (TLC) + 0.053 * (wordCount) + 0.003 * (imageCount)) / 10;
		if (VCS > 10) {
			VCS = 10.0;
		}

		return VCS;
	}
}

function countElements(el){
	if (el == null){
		return;
	}
		
	var type = el.nodeType;
	
	if(type === Node.COMMENT_NODE){
		// do nothing
	} else if(type === Node.DOCUMENT_NODE){
		// recurse through the node to find the rest of the counters
		for (var i = 0; i < el.childNodes.length; i++){
			if(el.childNodes[i].nodeType === Node.ELEMENT_NODE){
				countElements(el.childNodes[i]);
			}
		}
	} else if (type === Node.ELEMENT_NODE) {
		// checks and counts the type of element
		var nodeName = el.nodeName;
		if (isTextEqualTo(nodeName, 'a')){
			links++;
		} else if (isTextEqualTo(nodeName, 'p')){
			paragraphs++;
		} else if (isTextEqualTo(nodeName, 'img')){
			imageCount++;
		} else if (isTextEqualTo(nodeName, 'form')){
			formCount++;
		} else if (isTextEqualTo(nodeName, 'div')){
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
		if(! isTextEqualTo(nodeName, 'head') && ! isTextEqualTo(nodeName, 'title') && ! isTextEqualTo(nodeName, 'script') && ! isTextEqualTo(nodeName, 'style') && ! isTextEqualTo(nodeName, 'noscript')){
			for (var i = 0; i < el.childNodes.length; i++){
				countElements(el.childNodes[i]);
			}
		}
	} else if (type == Node.TEXT_NODE) {
		var content = el.textContent;
		
		if (content && content.trim() !== '') {
			wordCount += getWordCount(content);
			
			//console.log(wordCount + ' -> ' + content);
		}
	}// ends if (type == Node.TEXT_NODE)
}

function getWordCount(textContent){
	if(textContent){
		var count = 0;
		var segments = textContent.split(/[\s\.\?!@#\$&\*\/\-,:<>\(\)"'~;=_\|]/);
		
		segments.forEach(function(segment){
			if(segment !== ''){
				count++;
			}
		});
		
		return count;
	}
	
	return 0;
}

function singleChildren(node, length) {
	var nodeLength = length;
	
	// need to check all the node/tree
	if (nodeLength === 1 || nodeLength === 0) {
		if (! isTextEqualTo(node.nodeName, 'table') && ! isTextEqualTo(node.nodeName, 'tbody')) {
			// if singlesChildren == true then need to check if the display
			// is block if its zero
			if (nodeLength === 0 && isTextEqualTo(display, 'block')){
				singlesChildren = true;
			} else if (nodeLength === 1) {
				singlesChildren = true;
			} else if (nodeLength === 0 && isTextEqualTo(node.nodeName, 'img')){
				singlesChildren = true;
			} else {
				singlesChildren = false;
			}
		}
	}
	
	return singlesChildren;
}

/*
 * boolean tableCellLayout(node) This method is a help method for
 * calculateTLC(). It determines the number of column and rows a node that
 * identidied as table has and returns true if the table is used for layout
 */

function tableCellLayout(node) {
	isLayout = false;
	var tableRows = 0,
		tableCols = 0;
	
	// table-->tbody-->tr-->td
	// get the children nodes of the tbody
	var tbody = node.childNodes[0];
	if (tbody) {
		var tbodyNodes = tbody.childNodes;
		// System.out.println(childNodes);
		for (var i = 0; i < tbodyNodes.length; i++) {
			var trnode = tbodyNodes[i];
			if (isTextEqualTo(trnode.nodeName, "tr")) {
				rows++;
				tableRows++;
			}// ends if
			
			// get the children of TR to find TD count
			var trChildNodes = trnode.childNodes;
			for (var j = 0; j < trChildNodes.length; j++) {
				var tdnode = trChildNodes[j];
				if (isTextEqualTo(tdnode.nodeName, "td")) {
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

function isTextEqualTo(sourceText, targetText){
	if(sourceText && targetText){
		return sourceText.trim().toLowerCase() === targetText.trim().toLowerCase();
	}
	
	return false;
}

function countTLC(node){
	if (! node){
		return 0;
	}
	
	var type = node.nodeType;
	if (type == Node.DOCUMENT_NODE) {
		for (var i = 0; i < el.childNodes.length; i++){
			if(el.childNodes[i].nodeType === Node.ELEMENT_NODE){
				countTLC(el.childNodes[i]);
			}
		}
	} else if (type === Node.ELEMENT_NODE) {
		if(isTextEqualTo(node.nodeName, 'head') ){
			return 0;
		}
		
		var style = window.getComputedStyle(node);
		
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
				if (px > 0) {
					visibleBorder = true;
				} else {
					visibleBorder = false;
				}
			}
		}// ends style info extraction
		
		if (! display) {
			display = "";
		}

		// STEP 2. Node is display=block && has no block children (this step
		// is to flag elements such as standaline images) => lastIsImg flag
		// 1. Get the NodeList of the current node and find the number of
		// children that are type=1 ONLY
		// 
		// 2. If there is only one type 1 child, we check if it is an <img>
		// and we flag as true

		var children = node.childNodes;
		len = 0;
		for (var i = 0; i < children.length; i++) {
			if (children[i].nodeType == 1){
				len++;
			}
		}

		blockChild = false;
		lastIsImg = false;
		var nodeName = node.nodeName;
		if (len === 1) {
			for (var i = 0; i < children.lenght; i++) {
				if (isTextEqualTo(children[i].nodeName, 'img')) {
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
		// 3. If display=block && blockChild==false => TLC
		// 
		// 4. else If singleChild==true && isTLC==false => TLC
		// 
		// We need to follow these steps because if the last child is an
		// image then it is a TLC BUT then might have multiple TLCs! So, we
		// need to check that the img is the ONLY children and that the tag
		// is a series of singles children
		// 
		// NOTE: this needs to be visited only once per node so we use a
		// boolean flag findName which needs to be reset to true on the main
		// method.
		// 
		// Also, isTLC is used to make sure that a node is only once
		// identified as TLC and avoid duplicates
		
		if (findName) {
			if (children && children.length > 0) {
				singleChildren(node, len);
				for (var i = 0; i < len; i++) {
					// need to check each child's display attribute and
					// whether is a singleChildren
					// insert a flag - if there is at least one block level
					// element child then flag as true
					// blockChild are blocks!
					childNode = children[i];
					//NodeList childNodeList = childNode.getChildNodes();
					//int length = childNodeList.getLength();
					singleChildren(node, len);
					
					var childStyle = window.getComputedStyle(childNode);
					if (childStyle) {
						var displayChild = childStyle.display;
						if (isTextEqualTo(displayChild, "block") || isTextEqualTo(display, "table")){
							blockChild = true;
						}
					}
				}// end for-loop
			}// end if not null children

			if (isTextEqualTo(display, "block") && ! blockChild) {
				TLC++;
				isTLC = true;
			}

			else if (singlesChildren && ! isTLC) {
				TLC++;
				isTLC = true;
			}
			findName = false;
		}// ends if findName == true

		// STEP 4. <div> element and a visible border => TLC We run this
		// step here and not earlier to avoid duplicates. A <div> with
		// visible border could contain an img as a singleChildren or is
		// displayed as block element (see Step 3)
		
		else if (isTextEqualTo(nodeName, "div")) {
			if (visibleBorder) {
				TLC++;
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
		// not used for Layout => TLC
		// 
		// (iii). else if the node is a heading <h1> or <h2> => TLC && flag
		// that is identified as heading
		// 
		// (iv). else if <h3> && headingTLC==false => TLC
		// 
		// (v). else if <h4> && headintTLC==false => TLC
		// 
		// (vi). else if the node is a table and has visible border need to
		// make sure if the table is used for data or layout if the table
		// has a caption or a theading => then it would be a data table
		// which we count as one TLC if the table has only visible border
		// for now we count it as a TLC TLC++ if (one of those else if
		// statements): a. dataTable==true && isTLC==false
		// 
		// b. dataTalbe==false && isLayout==true (table is used for layout
		// see respective method)
		// 
		// c. isLayout == false && blockChilNodes==true
		// 
		// d. nodeName.equalsIgnoreCase("div")
		 

		else if (display && (isTextEqualTo(display, "block") || isTextEqualTo(display, "table") || display.indexOf("table") === 0)) {
			// step 5(ii)
			if (isTextEqualTo(nodeName, "div")) {
				if (visibleBorder && ! isLayout) {
					TLC++;
					isTLC = true;
				}
			}
			// step 5(iii) --flag that already identified TLC based on
			// headings
			else if (isTextEqualTo(nodeName, "h1") || isTextEqualTo(nodeName, "h2")) {
				TLC++;
				isTLC = true;
				headingTLC = true;
			}
			// step 5(iv)
			else if (! headingTLC && isTextEqualTo(nodeName, "h3")) {
				TLC++;
				isTLC = true;
			}
			// step 5(v)
			else if (! headingTLC && isTextEqualTo(nodeName, "h4")) {
				TLC++;
				isTLC = true;
			}

			// step 5(vi)
			else if (isTextEqualTo(nodeName, "table") || display.indexOf("table") > -1) {
				var dataTable = false;
				var blockChilNodes = false;
				
				var tchildren = node.childNodes;
				if (tchildren) {
					for (var i = 0; i < tchildren.length; i++) {
						// need to check if the table's children are thead
						// or caption
						
						var tchild = tchildren[i];
						if (isTextEqualTo(tchild.nodeName, "thead") || isTextEqualTo(tchild.nodeName, "caption")) {
							dataTable = true;
							dataTables++;
						}
						
						// check if there are block level child nodes
						var childStyle = window.getComputedStyle(tchild);
						if(childStyle){
							var displayChild = childStyle.display;
							if (isTextEqualTo(displayChild, "block") || isTextEqualTo(display, "table")){
								blockChilNodes = true;
							}
						}
					}// ends for-loop
				}

				if (! isTLC && dataTable) {
					TLC++;
					isTLC = true;
				} else if (! dataTable) {
					tableCellLayout(node);
					if (isLayout) {
						if (! isTLC) {
							TLC++;
							isTLC = true;
						}
					} else if (! isLayout && blockChilNodes) {
						TLC++;
						isTLC = true;
					} else if (isTextEqualTo(nodeName, "div")) {
						TLC++;
						isTLC = true;
					}
				}// ends if dataTable=false
			}// ends else-if table
		}// ends else-if block
		
		// Recurse through the rest of the childrenNodes
		for (var i = 0; i < node.childNodes.length; i++){
			visibleBorder = false;
			countTLC(node.childNodes[i]);
		}
		
	}// end if element node

	return TLC;
}