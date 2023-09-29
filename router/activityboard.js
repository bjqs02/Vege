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
});

// 後臺抓所有活動資料
activity.get('/all', function(req, res){
    var sql = `SELECT actid, actTitle, actImg, date_format(acttime, '%Y-%c-%d') as acttime, actText, actCat from activityboard order by acttime desc;`;
    db.query(sql, function(err, data){
        if(err){
            console.log('抓活動資料失敗');
            console.log(err);
        } else {
            console.log('抓活動資料成功');
            console.log(data);
            res.send(data);
        }
    })
})

// 後臺抓單一活動資料
activity.get('/:id', function(req, res){
    var sql = `SELECT actid, actTitle, actImg, date_format(acttime, '%Y-%c-%d') as acttime, actText, actCat from activityboard where actid = ?;`;
    var data = [req.params.id];
    console.log(req.params.id);
    db.query(sql, data, function(err, data){
        if(err){
            console.log('抓取單一活動失敗');
            console.log(err);
        } else {
            console.log('抓取單一活動成功');
            console.log(data);
            res.send(data);
        }
    })
})

//文章內頁
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
});

//文章分類
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
});

//抽獎功能
activity.post('/spanValue', jp, function(req, res){
    var spanValue = req.body.spanValue;
    var uid = req.body.uid;
    console.log(req.body.uid)
    const sql = 
    `INSERT INTO activitylotto(uid, lottobonus) VALUES (${uid}, ${spanValue});`
    db.query(sql, function(err, tags){
        if(err){
            console.log('value失敗');
            console.log(err);
        } else {
            console.log('value成功');
            console.log(tags);
            
        }
    })
})

// 後台新增活動
activity.put('/new', jp, function(req, res){
    console.log(req.body.aTitle);
    var data = [req.body.aTitle, req.body.aImg, req.body.aContent, parseInt(req.body.aType)];
    var sql =  `insert into activityboard (actTitle, actImg, actText, actCat) values (?, ?, ?, ?);`;
    db.query(sql, data, function(err, row){
        if(err){
            console.log('新增活動失敗');
            console.log(err);
        } else {
            console.log('新增活動成功');
            console.log(res);
            res.send(JSON.stringify(req.body));
        }
    })
})

// 後臺更新活動資料
activity.put('/edit', jp, function(req, res){
    const actid = parseInt(req.body.actid);
    const actTitle = req.body.actTitle;
    const actText = req.body.actText;
    const actCat = parseInt(req.body.actCat);
    const sql = `UPDATE activityboard SET actTitle=?, actText =?, actCat=? WHERE actid = ?;`
    const data = [actTitle, actText, actCat, actid];
    db.query(sql, data, function(err, rows){
        if(err){
            console.log('更新活動失敗')
            console.log(err)
        } else {
            console.log('更新活動成功')
            console.log(rows)
            res.send(JSON.stringify(req.body));
        }
    })
})

// 後臺刪除活動資料
activity.delete('/delete/:id', jp, function(req, res){
    var data = [req.params.id];
    console.log(data);
    var sql = `delete from activityboard where actid = ?;`;
    db.query(sql, data, function(err, scss){
        if(err){
            console.log('刪除活動失敗');
            console.log(err);
        } else {
            console.log('刪除活動成功');
            console.log(scss);
            res.send(JSON.stringify(req.body));
        }
    }) 
})


module.exports = activity;