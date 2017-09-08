var invalidNodes = ["AREA", "BASE", "BASEFONT", "COL",
	"COLGROUP", "LINK", "MAP", "META", "PARAM", "SCRIPT",
	"STYLE", "TITLE", "!DOCTYPE", "NOSCRIPT"];

var inlineNodes = ["A", "ABBR", "ACRONYM", "B", "BDO",
	"BIG", "BUTTON", "CITE", "CODE", "DEL", "DFN", "EM",
	"FONT", "I", "IMG", "INPUT", "INS", "KBD", "LABEL",
	"OBJECT", "Q", "S", "SAMP", "SMALL", "SPAN", "STRIKE",
	"STRONG", "SUB", "SUP", "TT", "U", "VAR", "APPLET",
	"SELECT", "TEXTAREA"];

var lineBreakTerminalNodes = ["IMG", "OBJECT", "AUDIO", "COMMAND", "EMBED",
	"KEYGEN", "METER", "OUTPUT", "PROGRESS", "VIDEO"];

function traverseDOMTree(root, border, parentBordered, blockLevel, parentZIndex) { //traverse function
	if (! root) {
        return;
    }

	var nodeValue = {
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

    setAttribute(root, 'name');
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

	var style = window.getComputedStyle(root);
	var zIndex = null;
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
		nodeValue.attributes.border = style.border;
        nodeValue.attributes.borderLeft = style.borderLeft;
        nodeValue.attributes.borderRight = style.borderRight;
        nodeValue.attributes.borderTop = style.borderTop;
        nodeValue.attributes.borderBottom = style.borderBottom;
		nodeValue.attributes.backgroundImage = style.backgroundImage;
		nodeValue.attributes.backgroundColor = style.backgroundColor;
		nodeValue.attributes.background = style.background;
        nodeValue.attributes.clear = style.clear;
	}

	try {
		nodeValue.attributes.positionX = root.getBoundingClientRect().left;
		nodeValue.attributes.positionY = root.getBoundingClientRect().top;
	} catch (e){

	}

	for (var i = 0; i < root.childNodes.length; i++){
		var el = root.childNodes[i];
		var childValue = null;
		try {
			if(el.nodeType === Node.COMMENT_NODE){
				// do nothing
			} else if(el.nodeType === Node.TEXT_NODE) {
                var content = el.textContent;
                if(content && content.trim() !== ''){
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
			} else if(el.nodeName === 'SCRIPT') {
				// do nothing
			} else if(el.nodeName === 'HEAD') {
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
				return traverseDOMTree(el, border, border, blockLevel, zIndex);
			} else if(el.nodeName === 'BODY') {
				if(!el.style.backgroundColor){
					el.style.backgroundColor = '#FFF';
				}
				return traverseDOMTree(el, border, border, blockLevel, zIndex);
			} else {
				if(isVisible(el) && !isInvalidNode(el)){
					var borderIncrement = 0,
                        isInline = isInlineNode(el);
					printProperties(el);

                    if(el.nodeName === 'IMG'){
                        nodeValue.containsImage = true;
                        nodeValue.imageCount = nodeValue.imageCount ? nodeValue.imageCount + 1 : 1;
                    }

                    if(! isInline) {
						if(border){
							borderIncrement = 1;
						} else if(getLinebreakChildCount(el) === 0 && !parentBordered){
							borderIncrement = 1;
						}
					} else if(getLinebreakChildCount(el.parentElement) > 0){
						borderIncrement = 1;
					}

					childValue = traverseDOMTree(el, getValidChildCount(el) > 1,
                        border, blockLevel + borderIncrement, zIndex);

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
			console.log(el.nodeName + ' ' + e);
		}

		if(childValue){
			nodeValue.children.push(childValue);
		}
	}

	return nodeValue;
}

function getText(node){
    if(node.nodeType === Node.TEXT_NODE){
        if(node.nodeValue && node.nodeValue.trim() !== ''){
            return node.nodeValue.trim().toLowerCase();
        }

        return '';
    }

    var text = '';
    for (var i = 0; i < node.childNodes.length; i++){
		var child = node.childNodes[i];

        if(child.nodeType === Node.TEXT_NODE){
            if(child.nodeValue && child.nodeValue.trim() !== ''){
                text += child.nodeValue.trim().toLowerCase();
            }
        }
    }

    return text;
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

    var wordCount = 0;
    for (var i = 0; i < node.childNodes.length; i++){
		var el = node.childNodes[i];
        wordCount += getWordCount(el);
    }

    node.sgmWordCount = wordCount;
    return wordCount;
}

function deepCopy(obj){
    return JSON.parse(JSON.stringify(obj));
}

function isInlineNode(el){
	var style = window.getComputedStyle(el);

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
	/*var props = Object.getOwnPropertyNames(obj).filter(function (p) {
		return typeof obj[p] !== 'function';
	});

	props.forEach(function (prop){
		if(obj[prop] && obj[prop] !== '' && obj[prop].toString().indexOf('/') > -1){
			//console.log(prop + ': ' + obj[prop]);
		}
	});*/
}

function getValidChildCount(parentNode){
	if(parentNode.sgmValidChildCount){
		return parentNode.sgmValidChildCount;
	}

    if(parentNode.nodeName === 'IMG') {
        return 0;
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
	if (element.id!==''){
        return '//*[@id=\'' + element.id + '\']';
    }

	if (element===document.body){
        return 'HTML/' + element.tagName;
    }

	var ix= 0;
	var siblings= element.parentNode.childNodes;
	for (var i= 0; i<siblings.length; i++) {
		var sibling= siblings[i];
		if (sibling===element){
            return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
        }

		if (sibling.nodeType===1 && sibling.tagName===element.tagName){
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
			if(style.height === 'auto' && getValidChildCount(el) > 0){
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
	} else if(el.nodeName === 'OBJECT') {
		// do nothing
	} else if(el.nodeName === 'IFRAME') {
		// do nothing
	} else {
		var isElementVisible = getValidChildCount(el) > 0;
		el.sgmIsVisible = isElementVisible;

		/* height check is added to prevent decorational nodes to be selected as valid blocks. */
		if(! isElementVisible && (style && style.backgroundImage && style.backgroundImage !== 'none' && el.offsetHeight > 40)){
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
