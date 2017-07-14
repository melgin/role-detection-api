var util = require('./common-util');

function areAllChildrenVirtualTextNodes(node) {
    var state = true;
    if(node.children){
        node.children.forEach(function(child){
            state = state && (child.inline || +child.type === 3 /*Node.TEXT_NODE*/);
        });
    }
    return state;
}

function childrenHaveDifferentBackground(node){
    if(node.children && node.children.length > 0){
        var state = false;
        var tempBg = node.children[0].attributes.background;

        node.children.forEach(function(child){
            state = state || child.attributes.background !== tempBg;
        });

        return state;
    }

    return false;
}

function containsEmptyListItem(node) {
    if(node.tagName === 'UL' && node.children){
        for(var i = 0; i < node.children.length; i++){
            if(isEmptyListItem(node.children[i])){
                return true;
            }
        }
    }

    return false;
}

function isEmptyListItem(node){
    return node.tagName === 'LI' && (! node.children || node.children.length === 0);
}

function containsLineBreak(node){
    return node.containsLineBreak ? true : false;
}

function containsImage(node){
    if(node.containsImage){
        return true;
    }

    if(! node.children){
        return false;
    }

    for(var i = 0; i < node.children.length; i++){
        var child = node.children[i];

        if(child.children && child.children.length === 1 && child.containsImage){
            return true;
        }
    }

    return false;
}

function containsLineBreakObject(node) {
    if(node.containsLineBreakTerminalNode){
        return true;
    }

    if(! node.children){
        return false;
    }

    for(var i = 0; i < node.children.length; i++){
        var child = node.children[i];

        if(child.children && child.children.length === 1 && child.containsLineBreakTerminalNode){
            return true;
        }
    }

    return false;
}

function hasDifferentFloatInChildren(node) {
    if(node.children && node.children.length > 0){
        var state = false;
        var tempFloat = node.children[0].attributes.float;

        node.children.forEach(function(child){
            state = state || child.attributes.float !== tempFloat;
        });

        return state;
    }

    return false;
}

function hasDivGroups(node) {
    var divCount = 0,
        lineBreakCount = 0;

    if(node.children && node.children.length > 0){
        node.children.forEach(function(child){
            if(child.tagName === 'DIV'){
                divCount++;
            } else if(! child.inline){
                lineBreakCount++;
            }
        });
    }

	if (divCount > 0 && lineBreakCount > 0){
        return true;
    }

    return false;
}

function areAllMarginSame(node){
    var tempMarginTop = node.children[0].attributes.marginTop,
        tempMarginBottom = node.children[0].attributes.marginBottom;

    for(var i = 0; i < node.children.length; i++){
        var child = node.children[i],
            marginTop = child.attributes.marginTop,
            marginBottom = child.attributes.marginBottom;

        if(marginTop !== tempMarginTop || marginBottom !== tempMarginBottom){
            return false;
        }
    }

    return true;
}

function hasDifferentMarginInChildren(node) {
    if(node.children && node.children.length > 0){
        if(areAllMarginSame(node)){
            return false;
        }

        for(var i = 0; i < node.children.length; i++){
            var child = node.children[i],
                marginTop = child.attributes.marginTop,
                marginBottom = child.attributes.marginBottom;

            if (i !== 0 && hasMargin(marginTop)) {
				return true;
			} else if (i !== node.children.length - 1 && hasMargin(marginBottom)) {
				return true;
			}
        }
    }

    return false;
}

function hasMargin(margin) {
	return margin && margin.toLowerCase() !== 'auto' && parseInt(margin, 10) !== 0;
}

function hasDifferentFontSizeInChildren(node) {
    if(node.children && node.children.length > 0){
        var state = false;

        var tempFontSize = null;

        for(var i = 0; i < node.children.length; i++){
            var child = node.children[i],
                fontSize = util.getMaxFontSize(child);

            if(fontSize !== -1){
                tempFontSize = fontSize;
                break;
            }
        }

        node.children.forEach(function(child){
            var fontSize = util.getMaxFontSize(child);
            if(fontSize !== -1){
                state = state || fontSize !== tempFontSize;
            }
        });

        return state;
    }

    return false;
}



function childrenHaveColumns(node, screenWidth){
    if(! node.children || node.children.length <= 1){
        return false;
    }

    if(node.attributes && node.attributes.width < screenWidth){
        return false;
    }

    var positionMap = {};
    node.children.forEach(function(child){
        if(positionMap[child.attributes.positionY]){
            positionMap[child.attributes.positionY] = positionMap[child.attributes.positionY] + 1;
        } else {
            positionMap[child.attributes.positionY] = 1;
        }
    });

    if(Object.keys(positionMap).length === 1){
        return false;
    }

    for (var property in positionMap) {
        if (positionMap.hasOwnProperty(property) && positionMap[property] > 1) {
            return true;
        }
    }

    return false;
}

module.exports.containsEmptyListItem = containsEmptyListItem;
module.exports.areAllChildrenVirtualTextNodes = areAllChildrenVirtualTextNodes;
module.exports.containsLineBreak = containsLineBreak;
module.exports.containsImage = containsImage;
module.exports.childrenHaveDifferentBackground = childrenHaveDifferentBackground;
module.exports.containsLineBreakObject = containsLineBreakObject;
module.exports.childrenHaveColumns = childrenHaveColumns;
module.exports.hasDifferentFontSizeInChildren = hasDifferentFontSizeInChildren;
module.exports.hasDifferentMarginInChildren = hasDifferentMarginInChildren;
module.exports.hasDivGroups = hasDivGroups;
module.exports.hasDifferentFloatInChildren = hasDifferentFloatInChildren;
