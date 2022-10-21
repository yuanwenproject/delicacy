/*
 * @Description: 
 * @Author: 袁文
 * @Date: 2021-10-01 20:43:24
 * @LastEditTime: 2021-10-27 15:41:56
 * @LastEditors: 袁文
 */
const puppeteer =require("puppeteer");
var option={
	headless:false,
	defaultViewport:{
		width:1366,
		height:650,
	},
	args: [
		'--disable-web-security',
		'--disable-features=IsolateOrigins,site-per-process', // 很关键...
	  ],
	timeout:5000
}
module.exports={
    puppeteer,
    option
}