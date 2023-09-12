var express = require("express");
var home = express.Router();
var db = require('../db')

var bodyParser = require("body-parser");
var jp = bodyParser.json();

home.get('/homeProduct', function(req, res){
    var sql1 = "SELECT * FROM `product_content` WHERE product like '%箱';";
    db.query(sql1, function (err, rows) {
        if (err) {
            console.log("----首頁抓產品資料失敗----");
            console.log(err);
        } else {
            console.log("----首頁抓產品資料成功----");          
        }
        res.send(rows);
    })
})

home.get('/homeRates', function(req, res){
    var sql1 = "SELECT * FROM rateorder, userinfo, vgorder where rateorder.oid = vgorder.oid and userinfo.uId = vgorder.uid order by rand();";
    db.query(sql1, function (err, rows) {
        if (err) {
            console.log("----首頁抓評論資料失敗----");
            console.log(err);
        } else {
            console.log("----首頁抓評論資料成功----");          
        }
        res.send(rows);
    })
})

module.exports = home;