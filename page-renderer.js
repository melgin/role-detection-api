var colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
		
var invalidNodes = ["AREA", "BASE", "BASEFONT", "COL",
	"COLGROUP", "LINK", "MAP", "META", "PARAM", "SCRIPT",
	"STYLE", "TITLE", "!DOCTYPE", "NOSCRIPT"];

var inlineNodes = ["A", "ABBR", "ACRONYM", "B", "BDO",
	"BIG", "BUTTON", "CITE", "CODE", "DEL", "DFN", "EM",
	"FONT", "I", "IMG", "INPUT", "INS", "KBD", "LABEL",
	"OBJECT", "Q", "S", "SAMP", "SMALL", "SPAN", "STRIKE",
	"STRONG", "SUB", "SUP", "TT", "U", "VAR", "APPLET",
	"SELECT", "TEXTAREA"];
			
function traverseDOMTree(root, border, parentBordered, blockLevel) { //traverse function
	
	if (root) {
		var nodeValue = {
			type: root.nodeType,
			tagName: root.nodeName,
			xpath: getPathTo(root),
			role: 'Unknown',
			children: [],
			id: root.id,
			className: root.className,
			attributes: {
				width: root.offsetWidth,
				height: root.offsetHeight
			}
		};
		
		var style = window.getComputedStyle(root);
		if(style){
			nodeValue.attributes.fontSize = style.fontSize;
			nodeValue.attributes.fontWeight = style.fontWeight;
			nodeValue.attributes.fontColor = style.color;
			nodeValue.attributes.listStyle = style.listStyle;
			nodeValue.attributes.float = style.float;
			nodeValue.attributes.marginLeft = style.marginLeft;
			nodeValue.attributes.marginRight = style.marginRight;
			nodeValue.attributes.marginTop = style.marginTop;
			nodeValue.attributes.marginBottom = style.marginBottom;
			nodeValue.attributes.border = style.border;
			nodeValue.attributes.backgroundImage = style.backgroundImage;
			nodeValue.attributes.backgroundColor = style.backgroundColor;
			nodeValue.attributes.background = style.background;
		}
		
		try {
			nodeValue.attributes.positionX = root.getBoundingClientRect().left;
			nodeValue.attributes.positionY = root.getBoundingClientRect().top;
		} catch (e){
			
		}
		
		//console.log('----> ' + JSON.stringify(nodeValue));
		
		for (var i = 0; i < root.childNodes.length; i++){
			var el = root.childNodes[i];
			var childValue = null;
			try {
				if(el.nodeType === Node.COMMENT_NODE){
					// do nothing
				} else if(el.nodeType === Node.TEXT_NODE) {
					// do nothing
				} else if(el.nodeName === 'SCRIPT') {
					// do nothing
				} else if(el.nodeName === 'HEAD') {
					// do nothing
				} else if(el.nodeName === 'INPUT') {
					// do nothing
				} else if(el.nodeName === 'HTML') {
					return traverseDOMTree(el, border, border, blockLevel);
				} else if(el.nodeName === 'BODY') {
					if(!el.style.backgroundColor){
						el.style.backgroundColor = '#FFF';
					}
					return traverseDOMTree(el, border, border, blockLevel);
				} else {
					if(isVisible(el) && !isInvalidNode(el)){
						var borderIncrement = 0;
						printProperties(el);
					
						if(! isInlineNode(el)){
							if(border){
								borderIncrement = 1;
								addBorder(el, blockLevel);
							} else if(getLinebreakChildCount(el) === 0 && !parentBordered){
								borderIncrement = 1;
								addBorder(el, blockLevel);
							}
						} else if(getLinebreakChildCount(el.parentElement) > 0){
							borderIncrement = 1;
							addBorder(el, blockLevel);
						}
						
						childValue = traverseDOMTree(el, getValidChildCount(el) > 1, 
							border, blockLevel + borderIncrement);
					}
				}
			} catch (e){
				console.log(el.nodeName + ' ' + e);
			}
			
			if(childValue){
				nodeValue.children.push(childValue);
			}
		}
		
		return nodeValue;
	}
	
	return null;
}

function isInlineNode(el){
	var style = window.getComputedStyle(el);
	
	if(style != null){
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
	/*var props = Object.getOwnPropertyNames(obj).filter(function (p) {
		return typeof obj[p] !== 'function';
	});

	props.forEach(function (prop){
		if(obj[prop] && obj[prop] !== '' && obj[prop].toString().indexOf('/') > -1){
			//console.log(prop + ': ' + obj[prop]);
		}
	});*/
}

function addBorder(el, blockLevel){
	//if(blockLevel === 5){
	el.style.borderWidth = '1px';
	el.style.borderStyle = 'solid';
	el.style.borderColor = colors[blockLevel % 10];
	//}
}

function addInlineBorder(el, blockLevel){
	el.style.borderWidth = '1px';
	el.style.borderStyle = 'solid';
	el.style.borderColor = colors[blockLevel % 10];
}

function getValidChildCount(parentNode){
	if(parentNode.sgmValidChildCount){
		return parentNode.sgmValidChildCount;
	}
	
	var validChildCount = 0;
	for (var i = 0; i < parentNode.childNodes.length; i++){
		var el = parentNode.childNodes[i];
		
		if(el.nodeType === Node.COMMENT_NODE){
			// do nothing
		} else if(el.nodeType === Node.TEXT_NODE) {
			if(el.nodeValue.trim() !== ''){
				validChildCount++;
			}
		} else if(el.nodeName === 'SCRIPT') {
			// do nothing
		} else if(el.nodeName === 'INPUT') {
			if(el.type !== 'hidden'){
				validChildCount++;
			}
			// do nothing
		} else if(el.nodeName === 'HEAD') {
			// do nothing
		} else if(el.nodeName === 'HR' || el.nodeName === 'BR') {
			// do nothing
		} else if(el.nodeName === 'HTML') {
			validChildCount++;
		} else if(el.nodeName === 'BODY') {
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
	var validChildCount = 0;
	for (var i = 0; i < parentNode.childNodes.length; i++){
		var el = parentNode.childNodes[i];
		
		if(isVisible(el) && !isInvalidNode(el) && !isInlineNode(el) && getValidChildCount(el) > 0){
			validChildCount++;
		}
	}
	
	return validChildCount;
}
	
function getPathTo(element) {
	if (element.id!=='')
		return 'id("'+element.id+'")';
	if (element===document.body)
		return element.tagName;

	var ix= 0;
	var siblings= element.parentNode.childNodes;
	for (var i= 0; i<siblings.length; i++) {
		var sibling= siblings[i];
		if (sibling===element)
			return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
		if (sibling.nodeType===1 && sibling.tagName===element.tagName)
			ix++;
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
	
	var style = window.getComputedStyle(el);
	
	if(style){
		if(style.display === 'none'){
			el.sgmInvisibilityReason = 'Display none';
			el.sgmIsVisible = false;
			return false;
		}
		
		if(style.visibility === 'hidden' || style.visibility === 'collapse'){
			el.sgmInvisibilityReason = 'Visibility hidden';
			el.sgmIsVisible = false;
			return false;
		}
		
		if(+el.offsetWidth === 0 && +el.offsetHeight === 0){
			if(style.height === 'auto' && el.childNodes.length > 0){
				el.sgmIsVisible = true;
				return true;
			}
		}
		
		if(+el.offsetWidth <= 1){
			if(getValidChildCount(el) === 0){
				el.sgmInvisibilityReason = 'Width <= 1 && no valid children';
				el.sgmIsVisible = false;
				return false;
			}
		}
		
		if(+el.offsetHeight <= 1){
			if(getValidChildCount(el) === 0){
				el.sgmInvisibilityReason = 'Height <= 1 && no valid children';
				el.sgmIsVisible = false;
				return false;
			}
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
		
		if(style.textIndent){
			if(style.textIndent !== '0px'){
				if(parseInt(style.textIndent, 10) + el.offsetWidth < 0){
					el.sgmInvisibilityReason = 'Text indent';
					el.sgmIsVisible = false;
					return false;
				}
			}
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
	} else if(el.nodeName === 'IMG') {
		// do nothing
	} else if(el.nodeName === 'LI') {
		// do nothing
	} else {
		var isElementVisible = getValidChildCount(el) > 0;
		el.sgmIsVisible = isElementVisible;
		
		if(! isElementVisible && (style && style.backgroundImage && style.backgroundImage !== 'none')){
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