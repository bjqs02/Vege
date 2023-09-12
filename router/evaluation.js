var express = require("express");
var eval = express.Router();
var db = require("../db");

var bodyParser = require("body-parser");
var jp = bodyParser.json();
// var up = bodyParser.urlencoded({extended: true});

eval.post("/result", jp, function (req, res) {
  var body = req.body;
  console.log("--------1213--------");
  console.log(body);
  var sql =
    "select * from produces where type not in (?) and temp not in (?,?) and protein not in (?) and calories not in (?) order by rand() limit 6;";
  //
  var data = [body.product, body.hot, body.cold, body.protein, body.calories];
  db.query(sql, data, function (err, fields) {
    if (err) {
      console.log("QQ 沒獨到資料庫喔...");
      console.log(err);
    } else {
      console.log("成功讀取資料庫!!");
      console.log(fields);
    }
    eval.get("/result", function (req, res) {
      res.send(fields);
    });
  });
});

module.exports = eval;
