var util = require('./common-util');

/**
 * Constructs a new block and put into the block pool
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function putIntoPool(parentBlock, node, doc, callback){
    /* For some tags, if node has only one child, put the child into the pool */
	if((node.tagName === 'TR' || node.tagName === 'UL') && node.children && node.children.length === 1){
        var child = node.children[0];

        if(child.tagName === 'TD' || child.tagName === 'LI'){
            node = child;
        }
    }

    var block = {
        doc: doc,
        tagName: node.tagName,
        xpath: node.xpath,
        name: parentBlock.name + '.' + (parentBlock.children ? parentBlock.children.length + 1 : 1),
        children: []
    };

    if(! parentBlock.children){
        parentBlock.children = [];
    }

    parentBlock.children.push(block);

	/* Recursive call for children */
    if(callback){
        callback(block, node, doc);
    }

	return block;
}

/**
 * According to the VIPS Algorithm, if there are some children of a node and two
 * or more but not all of these nodes are in the same horizontal line, the nodes
 * in the same line must be grouped to form a composite block before block
 * extraction.
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {int} screenWidth - Screen width
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function handleRowsAtChildren(block, node, doc, screenWidth, callback){
    var compositeNode = getNewCompositeNode(node.xpath),
        compositeNodeList = [];

    var tempY = node.children[0].attributes.positionY;

    for(var i = 0; i < node.children.length; i++){
        var child = node.children[i];

        if(tempY === child.attributes.positionY){
            compositeNode.children.push(child);
        } else {
            tempY = child.attributes.positionY;
            if(compositeNode.children.length > 0){
                compositeNodeList.push(compositeNode);
            }

            compositeNode = getNewCompositeNode(node.xpath);

            compositeNode.children.push(child);
        }
    }

    if(compositeNode.children.length > 0){
        compositeNodeList.push(compositeNode);
    }

    processCompositeNodeList(block, compositeNodeList, doc, true, callback);
	compositeNodeList = null;
	compositeNode = null;
}

/**
 *
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function handleDifferentBgColorAtChildren(block, node, doc, callback){
    if(! node.children || node.children.length === 0){
        return;
    }

    if(node.children.length === 1){
        return putIntoPool(block, node, doc, callback);
    }


    var tempBackground;

    if(node.isCompositeNode){
        tempBackground = node.children[0].attributes.background;
    } else {
        tempBackground = node.attributes.background;
    }


    var compositeNode = getNewCompositeNode(node.xpath),
        compositeNodeList = [];

    for(var i = 0; i < node.children.length; i++){
        var child = node.children[i],
            childBackground = child.attributes.background;

        if(childBackground !== tempBackground){
            if(compositeNode.children.length > 0){
                //compositeNodeList.push(compositeNode);
                createCompositeBlock(block, compositeNode, doc, true, callback);
            }

            //tempBackground = childBackground;
            putIntoPool(block, child, doc, callback);
            compositeNode = getNewCompositeNode(node.xpath);
        } else {
            compositeNode.children.push(child);
        }
    }

    if(compositeNode.children.length > 0){
        //compositeNodeList.push(compositeNode);
        createCompositeBlock(block, compositeNode, doc, true, callback);
    }

	processCompositeNodeList(block, compositeNodeList, doc, true, callback);
	compositeNodeList = null;
	compositeNode = null;
}

/**
 * If one of the child node has bigger font size than its previous sibling, divide node into
 * two blocks. Put the nodes before the child node with bigger font size into the first
 * block, and put the remaining nodes to the second block.
 *
 * If the first child of the node has bigger font size than the remaining children, extract
 * two blocks, one of which is the first child with bigger font size, and the other contains
 * remaining children.
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function handleDifferentFontSize(block, node, doc, callback){
    var maxFontSize = util.getMaxFontSizeInChildren(node.children),
        compositeNode = getNewCompositeNode(node.xpath),
        i = null,
        flag = null,
        childFontSize = null, child = null;

	if (parseInt(util.getMaxFontSize(node.children[0])) === maxFontSize) {
		/* First child has the maximum font size. */
		var count = util.getCountOfChildrenWithMaxFontSize(node.children, maxFontSize);

		if (count == 1) {
			/* There is only one child with maximum font size
			 * Put the first child into pool and create a composite
			 * node for the remaining */
			putIntoPool(block, node.children[0], 11, callback);

            if(node.children.length === 2){
                putIntoPool(block, node.children[1], 11, callback);
            } else {
                for (i = 1; i < node.children.length; i++) {
    				compositeNode.children.push(node.children[i]);
    			}
    			createCompositeBlock(block, compositeNode, 10, true, callback);
            }
		} else if (util.areAllMaxFontSizeChildrenAtFront(node.children, count, maxFontSize)) {
			/* First n children have the maximum font size
			 * where n is equal to the number of children
			 * with maximum font size. */
			var compositeNode2 = getNewCompositeNode(node.xpath),
                compositeNode3 = getNewCompositeNode(node.xpath);

			/* Create a composite node for the children with max. font size. */
			for (i = 0; i < count; i++) {
				compositeNode2.children.push(node.children[i]);
			}

			/* Create a composite node for the others. */
			for (i = count; i < node.children.length; i++) {
				compositeNode3.children.push(node.children[i]);
			}

			createCompositeBlock(block, compositeNode2, 10, true, callback);
			createCompositeBlock(block, compositeNode3, 10, true, callback);
		} else {
			/* The first child has maximum font size and there are some
			 * other children which have max. font size. */
			processChildrenWithDifferentFontSize();
		}
	} else {
		/* First child does not have the maximum font size*/
		processChildrenWithDifferentFontSize();
	}

    function processChildrenWithDifferentFontSize(){
        flag = true;
		for (i = 0; i < node.children.length; i++) {
			child = node.children[i];
            childFontSize = util.getMaxFontSize(child);

			if (childFontSize === maxFontSize && flag) {
				createCompositeBlock(block, compositeNode, 10, true, callback);
				compositeNode = getNewCompositeNode(node.xpath);
				compositeNode.children.push(child);
				flag = false;
			} else {
				compositeNode.children.push(child);
				if (childFontSize !== maxFontSize){
                    flag = true;
                }
			}
		}

		createCompositeBlock(block, compositeNode, 8, true, callback);
    }
}

function countFloats(node){
    var nodeList = [],
        numberOfFloats = 0,
        lastFloat = 'none';

	for (var i = 0; i < node.children.length; i++) {
		var child = node.children[i],
            childFloat = child.attributes.float,
            childClear = child.attributes.clear;

        if(lastFloat === 'none'){
            if(childFloat !== lastFloat){
                count();
                nodeList.push(child);
            } else {
                numberOfFloats++;

                if(childClear !== 'none'){
                    count();
                }
            }
        } else {
            nodeList.push(child);
            if(childFloat !== lastFloat && childFloat !== 'right'){
                count();
            }
        }

        lastFloat = childFloat;
	}

    count();

    function count(){
        if(nodeList.length !== 0){
            numberOfFloats++;
        }

        nodeList = [];
    }

    return numberOfFloats;
}

/**
 * If node has at least one child with float value ”left” or ”right”, create three blocks.
 * For each children,
 * <ol>
 * <li> If child is left float, put it into the first block.</li>
 * <li>If child is right float, put it into the second block.</li>
 * <li>If child is not both left and right float, put it into the third block. If first block
 * or second block have children, create new blocks for them. Also, create a new
 * block for the child without float.</li>
 * </ol>
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function handleDifferentFloat(block, node, doc, callback){
    var i;
    if(countFloats(node) === 1){
        for (i = 0; i < node.children.length; i++) {
            putIntoPool(block, node.children[i], 11, callback);
        }
        return;
    }

    var compositeNode = getNewCompositeNode(node.xpath),
        lastFloat = 'none';

	for (i = 0; i < node.children.length; i++) {
		var child = node.children[i],
            childFloat = child.attributes.float,
            childClear = child.attributes.clear;

        if(lastFloat === 'none'){
            if(childFloat !== lastFloat){
                flush();
                compositeNode.children.push(child);
            } else {
                putIntoPool(block, child, 11, callback);

                if(childClear !== 'none'){
                    flush();
                }
            }
        } else {
            compositeNode.children.push(child);
            if(childFloat !== lastFloat && childFloat !== 'right'){
                flush();
            }
        }

        lastFloat = childFloat;
	}

    flush();

    function flush(){
        if(compositeNode.children.length !== 0){
            createCompositeBlockWithFloat(block, compositeNode, doc, true, callback);
        }

        compositeNode = getNewCompositeNode(node.xpath);
    }
}

/**
 * If a node has a child, whose at least one of margin-top and margin-bottom values are
 * nonzero, divide this node into two blocks. Put the sibling nodes before the node with
 * nonzero margin into the first block and put the siblings after the node with nonzero
 * margin into the second block.
 * <ol>
 * <li>If child has only nonzero margin-top, put the child into second block.</li>
 * <li>If child has only nonzero margin-bottom, put the child into first block.</li>
 * <li>If child has both nonzero margin-top and nonzero margin-bottom, create a third
 * block and put it between two blocks.</li>
 * </ol>
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function handleDifferentMargin(block, node, doc, callback){
    var compositeNode = getNewCompositeNode(node.xpath);

    var marginAdded = false;
    for(var i = 0; i < node.children.length; i++){
        var child = node.children[i],
            marginTop = child.attributes.marginTop,
            marginBottom = child.attributes.marginBottom;

		if (util.hasMargin(marginTop) && util.hasMargin(marginBottom)) {
            flush();
            putIntoPool(block, child, doc, callback);
            marginAdded = true;
		} else if (util.hasMargin(marginTop)) {
            flush();

            if(! marginAdded){
                putIntoPool(block, child, doc, callback);
                marginAdded = true;
            } else {
                compositeNode.children.push(child);
            }
		} else if (util.hasMargin(marginBottom)) {
            if(! marginAdded){
                putIntoPool(block, child, doc, callback);
                marginAdded = true;
            } else {
                compositeNode.children.push(child);
            }

            flush();
		} else {
            if(! marginAdded){
                putIntoPool(block, child, doc, callback);
            } else {
                compositeNode.children.push(child);
            }
		}
    }

    function flush(){
        if(compositeNode.children.length > 0){
            createCompositeBlock(block, compositeNode, doc, true, callback);
        }

        compositeNode = getNewCompositeNode(node.xpath);
    }

    flush();

	compositeNode = null;
}

/**
 * If a node contains a child whose tag is HR or BR, then the node is divided into two as
 * the nodes before the separator and after the separator. For each side of the separator,
 * two new blocks are created and children nodes are put under these blocks. Note that,
 * separator does not extract a block under the main block, it just serves to extract
 * two blocks which other nodes are put into.
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function handleLineBreaks(block, node, doc, callback){
    removeChildrenAfterCheck(node, lineBreakCheck);

    if(node.children.length === 0){
        return;
    }

    function lineBreakCheck(child){
        return child.tagName === 'HR' || child.tagName === 'BR';
    }

    return divideChildren(block, node, doc, callback, lineBreakCheck, function(){
        return false;
    });
}

/**
 * If a node contains an empty list item, then the node is divided into two as
 * the nodes before the separator and after the separator. For each side of the separator,
 * two new blocks are created and children nodes are put under these blocks. Note that,
 * separator does not extract a block under the main block, it just serves to extract
 * two blocks which other nodes are put into.
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function handleEmptyListItem(block, node, doc, callback){
    removeChildrenAfterCheck(node, emptyListItemCheck);

    if(node.children.length === 0){
        return;
    }

    function emptyListItemCheck(child) {
        return child.tagName === 'LI' && (! child.children || child.children.length === 0);
    }

    return divideChildren(block, node, doc, callback, emptyListItemCheck, function(){
        return false;
    });
}

/**
 *
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function handleDivGroups(block, node, doc, callback){
    return divideChildren(block, node, doc, callback, function(child){
        return ! (child.tagName === 'DIV' || child.inline || +child.type === 3);
    });
}

/**
 *
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function handleImageInChildren(block, node, doc, callback){
    return divideChildren(block, node, doc, callback, function(child){
        return child.tagName === 'IMG' || (child.children.length === 1 && child.containsImage);
    });
}

/**
 *
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function handleObjectInChildren(block, node, doc, callback){
    return divideChildren(block, node, doc, callback, function(child){
        return child.lineBreakObject || (child.children.length === 1 && child.containsLineBreakTerminalNode);
    });
}

/**
 * Children have no special form
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function handleNormalForm(block, node, doc, callback){
    return divideChildren(block, node, doc, callback, function(child){
        return child.lineBreak || child.tagName === 'IMG' || child.lineBreakObject;
    });
}

/**
 * Divides the array of children into composite groups whenever a condition is met by one or more children
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} node - DOM node to create a new visual block
 * @param {int} doc - DoC value for specific segmentation case
 * @param {method} callback - callback method to call recursively for node children
 * @param {method} conditionCheck - method to check for specific conditions of a child node
 *
 * @method
 */
function divideChildren(block, node, doc, callback, conditionCheck, conditionHandler){
    var compositeNode = getNewCompositeNode(node.xpath);

    var prevBlockCount = 0;
    for(var i = 0; i < node.children.length; i++){
        var child = node.children[i];

        if(conditionCheck(child)){
            if(compositeNode.children.length > 0){
                prevBlockCount++;
                createCompositeBlock(block, compositeNode, doc, true, callback);
            }

            if(conditionHandler){
                var added = conditionHandler(block, child, doc, callback);

                if(added){
                    prevBlockCount++;
                }
            } else {
                prevBlockCount++;
                putIntoPool(block, child, doc, callback);
            }

            compositeNode = getNewCompositeNode(node.xpath);
        } else {
            compositeNode.children.push(child);
        }
    }

    if(compositeNode.children.length > 0){
        if(prevBlockCount > 0){
            createCompositeBlock(block, compositeNode, doc, true, callback);
        } else {
            for(i = 0; i < compositeNode.children.length; i++){
                putIntoPool(block, compositeNode.children[i], doc, callback);
            }
        }
    }

	compositeNode = null;
}

/**
 *
 *
 * @param {object} parentBlock - Parent visual block
 * @param {array} compositeNodeList -
 * @param {int} doc - DoC value for specific segmentation case
 * @param {boolean} floatExceptionCheck -
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function processCompositeNodeList(block, compositeNodeList, doc, floatExceptionCheck, callback){
    if(compositeNodeList.length === 1){
        var node = compositeNodeList[0];

        if(! node.children || node.children.length === 0){
            return;
        }

        for(var i = 0; i < node.children.length; i++){
            var child = node.children[i];

            if(child.isCompositeNode){
				createCompositeBlock(block, child, doc, floatExceptionCheck, callback);
			} else {
                putIntoPool(block, child, 11, callback);
            }
        }
    } else {
        compositeNodeList.forEach(function(node){
            createCompositeBlock(block, node, doc, floatExceptionCheck, callback);
        });
    }
}

/**
 *
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} compositeNode -
 * @param {int} doc - DoC value for specific segmentation case
 * @param {boolean} floatExceptionCheck -
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function createCompositeBlockWithFloat(block, compositeNode, doc, floatExceptionCheck, callback) {
	if (! compositeNode.children || compositeNode.children.length === 0) {
		return;
	} else if (compositeNode.children.length === 1) {
		createCompositeBlock(block, compositeNode.children[0], doc, floatExceptionCheck, callback);
	} else {
        var newBlock = putIntoPool(block, compositeNode, doc, null);

        compositeNode.children.forEach(function(child){
            if(child.attributes && child.attributes.float === 'none'){
                putIntoPool(newBlock, child, 11, callback);
            } else {
                createCompositeBlock(newBlock, child, 11, floatExceptionCheck, callback);
            }
        });
	}
}

/**
 *
 *
 * @param {object} parentBlock - Parent visual block
 * @param {object} compositeNode -
 * @param {int} doc - DoC value for specific segmentation case
 * @param {boolean} floatExceptionCheck -
 * @param {method} callback - callback method to call recursively for node children
 *
 * @method
 */
function createCompositeBlock(block, compositeNode, doc, floatExceptionCheck, callback) {
    if(compositeNode.children && compositeNode.children.length > 0){
        removeChildrenAfterCheck(compositeNode, lineBreakCheck);
        if(compositeNode.children.length === 0){
            return;
        }

        /* Prevent unnecessarily nested composite nodes */
        if(compositeNode.isCompositeNode && compositeNode.children.length === 1){
            var child = compositeNode.children[0];
            if(child.tagName === 'HR' || child.tagName === 'BR'){
                return;
            }

            return putIntoPool(block, child, doc, callback);
        }

        /*if(floatExceptionCheck && allChildrenMatches(compositeNode.children, ["DIV", "TABLE", "COMPOSITE"])){
            compositeNode.children.forEach(function(child){
                putIntoPool(block, child, doc, callback);
            });
        } else {*/
            putIntoPool(block, compositeNode, doc, callback);
        //}
    }

    function lineBreakCheck(child){
        return child.tagName === 'HR' || child.tagName === 'BR';
    }
}

function removeChildrenAfterCheck(node, check){
    var i;
    for(i = 0; i < node.children.length; ){
        if(check(node.children[i])){
            node.children.splice(i, 1);
        } else {
            break;
        }
    }

    for(i = node.children.length - 1; i > 0; i--){
        if(check(node.children[i])){
            node.children.splice(i, 1);
        } else {
            break;
        }
    }
}

function getNewCompositeNode(xpath){
    return {children: [], isCompositeNode: true, tagName: "COMPOSITE", xpath: xpath + '/COMPOSITE'};
}

module.exports.putIntoPool = putIntoPool;
module.exports.handleRowsAtChildren = handleRowsAtChildren;
module.exports.handleDifferentBgColorAtChildren = handleDifferentBgColorAtChildren;
module.exports.handleDifferentFontSize = handleDifferentFontSize;
module.exports.handleLineBreaks = handleLineBreaks;
module.exports.handleEmptyListItem = handleEmptyListItem;
module.exports.handleDivGroups = handleDivGroups;
module.exports.handleDifferentFloat = handleDifferentFloat;
module.exports.handleDifferentMargin = handleDifferentMargin;
module.exports.handleImageInChildren = handleImageInChildren;
module.exports.handleObjectInChildren = handleObjectInChildren;
module.exports.handleNormalForm = handleNormalForm;
