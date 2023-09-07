var express = require("express");
var app = express();

app.set('view engine', 'ejs');

// 首頁
app.use('/', express.static('lib'));
app.get("/", function (req, res) {
    res.render('home');
})

// 關於我們
app.use('/about', express.static('lib'));
var about = require('./router/about');
app.use('/about', about);
app.get('/about', function(req, res){
    res.render('about');
})

// 診斷
app.use('/eval', express.static('lib'));
var eval = require('./router/evaluation');
app.use('/eval', eval);
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



app.listen(2407, function () {
    console.log("----伺服器啟動OK " + new Date().toLocaleTimeString() + "----");
})