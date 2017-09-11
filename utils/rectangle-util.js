
function checkIntersection(b1, b2){
	return (b2.topX < (b1.topX + b1.width - 1) && 
           (b2.topX + b2.width - 1) > b1.topX && 
           b2.topY < (b1.topY + b1.height - 1) &&
           (b2.topY + b2.height - 1) > b1.topY);
}

function getIntersectionArea(b1, b2){
	var xOverlap = Math.max(0, Math.min(b1.topX + b1.width, b2.topX + b2.width) - Math.max(b1.topX, b2.topX));
	var yOverlap = Math.max(0, Math.min(b1.topY + b1.height, b2.topY + b2.height) - Math.max(b1.topY, b2.topY));
	
	return xOverlap * yOverlap;
}

function checkBlockIntersection(b1, b2){
	return checkIntersection(b1.getLocation(), b2.getLocation());
}

function subtractBlock(b1, b2){
	var intersectionArea = getIntersectionArea(b1.getLocation(), b2.getLocation());
	
	if(intersectionArea / b1.getArea() >= 0.8 || intersectionArea / b2.getArea() >= 0.8){
		if(b1.isImageBlock()){
			return b1.setRole('BackgroundImage');
		}
		
		if(b2.isImageBlock()){
			return b2.setRole('BackgroundImage');
		}
	}
	
	var zIndex1 = b1.getNode().attributes.zIndex;
	var zIndex2 = b2.getNode().attributes.zIndex;
		
	if(zIndex1 > zIndex2){
		var l = subtract(b1.getLocation(), b2.getLocation());
		if(l.height !== 0 && l.width !== 0){
			b2.setLocation(l);
		}
	} else if(zIndex1 < zIndex2){
		var l = subtract(b2.getLocation(), b1.getLocation());
		if(l.height !== 0 && l.width !== 0){
			b1.setLocation(l);
		}
	} else if(b1.getNode().type === 3){
		var l = subtract(b2.getLocation(), b1.getLocation());
		if(l.height !== 0 && l.width !== 0){
			b2.setLocation(l);
		}
	} else if(b2.getNode().type === 3){
		var l = subtract(b1.getLocation(), b2.getLocation());
		if(l.height !== 0 && l.width !== 0){
			b2.setLocation(l);
		}
	} else {
		b1.subtractPadding();
		b2.subtractPadding();
	}
}

function subtract(blockInFront, blockAtBack){
	var l1 = blockInFront.topX,
		l2 = blockAtBack.topX,
		r1 = blockInFront.topX + blockInFront.width,
		r2 = blockAtBack.topX + blockAtBack.width,
		t1 = blockInFront.topY,
		t2 = blockAtBack.topY,
		b1 = blockInFront.topY + blockInFront.height,
		b2 = blockAtBack.topY + blockAtBack.height;
		
	if(l1 === l2 && r1 === r2) {
		// do nothing
	} else if(l1 <= l2 && l2 < r1 && r1 <= r2){
		var diff = r1 - l2;
		blockAtBack.topX += diff;
		blockAtBack.width -= diff;
	} else if(l2 <= l1 && l1 < r2 && r2 <= r1){
		blockAtBack.width -= r2 - l1;
	}
	
	if(t1 === t2 && b1 === b2) {
		// do nothing
	} else if(t1 <= t2 && t2 < b1 && b1 <= b2){
		var diff = b1 - t2;
		blockAtBack.topY += diff;
		blockAtBack.height -= diff;
	} else if(t2 <= t1 && t1 < b2 && b2 <= b1){
		blockAtBack.height -= b2 - t1;
	}
	
	return blockAtBack;
}

module.exports.checkIntersection = checkIntersection;
module.exports.getIntersectionArea = getIntersectionArea;
module.exports.checkBlockIntersection = checkBlockIntersection;
module.exports.subtractBlock = subtractBlock;
module.exports.subtract = subtract;