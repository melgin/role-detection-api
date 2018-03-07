var fs = require('fs'),
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
	pageSegmenter = require('./page-segmenter'),
    Horseman = require('node-horseman');


var urlList = [
    /*"https://www.google.com",
	"https://www.youtube.com",
	"https://www.facebook.com",
	"http://www.baidu.com",
	"https://www.wikipedia.org",*/
	"https://www.reddit.com",
/*	"https://www.yahoo.com",
	"http://www.qq.com",
	"https://world.taobao.com",
	"https://www.tmall.com",
	"https://www.amazon.com",
	"https://twitter.com",
	"http://www.sohu.com",
	"https://www.instagram.com",
	"https://outlook.live.com",
	"https://vk.com",
	"http://www.sina.com.cn",
	"https://global.jd.com",
	"https://www.360.cn",
	"https://weibo.com",
	"https://login.tmall.com",
	"https://yandex.ru",
	"https://www.linkedin.com",
	"https://www.netflix.com",
	"https://www.twitch.tv",
	"https://www.alipay.com",
	"https://www.yahoo.co.jp",
	"http://t.co",
	"https://www.ebay.com",
	"https://www.microsoft.com",
	"https://ok.ru",
	"https://www.office.com",
	"https://err.tmall.com",
	"https://www.hao123.com",
	"https://www.bing.com",
	"https://imgur.com"*/
];

urlList.forEach(function(url){
	process(url);
});

function getFileName(url){
	return url.replace('https://', '').replace('http://', '').replace(/\./g, '_');
}

function process(url){
	console.log(url);

	var width = 1920,
        height = 1080,
        agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0',
        tlc, wordCount, imageCount, errorMessage;

    if(agent){
        agent
    }

    var horseman = new Horseman({phantomPath: config.phantomjsPath});

    horseman
        .userAgent(agent)
        .viewport(width, height)
		.on('resourceError', function(err) {
			//console.log(err);
		})
		.on('error', function(err) {
			//console.log('Error ' + url + ' ' + err);
		})
        .open(url)
		.then(function (result) {
			if(result !== 'success'){
				return horseman.close();
			}
		})
		.wait(5000)
		.catch((error) => {
			console.log(url + ' ' + error);
			return horseman.close();
		})
		.then(function () {

		})
        .on('consoleMessage', function( msg ){
            console.log(msg);
        })
		.screenshot('images\\' + getFileName(url) + '.png')
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

            if(errorMessage){
                return console.log(url + ' ' + errorMessage);
            }

            return console.log(url + ' ' + calculateVcs(tlc, wordCount, imageCount));
        })
        .close();
}

function calculateVcs(block, wordCount, imageCount){
	var vcs = (1.743 + 0.097 * (block) + 0.053 * (wordCount) + 0.003 * (imageCount)) / 10;

	if(vcs > 10){
		return 10.0;
	}

	return vcs;
}
