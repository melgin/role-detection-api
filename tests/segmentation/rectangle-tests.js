var chai = require('chai'),
    expect = chai.expect,
	fs = require('fs'),
	config = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
    rectangleUtil = require('./../../utils/rectangle-util'),
	segmenter = require('./../../page-segmenter'),
	Horseman = require('node-horseman');
	
	
describe('checkIntersection', function(){
	
	var rectA = {
	  topX: 10,
	  topY: 10,
	  width: 20,
	  height: 20
	};

	var rectB = {
	  topX: 20,
	  topY: 20,
	  width: 30,
	  height: 30
	};

	var rectC = {
	  topX: 70,
	  topY: 70,
	  height: 20,
	  width: 20
	};
	
	var rectD = {
	  topX: 30,
	  topY: 10,
	  width: 20,
	  height: 20
	};
	
	var rectE = {
		width: 160,
		height: 16,
		topX: 595,
		topY: 684
	};
	
	var rectF = {
		width: 160,
		height: 80,
		topX: 595,
		topY: 700
	};
	
	it('rectangleUtil.checkIntersection should return true if rectangles intersect', function() {
        expect(rectangleUtil.checkIntersection(rectA, rectB)).to.equal(true);
    });
	
	it('rectangleUtil.checkIntersection should return false if rectangles do not intersect', function() {
        expect(rectangleUtil.checkIntersection(rectA, rectC)).to.equal(false);
    });
	
	it('rectangleUtil.checkIntersection should return false if rectangles do not intersect', function() {
        expect(rectangleUtil.checkIntersection(rectA, rectD)).to.equal(false);
    });
	
	it('rectangleUtil.checkIntersection should return false if rectangles do not intersect', function() {
        expect(rectangleUtil.checkIntersection(rectE, rectF)).to.equal(false);
    });
	
	it('rectangleUtil.checkIntersection should return false if rectangles do not intersect', function() {
        expect(rectangleUtil.checkIntersection(rectF, rectE)).to.equal(false);
    });
})


describe('checkBlockIntersection', function(){
	var dom = JSON.parse(fs.readFileSync('./tests/data/bbc.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080),
		menuChildBlock = block.getChildAt(0),
		bodyChildBlock = block.getChildAt(1),
		otherChildBlock = bodyChildBlock.getChildAt(1);
	
	it('rectangleUtil.checkBlockIntersection should return true if blocks intersect', function() {
        expect(rectangleUtil.checkBlockIntersection(menuChildBlock, bodyChildBlock)).to.equal(true);
    });
	
	it('rectangleUtil.checkBlockIntersection should return false if blocks do not intersect', function() {
        expect(rectangleUtil.checkBlockIntersection(menuChildBlock, otherChildBlock)).to.equal(false);
    });
})

describe('subtract', function(){
	
	var rectA = {
	  topX: 10,
	  topY: 10,
	  width: 30,
	  height: 40
	};
	
	var rectA2 = {
	  topX: 10,
	  topY: 10,
	  width: 30,
	  height: 40
	};

	var rectB = {
	  topX: 30,
	  topY: 0,
	  width: 40,
	  height: 80
	};
	
	var rectB2 = {
	  topX: 30,
	  topY: 0,
	  width: 40,
	  height: 80
	};

	var rectC = {
	  topX: 0,
	  topY: 0,
	  height: 100,
	  width: 100
	};
	
	var rectD = {
	  topX: 100,
	  topY: 100,
	  height: 20,
	  width: 20
	};
	
	var rectX = { width: 1920, height: 40, topX: 0, topY: 0 };
	var rectY = { width: 1920, height: 2831, topX: 0, topY: 0 };
	
	it('rectangleUtil.subtract(rectA, rectB)', function() {
		var r = rectangleUtil.subtract(rectA, rectB);
        expect(r.topX).to.equal(40);
        expect(r.topY).to.equal(0);
        expect(r.width).to.equal(30);
        expect(r.height).to.equal(80);
    });
	
	it('rectangleUtil.subtract(rectB, rectA)', function() {
		var r = rectangleUtil.subtract(rectB2, rectA);
        expect(r.topX).to.equal(10);
        expect(r.topY).to.equal(10);
        expect(r.width).to.equal(20);
        expect(r.height).to.equal(40);
    });
	
	it('rectangleUtil.subtract(rectC, rectA)', function() {
		var r = rectangleUtil.subtract(rectC, rectA2);
        expect(r.topX).to.equal(10);
        expect(r.topY).to.equal(10);
        expect(r.width).to.equal(30);
        expect(r.height).to.equal(40);
    });
	
	it('rectangleUtil.subtract(rectD, rectA)', function() {
		var r = rectangleUtil.subtract(rectD, rectA2);
        expect(r.topX).to.equal(10);
        expect(r.topY).to.equal(10);
        expect(r.width).to.equal(30);
        expect(r.height).to.equal(40);
    });
	
	it('rectangleUtil.subtract(rectX, rectY)', function() {
		var r = rectangleUtil.subtract(rectX, rectY);
        expect(r.topX).to.equal(0);
        expect(r.topY).to.equal(40);
        expect(r.width).to.equal(1920);
        expect(r.height).to.equal(2791);
    });
})

describe('subtractBlock', function(){
	var dom = JSON.parse(fs.readFileSync('./tests/data/bbc.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080),
		menuChildBlock = block.getChildAt(0),
		bodyChildBlock = block.getChildAt(1),
		otherChildBlock = bodyChildBlock.getChildAt(1);
	
	rectangleUtil.subtractBlock(menuChildBlock, bodyChildBlock);
	var l = bodyChildBlock.getLocation();
	
	it('rectangleUtil.subtractBlock', function() {
        expect(l.topX).to.equal(0);
        expect(l.topY).to.equal(40);
        expect(l.width).to.equal(1920);
        expect(l.height).to.equal(2791);
    });
	
	
})

describe('isImageBlock', function(){
	var dom = JSON.parse(fs.readFileSync('./tests/data/avg.json', 'utf8')),
        block = segmenter.segment(dom, 1920, 1080),
		child = block.getChildAt(0).getChildAt(1).getChildAt(0).getChildAt(1);
		
	//VB.1.1.2.1.2
	
	it('block.isImageBlock should return true if blocks contains only image', function() {
        expect(child.getName()).to.equal('VB.1.1.2.1.2');
    });
	
	it('block.isImageBlock should return true if blocks contains only image', function() {
        expect(child.isImageBlock()).to.equal(true);
    });
	
	it('block.isImageBlock should return false if blocks does not contain only image', function() {
        expect(child = block.getChildAt(0).getChildAt(1).isImageBlock()).to.equal(false);
    });
})


describe('getIntersectionArea', function(){
	
	var rectA = {
	  topX: 10,
	  topY: 10,
	  width: 30,
	  height: 40
	};
	
	var rectA2 = {
	  topX: 10,
	  topY: 10,
	  width: 30,
	  height: 40
	};

	var rectB = {
	  topX: 30,
	  topY: 0,
	  width: 40,
	  height: 80
	};
	
	var rectB2 = {
	  topX: 30,
	  topY: 0,
	  width: 40,
	  height: 80
	};

	var rectC = {
	  topX: 0,
	  topY: 0,
	  height: 100,
	  width: 100
	};
	
	var rectD = {
	  topX: 100,
	  topY: 100,
	  height: 20,
	  width: 20
	};
	
	var rectX = { width: 1920, height: 40, topX: 0, topY: 0 };
	var rectY = { width: 1920, height: 2831, topX: 0, topY: 0 };
	
	it('rectangleUtil.getIntersectionArea(rectA, rectB)', function() {
		var r = rectangleUtil.getIntersectionArea(rectA, rectB);
        expect(r).to.equal(400);
    });
	
	it('rectangleUtil.getIntersectionArea(rectB, rectA)', function() {
		var r = rectangleUtil.getIntersectionArea(rectB2, rectA);
        expect(r).to.equal(400);
    });
	
	it('rectangleUtil.getIntersectionArea(rectD, rectA)', function() {
		var r = rectangleUtil.getIntersectionArea(rectD, rectA2);
        expect(r).to.equal(0);
    });
	
	it('rectangleUtil.getIntersectionArea(rectX, rectY)', function() {
		var r = rectangleUtil.getIntersectionArea(rectX, rectY);
        expect(r).to.equal(40*1920);
    });
});


describe('getWhiteSpaceArea', function(){
	
	var rectA = {
	  topX: 0,
	  topY: 0,
	  width: 30,
	  height: 40
	};
	
	var rectA7 = {
	  topX: 10,
	  topY: 10,
	  width: 10,
	  height: 20
	};
	
	var rectA2 = {
	  topX: 0,
	  topY: 0,
	  width: 30,
	  height: 40
	};
	
	var rectA3 = {
	  topX: 1000,
	  topY: 1000,
	  width: 30,
	  height: 40
	};
	
	var rectA4 = {
	  topX: 0,
	  topY: 0,
	  width: 30,
	  height: 20
	};
	
	var rectA5 = {
	  topX: 0,
	  topY: 20,
	  width: 30,
	  height: 20
	};
	
	var rectA6 = {
	  topX: 0,
	  topY: 0,
	  width: 60,
	  height: 60
	};
	
	it('rectangleUtil.getWhiteSpaceArea(rectA, [...]) -- exact match', function() {
		var r = rectangleUtil.getWhiteSpaceArea(rectA, [rectA2]);
        expect(r).to.equal(0);
    });
	
	it('rectangleUtil.getWhiteSpaceArea(rectA, [...]) -- no intersection', function() {
		var r = rectangleUtil.getWhiteSpaceArea(rectA, [rectA3]);
        expect(r).to.equal(1200);
    });
	
	it('rectangleUtil.getWhiteSpaceArea(rectA, [...]) -- one block at top edge', function() {
		var r = rectangleUtil.getWhiteSpaceArea(rectA, [rectA4]);
        expect(r).to.equal(600);
    });
	
	it('rectangleUtil.getWhiteSpaceArea(rectA, [...]) -- two blocks exact match', function() {
		var r = rectangleUtil.getWhiteSpaceArea(rectA, [rectA4, rectA5]);
        expect(r).to.equal(0);
    });
	
	it('rectangleUtil.getWhiteSpaceArea(rectA, [...]) -- one block larger', function() {
		var r = rectangleUtil.getWhiteSpaceArea(rectA, [rectA6]);
        expect(r).to.equal(0);
    });
	
	it('rectangleUtil.getWhiteSpaceArea(rectA, [...]) -- one block in the middle', function() {
		var r = rectangleUtil.getWhiteSpaceArea(rectA, [rectA7]);
        expect(r).to.equal(1000);
    });
	
	it('rectangleUtil.getWhiteSpaceArea(rectA, [...]) -- two blocks contains', function() {
		var r = rectangleUtil.getWhiteSpaceArea(rectA, [rectA7, rectA5]);
        expect(r).to.equal(500);
    });
});


