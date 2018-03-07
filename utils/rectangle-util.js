
function checkIntersection(b1, b2){
	return (b2.topX < (b1.topX + b1.width - 1) &&
           (b2.topX + b2.width - 1) > b1.topX &&
           b2.topY < (b1.topY + b1.height - 1) &&
           (b2.topY + b2.height - 1) > b1.topY);
}

function getWhiteSpaceArea(mainBlock, subBlockList){
	if(! subBlockList || subBlockList.length === 0){
		return mainBlock.width * mainBlock.height;
	}
	
	var intersectionBlocks = [];
	
	for(var i = 0; i < subBlockList.length; i++){
		var subBlock = subBlockList[i];
		if(checkIntersection(mainBlock, subBlock)){
			intersectionBlocks.push(subBlock);
		}
	}
	
	var blockList = [mainBlock];
	if(! intersectionBlocks || intersectionBlocks.length === 0){
		return mainBlock.width * mainBlock.height;
	}
	
	for(var i = 0; i < intersectionBlocks.length; i++){
		var subBlock = intersectionBlocks[i];
		
		if(blockList.length === 0){
			return 0;
		}
		
		var tmpBlockList = [];
		for(var j = 0; j < blockList.length; j++){
			var block = blockList[j];
			
			if(checkIntersection(block, subBlock)){
				var blockOnTheLeft = {
					topX: block.topX,
					topY: subBlock.topY,
					width: subBlock.topX - block.topX,
					height: subBlock.height,
					d: 'l'
				};
				var blockOnTheRight = {
					topX: subBlock.topX + subBlock.width,
					topY: subBlock.topY,
					width: block.topX + block.width - subBlock.topX - subBlock.width,
					height: subBlock.height,
					d: 'r'
				};
				var blockOnTheTop = {
					topX: block.topX,
					topY: block.topY,
					width: block.width,
					height: subBlock.topY - block.topY,
					d: 't'
				};
				var blockOnTheBottom = {
					topX: block.topX,
					topY: subBlock.topY + subBlock.height,
					width: block.width,
					height: block.topY + block.height - subBlock.topY - subBlock.height,
					d: 'b'
				};
				
				//blockList.splice(j, 1);

				if(blockOnTheLeft.width > 0 && blockOnTheLeft.height > 0){
					tmpBlockList.push(blockOnTheLeft);
				}
				
				if(blockOnTheRight.width > 0 && blockOnTheRight.height > 0){
					tmpBlockList.push(blockOnTheRight);
				}
				
				if(blockOnTheTop.width > 0 && blockOnTheTop.height > 0){
					tmpBlockList.push(blockOnTheTop);
				}
				
				if(blockOnTheBottom.width > 0 && blockOnTheBottom.height > 0){
					tmpBlockList.push(blockOnTheBottom);
				}
			} else {
				tmpBlockList.push(block);
			}
		}
		
		blockList = tmpBlockList;
	}
	
	if(blockList.length === 0){
		return 0;
	}
	
	var totalWhitespace = 0;
	
	for(var k = 0; k < blockList.length; k++){
		var block = blockList[k];
		
		totalWhitespace += (block.width * block.height);
	}
	
	return totalWhitespace;
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
		subtractRecursive(b1.getLocation(), b2);
	} else if(zIndex1 < zIndex2){
		subtractRecursive(b2.getLocation(), b1);
	} else if(b1.getNode().type === 3){
		subtractRecursive(b2.getLocation(), b1);
	} else if(b2.getNode().type === 3){
		subtractRecursive(b1.getLocation(), b2);
	} else {
		b1.subtractPadding();
		b2.subtractPadding();
	}
}

function subtractRecursive(location, b2){
	var l = subtract(location, b2.getLocation());

	if(l.height !== 0 && l.width !== 0){
		b2.setLocation(l);
	}

	for(var i = 0; i < b2.getChildCount(); i++){
		subtractRecursive(location, b2.getChildAt(i));
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
		b2 = blockAtBack.topY + blockAtBack.height,
        diff;

	if(l1 === l2 && r1 === r2) {
		// do nothing
	} else if(l1 <= l2 && l2 < r1 && r1 <= r2){
		diff = r1 - l2;
		blockAtBack.topX += diff;
		blockAtBack.width -= diff;
		return blockAtBack;
	} else if(l2 <= l1 && l1 < r2 && r2 <= r1){
		blockAtBack.width -= r2 - l1;

		return blockAtBack;
	}

	if(t1 === t2 && b1 === b2) {
		// do nothing
	} else if(t1 <= t2 && t2 < b1 && b1 <= b2){
		diff = b1 - t2;
		blockAtBack.topY += diff;
		blockAtBack.height -= diff;
	} else if(t2 <= t1 && t1 < b2 && b2 <= b1){
		blockAtBack.height -= b2 - t1;
	}

	return blockAtBack;
}

module.exports.getWhiteSpaceArea = getWhiteSpaceArea;
module.exports.checkIntersection = checkIntersection;
module.exports.getIntersectionArea = getIntersectionArea;
module.exports.checkBlockIntersection = checkBlockIntersection;
module.exports.subtractBlock = subtractBlock;
module.exports.subtract = subtract;
