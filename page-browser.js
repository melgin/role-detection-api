"use strict";
var sys = require("system"),
    page = require("webpage").create(),
    step1url = null,
	width = null,
	height = null,
	takeScreenshot = false;

if (sys.args.length > 1) {
    step1url = sys.args[1];
    width = sys.args[2];
    height = sys.args[3];
    takeScreenshot = sys.args[4] === 'true';
}

function takePageScreenshot(){
	page.render('tmp-' + (new Date()).getTime() + '.png');
}

function printArgs() {
    var i, ilen;
    for (i = 0, ilen = arguments.length; i < ilen; ++i) {
        console.log(JSON.stringify(arguments[i]));
    }
}

page.onConsoleMessage = function() {
    printArgs.apply(this, arguments);
};

setTimeout(function() {
	page.viewportSize = { width: width, height: height };
    page.open(step1url, function(status) {
		if (status === "success") {
			if(page.injectJs('page-renderer.js')){
				var root = page.evaluate(function() {
					return traverseDOMTree(document, true, null, 0);
				});
				console.log(JSON.stringify(root));
			}

			if(takeScreenshot){
				takePageScreenshot();
			}

			page.close();
			setTimeout(function(){
				phantom.exit();
			}, 100);
		} else {
			console.error('Failed to load url!');
			phantom.exit(1);
		}
	});
}, 0);
