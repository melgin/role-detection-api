var chai = require('chai'),
    expect = chai.expect,
    segmenter = require('./../../utils/node-checker'),
    fs = require('fs');

describe('containsEmptyListItem', function() {
    it('containsEmptyListItem(node) should return false if node tag is not UL', function() {
        expect(segmenter.containsEmptyListItem({tagName: 'DIV'})).to.equal(false);
    });

    it('containsEmptyListItem(node) should return false if node has null children', function() {
        expect(segmenter.containsEmptyListItem({tagName: 'UL'})).to.equal(false);
    });

    it('containsEmptyListItem(node) should return false if node has empty children', function() {
        expect(segmenter.containsEmptyListItem({tagName: 'UL', children: []})).to.equal(false);
    });

    it('containsEmptyListItem(node) should return true if single child is empty list item', function() {
        expect(segmenter.containsEmptyListItem({tagName: 'UL', children: [
            {tagName: 'LI'}
        ]})).to.equal(true);
    });

    it('containsEmptyListItem(node) should return false if single child is not empty list item', function() {
        expect(segmenter.containsEmptyListItem({tagName: 'UL', children: [
            {tagName: 'LI', children: [{tagName:'DIV'}]}
        ]})).to.equal(false);
    });

    it('containsEmptyListItem(node) should return false if single child is not list item', function() {
        expect(segmenter.containsEmptyListItem({tagName: 'UL', children: [
            {tagName: 'P'}
        ]})).to.equal(false);
    });

    it('containsEmptyListItem(node) should return true if last child is empty list item', function() {
        expect(segmenter.containsEmptyListItem({tagName: 'UL', children: [
            {tagName: 'LI', children: [{tagName:'DIV'}]},
            {tagName: 'LI', children: [{tagName:'DIV'}]},
            {tagName: 'LI', children: []}
        ]})).to.equal(true);
    });

    it('containsEmptyListItem(node) should return true if first child is empty list item', function() {
        expect(segmenter.containsEmptyListItem({tagName: 'UL', children: [
            {tagName: 'LI', children: []},
            {tagName: 'LI', children: [{tagName:'DIV'}]},
            {tagName: 'LI', children: [{tagName:'DIV'}]}
        ]})).to.equal(true);
    });

    it('containsEmptyListItem(node) should return true if middle child is empty list item', function() {
        expect(segmenter.containsEmptyListItem({tagName: 'UL', children: [
            {tagName: 'LI', children: [{tagName:'DIV'}]},
            {tagName: 'LI', children: []},
            {tagName: 'LI', children: [{tagName:'DIV'}]}
        ]})).to.equal(true);
    });
});

describe('areAllChildrenVirtualTextNodes', function() {
    it('areAllChildrenVirtualTextNodes(node) should return true if node has null children', function() {
        expect(segmenter.areAllChildrenVirtualTextNodes({tagName: 'DIV'})).to.equal(true);
    });

    it('areAllChildrenVirtualTextNodes(node) should return true if node has empty children', function() {
        expect(segmenter.areAllChildrenVirtualTextNodes({tagName: 'DIV', children: []})).to.equal(true);
    });

    it('areAllChildrenVirtualTextNodes(node) should return true if single child is inline', function() {
        expect(segmenter.areAllChildrenVirtualTextNodes({tagName: 'DIV', children: [
            {inline: true}
        ]})).to.equal(true);
    });

    it('areAllChildrenVirtualTextNodes(node) should return false if single child\'s inline attribute is not set',
        function() {
        expect(segmenter.areAllChildrenVirtualTextNodes({tagName: 'UL', children: [
            {tagName: 'LI', children: [{tagName:'DIV'}]}
        ]})).to.equal(false);
    });

    it('areAllChildrenVirtualTextNodes(node) should return false if single child is not inline', function() {
        expect(segmenter.areAllChildrenVirtualTextNodes({tagName: 'DIV', children: [
            {inline: false}
        ]})).to.equal(false);
    });

    it('areAllChildrenVirtualTextNodes(node) should return false if one child is inline', function() {
        expect(segmenter.areAllChildrenVirtualTextNodes({tagName: 'DIV', children: [
            {tagName: 'P'}, {tagName: 'P'}, {tagName: 'A', inline: true}
        ]})).to.equal(false);
    });

    it('areAllChildrenVirtualTextNodes(node) should return true if all children are inline', function() {
        expect(segmenter.areAllChildrenVirtualTextNodes({tagName: 'DIV', children: [
            {tagName: 'A', inline: true}, {tagName: 'A', type: 3}, {tagName: 'A', inline: true}
        ]})).to.equal(true);
    });
});

describe('containsLineBreak', function() {
    it('containsLineBreak(node) should return true if containsLineBreak attribute is true', function() {
        expect(segmenter.containsLineBreak({containsLineBreak: true})).to.equal(true);
    });

    it('containsLineBreak(node) should return false if containsLineBreak attribute is false', function() {
        expect(segmenter.containsLineBreak({containsLineBreak: false})).to.equal(false);
    });

    it('containsLineBreak(node) should return false if containsLineBreak attribute is null', function() {
        expect(segmenter.containsLineBreak({tagName: 'DIV'})).to.equal(false);
    });
});

describe('containsImage', function() {
    it('containsImage(node) should return true if containsImage attribute is true', function() {
        expect(segmenter.containsImage({containsImage: true})).to.equal(true);
    });

    it('containsImage(node) should return false if containsImage attribute is false', function() {
        expect(segmenter.containsImage({containsImage: false})).to.equal(false);
    });

    it('containsImage(node) should return false if containsImage attribute is null', function() {
        expect(segmenter.containsImage({tagName: 'DIV'})).to.equal(false);
    });
});

describe('containsLineBreakObject', function() {
    it('containsLineBreakObject(node) should return true if containsImage attribute is true', function() {
        expect(segmenter.containsLineBreakObject({containsLineBreakTerminalNode: true})).to.equal(true);
    });

    it('containsLineBreakObject(node) should return false if containsImage attribute is false', function() {
        expect(segmenter.containsLineBreakObject({containsLineBreakTerminalNode: false})).to.equal(false);
    });

    it('containsLineBreakObject(node) should return false if containsImage attribute is null', function() {
        expect(segmenter.containsLineBreakObject({tagName: 'DIV'})).to.equal(false);
    });
});

describe('childrenHaveDifferentBackground', function() {
    it('childrenHaveDifferentBackground(node) should return false if node has no children', function() {
        expect(segmenter.childrenHaveDifferentBackground({})).to.equal(false);
    });

    it('childrenHaveDifferentBackground(node) should return false if node has only one child', function() {
        expect(segmenter.childrenHaveDifferentBackground({children: [{attributes: {background: 'transparent'}}]})).to.equal(false);
    });

    it('childrenHaveDifferentBackground(node) should return false if all children have the same background', function(){
        expect(segmenter.childrenHaveDifferentBackground({children: [
            {attributes: {background: 'white'}},
            {attributes: {background: 'white'}},
            {attributes: {background: 'white'}}
        ]})).to.equal(false);
    });

    it('childrenHaveDifferentBackground(node) should return true if at least one child has different background',
        function() {
        expect(segmenter.childrenHaveDifferentBackground({children: [
            {attributes: {background: 'white'}},
            {attributes: {background: 'white'}},
            {attributes: {background: 'black'}}
        ]})).to.equal(true);
    });
});

describe('childrenHaveColumns', function() {
    var dom = JSON.parse(fs.readFileSync('./tests/data/layout-data.json', 'utf8'));

    it('childrenHaveColumns(node, width) should return false if children are rows (2)', function() {
        expect(segmenter.childrenHaveColumns(dom.children[0], 1920)).to.equal(false);
    });

    it('childrenHaveColumns(node, width) should return false if children are rows (3)', function() {
        expect(segmenter.childrenHaveColumns(dom.children[1], 1920)).to.equal(false);
    });

    it('childrenHaveColumns(node, width) should return true if children are columns (6)', function() {
        expect(segmenter.childrenHaveColumns(dom.children[2], 1920)).to.equal(true);
    });

    it('childrenHaveColumns(node, width) should return true if children are columns (6, 12)', function() {
        expect(segmenter.childrenHaveColumns(dom.children[3], 1920)).to.equal(true);
    });

    it('childrenHaveColumns(node, width) should return false if children are columns (8)', function() {
        expect(segmenter.childrenHaveColumns(dom.children[4], 1920)).to.equal(false);
    });

    it('childrenHaveColumns(node, width) should return false if children are columns (12)', function() {
        expect(segmenter.childrenHaveColumns(dom.children[5], 1920)).to.equal(false);
    });
});

describe('hasDifferentMarginInChildren', function() {
    var dom = JSON.parse(fs.readFileSync('./tests/data/margin-data.json', 'utf8'));

    it('hasDifferentMarginInChildren(node) should return false', function() {
        expect(segmenter.hasDifferentMarginInChildren(dom.children[0])).to.equal(false);
    });

    it('hasDifferentMarginInChildren(node) should return true if one child has margin', function() {
        expect(segmenter.hasDifferentMarginInChildren(dom.children[1])).to.equal(true);
    });

    it('hasDifferentMarginInChildren(node) should return true if multiple children have margin', function() {
        expect(segmenter.hasDifferentMarginInChildren(dom.children[2])).to.equal(true);
    });

    it('hasDifferentMarginInChildren(node) should return false', function() {
        expect(segmenter.hasDifferentMarginInChildren(dom.children[3])).to.equal(false);
    });
});

describe('childrenHaveDifferentBackground', function() {
    var dom = JSON.parse(fs.readFileSync('./tests/data/background-data.json', 'utf8'));

    it('childrenHaveDifferentBackground(node) should return true', function() {
        expect(segmenter.childrenHaveDifferentBackground(dom.children[0])).to.equal(true);
    });

    it('childrenHaveDifferentBackground(node) should return true', function() {
        expect(segmenter.childrenHaveDifferentBackground(dom.children[1])).to.equal(true);
    });

    it('childrenHaveDifferentBackground(node) should return true', function() {
        expect(segmenter.childrenHaveDifferentBackground(dom.children[2])).to.equal(true);
    });

    it('childrenHaveDifferentBackground(node) should return true', function() {
        expect(segmenter.childrenHaveDifferentBackground(dom.children[3])).to.equal(true);
    });
});
