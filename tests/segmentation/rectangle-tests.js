var chai = require('chai'),
    expect = chai.expect,
    rectangleUtil = require('./../../utils/rectangle-util'),
    fs = require('fs');
	
	
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