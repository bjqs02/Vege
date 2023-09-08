var express = require("express");
var login = express.Router();
var db = require('../db')

var bodyParser = require("body-parser");
var jp = bodyParser.json();
var up = bodyParser.urlencoded({ extended: true });

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

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

login.post('/register', jp, async function (req, res) {
    var body = req.body;
    console.log(body.pwd);
    // var pwd = bcrypt.hashSync(body.pwd, 10);
    // console.log(pwd);

    const pwd = body.pwd;
    const salt = 10;

    bcrypt.hash(pwd, salt, function (err, hash) {
        if (err) {
            console.log(err);
        } else {
            // 'hash' contains the salted hash, including the salt
            console.log('Salted Hash:', hash);

            // Store 'hash' securely in your database
            var sql = "INSERT INTO `userLogin` (`Email`, `password`) VALUES (?,?);";
            var data = [body.email, hash];
            db.query(sql, data, function (err, fields) {
                if (err) {
                    console.log('註冊進資料庫失敗');
                    console.log(err);
                } else {
                    console.log('註冊成功放進資料庫');
                    console.log(fields);
                    res.send('OK');
                }
            });
        }
    });
})


login.get('/userlogin', function (req, res) {
    res.render('login');
})

login.post('/userlogin', jp, function (req, res) {
    var body = req.body;
    console.log(body);
    var sql1 = "Select * from userlogin where email = ?";
    var data = [body.email];
    db.query(sql1, data, function (err, fields) {
        if (err) {
            console.log('抓帳號失敗');
            console.log(err);
        } else {
            console.log(fields[0].password);
            const storedHash = fields[0].password; // Retrieve the stored salted hash from the database
            const enteredPassword = body.pwd;

            bcrypt.compare(enteredPassword, storedHash, function (err, result) {
                if (err) {
                    console.log(err)
                } else if (result) {
                    const payload = fields[0].uid;
                    var token = jwt.sign({'id':payload}, `${process.env.SECRET_KEY}`, {
                        expiresIn: 60*60*24
                      })
                    db.query("update userlogin set token = ? where email = ?; select * from userlogin where email = ?;", [token, body.email, body.email], function(err, result){
                        if(err){
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                    })
                } else {
                    res.send('登入失敗');
                }
            });

        }
    })
})

module.exports = login;