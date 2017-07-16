var fs = require('fs'),
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
	urlValidator = require('valid-url'),
	express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	logger = require('./logger'),
	roleDetector = require('./role-detector'),
	pageSegmenter = require('./page-segmenter'),
	exec = require('child_process').exec;

app.use(bodyParser.json());
app.post('/', process);

var server = app.listen(config.port, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("App listening at http://%s:%s", host, port)
});

function process(req, res){
	var url = req.body.url;
	var width = +req.body.width ? req.body.width : 1920;
	var height = +req.body.height ? req.body.height : 1920;

	var sendErrorResponse = function(status, message){
		res.writeHead(status, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({"success": false, "error": message}));
	}

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

	var handle = function(error, stdout, stderr){
		if(error){
            console.log(error);
			return sendErrorResponse(500, error);
		}

		if(stderr){
            console.log(stderr);
			return sendErrorResponse(500, stderr);
		}

		if(stdout){
			var nodeTree = null,
				blockTree = null;

			try {
				nodeTree = JSON.parse(stdout);
			} catch (e){
                console.log(e);
                console.log(stdout);
				return sendErrorResponse(500, e);
			}

			if(nodeTree){
				blockTree = pageSegmenter.segment(nodeTree, width, height);
			}

			if(blockTree){
				roleDetector.detectRoles(blockTree);
			}

			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({"success": true, "result": blockTree.toJson()}));
		}
	}

	exec(config.phantomjsPath + " page-browser.js " + url + " " +
		width + " " + height + " " + config.takeScreenshot, handle);
}
