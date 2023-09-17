var express = require("express");
var bodyParser = require("body-parser");
// var dayjs = require('dayjs');
var member = express.Router();
var db = require("../db");

// 解析客戶端POST的資料
member.use(bodyParser.json());
member.use(bodyParser.urlencoded({ extended: true }));

// 基本資料
member.get("/basicInfo", function (req, res) {
  res.render("m_basicInfo");
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
