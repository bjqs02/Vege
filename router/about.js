var express = require("express");
var about = express.Router();
var db = require('../db')
var bp = require('body-parser');
var jp = bp.json();

about.get('/', function(req, res){
    var sql1 = "select * from farmer";
    db.query(sql1, function (err, rows) {
        if (err) {
            console.log("----抓小農資料失敗----");
            console.log(err);
        } else {
            console.log("----抓小農資料成功----");          
        }
        res.render('about', {
            data: rows
        });
    })
})

about.get('/farmers', function(req, res){
    var sql = "select * from farmer;";
    db.query(sql, function(err, data){
        if(err) {
            console.log('/farmers抓資料失敗');
            console.log(err);
        } else {
            console.log('/farmers抓資料成功');
            res.send(data);
        }
    })
})

about.get('/farmer/:id', function(req, res){
    var sql = "Select * from farmer where fId = ?;";
    var data = [req.params.id];
    db.query(sql, data, function(err, farmer){
        if(err){
            console.log('/farmer/id抓失敗');
            console.log(err);
        } else {
            console.log('/farmer/id抓成功');
            res.send(farmer);
        }
    })
})

about.put('/farmer/edit', jp, function(req, res){
    // console.log(req.body);
    var sql = "update farmer set fName = ?, fArea = ?, vegeType = ? where fId = ?;";
    data = [req.body.fName, req.body.fArea, req.body.vegeType, req.body.fId];
    db.query(sql, data, function(err, rows){
        res.send( JSON.stringify(req.body) );
    })
})

about.delete('/farmer/delete', jp, function(req, res){
    // console.log(req.body);
    var sql = "delete from farmer where fId = ?;";
    data = [req.body.fId];
    db.query(sql, data, function(err, rows){
        res.send( JSON.stringify(req.body) );
    })
})

about.put('/farmer/new', jp, function(req, res){
    // console.log(req.body);
    var sql = "insert into farmer (fName, fArea, fImg, vegeType) values ( ?, ?, '', ? )";
    data = [req.body.fName, req.body.fArea, req.body.vegeType];
    db.query(sql, data, function(err, rows){
        res.send( JSON.stringify(req.body) );
    })
})

about.get('/sgs', function(req, res){
    var sql1 = "select date_format(sgsDate, '%Y-%c-%d') as date,origin, item, sgsId from sgs order by sgsDate desc";
    db.query(sql1, function (err, rows) {
        if (err) {
            console.log("----抓小農資料失敗----");
            console.log(err);
        } else {
            console.log("----抓小農資料成功----");          
        }
        res.send(rows);
    })
})

module.exports = about;