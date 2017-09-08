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
	
	it('rectangleUtil.checkIntersection should return true if rectangles intersect', function() {
        expect(rectangleUtil.checkIntersection(rectA, rectB)).to.equal(true);
    });
	
	it('rectangleUtil.checkIntersection should return false if rectangles do not intersect', function() {
        expect(rectangleUtil.checkIntersection(rectA, rectC)).to.equal(false);
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
