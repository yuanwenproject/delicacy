var pool = require('../db/base');
function search(sql){
    return new Promise((resolve,reject)=>{
		pool.getConnection(function(err, connection) {
		  // Use the connection
		  connection.query(sql, function(err, rows) {
		    // And done with the connection.
			if (err) {
			        reject(err)
			    }
			    resolve(rows)
		    connection.release();
		    // Don't use the connection here, it has been returned to the pool.
		  });
		});
    })
    
}
async function searchData(sql){
    var data= await search(sql);
    return data;
}

module.exports=searchData