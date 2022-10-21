var baseOperation = require('./getBaseOperation.js');
async function getMenus() {
	//创建菜单数组
	let menuListArr = [];
	//创建菜单项对象
	var menuList = {
		listnav_ul: '',
		listnav_ulname: '',
		listnav_dt: '',
		listnav_dd: '',
		listnav_ddname: ''
	}
	// 创建浏览器对象
	let browser = await baseOperation.puppeteer.launch(baseOperation.option);
	// 创建浏览器页面对象
	let page = await browser.newPage();
	// 进入浏览器指定页面
	await page.goto('https://www.meishij.net/chufang/diy/', {
		'waitUntil': 'domcontentloaded',
		'timeout': 1000 * 60
	});
	//获取li的数量
	var ulCount = await page.$eval('#listnav_ul', res => {
		return res.childElementCount;
	});

	for (var i = 2; i < ulCount; i++) {
		// 通过点击菜单项获取菜单列表
		//第二项和第三项dom结构不完全相同,后续修改
		var ulElement, ulData;
		if (i == 2) {
			ulElement = await page.$('#listnav_ul > li:nth-child(2) > h1 > a');
			ulData = await page.$eval(`#listnav_ul > li:nth-child(2) > h1 > a`, el => {
				return [
					el.innerText,
					el.href.split('/')[4]
				]
			});
		} else {
			ulElement = await page.$(`#listnav_ul > li:nth-child(${i}) > a`);
			ulData = await page.$eval(`#listnav_ul > li:nth-child(${i}) > a`, el => {
				if(el.innerText=='外国菜谱'){
					return [
						el.innerText,
						el.href.split('/')[5]
					]
				}else if(el.innerText=='烘焙' || el.innerText=='厨房百科'){
					return [
						el.innerText,
						el.href.split('/')[3]
					]
				}
				return [
					el.innerText,
					el.href.split('/')[4]
				]
			});
		}
		menuList.listnav_ul = ulData[1];
		menuList.listnav_ulname = ulData[0];

		await ulElement.click()
		await page.waitForTimeout(2000);
		var dlCount = await page.$eval('#listnav > div', res => {
			return res.childElementCount;
		});
		var dtData
		var ddData
		if (dlCount > 1 && i != 5) {
			for (var j = 1; j <= dlCount; j++) {
				dtData = await page.$eval(`#listnav_con_c > dl:nth-child(${j}) > dt`, el => el.innerText);
				menuList.listnav_dt = dtData;
				var ddCount = await page.$eval(`#listnav_con_c > dl:nth-child(${j})`, res => {
					return res.childElementCount;
				});
				for (var k = 2; k <= ddCount; k++) {
					ddData = await page.$eval(`#listnav_con_c > dl:nth-child(${j}) > dd:nth-child(${k}) > a `, el => {
						return [
							el.innerText,
							el.href.split('/')[5]
						]
					});
					menuList.listnav_dd = ddData[1];
					menuList.listnav_ddname = ddData[0]
					var tempObj =JSON.parse(JSON.stringify(menuList))
					menuListArr.push([tempObj.listnav_ul,tempObj.listnav_ulname,tempObj.listnav_dt,tempObj.listnav_dd,tempObj.listnav_ddname])
				}
			}

		} else if (dlCount > 1 && i == 5) {
			for (var j = 1; j <= dlCount; j++) {
				dtData = await page.$eval(`#listnav > div > dl:nth-child(${j}) > dt`, el => el.innerText);
				menuList.listnav_dt = dtData;
				var ddCount = await page.$eval(`#listnav > div > dl:nth-child(${j})`, res => {
					return res.childElementCount;
				});
				for (var k = 2; k <= ddCount; k++) {
					ddData = await page.$eval(`#listnav > div > dl:nth-child(${j}) > dd:nth-child(${k}) > a`, el => {
						return [
							el.innerText,
							el.href.split('/')[6]
						]
					});
					menuList.listnav_dd = ddData[1];
					menuList.listnav_ddname = ddData[0]
					var tempObj =JSON.parse(JSON.stringify(menuList))
					menuListArr.push([tempObj.listnav_ul,tempObj.listnav_ulname,tempObj.listnav_dt,tempObj.listnav_dd,tempObj.listnav_ddname])
				}
				
			}
			
		} else if(dlCount == 1 && i>=6){
			for (var j = 1; j <= dlCount; j++) {
				dtData = await page.$eval(`#listnav > div > dl > dt`, el => el.innerText);
				menuList.listnav_dt = dtData;
				var ddCount = await page.$eval(`#listnav > div > dl`, res => {
					return res.childElementCount;
				});
				for (var k = 2; k <= ddCount; k++) {
					ddData = await page.$eval(`#listnav > div > dl:nth-child(1) > dd:nth-child(${k}) > a`, el => {
						return [
							el.innerText,
							el.href.split('/')[4]
						]
					});
					menuList.listnav_dd = ddData[1];
					menuList.listnav_ddname = ddData[0]
					var tempObj =JSON.parse(JSON.stringify(menuList))
					menuListArr.push([tempObj.listnav_ul,tempObj.listnav_ulname,tempObj.listnav_dt,tempObj.listnav_dd,tempObj.listnav_ddname])
				}
			}
			
			
		}else if(dlCount == 1 && i<6) {
			for (var j = 1; j <= dlCount; j++) {
				dtData = await page.$eval(`#listnav > div > dl > dt`, el => el.innerText);
				menuList.listnav_dt = dtData;
				var ddCount = await page.$eval(`#listnav > div > dl`, res => {
					return res.childElementCount;
				});
				for (var k = 2; k <= ddCount; k++) {
					ddData = await page.$eval(`#listnav > div > dl:nth-child(1) > dd:nth-child(${k}) > a`, el => {
						return [
							el.innerText,
							el.href.split('/')[5]
						]
					});
					menuList.listnav_dd = ddData[1];
					menuList.listnav_ddname = ddData[0]
					var tempObj =JSON.parse(JSON.stringify(menuList))
					menuListArr.push([tempObj.listnav_ul,tempObj.listnav_ulname,tempObj.listnav_dt,tempObj.listnav_dd,tempObj.listnav_ddname])
				}
			}
			
			
		}



	}
	
	return menuListArr
	//#listnav_ul > li:nth-child(2) > h1 > a

}
module.exports = getMenus;