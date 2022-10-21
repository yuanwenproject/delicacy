/*
 * @Description: 
 * @Author: 袁文
 * @Date: 2021-10-10 20:27:08
 * @LastEditTime: 2021-10-13 09:32:33
 * @LastEditors: 袁文
 */
var pool = require('../db/base');
function deleteData(sql) {
	return new Promise((resolve,reject)=>{
		pool.getConnection(function(err, connection) {
		  // Use the connection
		  connection.query(sql, function(err, rows) {
		    // And done with the connection.
			if (err) {
				console.log('删除失败,错误为 - ', err.message);
				reject(err);
			}else{
				console.log("删除成功");
				resolve(rows)
			}
		    connection.release();
		    // Don't use the connection here, it has been returned to the pool.
		  });
		});
	})
}
async function deleteResult(sql){
    var data= await deleteData(sql); 
    return data;
}
module.exports = deleteResult
