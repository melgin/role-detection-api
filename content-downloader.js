var fs = require('fs'),
	config = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
	Horseman = require('node-horseman');
	
download('http://users.metu.edu.tr/seraslan/pages/adobe/index.html', './tests/data/adobe.json', save);
download('http://users.metu.edu.tr/seraslan/pages/outlook/index.html', './tests/data/outlook.json', save);
download('http://users.metu.edu.tr/seraslan/pages/whatsapp/index.html', './tests/data/whatsapp.json', save);
download('http://users.metu.edu.tr/seraslan/pages/netflix/cy/index.html', './tests/data/netflix.json', save);
download('http://vista.ar-ni.com/pages/wordpress/index.html', './tests/data/wordpress.json', save);
download('http://vista.ar-ni.com/pages/amazon/index.html', './tests/data/amazon.json', save);
download('http://users.metu.edu.tr/seraslan/pages/bbc/index.html', './tests/data/bbc.json', save);
download('http://users.metu.edu.tr/seraslan/pages/youtube/index.html', './tests/data/youtube.json', save);
	
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
		.pdf('./capture-' + fileName + '.pdf', {
		  format: 'A4',
		  orientation: 'portrait',
		  margin: '0cm'
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