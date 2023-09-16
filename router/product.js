let express = require("express");
let product = express.Router();
let mysql = require("../db");
var { login_render, login_api } = require("../middleware/auth_login");
product.get("/", function (req, res) {
  let sql = "SELECT DISTINCT product FROM product WHERE category = '蔬果箱';";
  let sql1 =
    "SELECT info.product, product_content.image FROM info JOIN product_content ON info.product = product_content.product WHERE info.season ORDER BY RAND() LIMIT 6;";
  let sql2 =
    "SELECT product.pid, product.product, product_content.content, product_content.feature, product_content.price, activity.off_act, activity.act_content, activity.act_content2, activity.act_content3, activity.act_time FROM product_content INNER JOIN product ON product_content.product = product.product LEFT JOIN activity ON product_content.product = activity.product WHERE product.category = '蔬果箱' GROUP BY product.product ORDER BY product.pid ASC;";
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
          res.status(500).send("数据库错误");
          return;
        }
        data.con = rows;

        mysql.query(sql3, function (err, rows) {
          if (err) {
            console.log("蔬菜品項去得失敗");
            console.log(err);
            res.status(500).send("数据库错误");
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
      for (const cardData of cardDataArr) {
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

          mysql.query(addcart, addcartValues, (err) => {
            if (err) {
              console.error("產品添加失敗:", err);
              res.status(500).send("產品添加失敗");
            } else {
              res.send("卡片產品添加成功");
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
});

module.exports = product;
