var express = require("express");
app = express();
var blog = express.Router();
var db = require('../db');
var bp = require('body-parser');
var jp = bp.json();
var bluebird = require('bluebird');
bluebird.promisifyAll(db);


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


//上方分類
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

//進階搜尋
blog.get('/search/:in&:no', jp, function(req, res){
    
    var x = req.params.in.split(',');
    let sqlQuery = "";
    if (x.length > 0) {
        for (let i = 0; i < x.length; i++) {
            sqlQuery += 'atTag LIKE \'%' + x[i] + '%\'';
            if (i < x.length - 1) {
                sqlQuery += ' AND ';
            }
        }
    }

    var y = req.params.no.split(',');
    if (y.length > 0) {
        if (x.length > 0) {
            sqlQuery += ' AND ';
        }
        for (let i = 0; i < y.length; i++) {
            sqlQuery += 'atTag NOT LIKE \'%' + y[i] + '%\'';
            if (i < y.length - 1) {
                sqlQuery += ' AND ';
            }
        }
    }

    // console.log(y);
    // console.log(sqlQuery);
    var sql = 'SELECT * FROM article WHERE '+sqlQuery;
    db.query(sql, function(err, tags){
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

//文字搜尋
blog.get('/search1/:query', jp, function(req, res){
    
    var x = req.params.query;
    var data = [`%${x}%`];
    var sql = 'SELECT * FROM article WHERE atcText like ?';
    console.log(sql);
    db.query(sql, data, function(err, tags){
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

//文章內頁
blog.get('/inside/:id', function(req, res){
    var art_id = req.params.id;
    var sql2 = "SELECT * FROM article WHERE atcid = ?;";
    var sql4 = "SELECT * FROM article, atcxtag, tag WHERE article.atcid = atcxtag.atcid AND atcxtag.tagid = tag.tagid AND article.atcid = ?;";
    var sql7 = "SELECT * FROM comment,userinfo WHERE comment.uid = userinfo.uId AND atcid = ?;"; 

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
                            // console.log(result1);
                            // console.log(result2);
                            // console.log(result3);
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
    var sql6 = req.body;
    var comment = req.body.postcom;
    var uid = req.body.uid;
    var atcid = req.body.atcid;
    console.log(sql6);
    const sql =
    `INSERT INTO comment(uid, atcid, cmtText) VALUES ( ${uid}, ${atcid}, '${comment}');`
   
    db.query(sql, function(err, tags){
        if(err){
            console.log('post沒抓成功');
            console.log(err);
        } else {
            console.log('post抓成功');
            console.log(tags);
            res.send('ok');
        }
    })
})

//會員收藏
blog.post('/keepcheck', jp, function(req, res){
    var sql6 = req.body;
    var uid = req.body.uid;
    var atcid = req.body.atcid;
    console.log(sql6);
   let keep = `INSERT INTO atckeep(uid, atcid) VALUES ( ${uid}, ${atcid});`

       db.query(keep, function(err, tags){
        if(err){
            console.log('keep沒抓成功');
            console.log(err);
        } else {
            console.log('keep抓成功');
            console.log(tags);
            res.send('ok');
        }
    })
})

//會員按讚
blog.post('/likearticle', jp, function(req, res){
    var uid = req.body.uid;
    var atcid = req.body.atcid;
   let keep = `INSERT INTO atclike (uid, atcid) VALUES ( ${uid}, ${atcid});`

       db.query(keep, function(err, tags){
        if(err){
            console.log('like存放成功');
            console.log(err);
        } else {
            console.log('like存放成功');
            console.log(tags);
            res.send('ok');
        }
    })
})

//會員書籤列表
blog.get('/bookmark', jp, function(req, res){
    var user = [req.cookies.user];
    console.log(user);
    var sql = "Select * from atckeep where uid = ?;"
    db.query(sql, user, function(err, bookmark){
           if(err){
            console.log('抓書籤失敗');
            console.log(err);
           } else {
            console.log('抓書籤成功');
            console.log(bookmark);
            res.json(bookmark);
           }
        
    })
})

//會員按讚列表
blog.get('/likeList', jp, function(req, res){
    var user = [req.cookies.user];
    console.log(user);
    var sql = "Select * from atclike where uid = ?;"
    db.query(sql, user, function(err, atcs){
           if(err){
            console.log('抓書籤失敗');
            console.log(err);
           } else {
            console.log('抓書籤成功');
            console.log(atcs);
            res.json(atcs);
           }
        
    })
})


module.exports = blog;
