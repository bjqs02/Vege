var express = require("express");
var cart_order = express();
var db = require("../db");

var bodyParser = require("body-parser");
var jp = bodyParser.json();
var up = bodyParser.urlencoded({ extended: true });

var bluebird = require("bluebird");
bluebird.promisifyAll(db);

var cors = require("cors");
cart_order.use(cors());

// cart 購物流程相關資料庫指令
cart_order.use(express.json());
cart_order.use(express.urlencoded({ extended: true }));

// 讀取個別會員購物車
cart_order.get("/cart/item/:id", function (req, res) {
  // var sql1 = "SELECT * FROM temp_product join cart WHERE cart.pid = temp_product.pid and  cart.uid = ? and cart.c_status = 'active'";
  var sql1 =
    "SELECT product.pid, product.product as pname, product_content.image as img, product_content.content as pinfo , product_content.price as price, product.size, product.freq, cart.quantity, cart.c_option, cart.c_note, cart.fid FROM product_content INNER JOIN product join cart WHERE product_content.product = product.product and cart.pid = product.pid and cart.uid = ? and cart.c_status = 'active';";
  db.query(sql1, [req.params.id], function (err, rows) {
    res.send(rows);
  });
});

// 讀取會員願望清單
cart_order.get("/cart/wishlist/:id", function (req, res) {
  // var sql2 = "SELECT * FROM userinfo, wishlist, temp_product WHERE userinfo.uId = wishlist.uid AND wishlist.pid = temp_product.pid AND userinfo.uId = ? GROUP BY pname ORDER BY wid DESC"
  var sql2 =
    "SELECT * FROM userinfo, wishlist, product, product_content WHERE userinfo.uId = wishlist.uid AND wishlist.pid = product.pid AND product.product = product_content.product AND userinfo.uId = ? GROUP BY product.product ORDER BY wid DESC";
  db.query(sql2, [req.params.id], function (err, rows) {
    res.send(rows);
  });
});

// 更新購物車 cart 資料表 的 pid
cart_order.post("/cart/handleitem/", function (req, res) {
  // 更新購物車 cart 資料表 的 pid (根據變數尋找對應pid)
  var sql3_1 =
    "SELECT product.pid FROM product_content join product WHERE product_content.product = product.product and product.category LIKE '%箱%' AND product.product = ? AND product.freq = ? and product.size = ?;";
  // 更新購物車 cart 資料表 的 pid (把該pid塞回去cart)
  var sql3_2 = "UPDATE cart set pid= ? where uid = ? and pid = ?";

  var product = req.body.product;
  var freq = req.body.freq;
  var size = req.body.size;
  var uid = req.body.uid;
  var o_pid = req.body.o_pid;

  db.query(sql3_1, [product, freq, size], function (err, rows) {
    if (err) {
      console.error(err);
    }
    var newPid = rows[0].pid;
    db.query(sql3_2, [newPid, uid, o_pid], function (err, result) {
      if (err) {
        console.error(err);
      }
    });
  });
});

// 更新購物車 cart 資料表 的 oid || statue => inactive
cart_order.patch("/editcart/status/", function (req, res) {
  var sql4 =
    "update cart set oid= ?, c_status = 'inactive'  where uid = ? and c_status = 'active'";
  db.query(sql4, [req.body.oid, req.body.uid], function (err, rows) {
    res.send(JSON.stringify(req.body));
  });
});

// 建立訂購單 oid || uid (含購物金與折扣碼)
cart_order.post("/editcart/createorder/", function (req, res) {
  var sql5 =
    "INSERT INTO vgorder (oid, uid, useCoupon, useBonus ) VALUES (? , ? , ?, ?)";
  db.query(
    sql5,
    [req.body.oid, req.body.uid, req.body.useCoupon, req.body.useBonus],
    function (err, rows) {
      res.send(JSON.stringify(req.body));
    }
  );
});

// 讀取訂購單資訊
cart_order.get("/order/items/:id", function (req, res) {
  // var sql6 = "SELECT * FROM vgorder join cart join temp_product WHERE vgorder.oid = cart.oid and cart.pid = temp_product.pid and vgorder.uid = ? and vgorder.o_status = 'active'"
  var sql6 =
    "SELECT * FROM vgorder join cart join product join product_content WHERE vgorder.oid = cart.oid and cart.pid = product.pid and product.product = product_content.product and vgorder.uid = ? and vgorder.o_status = 'active'";
  db.query(sql6, [req.params.id], function (err, rows) {
    res.send(rows);
  });
});

// 更新購物車 cart 資料表 的 oid || statue => active
cart_order.patch("/editcart/statusactive/", function (req, res) {
  var sql7 = "update cart set oid= '' , c_status = 'active'  where oid = ? ";
  db.query(sql7, [req.body.oid, req.body.uid], function (err, rows) {
    res.send(JSON.stringify(req.body));
  });
});

// 刪除本筆訂單
cart_order.delete("/order/delete/:oid", function (req, res) {
  db.query(
    "DELETE FROM vgorder WHERE oid = ?",
    [req.params.oid],
    function (err, rows) {
      res.send("#" + req.params.oid + " deleted");
    }
  );
});

// 更新訂單 vgorder 資料表 的 使用者輸入資訊
cart_order.patch("/editorder/details/:oid", function (req, res) {
  var sql66 =
    "UPDATE vgorder SET oName= ? ,oTel= ? ,oMail= ? ,rName= ? ,rTel= ? ,rAddr= ? ,convName= ? ,convTel= ? ,convStore= ? ,payment= ? ,transName= ? ,transNum= ? ,transDate= ? ,creditName= ? ,creditNum= ? ,creditMM= ? ,creditYY= ? ,creditCSV= ? ,billDonate= ? ,billPersonal= ? ,billCompName= ? ,billCompNum= ? ,billCompAddr= ? ,o_note= ? WHERE oid = ? ";
  db.query(
    sql66,
    [
      req.body.oName,
      req.body.oTel,
      req.body.oMail,
      req.body.rName,
      req.body.rTel,
      req.body.rAddr,
      req.body.convName,
      req.body.convTel,
      req.body.convStore,
      req.body.payment,
      req.body.transName,
      req.body.transNum,
      req.body.transDate,
      req.body.creditName,
      req.body.creditNum,
      req.body.creditMM,
      req.body.creditYY,
      req.body.creditCSV,
      req.body.billDonate,
      req.body.billPersonal,
      req.body.billCompName,
      req.body.billCompNum,
      req.body.billCompAddr,
      req.body.o_note,
      req.body.oid,
    ],
    function (err, rows) {
      res.send(JSON.stringify(req.body));
    }
  );
});

// 更新 vgorder 資料表 的 o_statue => inactive 與 o_updatetime
cart_order.patch("/editorder/statusinactive/", function (req, res) {
  var sql77 =
    // "update vgorder set o_status = 'pending', o_updatetime = ? where oid = ? ";
    "update vgorder set o_status = 'pending', o_updatetime = ? where oid = ? ";
  db.query(sql77, [req.body.o_updatetime, req.body.oid], function (err, rows) {
    res.send(JSON.stringify(req.body));
  });
});

// 讀取訂購單資訊 (最新且o_status = pendind)
cart_order.get("/order/list/:id", function (req, res) {
  var sql8 =
    "SELECT * FROM vgorder WHERE vgorder.uid = ? and vgorder.o_status = 'pending' ORDER BY o_updatetime DESC LIMIT 1;";
  db.query(sql8, [req.params.id], function (err, rows) {
    res.send(rows);
  });
});

// cart 頁面 相關資料庫指令
// 更新願望清單 (新增項目至願望清單)
cart_order.post("/addtowishlist/", function (req, res) {
  var sql9 = "INSERT INTO wishlist (uid, pid) VALUES (? , ?)";
  db.query(sql9, [req.body.uid, req.body.pid], function (err, rows) {
    res.send(JSON.stringify(req.body));
  });
});

// 更新願望清單 (從購物車移除)
cart_order.delete("/cart/deleteitem/", function (req, res) {
  var sql10 =
    "DELETE FROM cart WHERE pid = ? and uid = ? and c_status = 'active'";
  db.query(sql10, [req.body.pid, req.body.uid], function (err, rows) {
    res.send(JSON.stringify(req.body));
  });
});

// 更新願望清單 (新增至購物車)
cart_order.post("/cart/additem/", function (req, res) {
  var countCart;
  var sql11_1 = 'SELECT COUNT(*) as count FROM cart where uid = ? and c_status = "active"';
  db.query(sql11_1, [req.body.uid], function (err, rows) {
    var temp = Object.values(JSON.parse(JSON.stringify(rows)))
    countCart = temp[0].count;
    // console.log('aa', countCart)
    var sql11_2 = `INSERT INTO cart (uid, pid, fid) VALUES (? , ?, 'Newprod${countCart}')`;
    db.query(sql11_2, [req.body.uid, req.body.pid], function (err, rows) {
      res.send(JSON.stringify(req.body));
    });
  })
});

// 更新願望清單 (從願望清單移除)
cart_order.delete("/delwishlist/", function (req, res) {
  var sql12 = "DELETE FROM wishlist WHERE pid = ? and uid = ?";
  db.query(sql12, [req.body.pid, req.body.uid], function (err, rows) {
    res.send(JSON.stringify(req.body));
  });
});

// 將備註推到cart資料表中
cart_order.patch("/editcart/c_note/", function (req, res) {
  var sql13 =
    "update cart set c_note= ?  where pid = ? and uid = ? and c_status = 'active' ";
  db.query(
    sql13,
    [req.body.c_note, req.body.pid, req.body.uid],
    function (err, rows) {
      res.send(JSON.stringify(req.body));
    }
  );
});

// 讀取使用者購物金
cart_order.get("/user/bonus/:id", function (req, res) {
  var sql14 = `
    SELECT SUM(bonus) as bonus
    FROM (
        SELECT SUM(bonus) as bonus FROM userbonus WHERE uid = ?
        UNION ALL
        SELECT SUM(lottobonus) as bonus FROM activitylotto WHERE uid = ?
    ) AS subquery;
  `;
  db.query(sql14, [req.params.id, req.params.id], function (err, rows) {
    res.send(rows);
  });
});

// 比對折扣碼
cart_order.get("/getcoupon/:coupon", function (req, res) {
  var sql15 = "SELECT discount FROM temp_coupon WHERE coupon = ?";
  db.query(sql15, [req.params.coupon], function (err, rows) {
    res.send(rows);
  });
});

// 讀取自選箱個別蔬果價格
cart_order.post("/getitemprice", function (req, res) {
  // 當價格以資料庫數據為主時
  // var sql15_2 = "SELECT price FROM product_content WHERE product = ?;"
  // 當價格在product.ejs寫死 蔬菜100+水果50時
  var sql15_2 = "SELECT category FROM product WHERE product = ?;"
  db.query(sql15_2, [req.body.product], function (err, rows) {
    // console.log((JSON.stringify(rows)))
    console.log(Object.values(JSON.parse(JSON.stringify(rows))))
    res.send(Object.values(JSON.parse(JSON.stringify(rows))))
  });
});

// order 頁面相關資料庫指令
// 取得訂購者存放會員資料
cart_order.get("/getuserinfo/:id", function (req, res) {
  var sql16 = "SELECT * FROM userinfo where uid = ?";
  db.query(sql16, [req.params.id], function (err, rows) {
    res.send(rows);
  });
});

// 更新會員資料
cart_order.patch("/updateuserinfo/", function (req, res) {
  var sql17 = "update userinfo set Name = ?, Phone = ?  where uId = ?";
  db.query(
    sql17,
    [req.body.Name, req.body.Phone, req.body.uId],
    function (err, rows) {
      res.send(JSON.stringify(req.body));
    }
  );
});

// 取得會員 creditcard 資料
cart_order.get("/getuserinfo/payment/:uid", function (req, res) {
  var sql18 =
    "SELECT * FROM userinfo join usercard where userinfo.uId = usercard.uId and usercard.default = 1 and userinfo.uId = ? ;";
  db.query(sql18, [req.params.uid], function (err, rows) {
    res.send(rows);
  });
});

// 取得會員 地址 資料
cart_order.get("/getuserinfo/addr/:uid", function (req, res) {
  var sql19 = "SELECT * FROM useraddress where uId = ?";
  db.query(sql19, [req.params.uid], function (err, rows) {
    res.send(rows);
  });
});

// 更新到常用地址
cart_order.post("/updateuserinfo/addr/", function (req, res) {
  var sql20 =
    "INSERT INTO useraddress (uId, Name, Phone, address) VALUES (?, ?, ?, ?)";
  db.query(
    sql20,
    [req.body.uid, req.body.name, req.body.phone, req.body.address],
    function (err, rows) {
      res.send(JSON.stringify(req.body));
    }
  );
});

// 便利商店地圖系統
cart_order.post("/cvs_callback/", (req, res) => {
  // 從便利商店點選完後 該API用POST方式回傳到指定網址
  var body = req.body;
  console.log(body);
  // 從指定網址返回order頁面，否則會卡在那邊
  res.render("order", { body });
});

// ordercomfirm 頁面相關資料庫指令
// 送出訂單 => o_status更新為 pending(sql7)  => 扣除購物金
cart_order.post("/updateuser/bonus/", function (req, res) {
  var sql22 = "INSERT INTO userbonus (uId, bonus) VALUES (?, ?)";
  db.query(sql22, [req.body.uid, req.body.bonus], function (err, rows) {
    res.send(JSON.stringify(req.body));
  });
});

// 送出訂單系統自動發信
var nodemailer = require("nodemailer");
cart_order.post("/server/send/", async (req, res, next) => {
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
    to: req.body.email,
    subject: `Vege果蔬( ${req.body.oid} ) 最新鮮的蔬果已在路上！`,
    html: `
        <h4>親愛的${req.body.name}，感謝您在Vege的訂購！</h4>
        <p>我們已收到您的訂單，將為您選購最新鮮、最適合您的蔬果。您可於官網查詢最新訂單狀況，如有任何問題，歡迎與我們聯繫。</p>
        <br>
        <p style="color:#1ebd95 ;font-weight:300">訂單成立日期：${req.body.o_createtime}</p>
        <p style="color:#1ebd95 ;font-weight:300">訂單編號：${req.body.oid}</p>
        <br>
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
});

// 綠界信用卡系統API (尚未完成)
cart_order.post("/credit_callback/", (req, res) => {
  var body = req.body;
  console.log(body);
  // 從指定網址返回orderprocessing頁面
  res.render("orderprocessing");
});

// LINEPAY系統API (尚未完整完成)
var rp = require('request-promise');

// 建立 linepay訂單
cart_order.post('/payments/linepay/', async function (req, res, next) {
  var amount;
  var payments = await rp({
    method: 'POST',
    uri: `https://sandbox-api-pay.line.me/v2/payments/request`,
    json: true,
    headers: {
      'X-LINE-ChannelId': process.env.LINE_PAY_CHANNELID,
      'X-LINE-ChannelSecret': process.env.LINE_PAY_SECRET
    },
    body: {
      "amount": req.body.amount,
      "productName": "vege box",
      // confirmUrl 會呼叫的 API 
      "confirmUrl": 'http://127.0.0.1:2407/line_callback/',
      "orderId": req.body.orderId,
      "currency": "TWD"
    }
  });
  amount = req.body.amount;
  console.log(payments)
  // console.log(payments.info.transactionId)
  // console.log(payments.info.paymentUrl.web)
  res.send(payments);

  // confirmUrl 會呼叫的 API (可導向，但未完成驗證已付款功能)
  cart_order.get("/line_callback/", async (req, res) => {
    var payments = await rp({
      method: 'POST',
      uri: `https://sandbox-api-pay.line.me/v2/payments/${req.query.transactionId}/confirm`,
      json: true,
      headers: {
        'X-LINE-ChannelId': process.env.LINE_PAY_CHANNELID,
        'X-LINE-ChannelSecret': process.env.LINE_PAY_SECRET
      },
      body: {
        // 需用body 攜帶 amount和 twd資料進行付款驗證
        "amount": amount,
        "currency": "TWD"
      }
    });
    console.log(payments)
    // res.send( payments )
    if (payments.returnMessage == "Success.") {
      // res.json({ success: true });
      setTimeout(() => { res.redirect("http://127.0.0.1:2407/orderprocessing") }, 5000)
    } else {
      res.send('有什麼東西出錯了，請關閉網頁重新操作！')
      // res.json({ success: false });
      // setTimeout(() => { res.redirect("http://127.0.0.1:2407/orderconfirm") }, 3000)
    }
  });

});





// rateorder 評價訂單相關資料庫指令
//讀取vgorder訂單狀態及品項
cart_order.get("/getorderstatus/:oid", function (req, res) {
  // var sql23 = "SELECT * FROM vgorder, cart, temp_product where vgorder.oid = cart.oid and cart.pid = temp_product.pid and vgorder.oid = ? ";
  var sql23 =
    // "SELECT * FROM vgorder, cart, product where vgorder.oid = cart.oid and cart.pid = product.pid and vgorder.oid = ? ";
    "SELECT * FROM vgorder, cart, product, product_content where vgorder.oid = cart.oid and cart.pid = product.pid and product_content.product = product.product and vgorder.oid = ?";
  db.query(sql23, [req.params.oid], function (err, rows) {
    res.send(rows);
  });
});

// 完成評價 => insert into table rateorder
// cart_order.post("/update/rateorder/", function (req, res) {
//     var sql24 = 'INSERT INTO  rateorder ( oid , speed ,  quality ,  service ,  comment1 ,  comment2 ,  comment3) VALUES (? ,?, ?, ?, ?, ?, ?)';
//     db.query(sql24,
//         [req.body.oid, req.body.speed, req.body.quality, req.body.service, req.body.comment1, req.body.comment2, req.body.comment3],
//         function (err, rows) {
//             res.send(JSON.stringify(req.body));
//         }
//     )
// })
cart_order.post("/update/rateorder/", function (req, res) {
  var sql24 =
    "INSERT INTO rateorder (oid, speed, quality, service, comment) VALUES (?, ?, ?, ?, ?)";
  var comments = req.body.comments;
  comments.forEach((commentObj) => {
    db.query(
      sql24,
      [
        req.body.oid,
        req.body.speed,
        req.body.quality,
        req.body.service,
        `${commentObj.items} | ${commentObj.comment}`,
      ],
      function (err, rows) {
        if (err) {
          console.error(err);
        }
      }
    );
  });
  res.send(JSON.stringify(req.body));
});

// 若已有評價資料，無法再次進行評價
cart_order.get("/getrateorderstatus/:oid", function (req, res) {
  var sql25 = "SELECT * FROM rateorder where oid = ? ";
  db.query(sql25, [req.params.oid], function (err, rows) {
    res.send(rows);
  });
});




module.exports = cart_order;
