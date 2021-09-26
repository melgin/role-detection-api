let fs = require('fs');
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
let urlValidator = require('valid-url');
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let logger = require('./logger');
let roleDetector = require('./role-detector');
let pageSegmenter = require('./page-segmenter');
let pageRenderer = require('./page-renderer');
let vicramCalculator = require('./vicram');

app.use(bodyParser.json());
app.post('/', process);
app.post('/visual-complexity', vicram);

let server = app.listen(config.port, function () {
	let host = server.address().address;
	let port = server.address().port;

	console.log("App listening at http://%s:%s", host, port)
});

vicramCalculator.calculateVicram({
	"url": "http://elginakpinar.com/"
}, function (err, result) {
	if (err) {
		console.log(err);
	} else {
		console.log(result);
	}
});

function process(req, res){
	let url = req.body.url;
	let width = +req.body.width ? req.body.width : 1920;
	let height = +req.body.height ? req.body.height : 1080;
	let explainRoles = req.body.explainRoles;
	let agent = req.body.userAgent;
	let wait = req.body.wait;
	let t0 = 0;
	let t1 = 0;
	let t2 = 0;

    if(agent){
        agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0';
    }

    if(! wait || wait < 0){
        wait = 0;
    }

	let  sendErrorResponse = function(status, message){
		res.writeHead(status, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({"success": false, "error": message}));
	};

	if(! urlValidator.isWebUri(url)){
		logger.error("Invalid url:" + url);
		return sendErrorResponse(400, "Invalid url!");
	}

	if(width < 0){
		logger.error("Invalid width:" + width);
		return sendErrorResponse(400, "Invalid width!");
	}

	if(height < 0){
		logger.error("Invalid height:" + height);
		return sendErrorResponse(400, "Invalid height!");
	}

	t0 = Date.now();

	pageRenderer.retrieve(url, width, height, function(nodeTree) {
		t1 = Date.now();

		let blockTree = null;
		let pageWidth = 0;
		let pageHeight = 0;
		let fontColor = null;
		let fontSize = null;

		if(nodeTree){
			pageWidth = nodeTree.attributes.width;
			pageHeight = nodeTree.attributes.height;
			fontColor = nodeTree.attributes.fontColor;
			fontSize = nodeTree.attributes.fontSize;
			blockTree = pageSegmenter.segment(nodeTree, width, height);
		}

		t2 = Date.now();

		blockTree.setLocationData();
		blockTree.calculateWhiteSpaceArea(true);

		if(blockTree){
			roleDetector.detectRoles(blockTree, pageWidth, pageHeight, fontSize, fontColor,
				explainRoles, sendResponse);
		} else {
			sendResponse(blockTree);
		}
	});

	function sendResponse(block){
		let t3 = Date.now();
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({
			"success": true,
			"renderingTime": t1 - t0,
			"segmentationTime": t2 - t1,
			"reasoningTime": t3 - t2,
			"result": block.toJson()
		}));
	}
}

function vicram(req, res){
	vicramCalculator.calculateVicram(req.body, function (err, result) {
		if (err) {
			res.writeHead(400, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({"success": false, "error": err}));
		} else {
			let t2 = Date.now();
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({
				"success": true,
				"renderingTime": result.t1 - result.t0,
				"calculationTime": t2 - result.t1,
				"result": result
			}));
		}
	});
}
