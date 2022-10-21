/*
 * @Description: 
 * @Author: 袁文
 * @Date: 2021-10-23 19:11:10
 * @LastEditTime: 2021-10-24 16:20:57
 * @LastEditors: 袁文
 */

var axios =require('axios');
function wallPaperData(requestParams){
    return new Promise((resolve,reject)=>{
      axios.get(`http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&`+requestParams)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    })
}
async function getwallPaperData(requestParams){
  var robortText=await wallPaperData(requestParams);
  // console.log('响应字段为',robortText.data);
  return robortText.data;
}
module.exports= getwallPaperData