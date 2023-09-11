var express = require("express");
var app = express();

var bp = require('body-parser');
var jp = bp.json();
var cp = require('cookie-parser');
app.use(cp());
var {login_render, login_api } = require('./middleware/auth_login');


app.set('view engine', 'ejs');
require('dotenv').config();



// 首頁
app.use('/', express.static('lib'));
app.get("/", function (req, res) {
    res.render('home');
})

// 登入
app.use('/login', express.static('lib'));
var login = require('./router/login');
app.use('/login', login);
// app.get('/login', function(req, res){
//     res.send('這是login數據');
// })

// 關於我們
app.use('/about', express.static('lib'));
var about = require('./router/about');
app.use('/about', about);
app.get('/about', function(req, res){
    res.render('about');
})

// 診斷
app.use('/eval', express.static('lib'));
var evalu = require('./router/evaluation');
app.use('/eval', evalu);
app.get('/eval', function(req, res){
    res.render('evaluation');
})


// 聯絡我們
app.use('/contact', express.static('lib'));
var contact = require('./router/contact');
app.use('/contact', contact);
app.get('/contact', function(req, res){
    res.render('contact');
})

// 常見Q&A
app.use('/qna', express.static('lib'));
var qna = require('./router/qna');
app.use('/qna', qna);
app.get('/qna', function(req, res){
    res.render('qna');
})

// 購物車
var cart_order = require('./router/cart_order');
const bodyParser = require("body-parser");
app.use('/', cart_order);
app.use('/cart', express.static('lib'));
app.get("/cart", login_render, function (req, res) {
    // console.log('middleware通過成功到購物車');
    res.render('cart');
})

// 結帳去(購買資訊輸入)
app.use('/order', express.static('lib'));
app.get("/order", function (req, res) {
    res.render('order');
})

// 確認訂單
app.use('/orderconfirm', express.static('lib'));
app.get("/orderconfirm", function (req, res) {
    res.render('orderconfirm');
})

// 送出訂單
app.use('/orderprocessing', express.static('lib'));
app.get("/orderprocessing", function (req, res) {
    res.render('orderprocessing');
})

// 完成訂單
app.use('/orderplaced', express.static('lib'));
app.get("/orderplaced", function (req, res) {
    res.render('orderplaced');
})
// 評價訂單
app.use('/rateorder', express.static('lib'));
app.get("/rateorder", function (req, res) {
    res.render('rateorder');
})


app.listen(2407, function () {
    console.log("----伺服器啟動OK " + new Date().toLocaleTimeString() + "----");
})