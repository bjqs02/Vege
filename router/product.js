let express = require("express");
let product = express.Router();
let mysql = require("../db");
var { login_render, login_api } = require("../middleware/auth_login");
product.get("/", function (req, res) {
  let sql = "SELECT DISTINCT product FROM product WHERE category = '蔬果箱';";
  let sql1 =
    "SELECT info.product, product_content.image FROM info JOIN product_content ON info.product = product_content.product WHERE info.season ORDER BY RAND() LIMIT 6;";
  let sql2 =
    "SELECT product.product,MAX(product_content.image) AS image, MAX(product.pid) AS pid, MAX(product_content.content) AS content, MAX(product_content.feature) AS feature, MAX(product_content.price) AS price, MAX(activity.off_act) AS off_act, MAX(activity.act_content) AS act_content, MAX(activity.act_content2) AS act_content2, MAX(activity.act_content3) AS act_content3, MAX(activity.act_content4) AS act_content4,MAX(activity.act_content5) AS act_content5,MAX(activity.act_content6) AS act_content6,MAX(activity.act_time) AS act_time FROM product_content INNER JOIN product ON product_content.product = product.product LEFT JOIN activity ON product_content.product = activity.product WHERE product.category = '蔬果箱' GROUP BY product.product ORDER BY MAX(product.pid) ASC LIMIT 0, 25;";
  let sql3 =
    "SELECT product.product, product.category, product.firm, info.season FROM product INNER JOIN info ON product.product = info.product WHERE (product.category = '蔬菜' ) AND (info.season = '9,10,11' OR info.season = '全年' or info.season = '12,1,2'or info.season = '3,4,5');";
  let sql4 =
    "SELECT product.product, product.category, product.firm, info.season FROM product INNER JOIN info ON product.product = info.product WHERE (product.category = '水果' ) AND (info.season = '9,10,11' OR info.season = '全年' or info.season = '12,1,2'or info.season = '3,4,5');";

  let data = {
    names: [],
    images: [],
    con: [],
    veg: [],
    fruit: [],
  };

  mysql.query(sql, function (err, rows) {
    if (err) {
      console.log("水果箱名稱連結錯誤");
      console.log(err);
      res.status(500).send("水果箱名稱連結錯誤");
      return;
    }
    data.names = rows;

    mysql.query(sql1, function (err, rows) {
      if (err) {
        console.log("圖片取得失敗");
        console.log(err);
        res.status(500).send("圖片數據取得失敗");
        return;
      }
      data.images = rows;

      mysql.query(sql2, function (err, rows) {
        if (err) {
          console.log("產品資訊取得失敗");
          console.log(err);
          res.status(500).send("產品資訊錯誤");
          return;
        }
        data.con = rows;

        mysql.query(sql3, function (err, rows) {
          if (err) {
            console.log("蔬菜品項取得失敗");
            console.log(err);
            res.status(500).send("產品資訊錯誤");
            return;
          }
          data.veg = rows;
          mysql.query(sql4, function (err, rows) {
            if (err) {
              console.log("水果品項取得失敗");
              console.log(err);
              res.status(500).send("数据库错误");
              return;
            }

            data.fruit = rows;

            res.render("product", {
              data: data,
            });
          });
        });
      });
    });
  });

  product.use(express.json());

  product.post("/cardData", async (req, res) => {
    const cardDataArr = req.body;

    try {
      const dataArray = Object.values(cardDataArr); // 将对象的值转换为数组
      for (const cardData of dataArray) {
        const { uid, quantity, c_option, product, size, freq, fid } = cardData;
        const sql8 =
          "SELECT pid FROM product WHERE product = ? and size = ? and freq = ?;";
        const getpid = [product, size, freq];

        mysql.query(sql8, getpid, (err, results) => {
          if (err) {
            console.error("取得產品id失敗:", err);
            res.status(500).send("取得產品id失敗"); // Send an error response
            return;
          }
          console.log("查詢product结果:", product);
          console.log("查詢size结果:", size);
          console.log("查詢freq结果:", freq);
          console.log("查詢id结果:", results);

          if (results.length === 0) {
            console.error("找不到產品id");
            res.status(404).send("找不到產品id");
            return;
          }

          const pid = results[0].pid;
          console.log("取得產品id:", pid);

          const addcart =
            "INSERT INTO cart (uid, pid, quantity, c_option, fid) VALUES (?, ?, ?, ?, ?)";
          const addcartValues = [uid, pid, quantity, c_option, fid];

          mysql.query(addcart, addcartValues, (err, results) => {
            if (err) {
              console.error("產品添加失敗:", err);
              res.status(500).send("產品添加失敗");
            } else {
              res.send(results);
            }
          });
        });
      }
    } catch (err) {
      console.error("发生错误:", err);
      res.status(500).send("发生错误"); // Send an error response
    }
  });

  product.post("/delcartData", async (req, res) => {
    const delDataArr = req.body;
    try {
      for (const delCart of delDataArr) {
        const { productId, userId } = delCart;

        // Query the maximum c_createtime
        const maxCreateTimeQuery =
          "SELECT MAX(c_createtime) AS max_createtime FROM cart WHERE uid = ? AND fid = ?";
        const maxCreateTimeValues = [userId, productId]; // Corrected variable name
        mysql.query(maxCreateTimeQuery, maxCreateTimeValues, (err, results) => {
          if (err) {
            console.error("取得產品時間錯誤:", err);
            res.status(500).send("取得產品時間錯誤");
            return;
          }
          console.log("時間查詢结果:", results);
          if (results.length === 0 || !results[0].max_createtime) {
            console.error("No matching records found");
            res.status(404).send("No matching records found");
          }

          const maxCreateTime = results[0].max_createtime;
          const deleteQuery =
            "DELETE FROM cart WHERE uid = ? AND fid = ? AND c_createtime = ?";
          const deleteValues = [userId, productId, maxCreateTime];
          mysql.query(deleteQuery, deleteValues, (err) => {
            if (err) {
              console.error("刪除失敗:", err);
              res.status(500).send("刪除失敗");
            } else {
              res.send("卡片已刪除");
            }
          });
        });
      }
    } catch (err) {
      console.error("連接錯誤: " + err.message);
      res.status(500).send("連接錯誤");
    }
  });

  // 讀取每個會員
  // product.get("/cart/item/:id", function (req, res) {
  //   // var sql1 = "SELECT * FROM temp_product join cart WHERE cart.pid = temp_product.pid and  cart.uid = ? and cart.c_status = 'active'";
  //   var sql99 =
  //     "SELECT product.pid, product.product as pname, product_content.image as img, product_content.content as pinfo , product_content.price as price, product.size, product.freq, cart.quantity, cart.c_option, cart.c_note, cart.fid FROM product_content INNER JOIN product join cart WHERE product_content.product = product.product and cart.pid = product.pid and cart.uid = ? and cart.c_status = 'active';";
  //   mysql.query(sql99, [req.params.id], function (err, rows) {
  //     res.send(rows);
  //   });
  // });
});

module.exports = product;
