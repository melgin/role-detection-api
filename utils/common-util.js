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

module.exports.getTreeHierarchy = getTreeHierarchy;
module.exports.getMaxFontSize = getMaxFontSize;
module.exports.getMaxFontSizeInChildren = getMaxFontSizeInChildren;
module.exports.getCountOfChildrenWithMaxFontSize = getCountOfChildrenWithMaxFontSize;
module.exports.areAllMaxFontSizeChildrenAtFront = areAllMaxFontSizeChildrenAtFront;
