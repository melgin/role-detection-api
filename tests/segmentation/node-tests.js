var chai = require('chai'),
    expect = chai.expect,
    Node = require('./../../node'),
    fs = require('fs');

describe('containsEmptyListItem', function() {
    it('containsEmptyListItem(node) should return false if node tag is not UL', function() {
        var node = new Node({tagName: 'DIV'});
        expect(node.containsEmptyListItem()).to.equal(false);
    });

    it('containsEmptyListItem(node) should return false if node has null children', function() {
        var node = new Node({tagName: 'UL'});
        expect(node.containsEmptyListItem()).to.equal(false);
    });

    it('containsEmptyListItem(node) should return false if node has empty children', function() {
        var node = new Node({tagName: 'UL', children: []});
        expect(node.containsEmptyListItem()).to.equal(false);
    });

    it('containsEmptyListItem(node) should return true if single child is empty list item', function() {
        var node = new Node({tagName: 'UL', children: [
            {tagName: 'LI'}
        ]});
        expect(node.containsEmptyListItem()).to.equal(true);
    });

    it('containsEmptyListItem(node) should return false if single child is not empty list item', function() {
        var node = new Node({tagName: 'UL', children: [
            {tagName: 'LI', children: [{tagName:'DIV'}]}
        ]});
        expect(node.containsEmptyListItem()).to.equal(false);
    });

    it('containsEmptyListItem(node) should return false if single child is not list item', function() {
        var node = new Node({tagName: 'UL', children: [
            {tagName: 'P'}
        ]});
        expect(node.containsEmptyListItem()).to.equal(false);
    });

    it('containsEmptyListItem(node) should return true if last child is empty list item', function() {
        var node = new Node({tagName: 'UL', children: [
            {tagName: 'LI', children: [{tagName:'DIV'}]},
            {tagName: 'LI', children: [{tagName:'DIV'}]},
            {tagName: 'LI', children: []}
        ]});
        expect(node.containsEmptyListItem()).to.equal(true);
    });

    it('containsEmptyListItem(node) should return true if first child is empty list item', function() {
        var node = new Node({tagName: 'UL', children: [
            {tagName: 'LI', children: []},
            {tagName: 'LI', children: [{tagName:'DIV'}]},
            {tagName: 'LI', children: [{tagName:'DIV'}]}
        ]});
        expect(node.containsEmptyListItem()).to.equal(true);
    });

    it('containsEmptyListItem(node) should return true if middle child is empty list item', function() {
        var node = new Node({tagName: 'UL', children: [
            {tagName: 'LI', children: [{tagName:'DIV'}]},
            {tagName: 'LI', children: []},
            {tagName: 'LI', children: [{tagName:'DIV'}]}
        ]});
        expect(node.containsEmptyListItem()).to.equal(true);
    });
});

describe('areAllChildrenVirtualTextNodes', function() {
    it('areAllChildrenVirtualTextNodes(node) should return true if node has null children', function() {
        var node = new Node({tagName: 'DIV'});
        expect(node.areAllChildrenVirtualTextNodes()).to.equal(true);
    });

    it('areAllChildrenVirtualTextNodes(node) should return true if node has empty children', function() {
        var node = new Node({tagName: 'DIV', children: []});
        expect(node.areAllChildrenVirtualTextNodes()).to.equal(true);
    });

    it('areAllChildrenVirtualTextNodes(node) should return true if single child is inline', function() {
        var node = new Node({tagName: 'DIV', children: [
            {inline: true}
        ]});
        expect(node.areAllChildrenVirtualTextNodes()).to.equal(true);
    });

    it('areAllChildrenVirtualTextNodes(node) should return false if single child\'s inline attribute is not set',
        function() {
        var node = new Node({tagName: 'UL', children: [
            {tagName: 'LI', children: [{tagName:'DIV'}]}
        ]});
        expect(node.areAllChildrenVirtualTextNodes()).to.equal(false);
    });

    it('areAllChildrenVirtualTextNodes(node) should return false if single child is not inline', function() {
        var node = new Node({tagName: 'DIV', children: [
            {inline: false}
        ]});
        expect(node.areAllChildrenVirtualTextNodes()).to.equal(false);
    });

    it('areAllChildrenVirtualTextNodes(node) should return false if one child is inline', function() {
        var node = new Node({tagName: 'DIV', children: [
            {tagName: 'P'}, {tagName: 'P'}, {tagName: 'A', inline: true}
        ]});
        expect(node.areAllChildrenVirtualTextNodes()).to.equal(false);
    });

    it('areAllChildrenVirtualTextNodes(node) should return true if all children are inline', function() {
        var node = new Node({tagName: 'DIV', children: [
            {tagName: 'A', inline: true}, {tagName: 'A', type: 3}, {tagName: 'A', inline: true}
        ]});
        expect(node.areAllChildrenVirtualTextNodes()).to.equal(true);
    });
});

describe('containsLineBreak', function() {
    it('containsLineBreak(node) should return true if containsLineBreak attribute is true', function() {
        var node = new Node({containsLineBreak: true});
        expect(node.containsLineBreak()).to.equal(true);
    });

    it('containsLineBreak(node) should return false if containsLineBreak attribute is false', function() {
        var node = new Node({containsLineBreak: false});
        expect(node.containsLineBreak()).to.equal(false);
    });

    it('containsLineBreak(node) should return false if containsLineBreak attribute is null', function() {
        var node = new Node({tagName: 'DIV'});
        expect(node.containsLineBreak()).to.equal(false);
    });
});

describe('containsImage', function() {
    it('containsImage(node) should return true if containsImage attribute is true', function() {
        var node = new Node({containsImage: true});
        expect(node.containsImage()).to.equal(true);
    });

    it('containsImage(node) should return false if containsImage attribute is false', function() {
        var node = new Node({containsImage: false});
        expect(node.containsImage()).to.equal(false);
    });

    it('containsImage(node) should return false if containsImage attribute is null', function() {
        var node = new Node({tagName: 'DIV'});
        expect(node.containsImage()).to.equal(false);
    });
});

describe('containsLineBreakObject', function() {
    it('containsLineBreakObject(node) should return true if containsImage attribute is true', function() {
        var node = new Node({containsLineBreakTerminalNode: true});
        expect(node.containsLineBreakObject()).to.equal(true);
    });

    it('containsLineBreakObject(node) should return false if containsImage attribute is false', function() {
        var node = new Node({containsLineBreakTerminalNode: false});
        expect(node.containsLineBreakObject()).to.equal(false);
    });

    it('containsLineBreakObject(node) should return false if containsImage attribute is null', function() {
        var node = new Node({tagName: 'DIV'});
        expect(node.containsLineBreakObject()).to.equal(false);
    });
});

describe('childrenHaveDifferentBackground', function() {
    it('childrenHaveDifferentBackground(node) should return false if node has no children', function() {
        var node = new Node({});
        expect(node.childrenHaveDifferentBackground()).to.equal(false);
    });

    it('childrenHaveDifferentBackground(node) should return false if node has only one child', function() {
        var node = new Node({children: [{attributes: {background: 'transparent'}}]});
        expect(node.childrenHaveDifferentBackground()).to.equal(false);
    });

    it('childrenHaveDifferentBackground(node) should return false if all children have the same background', function(){
        var node = new Node({children: [
            {attributes: {background: 'white'}},
            {attributes: {background: 'white'}},
            {attributes: {background: 'white'}}
        ]});
        expect(node.childrenHaveDifferentBackground()).to.equal(false);
    });

    it('childrenHaveDifferentBackground(node) should return true if at least one child has different background',
        function() {
            var node = new Node({children: [
                {attributes: {background: 'white'}},
                {attributes: {background: 'white'}},
                {attributes: {background: 'black'}}
            ]});
        expect(node.childrenHaveDifferentBackground()).to.equal(true);
    });
});

describe('childrenHaveRows', function() {
    var dom = JSON.parse(fs.readFileSync('./tests/data/layout-data.json', 'utf8'));

    it('childrenHaveRows(node, width) should return false if children are rows (2)', function() {
        var node = new Node(dom.children[0]);
        expect(node.childrenHaveRows(1920)).to.equal(false);
    });

    it('childrenHaveRows(node, width) should return false if children are rows (3)', function() {
        var node = new Node(dom.children[1]);
        expect(node.childrenHaveRows(1920)).to.equal(false);
    });

    it('childrenHaveRows(node, width) should return true if children are columns (6)', function() {
        var node = new Node(dom.children[2]);
        expect(node.childrenHaveRows(1920)).to.equal(true);
    });

    it('childrenHaveRows(node, width) should return true if children are columns (6, 12)', function() {
        var node = new Node(dom.children[3]);
        expect(node.childrenHaveRows(1920)).to.equal(true);
    });

    it('childrenHaveRows(node, width) should return false if children are columns (8)', function() {
        var node = new Node(dom.children[4]);
        expect(node.childrenHaveRows(1920)).to.equal(false);
    });

    it('childrenHaveRows(node, width) should return false if children are columns (12)', function() {
        var node = new Node(dom.children[5]);
        expect(node.childrenHaveRows(1920)).to.equal(false);
    });
});

describe('hasDifferentMarginInChildren', function() {
    var dom = JSON.parse(fs.readFileSync('./tests/data/margin-data.json', 'utf8'));

    it('hasDifferentMarginInChildren(node) should return false', function() {
        var node = new Node(dom.children[0]);
        expect(node.hasDifferentMarginInChildren()).to.equal(false);
    });

    it('hasDifferentMarginInChildren(node) should return true if one child has margin', function() {
        var node = new Node(dom.children[1]);
        expect(node.hasDifferentMarginInChildren()).to.equal(true);
    });

    it('hasDifferentMarginInChildren(node) should return true if multiple children have margin', function() {
        var node = new Node(dom.children[2]);
        expect(node.hasDifferentMarginInChildren()).to.equal(true);
    });

    it('hasDifferentMarginInChildren(node) should return false', function() {
        var node = new Node(dom.children[3]);
        expect(node.hasDifferentMarginInChildren()).to.equal(false);
    });
});

describe('childrenHaveDifferentBackground', function() {
    var dom = JSON.parse(fs.readFileSync('./tests/data/background-data.json', 'utf8'));

    it('childrenHaveDifferentBackground(node) should return true', function() {
        var node = new Node(dom.children[0]);
        expect(node.childrenHaveDifferentBackground()).to.equal(true);
    });

    it('childrenHaveDifferentBackground(node) should return true', function() {
        var node = new Node(dom.children[1]);
        expect(node.childrenHaveDifferentBackground()).to.equal(true);
    });

    it('childrenHaveDifferentBackground(node) should return true', function() {
        var node = new Node(dom.children[2]);
        expect(node.childrenHaveDifferentBackground()).to.equal(true);
    });

    it('childrenHaveDifferentBackground(node) should return true', function() {
        var node = new Node(dom.children[3]);
        expect(node.childrenHaveDifferentBackground()).to.equal(true);
    });
});
