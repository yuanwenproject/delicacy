var baseOperation = require('./getBaseOperation.js');
async function getAnecdotes() {
	//创建菜单数组
	let anecdotesArr = [];
	//创建菜单项对象
	// 创建浏览器对象
	let browser = await baseOperation.puppeteer.launch(baseOperation.option);
	// 创建浏览器页面对象
	let page = await browser.newPage();
	// 进入浏览器指定页面
	await page.goto(`http://www.ami888.com/index_2.html`, {
		'waitUntil': 'domcontentloaded',
		'timeout': 1000 * 600
	});
	var anecdotesCount =await page.$eval(`body > div.main > div.content > div.grid.clearfix > div.content-left`,el=>el.childElementCount);
	console.log("anecdotesCount为:",anecdotesCount)
	for(let i=1;i<anecdotesCount-1;i++){
		var anecdotesId = await page.$eval(`body > div.main > div.content > div.grid.clearfix > div.content-left > div:nth-child(${i}) > a`,el=>el.href.split('/')[4]);
		var anecdotesImg = await page.$eval(`body > div.main > div.content > div.grid.clearfix > div.content-left > div:nth-child(${i}) > div > div > a > em > img`,el=>el.src);
		var anecdotesName = await page.$eval(`body > div.main > div.content > div.grid.clearfix > div.content-left > div:nth-child(${i}) > div > div > a > i`,el=>el.innerText);
		var anecdotesDescription = await page.$eval(`body > div.main > div.content > div.grid.clearfix > div.content-left > div:nth-child(${i}) > a > div`,el=>el.innerHTML);
		var anecdotesTitle = await page.$eval(`body > div.main > div.content > div.grid.clearfix > div.content-left > div:nth-child(${i}) > a > div > p`,el=>el.innerText);
		await page.goto(`http://www.ami888.com/meishi/${anecdotesId}`)
		await page.waitForTimeout(2000);
		var anecdotesContent = await page.$eval(`.content .grid .content-left .one-cont .center .share-pic-content`,el=>el.innerHTML);
		// console.log("获取到的趣闻基本信息:",anecdotesId,anecdotesImg,anecdotesName,anecdotesDescription,anecdotesTitle,anecdotesContent)
		// console.log("获取到的趣闻基本信息:",anecdotesContent)
		anecdotesArr.push([anecdotesId.split('.')[0],anecdotesImg,anecdotesName,anecdotesDescription,anecdotesTitle,anecdotesContent])
		await page.goto(`http://www.ami888.com/index_2.html`)
	}
	return anecdotesArr
}

module.exports = getAnecdotes;