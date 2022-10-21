var baseOperation = require('./getBaseOperation.js');
async function gethealth() {
	//创建菜单数组
	let healthArr = [];
	//创建菜单项对象
	// 创建浏览器对象
	let browser = await baseOperation.puppeteer.launch(baseOperation.option);
	// 创建浏览器页面对象
	let page = await browser.newPage();
	// 进入浏览器指定页面
	await page.goto(`https://www.meishichina.com/Health/`, {
		'waitUntil': 'domcontentloaded',
		'timeout': 1000 * 600
	});
	await page.waitForTimeout(2000);
	var healthElement = await page.$('#zhen_title_wrap > div > div > h3:nth-child(3) > a');
	await healthElement.click()
	var healthCount =await page.$eval(`#cms_list_living > ul.on`,el=>el.childElementCount);
	console.log("healthCount为:",healthCount)
	for(let i=1;i<=healthCount;i++){
		var healthIdAndTitle = await page.$eval(`#cms_list_living > ul.on > li:nth-child(${i}) > div.detail > h4 > a`,el=>{
			var urlArr=el.href.split('/');
			var id=''
			for(var i=4;i<urlArr.length;i++){
				id+=urlArr[i]+'/'
			}
			id=id.split('.')[0];
			return [id,el.title]
		});
		var healthImg = await page.$eval(`#cms_list_living > ul.on > li:nth-child(${i}) > div.pic > a > img`,el=>el.src);
		await page.goto(`https://www.meishichina.com/Health/${healthIdAndTitle[0]}.html`)
		await page.waitForTimeout(2000);
		var healthDescription = await page.$eval(`#article > p:nth-child(2)`,el=>el.innerHTML);
		var healthTime=await page.$eval(`#article > p.f12.grey`,el=>el.innerHTML);
		
		
		var healthContent = await page.$eval(`#article`,el=>el.innerHTML);
		console.log("获取到的趣闻基本信息:",healthIdAndTitle[0],healthIdAndTitle[1],healthImg,healthDescription,healthTime,healthContent)
		healthArr.push([healthIdAndTitle[0],healthImg,healthIdAndTitle[1],healthTime,healthDescription,healthContent])
		await page.goto(`https://www.meishichina.com/Health/`)
		var healthElement = await page.$('#zhen_title_wrap > div > div > h3:nth-child(3) > a');
	await healthElement.click()
	}
	return healthArr
}

module.exports = gethealth;