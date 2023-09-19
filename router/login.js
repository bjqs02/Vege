var express = require("express");
var login = express.Router();
var db = require('../db');
var {login_render, login_api } = require('../middleware/auth_login');

var bodyParser = require("body-parser");
var jp = bodyParser.json();
// var up = bodyParser.urlencoded({ extended: true });

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var bluebird = require('bluebird');
bluebird.promisifyAll(db);

login.post('/checkmail', jp, function (req, res) {
    var body = req.body;
    console.log("--------1215--------");
    console.log(req.body);
    var sql = "Select * from userlogin where Email = ?;";
    var data = [body.mail];
    db.query(sql, data, function (err, fields) {
        if (err) {
            console.log("QQ 沒讀到資料庫喔...")
        } else {
            console.log("成功讀到資料庫!!");
        }
        res.send(fields);
    })
})

login.get('/register', function (req, res) {
    res.render('register');
})

login.get('/user/:id', function(req, res){
    db.query('select * from userinfo where uid = ?', [req.params.id], function(err, userinfo){
        if(err) {
            console.log('抓用戶資料失敗');
            console.log(err);
        } else {
            console.log('抓用戶資料成功');
            res.json(userinfo[0]);
        }
    })
})

login.post('/register', jp, async function (req, res) {
    var body = req.body;
     
    // 這個是客戶提供的密碼 將他加鹽hash之後放進資料庫
    const pwd = body.pwd;
    const salt = 10;
    bcrypt.hash(pwd, salt, function (err, hash) {
        if (err) {
            console.log(err); // hash失敗
        } else {

            // hash 成功
            var sql1 = "INSERT INTO `userLogin` (`Email`, `password`) VALUES (?,?);";
            var sql2 = "SELECT * FROM userlogin where Email = ?;";
            var sql3 = "INSERT INTO `userinfo` (`uID`, `Email`) VALUES (?,?);";
            var sql4 = "SELECT * FROM userinfo where Email = ?;";
            var data = [body.email, hash, body.email];
            db.queryAsync(sql1, data)
                .then(function (dataA) {
                    console.log('sql1跑成功');
                    return db.queryAsync(sql2, [body.email]);
                }).then(function (dataB) {
                    console.log('sql2跑成功');
                    return db.queryAsync(sql3, [dataB[0].uID, dataB[0].Email]);
                }).then(function (dataC) {
                    console.log('sql3跑成功');
                    return db.queryAsync(sql4, [body.email]);
                }).then(function (dataD) {
                    console.log('sql4跑成功');
                    res.json(dataD);
                })
        }
    });
})


login.get('/userlogin', function (req, res) {
    res.render('login');
})

login.post('/userlogin', jp, async function (req, res) {
    var body = req.body;
    var sql1 = "Select * from userlogin where email = ?";
    var sql2 = "update userlogin set token = ? where email = ?;";
    var sql3 = "SELECT * FROM userlogin, userinfo where userlogin.email = userinfo.Email and userlogin.Email = ?;"
    var data = [body.email];

    try {
        // 抓userlogin資料
        const resultA = await db.queryAsync(sql1, data);
        console.log('login sql1 success');

        // password 儲存 密碼進行compare比對後的結果(true|false)
        // 將userlogin裡的密碼跟 使用者輸入的密碼進行比對
        const passwordMatch = await new Promise((resolve, reject) => {
            bcrypt.compare(body.pwd, resultA[0].password, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // 密碼比對是匹配的 做以下的事情
        if (passwordMatch) {
            const payload = resultA[0].uid;
            var token = jwt.sign({ 'id': payload }, `${process.env.SECRET_KEY}`, { expiresIn: 60 * 60 * 24 });

            await db.queryAsync(sql2, [token, body.email]);
            console.log('Token updated in the database');

            const resultC = await db.queryAsync(sql3, [body.email]);
            console.log('login sql3 success');
            console.log(resultC[0]);

            res.status(200).json({
                status: 'success',
                data: {
                    id: resultC[0].uID,
                    name: resultC[0].Name,
                    token: resultC[0].token,
                    img: resultC[0].Img,
                    email: resultC[0].Email,
                    gender: resultC[0].Gender,
                    phone: resultC[0].Phone
                }
            });
            console.log('登入回傳成功');
        } else {
            // Handle invalid password
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle errors and send an appropriate response
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});


login.post('/logout', jp, login_api, function(req, res){
    console.log('成功到登出功能');
    var sql1 = "update userlogin set token = null where uID = ?;"
    var data = [req.body.id];
    db.query(sql1, data, function(){
        res.send('logout ok');
    })
})

module.exports = login;