var express = require("express");
var bodyParser = require("body-parser");
var dayjs = require("dayjs");
var member = express.Router();
var db = require("../db");

// 解析客戶端POST的資料
member.use(bodyParser.json());
member.use(bodyParser.urlencoded({ extended: true }));

// 讀取-基本資料
member.use("/basicInfo/", express.static("lib"));
member.get("/basicInfo/:id", function (req, res) {
  var sqlInfo = `SELECT *,SUBSTRING(Name, 1, 1) as firstN, SUBSTRING(Name, 2, 2) as lastN FROM userinfo where uId = ?;`;
  db.query(sqlInfo, [req.params.id], function (err, basicInfo) {
    if (basicInfo[0]) {
      console.log("這位顧客已有基本資料了鴨");
      var bDate = dayjs(basicInfo[0].Birthday).format("YYYY-MM-DD");
      res.render("m_basicInfo", {
        dataInfo: basicInfo,
        Birthday: bDate,
      });
    }
  });
});

// 修改-基本資料
member.post("/basicInfo/edit", function (req, res) {
  var editInfo = `UPDATE userinfo SET Name = ?, Birthday = ?, Gender = ?, Phone = ?, carrier = ? where Email = ?;`;
  var newdata = [
    req.body.Name,
    req.body.Birthday,
    req.body.Gender,
    req.body.Phone,
    req.body.carrier,
    req.body.Email,
  ];
  db.query(editInfo, newdata, function (err, newInfo) {
    if (err) {
      console.log("沒有資料可以更新喔");
    } else {
      console.log("更新資料了鴨");
      res.send(JSON.stringify(req.body));
    }
  });
});

member.get("/myCards", function (req, res) {
  res.render("m_mycards");
});

member.get("/address", function (req, res) {
  res.render("m_address");
});

member.get("/order", function (req, res) {
  res.render("m_order");
});

member.get("/bonus", function (req, res) {
  res.render("m_bonus");
});

member.get("/article", function (req, res) {
  res.render("m_article");
});

module.exports = member;
