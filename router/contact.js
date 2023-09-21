var express = require("express");
var contact = express.Router();
var db = require('../db')

var bodyParser = require("body-parser");
var jp = bodyParser.json();
// var up = bodyParser.urlencoded({extended: true});
var nodemailer = require("nodemailer");

contact.post('/', jp, function(req, res){
    var body = req.body;
    console.log("--------1213--------");
    console.log(req.body);
    var sql = "INSERT INTO `contactForm` (`Name`, `Tel`, `Email`, `Subject`, `Msg`) VALUES (?, ?, ?, ?, ?);";
    var data = [body.name, body.tel, body.mail, body.subject, body.message];
    db.query(sql, data, async function(err, fields) {
        if (err) {
            console.log("QQ 沒放進資料庫喔...");
            console.log(err);
        } else {
            console.log("成功放進資料庫!!");
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.GMAIL_USER,
                  pass: process.env.GMAIL_PASS,
                },
              });
            
              await transporter.verify();
              var mailOptions = {
                from: process.env.GMAIL_USER,
                to: 'moon.yuezhen@gmail.com',
                subject: `Vege果蔬已收到您的最新訊息！`,
                html: `
                    <h4>親愛的${body.name}，感謝您聯絡我們！</h4>
                    <p>我們已收到您的訊息，您的訊息如下:</p>
                    <br>
                    <p>主旨: ${body.subject}</p>
                    <p>內容: ${body.message}</p>
                    <br>
                    <p>我們將盡速回覆您!
                    <p style="color: #6f522c"> Vege 果蔬團隊 敬上 </p>
                    `,
              };
            
              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.error(err);
                  res.status(500).send("Error sending email");
                } else {
                  console.log("success:", info.envelope);
                  res.send("Email sent");
                }
              });
            res.json(fields);
        }
    })
})


module.exports = contact;