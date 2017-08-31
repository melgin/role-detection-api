
function checkIntersection(b1, b2){
	return !(b2.topX > (b1.topX + b1.width) || 
           (b2.topX + b2.width) < b1.topX || 
           b2.topY > (b1.topY + b1.height) ||
           (b2.topY + b2.height) < b1.topY);
}

module.exports.checkIntersection = checkIntersection;