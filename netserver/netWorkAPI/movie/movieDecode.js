/*
 * @Description: 
 * @Author: 袁文
 * @Date: 2021-10-23 19:18:44
 * @LastEditTime: 2021-10-28 15:29:23
 * @LastEditors: 袁文
 */
var axios = require('axios');
var qs = require('qs');
function getParams(requestParams) {
  return new Promise((resolve, reject) => {
    axios.get("https://play.hhplayer.com/hhjx/index.php?url="+requestParams)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}
function movieDecode(paramsObject) {
    // console.log("post请求参数为:",qs.stringify(paramsObject))
    var firstUrl="https://play.hhplayer.com/hhjx/index.php?url="+paramsObject.url;
    // console.log("firstUrl的值为:",firstUrl);
    var params = qs.stringify(paramsObject)
    return new Promise((resolve, reject) => {
      axios.post("https://play.hhplayer.com/hhjx/api.php",params, {
        headers: {
          'origin':'https://play.hhplayer.com',
          'content-type':'application/x-www-form-urlencoded; charset=UTF-8',
          'x-requested-with':'XMLHttpRequest',
          'referer':firstUrl
        }
      })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    })
  }
async function getMovieDecodeData(requestParams) {
  var paramsData = await getParams(requestParams);
  var paramContent =paramsData.data;
  var pattern = /(url\s\=\s\"\w+\")|(t\s\=\s\"\w+\")|(key\s\=\s\"\w+\")/gmi;
  var params=paramContent.match(pattern);
  var finalKey = params[2].split("=")[1].trim().replace(/\"/g,"");
  // console.log("params值为:",params);

  var paramsObject={
      url:params[0].split("=")[1].trim().replace(/\"/g,""),
      t:params[1].split("=")[1].trim().replace(/\"/g,""),
      key:finalKey,
      act:'0',
      play:'1'
  }
  // console.log("paramsObject为:",paramsObject);
  var finalResult = await movieDecode(paramsObject);
  
  return finalResult.data;
}
module.exports = getMovieDecodeData