var Node = require('./node'),
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

	return blockExtraction({
        tagName: 'BODY',
        xpath: 'BODY',
        name: 'VB.1', children:[]}, rootNode, 1);
}

function handleSingleChild(block, node){
    var child = node.getChildAt(0);
    if (child.isTextNode()) {
        if(node.isCompositeNode()){
            blockBuilder.putIntoPool(block, node.getNode(), DOC_TERMINAL_FORM, null);
        } else {
            block.doc = DOC_TERMINAL_FORM;
        }

        return null;
    }

    return blockExtraction(block, child.getNode(), DOC_TERMINAL_FORM);
}

function blockExtraction(block, node, doc) {
    if(! node){
		return;
	}

    var currentNode = new Node(node);

	if (currentNode.isTextNode()) {
		// no block
	} else if (currentNode.hasSingleChild()) {
		return handleSingleChild(block, currentNode);
	} else {
		// block has more than one children
		// (a) if all of the children are virtual text nodes, the node will
		// be a block
		if (currentNode.areAllChildrenVirtualTextNodes()) {
            log(node.xpath + ' all children are virtual text nodes ');
            block.doc = DOC_TERMINAL_FORM;
			// the node will be a block
			//blockBuilder.putIntoPool(block, node, DOC_VIRTUAL_FORM, null);
		} else if(currentNode.childrenHaveRows(screenWidth)){
            log(node.xpath + ' has columns');
            block.doc = DOC_COLUMN_FORM;
			blockBuilder.handleRowsAtChildren(block, node, DOC_COLUMN_FORM, screenWidth, blockExtraction);
		} else if(currentNode.childrenHaveDifferentBackground()){
            log(node.xpath + ' children have different background');
            block.doc = DOC_COLOR_FORM;
			blockBuilder.handleDifferentBgColorAtChildren(block, node, DOC_COLOR_FORM, blockExtraction);
		} else if (currentNode.hasDifferentFontSizeInChildren()) {
            log(node.xpath + ' children have different font size');
            block.doc = DOC_FONT_SIZE_FORM;
			blockBuilder.handleDifferentFontSize(block, node, DOC_FONT_SIZE_FORM, blockExtraction);
		} else if (currentNode.containsLineBreak()){
            log(node.xpath + ' contains line break');
            block.doc = DOC_LINEBREAK_FORM;
			blockBuilder.handleLineBreaks(block, node, 9, blockExtraction);
		} else if(currentNode.containsEmptyListItem()) {
            log(node.xpath + ' contains empty list item');
            block.doc = 9;
			blockBuilder.handleEmptyListItem(block, node, 9, blockExtraction);
		} else if (currentNode.hasDivGroups()) {
            log(node.xpath + ' has div groups');
            block.doc = DOC_GROUP_FORM;
			blockBuilder.handleDivGroups(block, node, 9, blockExtraction);
		} else if (currentNode.hasDifferentFloatInChildren()) {
            log(node.xpath + ' children have different float');
            block.doc = DOC_FLOAT_FORM;
			blockBuilder.handleDifferentFloat(block, node, 9, blockExtraction);
		} else if (currentNode.hasDifferentMarginInChildren()) {
            log(node.xpath + ' children have margin');
            block.doc = DOC_MARGIN_FORM;
			blockBuilder.handleDifferentMargin(block, node, DOC_MARGIN_FORM, blockExtraction);
		} else if (currentNode.containsImage()) {
            log(node.xpath + ' contains image');
            block.doc = DOC_IMAGE_FORM - 1;
			blockBuilder.handleImageInChildren(block, node, DOC_IMAGE_FORM, blockExtraction);
		} else if (currentNode.containsLineBreakObject()) {
            log(node.xpath + ' contains line break object');
            block.doc = DOC_IMAGE_FORM;
			blockBuilder.handleObjectInChildren(block, node, DOC_IMAGE_FORM, blockExtraction);
		} else {
            log(node.xpath + ' normal form');
            block.doc = DOC_NORMAL_FORM;
			blockBuilder.handleNormalForm(block, node, DOC_NORMAL_FORM, blockExtraction);
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
