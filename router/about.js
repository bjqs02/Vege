var express = require("express");
var about = express.Router();
var db = require('../db')

about.get('/', function(req, res){
    var sql1 = "select * from farmer";
    db.query(sql1, function (err, rows) {
        if (err) {
            console.log("----抓小農資料失敗----");
            console.log(err);
        } else {
            console.log("----抓小農資料成功----");          
        }
        res.render('about', {
            data: rows
        });
    })
})

about.get('/sgs', function(req, res){
    var sql1 = "select date_format(sgsDate, '%Y-%c-%d') as date,origin, item from sgs order by sgsDate desc";
    db.query(sql1, function (err, rows) {
        if (err) {
            console.log("----抓小農資料失敗----");
            console.log(err);
        } else {
            console.log("----抓小農資料成功----");          
        }
        res.send(rows);
    })
})

module.exports = about;