var express = require("express");
app = express();
var blog = express.Router();
var db = require('../db');
var bp = require('body-parser');
var jp = bp.json();


//分頁
blog.get('/page/:page([0-9]+)', function(req, res){
    var myPage = req.params.page;
    if (myPage <= 0) {
        res.redirect('/page/1');
    }
    var eachPage = 6;
    var offset = (myPage -1) * eachPage;

    db.query(`SELECT * FROM article LIMIT ${offset}, ${eachPage}`,
    function(err,rows){
    if (err) {
        console.log('喬巴:分頁sql執行錯誤====')
        console.log(err)
    }else{
        console.log('喬巴:分頁sql執行ok====')
        console.log(rows)
    }

   db.query(`SELECT count(*) as zoo FROM article`, function(err, totalRecord){
    if (err) {
        console.log('有錯')
        console.log(err)
    }else{
        console.log('我正在看總筆數')
        console.log(totalRecord[0].zoo);

        var last_page = Math.ceil(totalRecord[0].zoo / eachPage);
        if(myPage> last_page){
            res.redirect(`/page/${last_page}`);
        }

        res.render('blog',{
            data: rows,
            curr_page: myPage,
            next_page: `${parseInt(myPage)+1}`,
            total_nums: totalRecord[0].zoo,
            last_page: last_page
        })
    }
   })
});

})



//tag
blog.get('/tags', function(req, res){
    var sql1 = "select * from tag;"
    db.query(sql1, function(err, tags){
        if(err){
            console.log('資料沒抓成功');
            console.log(err);
        } else {
            console.log('資料抓成功');
            // console.log(tags);
            res.json(tags);
        }
    })
})

//tag標籤
blog.get('/tag/:id', function(req, res){
    var art_id2 = req.params.id;
    var sql3 = "SELECT * FROM tag, atcxtag, article WHERE tag.tagid = atcxtag.tagid AND atcxtag.atcid = article.atcid AND tag.tagid = ?;"
    var data = [req.params.id];
    db.query(sql3, data, function(err, tags){
        if(err){
            console.log('tagid沒抓成功');
            console.log(err);
        } else {
            console.log('tagid抓成功');
            // res.json(tags);
            res.render('blog',{
                data: tags,
                curr_page: 1,
                next_page: 2,
                total_nums: 2,
                last_page: 1
            })
        }
    })
})



blog.get('/category/:id', function(req, res){
    var art_id2 = req.params.id;
    var sql3 = "SELECT * FROM article WHERE atcCat = ?;"
    var data = [req.params.id];
    db.query(sql3, data, function(err, tags){
        if(err){
            console.log('category沒抓成功');
            console.log(err);
        } else {
            console.log('category抓成功');
            // res.json(tags);
            res.render('blog',{
                data: tags,
                curr_page: 1,
                next_page: 2,
                total_nums: 2,
                last_page: 1
            })
        }
    })
})

blog.post('/search', jp, function(req, res){
    var sql6 = req.body.search;
    // var data = [req.body.search];
    // console.log(req.body);
    db.query(sql6, function(err, tags){
        if(err){
            console.log('search沒抓成功');
            console.log(err);
        } else {
            console.log('search抓成功');
            console.log(tags);
            res.render('blog',{
                data: tags,
                curr_page: 1,
                next_page: 2,
                total_nums: 2,
                last_page: 1
            })
        }
    })
})


blog.get('/inside/:id', function(req, res){
    var art_id = req.params.id;
    var sql2 = "SELECT * FROM article WHERE atcid = ?;";
    var sql4 = "SELECT * FROM article, atcxtag, tag WHERE article.atcid = atcxtag.atcid AND atcxtag.tagid = tag.tagid AND article.atcid = ?;";
    var sql7 = "SELECT * FROM comment WHERE atcid = ?;"; // 修改此处查询语句

    // 第一次查询
    db.query(sql2, [art_id], function(err, result1){
        if(err){
            console.log('抓文章失敗');
            console.log(err);
        } else {
            // 第二次查询
            db.query(sql4, [art_id], function(err, result2){
                if(err){
                    console.log('抓取文章標籤失敗');
                    console.log(err);
                } else {
                    // 第三次查询
                    db.query(sql7, [art_id], function(err, result3){
                        if(err){
                            console.log('抓取评论失败');
                            console.log(err);
                        } else {
                            console.log(result1);
                            console.log(result2);
                            console.log(result3);
                            res.render('blog_inside',{
                                data: {
                                    article: result1,
                                    tags: result2,
                                    comments: result3
                                },
                            });
                        }
                    });
                }
            });
        }
    });
});


// insidecommentpost
blog.post('/postcom', jp, function(req, res){
    var sql6 = req.body.postcom;
    const sql =
    `INSERT INTO comment(uid, atcid, cmtText) VALUES (1001, ${sql6});`
    db.query(sql6, function(err, tags){
        if(err){
            console.log('post沒抓成功');
            console.log(err);
        } else {
            console.log('post抓成功');
            console.log(tags);

        }
    })
})






module.exports = blog;
