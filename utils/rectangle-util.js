
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

function getIntersectionRectangle(b1, b2){
	var xOverlap = Math.max(0, Math.min(b1.topX + b1.width, b2.topX + b2.width) - Math.max(b1.topX, b2.topX));
	var yOverlap = Math.max(0, Math.min(b1.topY + b1.height, b2.topY + b2.height) - Math.max(b1.topY, b2.topY));

	return { topX: Math.max(b1.topX, b2.topX), topY: Math.max(b1.topY, b2.topY), width: xOverlap, height: yOverlap};
}

function checkBlockIntersection(b1, b2){
	return checkIntersection(b1.getLocation(), b2.getLocation());
}

function subtractBlock(b1, b2){
	var intersectionArea = getIntersectionArea(b1.getLocation(), b2.getLocation());

	if(intersectionArea / b1.getArea() >= 0.8 || intersectionArea / b2.getArea() >= 0.8){
		if(b1.isImageBlock()){
			if(isInBorder(b1.getLocation(), b2.getLocation())){
				subtractRecursive(b1.getLocation(), b2);
			}
			
			return b1.setRole('BackgroundImage');
		}

		if(b2.isImageBlock()){
			if(isInBorder(b2.getLocation(), b1.getLocation())){
				subtractRecursive(b2.getLocation(), b1);
			}
	
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
		var intersection = getIntersectionRectangle(b1.getLocation(), b2.getLocation());
		
		var b1HasChildInIntersectionArea = hasChildInIntersectionArea(intersection, b1);
		var b2HasChildInIntersectionArea = hasChildInIntersectionArea(intersection, b2);
		if(b1HasChildInIntersectionArea && ! b2HasChildInIntersectionArea){
			subtractRecursive(b1.getLocation(), b2);
		} else if(b2HasChildInIntersectionArea && ! b1HasChildInIntersectionArea){
			subtractRecursive(b2.getLocation(), b1);
		} else {
			b1.subtractPadding();
			b2.subtractPadding();
		}
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

function isInBorder(l1, l2){
	if((l1.topX === l2.topX || (l1.topX + l1.width) === (l2.topX + l2.width)) && 
			l1.topY === l2.topY && l1.height <= l2.height && l2.height <= l1.height * 1.2 && l2.width > l1.width * 2){
		return true;
	}
	
	return false;
}

function hasChildInIntersectionArea(intersectionArea, b){
	for(var i = 0; i < b.getChildCount(); i++){
		var child = b.getChildAt(i);
		if(checkIntersection(intersectionArea, child.getLocation())){
			if('COMPOSITE' === child.getTagName()){
				var conflictingChildTag = hasChildInIntersectionArea(intersectionArea, child);
				if(conflictingChildTag){
					return conflictingChildTag;
				}
			} else {
				if(child.getTagName() !== 'IMG'){
					return child.getTagName();
				}
			}
		}
	}
	
	return null;
}

function isBetweenChildren(b1, b2){
	if(b2.getChildCount() < 2){
		return false;
	}
	
	var nodesOnLeft = [];
	var nodesOnRight = [];
	
	var l1 = b1.getLocation();
	
	for(var i = 0; i < b2.getChildCount(); i++){
		var child = b2.getChildAt(i),
			cl = child.getLocation();
		if(checkIntersection(l1, cl)){
			return false;
		}
		
		if(! isBetweenInterval(cl.topY, l1.topY, l1.height) && ! isBetweenInterval(cl.topY + cl.height, l1.topY, l1.height)){
			continue;
		}
		
		if(cl.topX + cl.width < l1.topX){
			nodesOnLeft.push(child);
		}
		
		if(cl.topX + cl.width > l1.topX + l1.width){
			nodesOnRight.push(child);
		}
	}
	
	return nodesOnLeft.length > 0 && nodesOnRight.length > 0;
}

function isBetweenNodeChildren(n1, n2){
	var nodesOnLeft = [];
	var nodesOnRight = [];
	
	var l1 = n1.attributes;
	
	for(var i = 0; i < n2.children.length; i++){
		var child = n2.children[i],
			cl = child.attributes;
			
		if((cl.positionX < (l1.positionX + l1.width - 1) &&
			(cl.positionX + cl.width - 1) > l1.positionX &&
           cl.positionY < (l1.positionY + l1.height - 1) &&
			(cl.positionY + cl.height - 1) > l1.positionY)){
			return false;
		}
		
		if(! isBetweenInterval(cl.positionY, l1.positionY, l1.height) && ! isBetweenInterval(cl.positionY + cl.height, l1.positionY, l1.height)){
			continue;
		}
		
		if(cl.positionX + cl.width < l1.positionX){
			nodesOnLeft.push(child);
		}
		
		if(cl.positionX + cl.width > l1.positionX + l1.width){
			nodesOnRight.push(child);
		}
	}
	
	return nodesOnLeft.length > 0 && nodesOnRight.length > 0;
}

function isBetweenInterval(val, start, distance){
	return val >= start && val <= (start + distance);
}

module.exports.getWhiteSpaceArea = getWhiteSpaceArea;
module.exports.checkIntersection = checkIntersection;
module.exports.getIntersectionArea = getIntersectionArea;
module.exports.checkBlockIntersection = checkBlockIntersection;
module.exports.isBetweenNodeChildren = isBetweenNodeChildren;
module.exports.subtractBlock = subtractBlock;
module.exports.subtract = subtract;
