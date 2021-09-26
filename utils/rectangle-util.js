
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

	let intersectionBlocks = [];

	for(let i = 0; i < subBlockList.length; i++){
		const subBlock = subBlockList[i];
		if(checkIntersection(mainBlock, subBlock)){
			intersectionBlocks.push(subBlock);
		}
	}

	let blockList = [mainBlock];
	if(! intersectionBlocks || intersectionBlocks.length === 0){
		return mainBlock.width * mainBlock.height;
	}

	for(let i = 0; i < intersectionBlocks.length; i++){
		const subBlock = intersectionBlocks[i];

		if(blockList.length === 0){
			return 0;
		}

		let tmpBlockList = [];
		for(let j = 0; j < blockList.length; j++){
			const block = blockList[j];

			if(checkIntersection(block, subBlock)){
				const blockOnTheLeft = {
					topX: block.topX,
					topY: subBlock.topY,
					width: subBlock.topX - block.topX,
					height: subBlock.height,
					d: 'l'
				};
				const blockOnTheRight = {
					topX: subBlock.topX + subBlock.width,
					topY: subBlock.topY,
					width: block.topX + block.width - subBlock.topX - subBlock.width,
					height: subBlock.height,
					d: 'r'
				};
				const blockOnTheTop = {
					topX: block.topX,
					topY: block.topY,
					width: block.width,
					height: subBlock.topY - block.topY,
					d: 't'
				};
				const blockOnTheBottom = {
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

	let totalWhitespace = 0;

	for(let k = 0; k < blockList.length; k++){
		const block = blockList[k];

		totalWhitespace += (block.width * block.height);
	}

	return totalWhitespace;
}

function getIntersectionArea(b1, b2){
	const xOverlap = getXOverlap(b1, b2);
	const yOverlap = getYOverlap(b1, b2);

	return xOverlap * yOverlap;
}

function getIntersectionRectangle(b1, b2){
	const xOverlap = getXOverlap(b1, b2);
	const yOverlap = getYOverlap(b1, b2);

	return { width: xOverlap, height: yOverlap, topX: Math.max(b1.topX, b2.topX), topY: Math.max(b1.topY, b2.topY)};
}

function checkBlockIntersection(b1, b2){
	return checkIntersection(b1.getLocation(), b2.getLocation());
}

function subtractBlock(b1, b2){
	const intersectionArea = getIntersectionArea(b1.getLocation(), b2.getLocation());

	if(intersectionArea / b1.getArea() >= 0.8 || intersectionArea / b2.getArea() >= 0.8){
		if(b1.isImageBlock()){
			//if(isInBorder(b1.getLocation(), b2.getLocation())){
			subtractRecursive(b1, b2);
			//}

			return b1.setRole('BackgroundImage');
		}

		if(b2.isImageBlock()){
			//if(isInBorder(b2.getLocation(), b1.getLocation())){
			subtractRecursive(b2, b1);
			//}

			return b2.setRole('BackgroundImage');
		}
	}

	const zIndex1 = b1.getNode().attributes.zIndex;
	const zIndex2 = b2.getNode().attributes.zIndex;

	if(zIndex1 > zIndex2){
		subtractRecursive(b1, b2);
	} else if(zIndex1 < zIndex2){
		subtractRecursive(b2, b1);
	} else if(b1.getNode().type === 3){
		subtractRecursive(b2, b1);
	} else if(b2.getNode().type === 3){
		subtractRecursive(b1, b2);
	} else {
		const intersection = getIntersectionRectangle(b1.getLocation(), b2.getLocation());
		const b1HasChildInIntersectionArea = hasChildInIntersectionArea(intersection, b1);
		const b2HasChildInIntersectionArea = hasChildInIntersectionArea(intersection, b2);

		if(b1HasChildInIntersectionArea && ! b2HasChildInIntersectionArea){
			subtractRecursive(b1, b2);
		} else if(b2HasChildInIntersectionArea && ! b1HasChildInIntersectionArea){
			subtractRecursive(b2, b1);
		} else if(b1.isImageBlock()){
			subtractRecursive(b1, b2);
		} else if(b2.isImageBlock()){
			subtractRecursive(b2, b1);
			//} else if(b1.getTagName() === 'COMPOSITE'){
			//	subtractRecursive(b2.getLocation(), b1);
			//} else if(b2.getTagName() === 'COMPOSITE'){
			//	subtractRecursive(b1.getLocation(), b2);
		} else {
			if((intersection.height >= b1.getLocation().height - 1 &&
				intersection.height <= b2.getLocation().height - 1) ||
				(intersection.width >= b1.getLocation().width - 1 &&
					intersection.width <= b2.getLocation().width - 1)){
				subtractRecursive(b1, b2);
			} else if((intersection.height >= b2.getLocation().height - 1 &&
				intersection.height <= b1.getLocation().height - 1) ||
				(intersection.width >= b2.getLocation().width - 1 &&
					intersection.width <= b1.getLocation().width - 1)){
				subtractRecursive(b2, b1);
			} else {
				subtractRecursive(b1, b2);
				b1.subtractPadding();
				b2.subtractPadding();
			}
		}
	}
}

function subtractRecursive(b1, b2, recursive){
	if(equals(getIntersectionRectangle(b1.getLocation(), b2.getLocation()), b2.getLocation()) && ! recursive){
		return subtractRecursive(b2, b1, true);
	}

	const l = subtract(b1.getLocation(), b2.getLocation());

	if(l.height !== 0 && l.width !== 0){
		b2.setLocation(l);
	}

	for(let i = 0; i < b2.getChildCount(); i++){
		subtractRecursive(b1, b2.getChildAt(i));
	}
}

function getXOverlap(b1, b2) {
	return Math.max(0, Math.min(b1.topX + b1.width, b2.topX + b2.width) - Math.max(b1.topX, b2.topX));
}

function getYOverlap(b1, b2) {
	return Math.max(0, Math.min(b1.topY + b1.height, b2.topY + b2.height) - Math.max(b1.topY, b2.topY));
}

function subtract(blockInFront, blockAtBack){
	const l1 = blockInFront.topX;
	const l2 = blockAtBack.topX;
	const r1 = blockInFront.topX + blockInFront.width;
	const r2 = blockAtBack.topX + blockAtBack.width;
	const t1 = blockInFront.topY;
	const t2 = blockAtBack.topY;
	const b1 = blockInFront.topY + blockInFront.height;
	const b2 = blockAtBack.topY + blockAtBack.height;
	let diff;

	const xOverlap = getXOverlap(b1, b2);
	const yOverlap = getYOverlap(b1, b2);

	if(xOverlap > yOverlap){
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
	} else {
		if(t1 === t2 && b1 === b2) {
			// do nothing
		} else if(t1 <= t2 && t2 < b1 && b1 <= b2){
			diff = b1 - t2;
			blockAtBack.topY += diff;
			blockAtBack.height -= diff;

			return blockAtBack;
		} else if(t2 <= t1 && t1 < b2 && b2 <= b1){
			blockAtBack.height -= b2 - t1;

			return blockAtBack;
		}

		if(l1 === l2 && r1 === r2) {
			// do nothing
		} else if(l1 <= l2 && l2 < r1 && r1 <= r2){
			diff = r1 - l2;
			blockAtBack.topX += diff;
			blockAtBack.width -= diff;
		} else if(l2 <= l1 && l1 < r2 && r2 <= r1){
			blockAtBack.width -= r2 - l1;
		}
	}

	return blockAtBack;
}

function isInBorder(l1, l2){
	return ((l1.topX === l2.topX || (l1.topX + l1.width) === (l2.topX + l2.width)) &&
		l1.topY === l2.topY && l1.height <= l2.height && l2.height <= l1.height * 1.2 && l2.width > l1.width * 2);
}

function hasChildInIntersectionArea(intersectionArea, b){
	for(let i = 0; i < b.getChildCount(); i++){
		const child = b.getChildAt(i);
		if(checkIntersection(intersectionArea, child.getLocation())){
			if('COMPOSITE' === child.getTagName()){
				const conflictingChildTag = hasChildInIntersectionArea(intersectionArea, child);
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

	let nodesOnLeft = [];
	let nodesOnRight = [];

	const l1 = b1.getLocation();

	for(let i = 0; i < b2.getChildCount(); i++){
		const child = b2.getChildAt(i);
		const cl = child.getLocation();

		if(checkIntersection(l1, cl)){
			return false;
		}

		if(! isBetweenInterval(cl.topY, l1.topY, l1.height) &&
			! isBetweenInterval(cl.topY + cl.height, l1.topY, l1.height)){
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
	let nodesOnLeft = [];
	let nodesOnRight = [];

	const l1 = n1.attributes;

	for(let i = 0; i < n2.children.length; i++){
		const child = n2.children[i];
		const cl = child.attributes;

		if((cl.positionX < (l1.positionX + l1.width - 1) &&
			(cl.positionX + cl.width - 1) > l1.positionX &&
			cl.positionY < (l1.positionY + l1.height - 1) &&
			(cl.positionY + cl.height - 1) > l1.positionY)){
			return false;
		}

		if(! isBetweenInterval(cl.positionY, l1.positionY, l1.height) &&
			! isBetweenInterval(cl.positionY + cl.height, l1.positionY, l1.height)){
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

function equals(b1, b2){
	return b1.width === b2.width && b1.height === b2.height && b1.topX === b2.topX && b1.topY === b2.topY;
}

module.exports.getWhiteSpaceArea = getWhiteSpaceArea;
module.exports.checkIntersection = checkIntersection;
module.exports.getIntersectionArea = getIntersectionArea;
module.exports.checkBlockIntersection = checkBlockIntersection;
module.exports.getIntersectionRectangle = getIntersectionRectangle;
module.exports.isBetweenNodeChildren = isBetweenNodeChildren;
module.exports.isBetweenChildren = isBetweenChildren;
module.exports.subtractBlock = subtractBlock;
module.exports.subtract = subtract;
module.exports.equals = equals;
module.exports.isInBorder = isInBorder;
