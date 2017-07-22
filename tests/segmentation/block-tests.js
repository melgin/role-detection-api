var chai = require('chai'),
    expect = chai.expect,
    Node = require('./../../dom-node'),
    Block = require('./../../block'),
	segmenter = require('./../../page-segmenter'),
    fs = require('fs');

describe('getTagName', function(){
	var block = new Block({tagName: 'DIV'}, new Node({}));
	
	it('block.getTagName() should return \'DIV\'', function() {
        var node = new Node({tagName: 'DIV', containsImage: false});
        expect(block.getTagName()).to.equal('DIV');
    });
})

describe('getAsFact for NAV node', function(){
	var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-offcanvas-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080),
		fact = null;

	block.getChildAt(0).setParentRole('BODY');
	
	fact = block.getChildAt(0).getAsFact(1920, 1080, '14px', 'rgb(0, 0, 0)');
	
	it('block.getAsFact().hasId', function() {
        expect(fact.hasId).to.equal('navbar navbar-fixed-top navbar-inverse');
    });
	
	it('block.getAsFact().hasTag', function() {
        expect(fact.hasTag).to.equal('|nav|,|div|');
    });
	
	it('block.getAsFact().mustHaveTag', function() {
        expect(fact.mustHaveTag).to.equal('|nav|,|div|');
    });
	
	it('block.getAsFact().isComposite', function() {
        expect(fact.isComposite).to.equal(0);
    });
	
	it('block.getAsFact().hasSize', function() {
        expect(fact.hasSize).to.equal('1920x51');
    });
	
	it('block.getAsFact().hasOrder', function() {
        expect(fact.hasOrder).to.equal(1);
    });
	
	it('block.getAsFact().isAtomic', function() {
        expect(fact.isAtomic).to.equal(0);
    });
	
	it('block.getAsFact().inPosition', function() {
        expect(fact.inPosition).to.equal('left, top');
    });
	
	it('block.getAsFact().fontSize', function() {
        expect(fact.fontSize).to.equal(0);
    });
	
	it('block.getAsFact().border', function() {
        expect(fact.border).to.equal(1);
    });
	
	it('block.getAsFact().fontColor', function() {
        expect(fact.fontColor).to.equal(1);
    });
	
	it('block.getAsFact().hasBackground', function() {
        expect(fact.hasBackground).to.equal(1);
    });
	
	it('block.getAsFact().wordCount', function() {
        expect(fact.wordCount).to.equal('medium');
    });
	
	it('block.getAsFact().hasParent', function() {
        expect(fact.hasParent).to.equal('body');
    });
	
	it('block.getAsFact().relativeSize', function() {
        expect(fact.relativeSize).to.equal('full, medium_height');
    });
	
	it('block.getAsFact().doc', function() {
        expect(fact.doc).to.equal(7);
    });
	
	it('block.getAsFact().hasListStyle', function() {
        expect(fact.hasListStyle).to.equal(0);
    });
	
	it('block.getAsFact().hasAttribute', function() {
        expect(fact.hasAttribute).to.equal('');
    });
	
	it('block.getAsFact().fontWeight', function() {
        expect(fact.fontWeight).to.equal(0);
    });
})

describe('getAsFact for H2 node', function(){
	var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-offcanvas-data.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080),
		fact = null,
		childBlock = block.getChildAt(1).getChildAt(0).getChildAt(0).getChildAt(1).getChildAt(0).getChildAt(2).getChildAt(0);

	childBlock.setParentRole(null);
	
	fact = childBlock.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)');
	
	it('block.getAsFact().hasId', function() {
        expect(fact.hasId).to.equal('');
    });
	
	it('block.getAsFact().hasTag', function() {
        expect(fact.hasTag).to.equal('|h2|,|text|');
    });
	
	it('block.getAsFact().mustHaveTag', function() {
        expect(fact.mustHaveTag).to.equal('|h2|,|text|');
    });
	
	it('block.getAsFact().isComposite', function() {
        expect(fact.isComposite).to.equal(0);
    });
	
	it('block.getAsFact().hasSize', function() {
        expect(fact.hasSize).to.equal('262x33');
    });
	
	it('block.getAsFact().hasOrder', function() {
        expect(fact.hasOrder).to.equal(1);
    });
	
	it('block.getAsFact().isAtomic', function() {
        expect(fact.isAtomic).to.equal(1);
    });
	
	it('block.getAsFact().inPosition', function() {
        expect(fact.inPosition).to.equal('center, center');
    });
	
	it('block.getAsFact().fontSize', function() {
        expect(fact.fontSize).to.equal(1);
    });
	
	it('block.getAsFact().border', function() {
        expect(fact.border).to.equal(0);
    });
	
	it('block.getAsFact().fontColor', function() {
        expect(fact.fontColor).to.equal(0);
    });
	
	it('block.getAsFact().hasBackground', function() {
        expect(fact.hasBackground).to.equal(0);
    });
	
	it('block.getAsFact().wordCount', function() {
        expect(fact.wordCount).to.equal('one');
    });
	
	it('block.getAsFact().hasParent', function() {
        expect(fact.hasParent).to.equal('');
    });
	
	it('block.getAsFact().relativeSize', function() {
        expect(fact.relativeSize).to.equal('medium_length, short');
    });
	
	it('block.getAsFact().doc', function() {
        expect(fact.doc).to.equal(11);
    });
	
	it('block.getAsFact().hasListStyle', function() {
        expect(fact.hasListStyle).to.equal(0);
    });
	
	it('block.getAsFact().hasAttribute', function() {
        expect(fact.hasAttribute).to.equal('');
    });
	
	it('block.getAsFact().fontWeight', function() {
        expect(fact.fontWeight).to.equal(1);
    });
})

describe('getAsFact for a node with empty attributes', function(){
	var dom = JSON.parse(fs.readFileSync('./tests/data/bootstrap-offcanvas-data.json', 'utf8')),
        block = new Block({}, new Node({})),
		fact = block.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)');
	
	it('block.getAsFact().hasId', function() {
        expect(fact.hasId).to.equal('');
    });
	
	it('block.getAsFact().hasTag', function() {
        expect(fact.hasTag).to.equal('||');
    });
	
	it('block.getAsFact().mustHaveTag', function() {
        expect(fact.mustHaveTag).to.equal('||');
    });
	
	it('block.getAsFact().isComposite', function() {
        expect(fact.isComposite).to.equal(0);
    });
	
	it('block.getAsFact().hasSize', function() {
        expect(fact.hasSize).to.equal('');
    });
	
	it('block.getAsFact().isAtomic', function() {
        expect(fact.isAtomic).to.equal(1);
    });
	
	it('block.getAsFact().inPosition', function() {
        expect(fact.inPosition).to.equal(', ');
    });
	
	it('block.getAsFact().fontSize', function() {
        expect(fact.fontSize).to.equal(0);
    });
	
	it('block.getAsFact().border', function() {
        expect(fact.border).to.equal(0);
    });
	
	it('block.getAsFact().fontColor', function() {
        expect(fact.fontColor).to.equal(0);
    });
	
	it('block.getAsFact().hasBackground', function() {
        expect(fact.hasBackground).to.equal(0);
    });
	
	it('block.getAsFact().wordCount', function() {
        expect(fact.wordCount).to.equal('none');
    });
	
	it('block.getAsFact().relativeSize', function() {
        expect(fact.relativeSize).to.equal(', ');
    });
	
	it('block.getAsFact().hasListStyle', function() {
        expect(fact.hasListStyle).to.equal(0);
    });
	
	it('block.getAsFact().hasAttribute', function() {
        expect(fact.hasAttribute).to.equal('');
    });
	
	it('block.getAsFact().fontWeight', function() {
        expect(fact.fontWeight).to.equal(0);
    });
})

describe('getAsFact.hasId', function(){
	var block = new Block({}, new Node({ 
			id:"id",
			className:"cls",
			attributes: {
				src: "src",
				value: "val",
				role: "role",
				name: "name",
				backgroundImage: "bg"
			}
		})),
		fact = block.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)');
	
	it('block.getAsFact().hasId', function() {
        expect(fact.hasId).to.equal('id,cls,src,val,role,name,bg');
    });
})

describe('getAsFact.wordCount', function(){
	var block1 = new Block({}, new Node({
			attributes: {
				wordCount: 3
			}
		})),
		fact1 = block1.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)'),
		block2 = new Block({}, new Node({
			attributes: {
				wordCount: 1000
			}
		})),
		fact2 = block2.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)');
	
	it('block.getAsFact().wordCount', function() {
        expect(fact1.wordCount).to.equal('few');
    });
	
	it('block.getAsFact().wordCount', function() {
        expect(fact2.wordCount).to.equal('many');
    });
})

describe('getAsFact.fontSize', function(){
	var block1 = new Block({}, new Node({
			attributes: {
				fontSize: 11
			}
		})),
		fact1 = block1.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)');
	
	it('block.getAsFact().fontSize', function() {
        expect(fact1.fontSize).to.equal(-1);
    });
})

describe('getAsFact.fontWeight', function(){
	var block1 = new Block({}, new Node({
			attributes: {
				fontWeight: 'bold'
			}
		})),
		fact1 = block1.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)'),
		block2 = new Block({}, new Node({
			attributes: {
				fontWeight: 300
			}
		})),
		fact2 = block2.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)');
	
	it('block.getAsFact().fontWeight', function() {
        expect(fact1.fontWeight).to.equal(1);
    });
	
	it('block.getAsFact().fontWeight', function() {
        expect(fact2.fontWeight).to.equal(0);
    });
})

describe('getAsFact.border', function(){
	var block1 = new Block({}, new Node({
			attributes: {
				borderBottom: '1x solid rgb(0, 0, 0)'
			}
		})),
		fact1 = block1.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)'),
		block2 = new Block({}, new Node({
			children: [
				{
					attributes: {
						borderLeft: '1x solid rgb(0, 0, 0)'
					}
				}
			]
		})),
		fact2 = block2.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)');
	
	it('block.getAsFact().border', function() {
        expect(fact1.border).to.equal(1);
    });
	
	it('block.getAsFact().border with children', function() {
        expect(fact2.border).to.equal(1);
    });
})

describe('getAsFact.hasListStyle', function(){
	var block1 = new Block({}, new Node({
			tagName: 'LI',
			attributes: {
				listStyle: 'disc outside none'
			}
		})),
		fact1 = block1.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)'),
		block2 = new Block({}, new Node({
			tagName: 'LI',
			attributes: {
				listStyle: 'none outside none'
			}
		})),
		fact2 = block2.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)');
	
	it('block.getAsFact().hasListStyle', function() {
        expect(fact1.hasListStyle).to.equal(1);
    });
	
	it('block.getAsFact().hasListStyle', function() {
        expect(fact2.hasListStyle).to.equal(0);
    });

})

describe('getAsFact.relativeSize', function(){
	var block1 = new Block({}, new Node({
			tagName: 'LI',
			attributes: {
				width: 1000,
				height: 1000
			}
		})),
		fact1 = block1.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)'),
		block2 = new Block({}, new Node({
			tagName: 'LI',
			attributes: {
				width: 40,
				height: 10,
			}
		})),
		fact2 = block2.getAsFact(1920, 1080, '14px', 'rgb(51, 51, 51)');
	
	it('block.getAsFact().relativeSize', function() {
        expect(fact1.relativeSize).to.equal('wide, long');
    });
	
	it('block.getAsFact().relativeSize', function() {
        expect(fact2.relativeSize).to.equal('narrow, short');
    });

})
