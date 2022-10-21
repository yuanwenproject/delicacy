var baseOperation = require('./getBaseOperation.js');
async function geteating() {
	//创建菜单数组
	let eatingArr = [];
	//创建菜单项对象
	// 创建浏览器对象
	let browser = await baseOperation.puppeteer.launch(baseOperation.option);
	// 创建浏览器页面对象
	let page = await browser.newPage();
	// 进入浏览器指定页面
	await page.goto(`https://home.meishichina.com/pai/meishi/elite/`, {
		'waitUntil': 'domcontentloaded',
		'timeout': 1000 * 600
	});
	await autoScroll(page)
	var eatingCount =await page.$eval(`#J_list > ul`,el=>el.childElementCount);
	console.log("eatingCount为:",eatingCount)
	for(let i=1;i<=eatingCount;i++){
		var eatingIdAndTitle = await page.$eval(`#J_list > ul > li:nth-child(${i}) > div.c.clear > div.pp > a`,el=>{
			var id=el.href.split('/')[3];
			var title
			try {
				title=el.children[0].innerText
			} catch (error) {
				title=el.innerText
			}
			return [id.split('.')[0],title]
		});
		await page.waitForSelector(`#J_list > ul > li:nth-child(${i}) > div.c.clear > a`);
		var eatingFoodImg = await page.$eval(`#J_list > ul > li:nth-child(${i}) > div.c.clear > a`,el=>{
			var imgArr=""
			var count;
			if(el.childElementCount>=5){
				count=4
			}else{
				count=el.childElementCount
			}
			for(let i=0;i<count;i++){
				imgArr+=el.children[i].src.replace(/c180/ig,'p800')+" "
			}
			return imgArr
		});
		var eatingAuthorImg=await page.$eval(`#J_list > ul > li:nth-child(${i}) > div.u > a > img`,el=>el.src);
		var eatingShowTime = await page.$eval(`#J_list > ul > li:nth-child(${i}) > div.u > div > span`,el=>el.innerText);
		var eatingAuthorName = await page.$eval(`#J_list > ul > li:nth-child(${i}) > div.u > div > a`,el=>el.innerText);
		console.log("获取到的趣闻基本信息:",eatingIdAndTitle[0],eatingAuthorImg,eatingAuthorName,eatingIdAndTitle[1],eatingShowTime,eatingFoodImg)
		eatingArr.push([eatingIdAndTitle[0],eatingAuthorImg,eatingAuthorName,eatingIdAndTitle[1],eatingShowTime,eatingFoodImg])
		
	}
	return eatingArr
}
async function autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
}

module.exports = geteating;