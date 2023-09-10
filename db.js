var mysql = require("mysql");
var db = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: 'Vege'
});
db.connect(function (err) {
    if (err) {
        console.log("----資料庫連線錯誤----");
    } else {
        console.log("----資料庫連線成功----");
    }
});

module.exports = db;