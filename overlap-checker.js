const fs = require('fs');
const rectangleUtil = require('./utils/rectangle-util');
const segmenter = require('./page-segmenter');

let intersectCount = 0;

doTheThing('adobe');
doTheThing('outlook');
doTheThing('whatsapp');
doTheThing('netflix');
doTheThing('wordpress');
doTheThing('amazon');
doTheThing('bbc');
doTheThing('youtube');

console.log(intersectCount + ' intersections');

function doTheThing(key){
	console.log(key);

	const dom = JSON.parse(fs.readFileSync('./tests/data/' + key + '.json', 'utf8'));
	const block = segmenter.segment(dom, 1920, 1080);
	block.setLocationData();

	checkIntersection(block);
	console.log('\n');
}

function checkIntersection(block){
	for(let i = 0; i < block.getChildCount(); i++){
		const b1 = block.getChildAt(i);
		if(b1.getChildCount() === 1){
			console.log(b1.getName() + " single child");
		}

		checkLocation(b1.getLocation(), b1.getName());

		for(let j = i + 1; j < block.getChildCount(); j++){
			const b2 = block.getChildAt(j);

			checkLocation(b2.getLocation(), b2.getName());

			if(rectangleUtil.checkBlockIntersection(b1, b2)
				/* && b1.getRole() !== 'BackgroundImage' && b2.getRole() !== 'BackgroundImage'*/){
				intersectCount++;
				console.log(b1.getName() + ': ' + b1.getNode().xpath + " (" + b1.getRole() + ") - " +
					b2.getName() + ': ' + b2.getNode().xpath + ' (' + b2.getRole() + ')');
				console.log(' -> ' + rectangleUtil.equals(rectangleUtil.getIntersectionRectangle(b1.getLocation(),
					b2.getLocation()), b1.getLocation()));
				console.log(' -> ' + rectangleUtil.equals(rectangleUtil.getIntersectionRectangle(b1.getLocation(),
					b2.getLocation()), b2.getLocation()));
				console.log(' -> ' + JSON.stringify(rectangleUtil.getIntersectionRectangle(b1.getLocation(),
					b2.getLocation())));
				console.log(' -> ' + JSON.stringify(b1.getLocation()));
				console.log(' -> ' + JSON.stringify(b2.getLocation()));
				console.log('');
			}
		}
	}

	for(let i = 0; i < block.getChildCount(); i++){
		checkIntersection(block.getChildAt(i))
	}
}

function checkLocation(location, name) {
	if(!location.width || location.width <= 0){
		console.log(name, " invalid width");
	}

	if(!location.height || location.height <= 0){
		console.log(name, " invalid height");
	}
}

