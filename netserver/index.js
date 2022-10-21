var fs = require('fs')
var express = require('express');
var app = new express();
var moment = require('moment');
var insertData = require('./dbOperation/insertAdvanced.js');
var searchData = require('./dbOperation/searchAdvanced.js');
var getMenus = require('./getNetWorkData/getMenuList.js');
var getDishes = require('./getNetWorkData/getDishDescription')
var getDishDetails = require('./getNetWorkData/getDishDetails')
var getAnecdotes = require('./getNetWorkData/getAnecdotes')
var getHotAnecdotes = require('./getNetWorkData/getHotAnecdotes')
var getHealth = require('./getNetWorkData/getHealth')
var getEatingTime = require('./getNetWorkData/getEatingTime')
var areaList = require('./getNetWorkData/areaList.js');
var qs = require('qs');
const bodyParser = require('body-parser');
//使用cors解除跨域问题
const cors = require('cors');
const {
    request
} = require('express');
app.use(cors());
//配置body-parser模块
app.use(bodyParser.urlencoded({
    extended: false
}));
app.get('/', async (req, res, next) => {
    res.json({
        data: 'hello world!'
    })
    next();
})
// 插入菜单
app.get('/insertMenus', async (req, res, next) => {
    // var targetLink = req.query.targetLink;
    // console.log(targetLink);
    var getResult = await getMenus();
    // console.log("游戏信息为:",getResult)
    var insertDataSql = "INSERT INTO menulist (`listnav_ul`,`listnav_ulname`,`listnav_dt`,`listnav_dd`,`listnav_ddname`) VALUES ?";
    var insertMenusResult = await insertData(insertDataSql, getResult);
    res.json({
        data: insertMenusResult
    })
})
// 插入菜品基本信息
app.get('/insertDishDesc', async (req, res, next) => {
    // var targetLink = req.query.targetLink;
    // console.log(targetLink);
    var getResult = await getDishes();
    // console.log("游戏信息为:",getResult)
    var insertDataSql = "INSERT INTO dishdescription (`listnav_ul`,`listnav_dd`,`listnav_ddname`,`dish_img`,`dish_name`,`dish_voice`,`dish_author`,`dish_step`,`dish_methods`,`dish_id`) VALUES ?";
    var insertMenusResult = await insertData(insertDataSql, getResult);
    res.json({
        data: insertMenusResult
    })
})
// 插入菜品详细信息
app.get('/insertDishDetails', async (req, res, next) => {
    // var targetLink = req.query.targetLink;
    // console.log(targetLink);
    var searchDataSql = "select * from dishdescription limit 450,467";
    var searchDataResult = await searchData(searchDataSql)
    var getResult = await getDishDetails(searchDataResult);
    // // console.log("游戏信息为:",getResult)
    var insertDataSql = "INSERT INTO dish_details (`dish_id`,`dish_img`,`dish_hot`,`dish_time`,`dish_difficulty`,`dish_weight`,`dish_main`,`dish_other`,`dish_author_img`,`dish_author_say`,`dish_cooking_method`,`dish_suit`) VALUES ?";
    var insertDishResult = await insertData(insertDataSql, getResult);
    res.json({
        data: insertDishResult
    })
    // console.log("查询到的结果为:",searchDataResult)
})
// 插入饮食趣闻信息
app.get('/insertAnecdotes', async (req, res, next) => {
    // var targetLink = req.query.targetLink;
    // console.log(targetLink);
    var getResult = await getAnecdotes();
    // console.log("游戏信息为:",getResult)
    var insertDataSql = "INSERT INTO anecdotes (`anecdotes_id`,`anecdotes_author_img`,`anecdotes_author_name`,`anecdotes_description`,`anecdotes_title`,`anecdotes_content`) VALUES ?";
    var insertMenusResult = await insertData(insertDataSql, getResult);
    res.json({
        data: insertMenusResult
    })
})
// 插入热门饮食趣闻信息
app.get('/insertHotAnecdotes', async (req, res, next) => {
    // var targetLink = req.query.targetLink;
    // console.log(targetLink);
    var getResult = await getHotAnecdotes();
    // console.log("游戏信息为:",getResult)
    var insertDataSql = "INSERT INTO anecdotes (`anecdotes_id`,`anecdotes_author_img`,`anecdotes_author_name`,`anecdotes_description`,`anecdotes_title`,`anecdotes_content`) VALUES ?";
    var insertMenusResult = await insertData(insertDataSql, getResult);
    res.json({
        data: insertMenusResult
    })
})
// 插入饮食健康信息
app.get('/insertHealth', async (req, res, next) => {
    // var targetLink = req.query.targetLink;
    // console.log(targetLink);
    var getResult = await getHealth();
    // console.log("游戏信息为:",getResult)
    var insertDataSql = "INSERT INTO health (`health_id`,`health_img`,`health_title`,`health_time`,`health_description`,`health_details`) VALUES ?";
    var insertMenusResult = await insertData(insertDataSql, getResult);
    res.json({
        data: insertMenusResult
    })
})
// 插入吃货时刻信息
app.get('/insertEatingTime', async (req, res, next) => {
    // var targetLink = req.query.targetLink;
    // console.log(targetLink);
    var getResult = await getEatingTime();
    var insertDataSql = "INSERT INTO eating_time (`eating_id`,`eating_author_img`,`eating_author_name`,`eating_title`,`eating_show_time`,`eating_food_img`) VALUES ?";
    var insertMenusResult = await insertData(insertDataSql, getResult);
    res.json({
        data: insertMenusResult
    })
})


//获取饮食趣闻
app.get('/dishDescription/search', async (req, res, next) => {
    var requestParams = req.query.limit
    var searchAnecdotesSql = `select * from dishdescription`;
    if (!!requestParams) {
        searchAnecdotesSql = `select * from dishdescription limit 8`
    }
    var anecdotesResult = await searchData(searchAnecdotesSql);
    console.log("anecdotesResult为:", anecdotesResult.length)
    res.json({
        data: anecdotesResult,
        meta: {
            status: 200,
            msg: "查询成功!"
        }
    })
})

//获取饮食健康信息
app.get('/health/search', async (req, res, next) => {
    var searchSql = `select * from health`;
    var getResult = await searchData(searchSql);
    res.json({
        data: getResult,
        meta: {
            status: 200,
            msg: "查询成功!"
        }
    })
})
//获取饮食健康信息
app.get('/eatingTime/search', async (req, res, next) => {
    var searchSql = `select * from eating_time`;
    var getResult = await searchData(searchSql);
    res.json({
        data: getResult,
        meta: {
            status: 200,
            msg: "查询成功!"
        }
    })
})
//获取菜谱主按钮
app.get('/dishMenu/main', async (req, res, next) => {
    var searchSql = `select * from menulist`;
    var getResult = await searchData(searchSql);
    res.json({
        data: getResult,
        meta: {
            status: 200,
            msg: "查询成功!"
        }
    })
})
//获取菜谱主按钮
app.get('/dishList/search', async (req, res, next) => {
    var requestParams = req.query
    console.log("当前参数为:", requestParams)
    var searchSql = `select * from dishdescription where listnav_ul='${requestParams.listnav_ul}' and listnav_dd ='${requestParams.listnav_dd}' and listnav_ddname = '${requestParams.listnav_ddname}'`;
    var getResult = await searchData(searchSql);
    res.json({
        data: getResult,
        meta: {
            status: 200,
            msg: "查询成功!"
        }
    })
})
//获取相关菜谱
app.get('/dishList/relevant', async (req, res, next) => {
    var requestParams = req.query.dish_name;
    console.log("当前参数为:", requestParams)
    var searchSql = `select * from dishdescription where dish_name like'%${requestParams}%'`;
    var getResult = await searchData(searchSql);
    res.json({
        data: getResult,
        meta: {
            status: 200,
            msg: "查询成功!"
        }
    })
})
//生成json文件
app.get('/areaList', async (req, res, next) => {
    var originData ={};
    for (let i in areaList) {
        originData[areaList[i].cityNm] = i;
    }
    fs.writeFile('./jsonFile/areaList.json',JSON.stringify(originData),function(err){
        if(err){
            console.log("写入错误为:",err)
        }
    })
})
//获取猜你喜欢数据
app.get('/dishList/guess', async (req, res, next) => {
    var requestParams = req.query.listnav_dd;
    console.log("当前参数为:", requestParams)
    var searchSql = `select * from dishdescription where listnav_dd ='${requestParams}' limit 4`;
    var getResult = await searchData(searchSql);
    res.json({
        data: getResult,
        meta: {
            status: 200,
            msg: "查询成功!"
        }
    })
})
//获取具体菜谱信息
app.get('/dishList/searchCurrent', async (req, res, next) => {
    var requestParams = req.query.id
    var searchSql = `select * from dish_details where dish_id='${requestParams}'`;
    var getResult = await searchData(searchSql);
    res.json({
        data: getResult,
        meta: {
            status: 200,
            msg: "查询成功!"
        }
    })
})
//获取饮食健康详细
app.get('/health/details', async (req, res, next) => {
    var requestParam = req.query.requestParam.split("_").join("/");
    console.log("id参数为:", requestParam)
    var searchSql = `select * from health where health_id = '${requestParam}'`;
    var getResult = await searchData(searchSql);
    res.json({
        data: getResult,
        meta: {
            status: 200,
            msg: "查询成功!"
        }
    })
})

//获取饮食趣闻列表
app.get('/anecdotes/search', async (req, res, next) => {
    var requestParams = req.query.id
    var searchAnecdotesSql = `select * from anecdotes limit 0,20`;
    if (!!requestParams) {
        searchAnecdotesSql = `select * from anecdotes where anecdotes_id ='${requestParams}'`
    }
    var anecdotesResult = await searchData(searchAnecdotesSql);
    console.log("anecdotesResult为:", anecdotesResult)
    res.json({
        data: anecdotesResult,
        meta: {
            status: 200,
            msg: "查询成功!"
        }
    })
})
//获取热门饮食趣闻
app.get('/anecdotes/hotSearch', async (req, res, next) => {
    var searchAnecdotesSql = `select * from anecdotes where anecdotes_description = ''`;
    var anecdotesResult = await searchData(searchAnecdotesSql);
    console.log("anecdotesResult为:", anecdotesResult)
    res.json({
        data: anecdotesResult,
        meta: {
            status: 200,
            msg: "查询成功!"
        }
    })
})

app.listen(3000, () => {
    console.log("监听3000端口--http://localhost:3000/  数组插入记得使用嵌套数组[[]]");
})