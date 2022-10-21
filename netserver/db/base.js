
var mysql = require('mysql');
let connectBase={
      host     : 'localhost',
      user     : 'root',
      password : '123456',
      database : 'delicacy'
}
let connection=mysql.createPool(connectBase)
module.exports= connection