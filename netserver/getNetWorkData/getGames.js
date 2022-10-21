
var baseOperation = require('./getBaseOperation.js');
async function getGames(gameHref,pageId) {
	// 创建浏览器对象
	let browser = await baseOperation.puppeteer.launch(baseOperation.option);
	// 创建浏览器页面对象
	let page = await browser.newPage();
	// 进入浏览器指定页面
	await page.goto(gameHref, {
		'waitUntil': 'domcontentloaded',
		'timeout': 1000 * 60
	});
	await page.waitForTimeout(2000);
	var inputBorder = await page.$("#verifycode");
	await inputBorder.focus();
	// 键盘输入
	await page.keyboard.type('95678933');
	// 点击回车按钮,进入下一个页面
	await page.keyboard.down('Enter');
	// 在跳转之后添加
	await page.waitForNavigation(); // 等待页面跳转
	await page.waitForTimeout(4000);
	var gameName = await page.$eval(`#post-${pageId} > h1`,el=>el.innerText);
	// console.log("游戏名称为:",gameName)
	var gameCover = await page.$eval(`#post-${pageId} > div > div.inn-singular__post__body__content.inn-content-reseter > p:nth-child(3) > a > img`,el=>el.src);
	// console.log("游戏封面链接为:",gameCover);

	var gameContent =await page.$eval(`#post-${pageId} > div > div.inn-singular__post__body__content.inn-content-reseter`,el=>el.innerHTML);
	var tempContentArr=gameContent.split('</p>');
	var gameContentArr=tempContentArr.filter((item)=>{
		return item.indexOf("video") === -1;
	})
	gameContent=gameContentArr.join('</p>');
	// console.log("游戏详情内容为:",gameContent);

	var linkList = await page.$eval(`#post-${pageId} > div > div.inn-singular__post__body__content.inn-content-reseter > div:nth-last-child(2)`, res => res.innerHTML);
	var tempArr=linkList.split('<br>').filter((item)=>{ 
		return item.length>40
	}) 
	var validLink = tempArr.join("");
	// console.log("游戏下载链接为:",validLink);  
	return [gameName,gameCover,gameContent,validLink];

}
module.exports = getGames;