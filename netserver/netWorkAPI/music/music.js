/*
 * @Description: 
 * @Author: 袁文
 * @Date: 2021-10-23 19:18:44
 * @LastEditTime: 2021-10-27 20:38:32
 * @LastEditors: 袁文
 */
var axios = require('axios');
function musicData(requestParams) {
  // console.log("音乐数据请求参数为:",requestParams)
  return new Promise((resolve, reject) => {
    axios.post("https://music.sonimei.cn/", requestParams, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'origin':'https://music.sonimei.cn',
          'x-requested-with':'XMLHttpRequest',
          
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
async function getMusic(requestParams) {
  var musicalData = await musicData(requestParams);
  // console.log('响应字段为',robortText.data);
  return musicalData.data;
}
module.exports = getMusic