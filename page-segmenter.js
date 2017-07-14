var nodeChecker = require('./utils/node-checker'),
    blockBuilder = require('./utils/block-builder');

var DOC_COLUMN_FORM = 2,
	DOC_COLOR_FORM 	= 4,
	DOC_FLOAT_FORM 	= 4,
	DOC_LINEBREAK_FORM = 5,
	DOC_MARGIN_FORM = 6,
	DOC_GROUP_FORM = 6,
	DOC_FONT_SIZE_FORM = 7,
	DOC_NORMAL_FORM = 8,
	DOC_IMAGE_FORM = 9,
	DOC_VIRTUAL_FORM = 10,
	DOC_TERMINAL_FORM = 11;

var screenWidth = null,
    screenHeight = null;

function segment(rootNode, width, height){
    screenWidth = width;
    screenHeight = height;

	return blockExtraction({
        tagName: 'BODY',
        xpath: 'BODY',
        name: 'VB.1', children:[]}, rootNode, 1);
}

function blockExtraction(block, node, doc) {
	if(! node){
		return;
	} else if (+node.type === 3 /*Node.TEXT_NODE*/) {
		// no block
	} else if (node.children.length === 1) {
		var child = node.children[0];
		if (+child.type === 3 /*Node.TEXT_NODE*/) {
			block.doc = DOC_TERMINAL_FORM;
			return null;
		}

		return blockExtraction(block, child, DOC_TERMINAL_FORM);
	} else {
		// block has more than one children
		// (a) if all of the children are virtual text nodes, the node will
		// be a block
		if (nodeChecker.areAllChildrenVirtualTextNodes(node)) {
            console.log(node.xpath + ' all children are virtual text nodes ');
			// the node will be a block
			//blockBuilder.putIntoPool(block, node, DOC_VIRTUAL_FORM, null);
		} else if(nodeChecker.childrenHaveColumns(node, screenWidth)){
            console.log(node.xpath + ' has columns');
			blockBuilder.handleColumnsAtChildren(block, node, DOC_COLUMN_FORM, screenWidth, blockExtraction);
		} else if(nodeChecker.childrenHaveDifferentBackground(node)){
            console.log(node.xpath + ' children have different background');
			blockBuilder.handleDifferentBgColorAtChildren(block, node, DOC_COLOR_FORM, blockExtraction);
		} else if (nodeChecker.hasDifferentFontSizeInChildren(node, 0)) {
            console.log(node.xpath + ' children have different font size');
			blockBuilder.handleDifferentFontSize(block, node, DOC_FONT_SIZE_FORM, blockExtraction);
		} else if (nodeChecker.containsLineBreak(node)){
            console.log(node.xpath + ' contains line break');
			blockBuilder.handleLineBreaks(block, node, DOC_LINEBREAK_FORM, blockExtraction);
		} else if(nodeChecker.containsEmptyListItem(node)) {
            console.log(node.xpath + ' contains empty list item');
			blockBuilder.handleEmptyListItem(block, node, DOC_LINEBREAK_FORM, blockExtraction);
		} else if (nodeChecker.hasDivGroups(node)) {
            console.log(node.xpath + ' has div groups');
			blockBuilder.handleDivGroups(block, node, DOC_GROUP_FORM, blockExtraction);
		} else if (nodeChecker.hasDifferentFloatInChildren(node)) {
            console.log(node.xpath + ' children have different float');
			blockBuilder.handleDifferentFloat(block, node, DOC_FLOAT_FORM, blockExtraction);
		} else if (nodeChecker.hasDifferentMarginInChildren(node, 0)) {
            console.log(node.xpath + ' children have margin');
			blockBuilder.handleDifferentMargin(block, node, DOC_MARGIN_FORM, blockExtraction);
		} else if (nodeChecker.containsImage(node)) {
            console.log(node.xpath + ' contains image');
			blockBuilder.handleImageInChildren(block, node, DOC_IMAGE_FORM, blockExtraction);
		} else if (nodeChecker.containsLineBreakObject(node)) {
            console.log(node.xpath + ' contains line break object');
			blockBuilder.handleObjectInChildren(block, node, DOC_IMAGE_FORM, blockExtraction);
		} else {
            console.log(node.xpath + ' normal form');
			blockBuilder.handleNormalForm(block, node, DOC_NORMAL_FORM, blockExtraction);
		}

        return block;
	}
}

module.exports.segment = segment;
module.exports.blockExtraction = blockExtraction;
