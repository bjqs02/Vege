var express = require("express");
app = express();
var activity = express.Router();
var db = require('../db');
var bp = require('body-parser');
var jp = bp.json();

activity.get('/', function(req, res){
    var sql1 = "select * from activityboard;"
    db.query(sql1, function(err, data){
        if(err){
            console.log('資料失敗');
            console.log(err);
        } else {
            console.log('資料抓成功');
            res.render('activityboard',{
                data: data
            });
        }
    })
})
activity.get('/inside/:id', function(req, res){
    var act_id = req.params.id;
    var sql1 = "select * from activityboard WHERE actid = ?;"
    db.query(sql1, act_id, function(err, act){
        if(err){
            console.log('活動失敗');
            console.log(err);
        } else {
            console.log('活動成功');
            res.render('activityboard_inside',{
                data: act
            });
        }
    })
})


activity.get('/category/:id', function(req, res){
    var sql3 = "SELECT * FROM activityboard WHERE actCat = ?;"
    var data = [req.params.id];
    db.query(sql3, data, function(err, tags){
        if(err){
            console.log('category沒抓成功');
            console.log(err);
        } else {
            console.log('category抓成功');
            // res.json(tags);
            res.render('activityboard',{
                data: tags,
            })
        }
    })
})

activity.post('/spanValue', jp, function(req, res){
    var sql6 = req.body.spanValue;
    const sql =
    `INSERT INTO activitylotto(uid, lottobonus) VALUES (1001, ${sql6});`
    db.query(sql, function(err, tags){
        if(err){
            console.log('value失敗');
            console.log(err);
        } else {
            console.log('value成功');
            console.log(tags);
            // res.send('blog')
        }
    })
})








module.exports = activity;