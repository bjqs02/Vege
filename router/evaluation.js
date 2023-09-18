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
    "SELECT product.product, product.category, product.firm, info.season FROM product INNER JOIN info ON product.product = info.product WHERE (product.category = '蔬菜' OR product.category = '水果') AND (info.season = '9,10,11' OR info.season = '全年' or info.season = '12,1,2'or info.season = '3,4,5') AND product.category not in (?) and temp not in (?,?) and protein not in (?) and calories not in (?) order by rand() limit 6";

  var data = [body.product, body.hot, body.cold, body.protein, body.calories];
  db.query(sql, data, function (err, fields) {
    if (err) {
      console.log("QQ 沒讀到資料庫喔...");
      console.log(err);
    } else {
      console.log("成功讀取資料庫!!");
      console.log(fields);
      res.send(fields);
    }
    eval.get("/result", function (req, res) {
      res.send(fields);
    });
  });
});

module.exports = eval;
