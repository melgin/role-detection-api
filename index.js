var fs = require('fs'),
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
	urlValidator = require('valid-url'),
	express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	logger = require('./logger'),
	roleDetector = require('./role-detector'),
	pageSegmenter = require('./page-segmenter'),
    Horseman = require('node-horseman');

app.use(bodyParser.json());
app.post('/', process);
app.post('/visual-complexity', vicram);

var server = app.listen(config.port, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("App listening at http://%s:%s", host, port)
});

function process(req, res){
	var url = req.body.url,
        width = +req.body.width ? req.body.width : 1920,
        height = +req.body.height ? req.body.height : 1920,
		explainRoles = req.body.explainRoles,
        agent = req.body.userAgent,
        t0 = 0,
        t1 = 0,
        t2 = 0;

    if(agent){
        agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0';
    }

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

    var horseman = new Horseman({phantomPath: config.phantomjsPath});

    t0 = Date.now();

    horseman
        .userAgent(agent)
        .viewport(width, height)
        .open(url)
		.then(function () {
			t1 = Date.now();
		})
        .on('consoleMessage', function( msg ){
            console.log(msg);
        })
        .injectJs('page-renderer.js')
        .evaluate(function () {
            return traverseDOMTree(document, true, null, 0);
        })
        .then(function (nodeTree) {
            var blockTree = null,
                pageWidth = 0,
                pageHeight = 0,
                fontColor = null,
                fontSize = null;

            if(nodeTree){
                pageWidth = nodeTree.attributes.width;
                pageHeight = nodeTree.attributes.height;
                fontColor = nodeTree.attributes.fontColor;
                fontSize = nodeTree.attributes.fontSize;
				blockTree = pageSegmenter.segment(nodeTree, width, height);
			}

            t2 = Date.now();

			blockTree.setLocationData();
            blockTree.calculateWhiteSpaceArea();

			if(blockTree){
				roleDetector.detectRoles(blockTree, pageWidth, pageHeight, fontSize, fontColor,
                    explainRoles, sendResponse);
			} else {
                sendResponse(blockTree);
            }
        })
        .close();

        function sendResponse(block){
            var t3 = Date.now();
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
	var url = req.body.url,
        width = +req.body.width ? req.body.width : 1920,
        height = +req.body.height ? req.body.height : 1920,
        agent = req.body.userAgent,
        t0 = 0,
        t1 = 0,
		tlc = null,
		imageCount = null,
		wordCount = null,
		errorMessage = null;

    if(agent){
        agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0';
    }

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

    var horseman = new Horseman({phantomPath: config.phantomjsPath});

    t0 = Date.now();

	try {
		horseman
			.userAgent(agent)
			.viewport(width, height)
			.open(url)
			.then(function () {
				console.log('Opened the document');
				t1 = Date.now();
			})
			.on('consoleMessage', function( msg ){
				console.log(msg);
			})
			.on('error', function( msg, trace ){
				console.log(msg);
				return sendErrorResponse(500, msg);
			})
			.injectJs('vicram.js')
			.injectJs('page-renderer.js')
			.evaluate(function () {
				console.log('Evaluating');
				return calculateVicramScore(document);
			})
			.then(function (vicramResponse) {
				errorMessage = vicramResponse.err;
				tlc = vicramResponse.tlc;
				imageCount = vicramResponse.imageCount;
				wordCount = vicramResponse.wordCount;
			})
			.evaluate(function () {
				return traverseDOMTree(document, true, null, 0);
			})
			.then(function (nodeTree) {
				var blockTree = null,
					pageWidth = 0,
					pageHeight = 0,
					fontColor = null,
					fontSize = null;

				if(nodeTree){
					pageWidth = nodeTree.attributes.width;
					pageHeight = nodeTree.attributes.height;
					fontColor = nodeTree.attributes.fontColor;
					fontSize = nodeTree.attributes.fontSize;
					blockTree = pageSegmenter.segment(nodeTree, width, height);
				}

				t2 = Date.now();

				var numberOfBlocks = blockTree.getOverallBlockCount();
				var numberOfLeaves = blockTree.getOverallLeafCount();
				var depth = blockTree.getDepth();
				
				if(errorMessage){
					return sendErrorResponse(500, errorMessage);
				}
				
				sendResponse({
					vicram: calculateVcs(tlc, wordCount, imageCount),
					numberOfBlocks: calculateVcs(numberOfBlocks, wordCount, imageCount),
					numberOfLeaves: calculateVcs(numberOfLeaves, wordCount, imageCount),
					depth: calculateVcs(depth, wordCount, imageCount)
				});
			})
			.catch(function (err, o) {
				return sendErrorResponse(500, err.message);
			})
			.close();
		} catch (err){
			return sendErrorResponse(500, err);
		}

        function sendResponse(vicramResponse){
            var t2 = Date.now();
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                "success": true,
                "renderingTime": t1 - t0,
                "calculationTime": t2 - t1,
                "result": vicramResponse
            }));
        }
}

function calculateVcs(block, wordCount, imageCount){
	var vcs = (1.743 + 0.097 * (block) + 0.053 * (wordCount) + 0.003 * (imageCount)) / 10;
	
	if(vcs > 10){
		return 10.0;
	}
	
	return vcs;
}