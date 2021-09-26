const fs = require('fs');
//const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const puppeteer = require('puppeteer');

//download('http://users.metu.edu.tr/seraslan/pages/adobe/index.html', './tests/data/adobe.json', save);
//download('http://users.metu.edu.tr/seraslan/pages/outlook/index.html', './tests/data/outlook.json', save);
//download('http://users.metu.edu.tr/seraslan/pages/whatsapp/index.html', './tests/data/whatsapp.json', save);
//download('http://users.metu.edu.tr/seraslan/pages/netflix/cy/index.html', './tests/data/netflix.json', save);
//download('http://vista.ar-ni.com/pages/wordpress/index.html', './tests/data/wordpress.json', save);
//download('http://vista.ar-ni.com/pages/amazon/index.html', './tests/data/amazon.json', save);
//download('http://users.metu.edu.tr/seraslan/pages/bbc/index.html', './tests/data/bbc.json', save);
//download('http://users.metu.edu.tr/seraslan/pages/youtube/YouTube.html', './tests/data/youtube.json', save);

download('https://www.youtube.com/', 'youtube', save);

async function download(url, fileName, callback){
	const width = 1920;
	const height = 1080;
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({
		width: width,
		height: height,
		deviceScaleFactor: 1,
	});

	await page.emulateMediaFeatures('screen');

	page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
	await page.goto(url, {waitUntil: 'networkidle0'});

	const totalPage = await page.$('body');
	const boundingBox = await totalPage.boundingBox();

	console.log(boundingBox);

	const pdf = await page.pdf( {
		path: './capture-' + fileName + '.pdf',
		width: `${boundingBox.width}px`,
		height: `${boundingBox.height}px`,
		printBackground: true,
		margin: 'none'
	});

	//console.log(JSON.stringify(html, null, 2));
	//await bodyHandle.dispose();
	await browser.close();

	return pdf;
}

function save(fileName, nodeTree){
	fs.writeFile(fileName, JSON.stringify(nodeTree), function(err) {
		if(err) {
			return console.log(err);
		}

		console.log("The file was saved!");
	});
}
