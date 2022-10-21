var baseOperation = require('./getBaseOperation.js');
async function getDishDetails(dishInfo) {
	//创建菜单数组
	let dishArr = [];
	//创建菜单项对象
	var dishDetails = {
		
	}
	// 创建浏览器对象
	let browser = await baseOperation.puppeteer.launch(baseOperation.option);
	// 创建浏览器页面对象
	let page = await browser.newPage();
	for(let i=0;i<dishInfo.length;i++){
		console.log('dish_id为:',dishInfo[i].dish_id);
		// 进入浏览器指定页面
	await page.goto(`http://www.meishij.net/zuofa/${dishInfo[i].dish_id}.html`, {
		'waitUntil': 'domcontentloaded',
		'timeout': 1000 * 600
	});
	await page.waitForTimeout(2000);
	var dish_id = await page.url().split('/')[4];
	
	var dish_img;
	try{
		dish_img = await page.$eval(`#app > div.recipe_header > div > div.recipe_topimgw > img`, el => el.src);
	}catch(e){
		dish_img='';
	}
	var dish_hot
	try{
		dish_hot = await page.$eval(`#app > div.recipe_header > div > div.recipe_header_info > span`, el => el.innerText);
	}catch(e){
		dish_hot='0 收藏 · 30 浏览'
	}
	var dish_time =await page.$eval(`#app > div.recipe_header > div > div.recipe_header_info > div.info2 > div.info2_item.info2_item3 > strong`, el => el.innerText);
	var dish_difficulty= await page.$eval(`#app > div.recipe_header > div > div.recipe_header_info > div.info2 > div.info2_item.info2_item4 > strong`, el => el.innerText);
	var dish_weight
	try {
		dish_weight =await page.$eval(`#app > div.recipe_header > div > div.recipe_header_info > div.recipe_ingredientsw > div:nth-child(1) > div.right > span`, el => el.innerText);
	} catch (error) {
		dish_weight='一人份'
	}
	
	var dish_main= await page.$eval(`#app > div.recipe_header > div > div.recipe_header_info > div.recipe_ingredientsw > div:nth-child(1) > div.right`, el => el.innerText);
	var dish_other
	try {
	dish_other = await page.$eval(`#app > div.recipe_header > div > div.recipe_header_info > div.recipe_ingredientsw > div.recipe_ingredients.recipe_ingredients1 > div.right`, el => el.innerText);
	} catch (error) {
		dish_other="无"
	}
	var dish_author_img=await page.$eval(`#app > div.main > div.main_left > div.recipe_author > div.author > div.avatarw`, el => el.style.background);
	var reg = /((http|https|ftp|rtsp|mms|\d{1}):(\/\/|\\|\\\\){1}(([A-Za-z0-9_-])+[.]){1,}(net|com|cn|org|cc|tv|[0-9]{1,3})([^ \f\n\r\t\v\""\'\>]*\/)(([^ \f\n\r\t\v\""\'\>])+[.]{1}(jpg|gif|png|bmp|jpeg)))/
	var dish_author_img_result = reg.exec(dish_author_img)
	dish_author_img=dish_author_img_result[0]
	var dish_author_say=await page.$eval(`#app > div.main > div.main_left > div.recipe_author > div.author_words > p`, el => el.innerHTML);
	var dish_cooking_method =await page.$eval(`#app > div.main > div.main_left > div.recipe_step_box`, el => el.innerHTML);
	var dish_suit
	try {
		dish_suit = await page.$eval(`#app > div.main > div.main_right > div.fitme`, el => el.innerHTML);
	} catch (error) {
		dish_suit ='此数据暂时为空'
	}
	// var dish_analys_background=await page.$eval(`#app > div.main > div.main_right > div.fitme > div.jztbox > div.jzt_show > div.masker`,  (el) => {return JSON.parse(JSON.stringify(window.getComputedStyle(el))).background});
	// console.log("dish_suit为:",dish_suit)
	dishArr.push([dish_id.split('.')[0],dish_img,dish_hot,dish_time,dish_difficulty,dish_weight,dish_main.slice(0,-3),dish_other,dish_author_img,dish_author_say,dish_cooking_method,dish_suit])
	}
	return dishArr
	
}

module.exports = getDishDetails;