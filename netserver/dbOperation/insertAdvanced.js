var pool = require('../db/base');
function insert(sql,values) {
	console.log('插入数据为:',values);
	return new Promise((resolve,reject)=>{
		pool.getConnection(function(err, connection) {
		  // Use the connection
		  connection.query(sql, [values], function(err, rows) {
		    // And done with the connection.
			if (err) {
				console.log('插入失败,错误为 - ', err.message);
				reject(err);
			}else{
				console.log("插入成功");
				resolve(rows)
			}
		    connection.release();
		    // Don't use the connection here, it has been returned to the pool.
		  });
		});
	})
}
async function insertData(sql,values){
    var data= await insert(sql,values); 
    return data;
}
module.exports = insertData
