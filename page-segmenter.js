var Node = require('./dom-node'),
    Block = require('./block'),
    blockBuilder = require('./utils/block-builder');

var DOC_COLUMN_FORM = 2,
	DOC_COLOR_FORM 	= 4,
	DOC_FLOAT_FORM 	= 9,
	DOC_LINEBREAK_FORM = 7,
	DOC_MARGIN_FORM = 6,
	DOC_GROUP_FORM = 6,
	DOC_FONT_SIZE_FORM = 7,
	DOC_NORMAL_FORM = 9,
	DOC_IMAGE_FORM = 9,
	//DOC_VIRTUAL_FORM = 10,
	DOC_TERMINAL_FORM = 11;

var screenWidth = null,
    screenHeight = null,
    printLog = false;

function segment(rootNode, width, height){
    screenWidth = width;
    screenHeight = height;

    var node = new Node(rootNode);
    var block = new Block(
        {
            tagName: 'BODY',
            xpath: 'BODY',
            role: 'BODY',
            name: 'VB.1',
            children:[]
        },
        node
    );
	return blockExtraction(block, node, 1);
}

function handleSingleChild(block, node){
    var child = node.getChildAt(0);
    if (child.isTextNode()) {
        if(node.isCompositeNode()){
            blockBuilder.putIntoPool(block, node, DOC_TERMINAL_FORM, null);
        } else {
            block.setDoc(DOC_TERMINAL_FORM);
        }

        return null;
    }

    return blockExtraction(block, child, DOC_TERMINAL_FORM);
}

function blockExtraction(block, currentNode, doc) {
    if(! currentNode || currentNode.isTextNode()){
		return;
	}
	
	if (currentNode.hasSingleChild()) {
		return handleSingleChild(block, currentNode);
	} else {
		var intersectingChildrenCase = currentNode.hasInsersectingChildren();
		if(intersectingChildrenCase){
			log(currentNode.getXPath() + ' intersecting children');
            block.setDoc(DOC_NORMAL_FORM);
			blockBuilder.handleIntersectingChildrenForm(block, currentNode, DOC_NORMAL_FORM, intersectingChildrenCase, blockExtraction);
		} else 
		
		// block has more than one children
		// (a) if all of the children are virtual text nodes, the node will
		// be a block
		
		if(currentNode.allChildrenIntersect()){
			log(currentNode.getXPath() + ' all children intersect');
            block.setDoc(DOC_TERMINAL_FORM);
		} else if (currentNode.areAllChildrenVirtualTextNodes()) {
            log(currentNode.getXPath() + ' all children are virtual text nodes ');
            block.setDoc(DOC_TERMINAL_FORM);
			// the node will be a block
			//blockBuilder.putIntoPool(block, node, DOC_VIRTUAL_FORM, null);
		} else if(currentNode.childrenHaveRows(screenWidth)){
            log(currentNode.getXPath() + ' has columns');
            block.setDoc(DOC_COLUMN_FORM);
			blockBuilder.handleRowsAtChildren(block, currentNode, DOC_COLUMN_FORM, screenWidth, blockExtraction);
		} else if(currentNode.childrenHaveDifferentBackground()){
            log(currentNode.getXPath() + ' children have different background');
            block.setDoc(DOC_COLOR_FORM);
			blockBuilder.handleDifferentBgColorAtChildren(block, currentNode, DOC_COLOR_FORM, blockExtraction);
		} else if (currentNode.hasDifferentFontSizeInChildren()) {
            log(currentNode.getXPath() + ' children have different font size');
            block.setDoc(DOC_FONT_SIZE_FORM);
			blockBuilder.handleDifferentFontSize(block, currentNode, DOC_FONT_SIZE_FORM, blockExtraction);
		} else if (currentNode.containsLineBreak()){
            log(currentNode.getXPath() + ' contains line break');
            block.setDoc(DOC_LINEBREAK_FORM);
			blockBuilder.handleLineBreaks(block, currentNode, 9, blockExtraction);
		} else if(currentNode.containsEmptyListItem()) {
            log(currentNode.getXPath() + ' contains empty list item');
            block.setDoc(9);
			blockBuilder.handleEmptyListItem(block, currentNode, 9, blockExtraction);
		} else if (currentNode.hasDivGroups()) {
            log(currentNode.getXPath() + ' has div groups');
            block.setDoc(DOC_GROUP_FORM);
			blockBuilder.handleDivGroups(block, currentNode, 9, blockExtraction);
		} else if (currentNode.hasDifferentFloatInChildren()) {
            log(currentNode.getXPath() + ' children have different float');
            block.setDoc(DOC_FLOAT_FORM);
			blockBuilder.handleDifferentFloat(block, currentNode, 9, blockExtraction);
		} else if (currentNode.hasDifferentMarginInChildren()) {
            log(currentNode.getXPath() + ' children have margin');
            block.setDoc(DOC_MARGIN_FORM);
			blockBuilder.handleDifferentMargin(block, currentNode, DOC_MARGIN_FORM, blockExtraction);
		} else if (currentNode.containsImage()) {
            log(currentNode.getXPath() + ' contains image');
            block.setDoc(DOC_IMAGE_FORM - 1);
			blockBuilder.handleImageInChildren(block, currentNode, DOC_IMAGE_FORM, blockExtraction);
		} else if (currentNode.containsLineBreakObject()) {
            log(currentNode.getXPath() + ' contains line break object');
            block.setDoc(DOC_IMAGE_FORM);
			blockBuilder.handleObjectInChildren(block, currentNode, DOC_IMAGE_FORM, blockExtraction);
		} else {
            log(currentNode.getXPath() + ' normal form');
            block.setDoc(DOC_NORMAL_FORM);
			blockBuilder.handleNormalForm(block, currentNode, DOC_NORMAL_FORM, blockExtraction);
		}
		
        return block;
	}
}

function log(text){
    if(printLog){
        console.log(text);
    }
}

function enableLog(bool){
    printLog = bool;
}

module.exports.segment = segment;
module.exports.blockExtraction = blockExtraction;
module.exports.log = log;
module.exports.enableLog = enableLog;
