var baseOperation = require('./getBaseOperation.js');
async function getDishes() {
	//创建菜单数组
	let dishArr = [];
	//创建菜单项对象
	var menuList = {
		listnav_ul: '',
		listnav_dd: '',
		listnav_ddname: ''
	}
	// 创建浏览器对象
	let browser = await baseOperation.puppeteer.launch(baseOperation.option);
	// 创建浏览器页面对象
	let page = await browser.newPage();
	// 进入浏览器指定页面
	await page.goto('https://www.meishij.net/hongpei/hongpeigongju/', {
		'waitUntil': 'domcontentloaded',
		'timeout': 1000 * 60
	});
	await page.waitForTimeout(2000);
	var currentUrl = await page.url();
	menuList.listnav_ul=currentUrl.split('/')[3];
	menuList.listnav_dd=currentUrl.split('/')[4];
	
	var currentItemData = await page.$eval(`#listnav > div > dl > dd.current > h1 > a`, el => el.innerText);
	
	menuList.listnav_ddname=currentItemData;
	var dishCount = await page.$eval(`#listtyle1_list`,el=>el.childElementCount);
	for(let i=1 ;i<=dishCount;i++){
		var itemIdAndTitle =await page.$eval(`#listtyle1_list > div:nth-child(${i}) > a`,el=>{
			return [ el.href.split('/')[4],el.title]
		});
		var itemImg =await page.$eval(`#listtyle1_list > div:nth-child(${i}) > a > img`,el=>{
			return el.src
		});
		var itemVoice =await page.$eval(`#listtyle1_list > div:nth-child(${i}) > a > div > div > div.c1 > span`,el=> el.innerHTML);
		var itemAuthor;
		try{
			itemAuthor =await page.$eval(`#listtyle1_list > div:nth-child(${i}) > a > div > div > div.c1 > em`,el=> el.innerHTML);
		}catch(e){
			itemAuthor=''
		}
		var itemStep =await page.$eval(`#listtyle1_list > div:nth-child(${i}) > a > div > div > div.c2 > ul > li.li1`,el=> el.innerHTML);
		var itemMethod = await page.$eval(`#listtyle1_list > div:nth-child(${i}) > a > div > div > div.c2 > ul > li.li2`,el=> el.innerHTML);
		var tempObj =JSON.parse(JSON.stringify(menuList));
		console.log('美食数据为:',tempObj.listnav_ul,tempObj.listnav_dd,tempObj.listnav_ddname,itemImg,itemIdAndTitle[1],itemVoice,itemAuthor,itemStep,itemMethod,itemIdAndTitle[0].split('.')[0])
		dishArr.push([tempObj.listnav_ul,tempObj.listnav_dd,tempObj.listnav_ddname,itemImg,itemIdAndTitle[1],itemVoice,itemAuthor,itemStep,itemMethod,itemIdAndTitle[0].split('.')[0]]);
	}
	return dishArr;
}
async function getDishSimple(page,menuListArr,currentItem,tempObj){
	menuListArr.push([tempObj.listnav_ul,tempObj.listnav_dd,tempObj.listnav_ddname])
	currentItem.click();
	await page.waitForTimeout(2000);
}
module.exports = getDishes;