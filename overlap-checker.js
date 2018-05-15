var chai = require('chai'),
    expect = chai.expect,
	fs = require('fs'),
	config = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
    rectangleUtil = require('./utils/rectangle-util'),
	segmenter = require('./page-segmenter')
	
doTheThing('outlook');
	
function doTheThing(key){
	console.log(key);
	
	var dom = JSON.parse(fs.readFileSync('./tests/data/' + key + '.json', 'utf8')),
		block = segmenter.segment(dom, 1920, 1080);
		block.setLocationData();
		
	checkIntersection(block);
	console.log('\n');
}

	
function checkIntersection(block){
	for(var i = 0; i < block.getChildCount(); i++){
		for(var j = i + 1; j < block.getChildCount(); j++){
			var b1 = block.getChildAt(i),
				b2 = block.getChildAt(j);
			
			if(b1.getLocation().width == null || b1.getLocation().width <= 0){
				console.log(b1.getName() + " invalid width");
			}
			
			if(b1.getLocation().height == null || b1.getLocation().height <= 0){
				console.log(b1.getName() + " invalid height");
			}
			
			if(b2.getLocation().width == null || b2.getLocation().width <= 0){
				console.log(b2.getName() + " invalid width");
			}
			
			if(b2.getLocation().height == null || b2.getLocation().height <= 0){
				console.log(b2.getName() + " invalid height");
			}
			
			if(rectangleUtil.checkBlockIntersection(b1, b2)/* && b1.getRole() !== 'BackgroundImage' && b2.getRole() !== 'BackgroundImage'*/){
				console.log(b1.getName() + ': ' + b1.getNode().xpath + " - " + b2.getName() + ': ' + b2.getNode().xpath);
				console.log(' -> ' + JSON.stringify(b1.getLocation()));
				console.log(' -> ' + JSON.stringify(b2.getLocation()));
				console.log('');
			}
		}
	}
	
	for(var i = 0; i < block.getChildCount(); i++){
		checkIntersection(block.getChildAt(i))
	}
}
	
	