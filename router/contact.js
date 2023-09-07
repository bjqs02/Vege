var express = require("express");
var contact = express.Router();
var db = require('../db')

var bodyParser = require("body-parser");
var jp = bodyParser.json();
// var up = bodyParser.urlencoded({extended: true});

contact.post('/', jp, function(req, res){
    var body = req.body;
    console.log("--------1213--------");
    console.log(req.body);
    var sql = "INSERT INTO `contactForm` (`Name`, `Tel`, `Email`, `Subject`, `Msg`) VALUES (?, ?, ?, ?, ?);";
    var data = [body.name, body.tel, body.mail, body.subject, body.message];
    db.query(sql, data, function(err, fields) {
        if (err) {
            console.log("QQ 沒放進資料庫喔...")
        } else {
            console.log("成功放進資料庫!!");
        }
    })
})

module.exports = contact;