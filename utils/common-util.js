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

module.exports.getTreeHierarchy = getTreeHierarchy;

