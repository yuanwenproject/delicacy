/*
 * @Description: 
 * @Author: 袁文
 * @Date: 2021-10-01 20:41:29
 * @LastEditTime: 2021-10-27 17:00:30
 * @LastEditors: 袁文
 */
const e = require('express');
var baseOperation = require('./getBaseOperation.js');
async function getMovies(movieName, alreadyCout = 0) {
	var allMovieItem = [];
	var detailPageUrl;
	var relatedPageUrl;
	// 创建浏览器对象
	let browser = await baseOperation.puppeteer.launch(baseOperation.option);
	// 创建浏览器页面对象
	let page = await browser.newPage();
	// 进入浏览器指定页面
	await page.goto('https://dm84.tv/');
	// 通过输入框输入搜索
	var searchElement = await page.$('#open_search');
	await searchElement.click()
	// 输入框高亮,好像要通过输入文本才会出现高亮
	await searchElement.focus();
	// 键盘输入
	await page.keyboard.type(movieName);
	// 点击回车按钮,进入下一个页面
	await page.keyboard.down('Enter');

	// 刚进入网页,有些dom元素可能还未生成,使用延时器,等待至生命周期就绪
	await page.waitForTimeout(3000);
	// 根据搜索关键字进入影视展示页面,展示相关条数的影视
	// 获取此影视的条数,用于后续循环爬取相关影视
	var relatedItemCount = await page.$eval('body > div > div:nth-child(3) > ul', res => {
		return res.childElementCount;
	});
	// 获取当前页面地址,用于每部影视详细信息获取之后的跳转
	relatedPageUrl = await page.url();
	console.log('当前剧目的相似剧目条数为:', relatedItemCount);
	var movieCount = 1;
	while (movieCount <= relatedItemCount) {
		await page.waitForTimeout(3000);
		var determinItem = await page.$(`body > div > div:nth-child(3) > ul > li:nth-child(${movieCount}) > div > a.cover.lazy.entered.loaded`)
		await determinItem.click();
		await page.waitForTimeout(3000);
		detailPageUrl = await page.url();
		console.log("当前页面的url地址为:", detailPageUrl);
		var listCount = await page.$eval('#play_list > ul', res => {
			return res.childElementCount;
		});
		listCount -= alreadyCout;
		console.log("当前剧目的集数为:", listCount);
		var currentItem = await page.$$eval('body > div > div.card.v_info.mb20', (res) => {
			// console.log("查看封面:",res[0].lastChild.childNodes[0].innerHTML);
			var reg = /\<[img|href][^>]*src\s*=\s*('|")?([^'">]*)\1([^>])*\>/ig
			let result = reg.exec(res[0].lastChild.childNodes[0].innerHTML)
			// console.log("是否已经获取到当前元素",res[0].outerText);
			return res[0].outerText + `\n\n` + result[2];
		});
		var movieInfo = currentItem.split("\n\n");
		var tempArr = movieInfo.filter((item, index) => {
			return (item.indexOf('编剧') === -1) && (item.indexOf('又名') === -1);
		})
		console.log('临时数组的数据为:', tempArr);
		movieInfo = tempArr;
		var count = 1;
		await getDetails(page, movieInfo, count, listCount, allMovieItem, detailPageUrl, alreadyCout);
		movieCount++;
		await page.goto(relatedPageUrl);
	}
	return allMovieItem;
	// page.on('console', msg => {
	//   for (let i = 0; i < msg.args().length; ++i)
	//     console.log(`${i}: ${msg.args()[i]}`);  // 译者注：这句话的效果是打印到你的代码的控制台
	// });

}
// 获取详情
async function getDetails(page, movieInfo, count, listCount, allMovieItem, detailPageUrl, alreadyCout) {
	while (count <= listCount) {
		var movieItemInfo = JSON.parse(JSON.stringify(movieInfo));
		await page.waitForTimeout(2000)
		var currentEpisode = await page.$(`#play_list > ul > li:nth-child(${count}) > a`);
		await currentEpisode.click();
		await page.waitForTimeout(2000);
		const frame = page.frames()[0];
		const text = await frame.$('iframe');
		var link = await text.getProperty('src').then(res => {
			return res._remoteObject.value;
		})
		
		// await page.waitForSelector("iframe");
		// const elementHandle = await page.$('iframe');
		// const frame = await elementHandle.contentFrame();
		// await frame.waitForSelector('video');
		// const movieLink = await frame.$eval('video', el => el.src);
		// console.log("框架中的信息为:", movieLink)
		movieItemInfo.push(link);
		if (alreadyCout !== 0) {
			movieItemInfo.push((alreadyCout + 1).toString());
		} else {
			movieItemInfo.push((listCount - count + 1).toString())
		}
		allMovieItem.push(movieItemInfo);
		await page.goto(detailPageUrl);
		count++;
	}
}
module.exports = getMovies;