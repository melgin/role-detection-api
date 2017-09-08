var fs = require('fs'),
	config = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
	Horseman = require('node-horseman');
	
download('http://emine.ncc.metu.edu.tr/survey/web/pages2/http/www.bbc.co.uk/', './tests/data/bbc.json', save);
download('http://emine.ncc.metu.edu.tr/survey/web/pages2/http/www.avg.com/us-en/index.html', './tests/data/avg.json', save);
download('http://emine.ncc.metu.edu.tr/survey/web/pages2/http/www.babylon.com/', './tests/data/babylon.json', save);
download('http://emine.ncc.metu.edu.tr/survey/web/pages2/http/www.apple.com/', './tests/data/apple.json', save);
	
function download(url, fileName, callback){
	var width = 1920,
        height = 1920,
		agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0';

    var horseman = new Horseman({phantomPath: config.phantomjsPath});

    horseman
        .userAgent(agent)
        .viewport(width, height)
        .open(url)
		.then(function () {
			
		})
        .on('consoleMessage', function( msg ){
            console.log(msg);
        })
        .injectJs('page-renderer.js')
        .evaluate(function () {
            return traverseDOMTree(document, true, null, 0);
        })
        .then(function (nodeTree) {
            callback(fileName, nodeTree);
        })
        .close();
}

function save(fileName, nodeTree){
	fs.writeFile(fileName, JSON.stringify(nodeTree), function(err) {
		if(err) {
			return console.log(err);
		}

		console.log("The file was saved!");
	}); 
}