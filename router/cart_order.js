var express = require("express");
var cart_order = express();
var db = require('../db');

var bodyParser = require("body-parser");
var jp = bodyParser.json();
var up = bodyParser.urlencoded({ extended: true });

var bluebird = require('bluebird');
bluebird.promisifyAll(db);


// cart 購物車相關資料庫指令
cart_order.use(express.json());
cart_order.use(express.urlencoded({ extended: true }));

// 讀取個別會員購物車
cart_order.get('/cart/item/:id', function (req, res) {
    var sql1 = "SELECT * FROM temp_product join cart WHERE cart.pid = temp_product.pid and  cart.uid = ? and cart.c_status = 'active'";
    db.query(sql1, [req.params.id], function (err, rows) {
        res.send(rows);
    })
})

// 讀取會員願望清單
cart_order.get('/cart/wishlist/:id', function (req, res) {
    var sql2 = "SELECT * FROM userinfo, wishlist, temp_product WHERE userinfo.uId = wishlist.uid AND wishlist.pid = temp_product.pid AND userinfo.uId = ? GROUP BY pname ORDER BY wid DESC"
    db.query(sql2, [req.params.id], function (err, rows) {
        res.send(rows);
    })
})

// 更新購物車 cart 資料表 的 pid (尚未完成)
cart_order.put("/cart/item/:id", function (req, res) {
    var sql3 = "update cart set pid= ? where uid = ? and pid = ?"
    db.query(sql3,
        [req.body.newPid, req.body.uid, req.body.pid],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 更新購物車 cart 資料表 的 oid || statue => inactive
cart_order.patch("/editcart/status/", function (req, res) {
    var sql3 = "update cart set oid= ?, c_status = 'inactive'  where uid = ? and c_status = 'active'"
    db.query(sql3,
        [req.body.oid, req.body.uid],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 建立訂購單 oid || uid (含購物金與折扣碼)
cart_order.post("/editcart/createorder/", function (req, res) {
    var sql3 = "INSERT INTO vgorder (oid, uid, useCoupon, useBonus ) VALUES (? , ? , ?, ?)"
    db.query(sql3,
        [req.body.oid, req.body.uid, req.body.useCoupon, req.body.useBonus],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 讀取訂購單資訊
cart_order.get('/order/items/:id', function (req, res) {
    var sql4 = "SELECT * FROM vgorder join cart join temp_product WHERE vgorder.oid = cart.oid and cart.pid = temp_product.pid and vgorder.uid = ? and vgorder.o_status = 'active'"
    db.query(sql4, [req.params.id], function (err, rows) {
        res.send(rows);
    })
})


// 更新購物車 cart 資料表 的 oid || statue => active
cart_order.patch("/editcart/statusactive/", function (req, res) {
    var sql5 = "update cart set oid= '' , c_status = 'active'  where oid = ? "
    db.query(sql5,
        [req.body.oid, req.body.uid],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 刪除本筆訂單
cart_order.delete("/order/delete/:oid", function (req, res) {
    db.query("DELETE FROM vgorder WHERE oid = ?",
        [req.params.oid],
        function (err, rows) {
            res.send("#" + req.params.oid + " deleted");
        }
    )
})

// 更新訂單 vgorder 資料表 的 使用者輸入資訊
cart_order.patch("/editorder/details/:oid", function (req, res) {
    var sql6 = "UPDATE vgorder SET oName= ? ,oTel= ? ,oMail= ? ,rName= ? ,rTel= ? ,rAddr= ? ,convName= ? ,convTel= ? ,convStore= ? ,payment= ? ,transName= ? ,transNum= ? ,transDate= ? ,creditName= ? ,creditNum= ? ,creditMM= ? ,creditYY= ? ,creditCSV= ? ,billDonate= ? ,billPersonal= ? ,billCompName= ? ,billCompNum= ? ,billCompAddr= ? ,o_note= ? WHERE oid = ? "
    db.query(sql6,
        [req.body.oName, req.body.oTel, req.body.oMail, req.body.rName, req.body.rTel, req.body.rAddr, req.body.convName, req.body.convTel, req.body.convStore, req.body.payment, req.body.transName, req.body.transNum, req.body.transDate, req.body.creditName, req.body.creditNum, req.body.creditMM, req.body.creditYY, req.body.creditCSV, req.body.billDonate, req.body.billPersonal, req.body.billCompName, req.body.billCompNum, req.body.billCompAddr, req.body.o_note, req.body.oid],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 更新 vgorder 資料表 的 o_statue => inactive 與 o_updatetime
cart_order.patch("/editorder/statusinactive/", function (req, res) {
    var sql7 = "update vgorder set o_status = 'inactive', o_updatetime = ? where oid = ? "
    db.query(sql7,
        [req.body.o_updatetime, req.body.oid],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 讀取訂購單資訊 (最新且o_status = inactive)
cart_order.get('/order/list/:id', function (req, res) {
    var sql8 = "SELECT * FROM vgorder WHERE vgorder.uid = ? and vgorder.o_status = 'inactive' ORDER BY o_updatetime DESC LIMIT 1;"
    db.query(sql8, [req.params.id], function (err, rows) {
        res.send(rows);
    })
})

// 更新願望清單 (新增項目至願望清單)
cart_order.post("/addtowishlist/", function (req, res) {
    var sql9 = "INSERT INTO wishlist (uid, pid) VALUES (? , ?)";
    db.query(sql9,
        [req.body.uid, req.body.pid],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 更新願望清單 (從購物車移除)
cart_order.delete("/cart/deleteitem/", function (req, res) {
    var sql10 = "DELETE FROM cart WHERE pid = ? and uid = ? and c_status = 'active'";
    db.query(sql10,
        [req.body.pid, req.body.uid],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 更新願望清單 (新增至購物車)
cart_order.post("/cart/additem/", function (req, res) {
    var sql11 = "INSERT INTO cart (uid, pid) VALUES (? , ?)";
    db.query(sql11,
        [req.body.uid, req.body.pid],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 更新願望清單 (從願望清單移除)
cart_order.delete("/delwishlist/", function (req, res) {
    var sql12 = "DELETE FROM wishlist WHERE pid = ? and uid = ?";
    db.query(sql12,
        [req.body.pid, req.body.uid],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 將備註推到cart資料表中
cart_order.patch("/editcart/c_note/", function (req, res) {
    var sql13 = "update cart set c_note= ?  where pid = ? and uid = ? and c_status = 'active' ";
    db.query(sql13,
        [req.body.c_note, req.body.pid, req.body.uid],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 讀取使用者購物金
cart_order.get('/user/bonus/:id', function (req, res) {
    var sql14 = "SELECT SUM(bonus) as bonus FROM userbonus WHERE uid = ?";
    db.query(sql14, [req.params.id], function (err, rows) {
        res.send(rows);
    })
})

// 比對折扣碼
cart_order.get('/getcoupon/:coupon', function (req, res) {
    var sql15 = "SELECT discount FROM temp_coupon WHERE coupon = ?";
    db.query(sql15, [req.params.coupon], function (err, rows) {
        res.send(rows);
    })
})

// order 頁面相關資料庫指令
// 取得訂購者存放會員資料
cart_order.get('/getuserinfo/:id', function (req, res) {
    var sql16 = "SELECT * FROM userinfo where uid = ?";
    db.query(sql16, [req.params.id], function (err, rows) {
        res.send(rows);
    })
})

// 更新會員資料
cart_order.patch("/updateuserinfo/", function (req, res) {
    var sql17 = "update userinfo set Name = ?, Phone = ?  where uId = ?"
    db.query(sql17,
        [req.body.Name, req.body.Phone, req.body.uId ],
        function (err, rows) {
            res.send(JSON.stringify(req.body));
        }
    )
})

// 取得會員 creditcard 資料
cart_order.get('/getuserinfo/payment/:uid', function (req, res) {
    var sql18 = "SELECT * FROM userinfo join usercard where userinfo.uId = usercard.uId and usercard.default = 1 and userinfo.uId = ? ;";
    db.query(sql18, [req.params.uid], function (err, rows) {
        res.send(rows);
    })
})

// 取得會員 地址 資料
cart_order.get('/getuserinfo/addr/:uid', function (req, res) {
    var sql19 = "SELECT * FROM useraddress where uId = ?";
    db.query(sql19, [req.params.uid], function (err, rows) {
        res.send(rows);
    })
})

// ordercomfirm 頁面相關資料庫指令


// 送出訂單 => o_status更新為 pending  



// rateorder 評價訂單相關資料庫指令
//讀取vgorder訂單狀態及品項
cart_order.get('/getorderstatus/:oid', function (req, res) {
    var sql20 = "SELECT * FROM vgorder, cart, temp_product where vgorder.oid = cart.oid and cart.pid = temp_product.pid and vgorder.oid = ? ";
    db.query(sql20, [req.params.oid], function (err, rows) {
        res.send(rows);
    })
})

// 完成評價 => insert into table rateorder
// cart_order.post("/update/rateorder/", function (req, res) {
//     var sql21 = 'INSERT INTO  rateorder ( oid , speed ,  quality ,  service ,  comment1 ,  comment2 ,  comment3) VALUES (? ,?, ?, ?, ?, ?, ?)';
//     db.query(sql21,
//         [req.body.oid, req.body.speed, req.body.quality, req.body.service, req.body.comment1, req.body.comment2, req.body.comment3],
//         function (err, rows) {
//             res.send(JSON.stringify(req.body));
//         }
//     )
// })
cart_order.post("/update/rateorder/", function (req, res) {
    var sql21 = 'INSERT INTO rateorder (oid, speed, quality, service, comment) VALUES (?, ?, ?, ?, ?)';
    var comments = req.body.comments;
    comments.forEach((commentObj) => {
        db.query(sql21, [req.body.oid, req.body.speed, req.body.quality, req.body.service, `${commentObj.items} | ${commentObj.comment}`], function (err, rows) {
            if (err) {
                console.error(err);
            }
        });
    });
    res.send(JSON.stringify(req.body));
});

// 若已有評價資料，無法再次進行評價
cart_order.get('/getrateorderstatus/:oid', function (req, res) {
    var sql22 = "SELECT * FROM rateorder where oid = ? ";
    db.query(sql22, [req.params.oid], function (err, rows) {
        res.send(rows);
    })
})



module.exports = cart_order;