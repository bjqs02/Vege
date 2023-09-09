var express = require("express");
var app = express();


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


// 以下為忽忽的路由(陸續整理中)
// 購物車相關資料庫指令
var db = require('./db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var bodyParser = require("body-parser");
var jp = bodyParser.json();

// 讀取個別會員購物車
app.get('/cart/item/:id', function (req, res) {
    var sql1 = "SELECT * FROM temp_product join cart WHERE cart.pid = temp_product.pid and  cart.uid = ? and cart.c_status = 'active'";
    db.query(sql1, [req.params.id], function (err, rows) {
        res.send( rows );
    })
})

// 讀取會員願望清單
app.get('/cart/wishlist/:id', function (req, res) {
    var sql2 = "SELECT pname, price, pic FROM userinfo, wishlist, temp_product WHERE userinfo.uId = wishlist.uid AND wishlist.pid = temp_product.pid AND userinfo.uId = ? GROUP BY pname"
    db.query(sql2, [req.params.id], function (err, rows) {
        res.send( rows );
    })
})

// 更新購物車 cart 資料表 的 pid (尚未完成)
app.put("/cart/item/:id", function (req, res) {
    var sql3 = "update cart set pid= ? where uid = ? and pid = ?"
    db.query(sql3, 
        [req.body.newPid, req.body.uid, req.body.pid],
        function (err, rows) {
            res.send( JSON.stringify( req.body ));
        }
    )

})

// 更新購物車 cart 資料表 的 oid || statue => inactive
app.patch("/editcart/status/", function (req, res) {
    var sql3 = "update cart set oid= ?, c_status = 'inactive'  where uid = ? and c_status = 'active'"
    db.query(sql3, 
        [req.body.oid, req.body.uid],
        function (err, rows) {
            res.send( JSON.stringify( req.body ));
        }
    )

})

// 建立訂購單 oid || uid 
app.post("/editcart/createorder/", function (req, res) {
    var sql3 = "INSERT INTO vgorder (oid, uid) VALUES (? , ?)"
    db.query(sql3, 
        [req.body.oid, req.body.uid],
        function (err, rows) {
            res.send( JSON.stringify( req.body ));
        }
    )

})

// 讀取訂購單資訊
app.get('/order/items/:id', function (req, res) {
    var sql4 = "SELECT * FROM vgorder join cart join temp_product WHERE vgorder.oid = cart.oid and cart.pid = temp_product.pid and vgorder.uid = ? and vgorder.o_status = 'active';" 
    db.query(sql4, [req.params.id], function (err, rows) {
        res.send( rows );
    })
})


// 更新購物車 cart 資料表 的 oid || statue => active
app.patch("/editcart/statusactive/", function (req, res) {
    var sql5 = "update cart set oid= '' , c_status = 'active'  where oid = ? "
    db.query(sql5, 
        [req.body.oid, req.body.uid],
        function (err, rows) {
            res.send( JSON.stringify( req.body ));
        }
    )
})

// 刪除本筆訂單
app.delete("/order/delete/:oid", function (req, res) {
    db.query("DELETE FROM vgorder WHERE oid = ?",
        [req.params.oid], 
        function (err, rows) {
            res.send("#" + req.params.oid + " deleted");
        }
    )
})

// 更新訂單 vgorder 資料表 的 使用者輸入資訊
app.patch("/editorder/details/:oid", function (req, res) {
    var sql6 = "UPDATE vgorder SET oName= ? ,oTel= ? ,oMail= ? ,rName= ? ,rTel= ? ,rAddr= ? ,convName= ? ,convTel= ? ,convStore= ? ,payment= ? ,transName= ? ,transNum= ? ,transDate= ? ,creditName= ? ,creditNum= ? ,creditMM= ? ,creditYY= ? ,creditCSV= ? ,billDonate= ? ,billPersonal= ? ,billCompName= ? ,billCompNum= ? ,billCompAddr= ? ,o_note= ? WHERE oid = ? "
    db.query(sql6, 
        [req.body.oName, req.body.oTel, req.body.oMail, req.body.rName, req.body.rTel, req.body.rAddr, req.body.convName, req.body.convTel, req.body.convStore, req.body.payment, req.body.transName, req.body.transNum, req.body.transDate, req.body.creditName, req.body.creditNum, req.body.creditMM, req.body.creditYY, req.body.creditCSV, req.body.billBonate, req.body.billPersonal, req.body.billCompName, req.body.billCompNum, req.body.billCompAddr, req.body.o_note, req.body.oid],
        function (err, rows) {
            res.send( JSON.stringify( req.body ));
        }
    )
})

// 更新 vgorder 資料表 的 o_statue => inactive 與 o_updatetime
app.patch("/editorder/statusinactive/", function (req, res) {
    var sql7 = "update vgorder set o_status = 'inactive', o_updatetime = ? where oid = ? "
    db.query(sql7, 
        [req.body.o_updatetime, req.body.oid],
        function (err, rows) {
            res.send( JSON.stringify( req.body ));
        }
    )
})

// 讀取訂購單資訊 (最新且o_status = inactive)
app.get('/order/list/:id', function (req, res) {
    var sql8 = "SELECT * FROM vgorder WHERE vgorder.uid = ? and vgorder.o_status = 'inactive' ORDER BY o_updatetime DESC LIMIT 1;" 
    db.query(sql8, [req.params.id], function (err, rows) {
        res.send( rows );
    })
})

// 更新願望清單 (未完成)



// 購物車
app.use('/cart', express.static('lib'));
app.get("/cart", function (req, res) {
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

// 以上為忽忽的路由(陸續整理中)


app.listen(2407, function () {
    console.log("----伺服器啟動OK " + new Date().toLocaleTimeString() + "----");
})