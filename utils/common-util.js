
function getTreeHierarchy(blockTree){
    if(!blockTree.children || blockTree.children.length === 0){
        return blockTree.tagName;
    }

    var childList = [];

    blockTree.children.forEach(function(child){
        childList.push(getTreeHierarchy(child));
    });

    return blockTree.tagName + '[' + childList.join() + ']';

}

function getMaxFontSize(node){
    if(node.inline){
        return -1;
    }

    var maxFontSize = parseInt(node.attributes.fontSize);

    if(node.children && node.children.length > 0){
        node.children.forEach(function(child){
            maxFontSize = Math.max(maxFontSize, getMaxFontSize(child));
        });
    }

    return maxFontSize;
}

function getMaxFontSizeInChildren(nodes){
    var maxFontSize = -1;

    nodes.forEach(function(node){
        maxFontSize = Math.max(maxFontSize, getMaxFontSize(node));
    });

    return maxFontSize;
}

function getCountOfChildrenWithMaxFontSize(nodes, maxFontSize){
    var count = 0;

    nodes.forEach(function(node){
        var fontSize = getMaxFontSize(node);
        if(fontSize === maxFontSize){
            count++;
        }
    });

    return count;
}

function areAllMaxFontSizeChildrenAtFront(nodes, count, maxFontSize){
    for(var i = 0; i < count; i++){
        var fontSize = getMaxFontSize(nodes[i]);

        if(fontSize !== maxFontSize){
            return false;
        }
    }

    return true;
}

/**
 * Checks whether specified margin value is 0 or auto.
 *
 * @param {string} margin - Margin value to be checked
 *
 * @method
 */
function hasMargin(margin) {
	return margin && margin.toLowerCase() !== 'auto' && parseInt(margin, 10) !== 0;
}

/**
 * Checks whether tags of all children are one of the tags in specified tag array
 *
 * @param {array} children - array of children
 * @param {array} tagList - tag list to be checked
 *
 * @method
 */
function allChildrenMatches(children, tagList) {
	if(! children || children.length === 0){
		return false;
	} else {
        for(var i = 0; i < children.length; i++){
            if(tagList.indexOf(children[i].tagName) === -1){
                return false;
            }
        }
        return true;
	}
}

module.exports.getTreeHierarchy = getTreeHierarchy;
module.exports.getMaxFontSize = getMaxFontSize;
module.exports.getMaxFontSizeInChildren = getMaxFontSizeInChildren;
module.exports.getCountOfChildrenWithMaxFontSize = getCountOfChildrenWithMaxFontSize;
module.exports.areAllMaxFontSizeChildrenAtFront = areAllMaxFontSizeChildrenAtFront;
module.exports.hasMargin = hasMargin;
module.exports.allChildrenMatches = allChildrenMatches;
