var express = require("express");
var app = express();

var bp = require("body-parser");
var jp = bp.json();
var cp = require("cookie-parser");
app.use(cp());
var { login_render, login_api } = require("./middleware/auth_login");

app.set("view engine", "ejs");
require("dotenv").config();

// 首頁
app.use("/", express.static("lib"));
app.get("/", function (req, res) {
  res.render("home");
});
app.use("/home", express.static("lib"));
var home = require("./router/home");
app.use("/home", home);

// 登入
app.use("/login", express.static("lib"));
var login = require("./router/login");
app.use("/login", login);
// app.get('/login', function(req, res){
//     res.send('這是login數據');
// })

// 關於我們
app.use("/about", express.static("lib"));
var about = require("./router/about");
app.use("/about", about);
app.get("/about", function (req, res) {
  res.render("about");
});

// 診斷
app.use("/eval", express.static("lib"));
var evalu = require("./router/evaluation");
app.use("/eval", evalu);
app.get("/eval", function (req, res) {
  res.render("evaluation");
});

// 聯絡我們
app.use("/contact", express.static("lib"));
var contact = require("./router/contact");
app.use("/contact", contact);
app.get("/contact", function (req, res) {
  res.render("contact");
});

// 常見Q&A
app.use("/qna", express.static("lib"));
var qna = require("./router/qna");
app.use("/qna", qna);
app.get("/qna", function (req, res) {
  res.render("qna");
});

// 購物車
var cart_order = require("./router/cart_order");
const bodyParser = require("body-parser");
app.use("/", cart_order);
app.use("/cart", express.static("lib"));
app.get("/cart", login_render, function (req, res) {
  // console.log('middleware通過成功到購物車');
  res.render("cart");
});

// 產品資訊
app.use("/product", express.static("lib"));
var product = require("./router/product");
app.use("/product", product);
app.get("/product", function (req, res) {
  res.render("product");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", product);

// 結帳去(購買資訊輸入)
app.use("/order", express.static("lib"));
app.get("/order", login_render, function (req, res) {
  res.render("order");
});

// 確認訂單
app.use("/orderconfirm", express.static("lib"));
app.get("/orderconfirm", login_render, function (req, res) {
  res.render("orderconfirm");
});

// 送出訂單
app.use("/orderprocessing", express.static("lib"));
app.get("/orderprocessing", login_render, function (req, res) {
  res.render("orderprocessing");
});

// 完成訂單
app.use("/orderplaced", express.static("lib"));
app.get("/orderplaced", login_render, function (req, res) {
  res.render("orderplaced");
});
// 評價訂單
app.use("/rateorder", express.static("lib"));
app.get("/rateorder", login_render, function (req, res) {
  res.render("rateorder");
});

//blog
let blog = require('./router/blog.js');
let activityboard = require('./router/activityboard.js');
app.use('/blog',express.static('lib'));
app.use('/blog/page',express.static('lib'));
app.use('/blog/inside',express.static('lib'));
app.use('/blog/tag',express.static('lib'));
app.use('/blog/category',express.static('lib'));
app.use('/blog/search',express.static('lib'));
app.use('/blog/search1',express.static('lib'));
app.use('/activityboard',express.static('lib'));
app.use('/activityboard/category',express.static('lib'));
app.use('/activityboard/inside',express.static('lib'));
app.use('/blog', blog);
app.use('/activityboard', activityboard);






app.listen(2407, function () {
  console.log("----伺服器啟動OK " + new Date().toLocaleTimeString() + "----");
});
