const puppeteer = require('puppeteer');

async function retrieve(url, width, height, cb) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({
	  width: width,
	  height: height,
	  deviceScaleFactor: 1,
	});

	page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
	await page.goto(url);
	//const bodyHandle = await page.$('body');
	//await page.addScriptTag({'path': 'page-renderer.js'});
	const domTree = await page.evaluate(preprocess);

	//console.log(JSON.stringify(html, null, 2));
	//await bodyHandle.dispose();
	await browser.close();

	cb(domTree);
}

function preprocess() {
	const invalidNodes = ["AREA", "BASE", "BASEFONT", "COL",
	"COLGROUP", "LINK", "MAP", "META", "PARAM", "SCRIPT",
	"STYLE", "TITLE", "!DOCTYPE", "NOSCRIPT"];

	const inlineNodes = ["A", "ABBR", "ACRONYM", "B", "BDO",
		"BIG", "BUTTON", "CITE", "CODE", "DEL", "DFN", "EM",
		"FONT", "I", "IMG", "INPUT", "INS", "KBD", "LABEL",
		"OBJECT", "Q", "S", "SAMP", "SMALL", "SPAN", "STRIKE",
		"STRONG", "SUB", "SUP", "TT", "U", "VAR", "APPLET",
		"SELECT", "TEXTAREA"];

	const lineBreakTerminalNodes = ["IMG", "OBJECT", "AUDIO", "COMMAND", "EMBED",
		"KEYGEN", "METER", "OUTPUT", "PROGRESS", "VIDEO"];

	return traverseDOMTree(document, true, null, 0);

	function traverseDOMTree(root, border, parentBordered, parentZIndex) { //traverse function
		if (! root) {
			return;
		}

		let nodeValue = {
			type: root.nodeType,
			tagName: root.nodeName.toUpperCase(),
			xpath: getPathTo(root),
			children: [],
			id: root.id,
			className: root.className,
			attributes: {
				width: root.offsetWidth,
				height: root.offsetHeight,
				wordCount: getWordCount(root),
				text: getText(root)
			}
		};

		/*setAttribute(root, 'name');
		setAttribute(root, 'value');
		setAttribute(root, 'src');
		setAttribute(root, 'role');
		setAttribute(root, 'hover');
		setAttribute(root, 'for');
		setAttribute(root, 'href');
		setAttribute(root, 'command');
		setAttribute(root, 'type');
		setAttribute(root, 'onFocus');
		setAttribute(root, 'onClick');
		setAttribute(root, 'method');
		setAttribute(root, 'action');
		setAttribute(root, 'alt');
		setAttribute(root, 'title');

		function setAttribute(node, key){
			if(node[key] && node[key] !== 'none'){
				nodeValue.attributes[key] = node[key];
			}
		}

		*/

		const attributes = root.attributes;
		if (attributes) {
			for(let i = attributes.length - 1; i >= 0; i--) {
				const attribute = attributes[i];
				//console.log(attribute.name + "->" + attribute.value);
				nodeValue.attributes[attribute.name] = attribute.value;
			}
		}

		const style = getStyle(root);
		let zIndex = null;
		if(style){
			if(style.zIndex === 'auto'){
				zIndex = parentZIndex;
			} else {
				zIndex = style.zIndex;
			}

			nodeValue.attributes.zIndex = zIndex;
			nodeValue.attributes.fontSize = style.fontSize;
			nodeValue.attributes.fontWeight = style.fontWeight;
			nodeValue.attributes.fontColor = style.color;
			nodeValue.attributes.listStyle = style.listStyle;
			nodeValue.attributes.float = style.float ? style.float : 'none';
			nodeValue.attributes.marginLeft = style.marginLeft;
			nodeValue.attributes.marginRight = style.marginRight;
			nodeValue.attributes.marginTop = style.marginTop;
			nodeValue.attributes.marginBottom = style.marginBottom;
			nodeValue.attributes.paddingLeft = style.paddingLeft;
			nodeValue.attributes.paddingRight = style.paddingRight;
			nodeValue.attributes.paddingTop = style.paddingTop;
			nodeValue.attributes.paddingBottom = style.paddingBottom;
			nodeValue.attributes.border = style.border;
			nodeValue.attributes.borderLeft = style.borderLeft;
			nodeValue.attributes.borderRight = style.borderRight;
			nodeValue.attributes.borderTop = style.borderTop;
			nodeValue.attributes.borderBottom = style.borderBottom;
			nodeValue.attributes.backgroundImage = style.backgroundImage;
			nodeValue.attributes.backgroundColor = style.backgroundColor;
			nodeValue.attributes.background = style.background;
			nodeValue.attributes.clear = style.clear;
			nodeValue.attributes.display = style.display;
		}

		printProperties(root);

		const position = getPosition(root);
		nodeValue.attributes.positionX = position.positionX;
		nodeValue.attributes.positionY = position.positionY;
		nodeValue.attributes.width = position.width;
		nodeValue.attributes.height = position.height;

		for (let i = 0; i < root.childNodes.length; i++){
			const el = root.childNodes[i];
			let childValue = null;
			try {
				if(el.nodeType === Node.COMMENT_NODE){
					// do nothing
				} else if(el.nodeType === Node.TEXT_NODE) {
					const content = el.textContent;
					if(content && content.trim() !== ''){
						const position = getPosition(el);
						nodeValue.attributes.positionX = position.positionX;
						nodeValue.attributes.positionY = position.positionY;
						nodeValue.attributes.width = position.width;
						nodeValue.attributes.height = position.height;

						childValue = {
							type: el.nodeType,
							tagName: 'TEXT',
							xpath: nodeValue.xpath + '/#TEXT',
							children: [],
							id: null,
							className: null,
							attributes: nodeValue.attributes ? deepCopy(nodeValue.attributes) : {}
						};
					}
				} else if(el.nodeName === 'SCRIPT' || el.nodeName === 'HEAD') {
					// do nothing
				} else if(el.nodeName === 'HR' || el.nodeName === 'BR') {
					nodeValue.containsLineBreak = true;

					childValue = {
						type: el.nodeType,
						tagName: el.nodeName,
						xpath: getPathTo(el),
						children: [],
						id: null,
						className: null,
						attributes: nodeValue.attributes ? deepCopy(nodeValue.attributes) : {}
					};
				} else if(el.nodeName === 'HTML') {
					return traverseDOMTree(el, border, border, zIndex);
				} else if(el.nodeName === 'BODY') {
					if(!el.style.backgroundColor){
						el.style.backgroundColor = '#FFF';
					}
					return traverseDOMTree(el, border, border, zIndex);
				} else {
					if(isVisible(el) && !isInvalidNode(el)){
						let isInline = isInlineNode(el);
						printProperties(el);

						if(el.nodeName === 'IMG'){
							nodeValue.containsImage = true;
							nodeValue.imageCount = nodeValue.imageCount ? nodeValue.imageCount + 1 : 1;
						}

						childValue = traverseDOMTree(el, getValidChildCount(el) > 1,
							border, zIndex);

						childValue.inline = isInline;
						childValue.lineBreak = ! isInline;

						if(lineBreakTerminalNodes.indexOf(el.nodeName) > -1) {
							nodeValue.containsLineBreakTerminalNode = true;
							childValue.lineBreakObject = true;
							nodeValue.lineBreakObjectCount = nodeValue.lineBreakObjectCount ?
								nodeValue.lineBreakObjectCount + 1 : 1;
						}
					}
				}
			} catch (e){
				console.log('Error', el.nodeName, el.nodeType, getPathTo(el), JSON.stringify(e));
				return el.nodeName + ' ' + e;
			}

			if(childValue){
				nodeValue.children.push(childValue);
			}
		}

		return nodeValue;
	}

	function getStyle(el) {
		try {
		return (el.nodeName === '#document' || el.nodeName === '#text' || el.nodeName === '#comment' ||
			el.nodeName === 'html') ? null : window.getComputedStyle(el);
		} catch (e) {
			console.log('getStyle', el.nodeName, el.nodeType, getPathTo(el), JSON.stringify(e));
			return null;
		}
	}

	function getText(node){
		if(node.nodeType === Node.TEXT_NODE){
			if(node.nodeValue && node.nodeValue.trim() !== ''){
				return node.nodeValue.trim().toLowerCase();
			}

			return '';
		}

		let textValue = '';
		for (let i = 0; i < node.childNodes.length; i++){
			const child = node.childNodes[i];

			if(child.nodeType === Node.TEXT_NODE && child.nodeValue && child.nodeValue.trim() !== ''){
				textValue += child.nodeValue.trim().toLowerCase() + ' ';
			}
		}

		return textValue;
	}

	function getPosition(el) {
		let position = {};
		if (el.nodeName === '#document' || el.nodeName === '#text') {
			let range = document.createRange();
			range.selectNodeContents(el);
			const rects = range.getClientRects();
			if (rects.length > 0) {
				const rect = rects[0];
				position.positionX = rect.left;
				position.positionY = rect.top;
				position.width = rect.width;
				position.height = rect.height;
			}
		} else {
			try {
				const boundingClientRect = el.getBoundingClientRect();
				position.positionX = boundingClientRect.left;
				position.positionY = boundingClientRect.top;
				position.width = boundingClientRect.width;
				position.height = boundingClientRect.height;

				/*
				if(style){
					nodeValue.attributes.positionX += parseInt(style.marginLeft);
					nodeValue.attributes.positionY += parseInt(style.marginTop);
					nodeValue.attributes.width -= parseInt(style.marginLeft) + parseInt(style.marginRight);
					nodeValue.attributes.height -= parseInt(style.marginTop) + parseInt(style.marginBottom);
				}*/
			} catch (e){
				console.log(el.nodeName, el.nodeType, getPathTo(el), JSON.stringify(e));
			}
		}

		return position;
	}

	function getWordCount(node){
		if(node.sgmWordCount){
			return node.sgmWordCount;
		}

		if(node.nodeType === Node.TEXT_NODE){
			if(node.nodeValue && node.nodeValue.trim() !== ''){
				return node.nodeValue.trim().split(' ').length;
			}

			return 0;
		}

		let wordCount = 0;
		for (let i = 0; i < node.childNodes.length; i++){
			const el = node.childNodes[i];
			wordCount += getWordCount(el);
		}

		node.sgmWordCount = wordCount;
		return wordCount;
	}

	function deepCopy(obj){
		return JSON.parse(JSON.stringify(obj));
	}

	function isInlineNode(el){
		const style = getStyle(el);

		if(style){
			return (style.display === 'inline' ||
				//style.display === 'inline-block' ||
				style.display === 'inline-flex' ||
				style.display === 'inline-table');
		} else {
			return inlineNodes.indexOf(el.nodeName) > -1;
		}
	}

	function isInvalidNode(el){
		return invalidNodes.indexOf(el.nodeName) > -1;
	}

	function printProperties(obj){
		let props = Object.getOwnPropertyNames(obj).filter(function (p) {
			return typeof obj[p] !== 'function';
		});

		props.forEach(function (prop){
			if(obj[prop]/* && obj[prop] !== '' && obj[prop].toString().indexOf('/') > -1*/){
				//console.log(prop + ': ' + obj[prop]);
			}
		});
	}

	function getValidChildCount(parentNode){
		if(parentNode.sgmValidChildCount){
			return parentNode.sgmValidChildCount;
		}

		if(parentNode.nodeName === 'IMG') {
			return 0;
		}

		let validChildCount = 0;
		for (let i = 0; i < parentNode.childNodes.length; i++){
			const el = parentNode.childNodes[i];

			if(el.nodeType === Node.COMMENT_NODE){
				// do nothing
			} else if(el.nodeType === Node.TEXT_NODE) {
				if(el.nodeValue.trim() !== ''){
					validChildCount++;
				}
			} else if(el.nodeName === 'INPUT') {
				if(el.type !== 'hidden'){
					validChildCount++;
				}
			} else if(el.nodeName === 'SCRIPT' || el.nodeName === 'HEAD' || el.nodeName === 'HR' || el.nodeName === 'BR') {
				// do nothing
			} else if(el.nodeName === 'HTML' || el.nodeName === 'BODY') {
				validChildCount++;
			} else {
				if(isVisible(el)){
					validChildCount++;
				}
			}
		}

		parentNode.sgmValidChildCount = validChildCount;

		return validChildCount;
	}

	function getLinebreakChildCount(parentNode){
		let validChildCount = 0;
		for (let i = 0; i < parentNode.childNodes.length; i++){
			const el = parentNode.childNodes[i];

			if(isVisible(el) && !isInvalidNode(el) && !isInlineNode(el) && getValidChildCount(el) > 0){
				validChildCount++;
			}
		}

		return validChildCount;
	}

	function getPathTo(el) {
		if (el.id!==''){
			return '//*[@id=\'' + el.id + '\']';
		}

		if (el===document.body){
			return 'HTML/' + el.tagName;
		}

		let ix=0;
		let siblings= el.parentNode.childNodes;
		for (let i= 0; i<siblings.length; i++) {
			let sibling= siblings[i];
			if (sibling===el){
				return getPathTo(el.parentNode)+'/'+el.tagName+'['+(ix+1)+']';
			}

			if (sibling.nodeType===Node.ELEMENT_NODE && sibling.tagName===el.tagName){
				ix++;
			}
		}
	}

	function isVisible(el){
		if(el.sgmIsVisible){
			return el.sgmIsVisible;
		}

		if(isInvalidNode(el)){
			el.sgmInvisibilityReason = 'Invalid node';
			el.sgmIsVisible = false;
			return false;
		}

		var style = getStyle(el);

		if(style){
			if(style.display === 'none'){
				el.sgmInvisibilityReason = 'Display none';
				el.sgmIsVisible = false;
				return false;
			}

			if(style.opacity === 0 || style.opacity === '0' || style.opacity === '0.0'){
				el.sgmInvisibilityReason = 'Opacity is 0';
				el.sgmIsVisible = false;
				return false;
			}

			if(style.visibility === 'hidden' || style.visibility === 'collapse'){
				el.sgmInvisibilityReason = 'Visibility hidden';
				el.sgmIsVisible = false;
				return false;
			}

			if(+el.offsetWidth === 0 && +el.offsetHeight === 0 && style.height === 'auto' &&
				getValidChildCount(el) > 0){
				el.sgmIsVisible = true;
				return true;
			}

			if(+el.offsetWidth <= 1 && getValidChildCount(el) === 0){
				el.sgmInvisibilityReason = 'Width <= 1 && no valid children';
				el.sgmIsVisible = false;
				return false;
			}

			if(+el.offsetHeight <= 1 && getValidChildCount(el) === 0){
				el.sgmInvisibilityReason = 'Height <= 1 && no valid children';
				el.sgmIsVisible = false;
				return false;
			}

			var rect = el.getBoundingClientRect();
			if(+rect.bottom < 0 || +rect.right < 0){
				el.sgmInvisibilityReason = 'Out of window';
				el.sgmIsVisible = false;
				return false;
			}

			if(+el.offsetWidth === 1 && +el.offsetHeight === 1){
				el.sgmInvisibilityReason = 'Width = 1 && height = 1';
				el.sgmIsVisible = false;
				return false;
			}

			if(style.textIndent && style.textIndent !== '0px'&& !(style && style.backgroundImage &&
				style.backgroundImage !== 'none' && el.offsetHeight > 0) &&
				(parseInt(style.textIndent, 10) + el.offsetWidth < 0)){
				el.sgmInvisibilityReason = 'Text indent';
				el.sgmIsVisible = false;
				return false;
			}

			/*if(style.lineHeight){
				if(parseInt(style.lineHeight, 10) === 0){
					el.sgmIsVisible = false;
					return false;
				}
			}*/
		}

		if(el.nodeType === Node.TEXT_NODE) {
			return el.nodeValue.trim() !== '';
		} else if(el.nodeName === 'INPUT') {
			if(el.type === 'hidden'){
				el.sgmInvisibilityReason = 'Hidden input';
				el.sgmIsVisible = false;
				return false;
			}
			// do nothing
		} else if(el.nodeName === 'IMG' || el.nodeName === 'LI' || el.nodeName === 'OBJECT' ||
			el.nodeName === 'IFRAME') {
			// do nothing
		} else {
			var isElementVisible = getValidChildCount(el) > 0;
			el.sgmIsVisible = isElementVisible;

			/* height check is added to prevent decorational nodes to be selected as valid blocks. */
			if(! isElementVisible && (style && style.backgroundImage && style.backgroundImage !== 'none' &&
				el.offsetHeight > 40)){
				el.isBackgroundImage = true;
				isElementVisible = true;
			}

			if(! isElementVisible){
				el.sgmInvisibilityReason = 'No valid children';
			}

			return isElementVisible;
		}

		el.sgmIsVisible = true;
		return true;
	}
}

module.exports.retrieve = retrieve;
module.exports.preprocess = preprocess;
