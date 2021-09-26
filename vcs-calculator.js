const vicramCalculator = require('./vicram');

const urlList = [
   "https://www.google.com",
	"https://www.youtube.com",
	"https://www.facebook.com",
	"http://www.baidu.com",
	"https://www.wikipedia.org",
    "https://www.reddit.com",
    /*    "https://www.yahoo.com",
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

    vicramCalculator.calculateVicram({
        url: url,
        width: 1920,
        height: 1080,
        screenshot: true,
        screenshotFileName: getFileName(url),
        pageLogs: false,
        fullPage: false,
        timeout: 60000,
        waitForTimeout: 10000,
        waitUntil: 'networkidle0' // "load"|"domcontentloaded"|"networkidle0"|"networkidle2"|Array
    }, function (err, result) {
        if (err) {
            console.log(url + ' ' + JSON.stringify({error: err}));
        } else {
            console.log(url + ' ' + JSON.stringify(result));
        }
    });
}

