var express = require("express");
var qna = express.Router();
var db = require('../db')


qna.get('/', function(req, res){
    var sql1 = "select * from qa";
    db.query(sql1, function (err, data) {
        if (err) {
            console.log("----抓問答資料失敗----");
            console.log(err);
        } else {
            console.log("----抓問答資料成功----");          
        }
        res.render('qna', {
            data: data
        });
    })
})

module.exports = qna;