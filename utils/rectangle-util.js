
function checkIntersection(b1, b2){
	return !(b2.topX > (b1.topX + b1.width) || 
           (b2.topX + b2.width) < b1.topX || 
           b2.topY > (b1.topY + b1.height) ||
           (b2.topY + b2.height) < b1.topY);
}

function subtract(b1, b2){
	if(! checkIntersection(b1, b2)){
		return;
	}
	
	var left1 = b1.topX,
		left2 = b2.topX,
		right1 = b1.topX + b1.width,
		right2 = b2.topX + b2.width,
		top1 = b1.topY,
		top2 = b2.topY,
		bottom1 = b1.topY + b1.height,
		bottom2 = b2.topY + b2.height;
	
}

module.exports.checkIntersection = checkIntersection;
module.exports.subtract = subtract;