var baseOperation = require('./getBaseOperation.js');
async function getHotAnecdotes() {
	//创建菜单数组
	let anecdotesArr = [];
	//创建菜单项对象
	// 创建浏览器对象
	let browser = await baseOperation.puppeteer.launch(baseOperation.option);
	// 创建浏览器页面对象
	let page = await browser.newPage();
	// 进入浏览器指定页面
	await page.goto(`http://www.ami888.com/`, {
		'waitUntil': 'domcontentloaded',
		'timeout': 1000 * 600
	});
	var hotAnecdotesCount =await page.$eval(`body > div.main > div.content > div.index-focus.clearfix > div.index-article > div > div.bd > ul`,el=>el.childElementCount);
	console.log("anecdotesCount为:",hotAnecdotesCount)
	for(let i=1;i<=hotAnecdotesCount;i++){
		var anecdotesId = await page.$eval(`body > div.main > div.content > div.index-focus.clearfix > div.index-article > div > div.bd > ul > li.item.item-${i} > a.tit`,el=>el.href.split('/')[4]);
		var anecdotesTitle = await page.$eval(`body > div.main > div.content > div.index-focus.clearfix > div.index-article > div > div.bd > ul > li.item.item-${i} > a.tit`,el=>el.innerText);
		await page.goto(`http://www.ami888.com/meishi/${anecdotesId}`)
        await page.waitForTimeout(2000);
        var anecdotesImg = await page.$eval(`#imgIco`,el=>el.src);
		var anecdotesName = await page.$eval(`body > div.main > div.content > div > div.content-left > div > div > div.one-cont-title.clearfix > div.one-cont-font.clearfix > a > i`,el=>el.innerText);
		var anecdotesContent = await page.$eval(`body > div.main > div.content > div > div.content-left > div > div > div.share-pic-content`,el=>el.innerHTML);
		// console.log("获取到的趣闻基本信息:",anecdotesId,anecdotesImg,anecdotesName,anecdotesDescription,anecdotesTitle,anecdotesContent)
		// console.log("获取到的趣闻基本信息:",anecdotesContent)
		anecdotesArr.push([anecdotesId.split('.')[0],anecdotesImg,anecdotesName,'',anecdotesTitle,anecdotesContent])
		await page.goto(`http://www.ami888.com/`)
	}
	return anecdotesArr
}

module.exports = getHotAnecdotes;