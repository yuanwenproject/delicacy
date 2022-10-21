var pool = require('../db/base');
function update(sql) {
	return new Promise((resolve,reject)=>{
		pool.getConnection(function(err, connection) {
		  // Use the connection
		  connection.query(sql, function(err, rows) {
		    // And done with the connection.
			if (err) {
				console.log('更新失败,错误为 - ', err.message);
				reject(err);
			}else{
				console.log("更新成功");
				resolve(rows)
			}
		    connection.release();
		    // Don't use the connection here, it has been returned to the pool.
		  });
		});
	})
}
async function updateData(sql){
    var data= await update(sql); 
    return data;
}
module.exports = updateData
