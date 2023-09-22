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
  let sql5 =
    "SELECT info.product,info.save,info.note,product.Origin FROM info,product WHERE info.season ORDER BY RAND() LIMIT 1;";

  let sql6 = "SELECT product, Temp FROM product WHERE Temp IS NOT NULL;";
  let sql7 =
    "SELECT info.product, product_content.image FROM info JOIN product_content ON info.product = product_content.product WHERE info.season ;";
  let data = {
    names: [],
    images: [],
    con: [],
    veg: [],
    fruit: [],
    temp: [],
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
            mysql.query(sql6, function (err, rows) {
              if (err) {
                console.log("temp取得失敗");
                console.log(err);
                res.status(500).send("資料庫错误");
                return;
              }

              data.temp = rows;
              res.render("product", {
                data: data,
              });
            });
          });
        });
      });
    });
  });

  product.use(express.json());

  let { promisify } = require("util");

  let queryAsync = promisify(mysql.query).bind(mysql);

  product.post("/cardData", async (req, res) => {
    let cardDataArr = req.body;

    try {
      let dataArray = Object.values(cardDataArr);
      for (let cardData of dataArray) {
        let { uid, quantity, c_option, product, size, freq, fid, money, day } =
          cardData;
        let sql8 =
          "SELECT pid FROM product WHERE product = ? and size = ? and freq = ?";
        let getpid = [product, size, freq];

        let results = await queryAsync(sql8, getpid);

        if (results.length === 0) {
          console.error("找不到產品id");
          return res.status(404).send("找不到產品id");
        }
        console.log("product = " + product);
        console.log("size = " + size);
        console.log("freq = " + freq);
        let pid = results[0].pid;
        console.log("取得產品id:", pid);

        let addcart =
          "INSERT INTO cart (uid, pid, quantity, c_option, fid, money, day) VALUES (?, ?, ?, ?, ?,?,?)";
        let addcartValues = [uid, pid, quantity, c_option, fid, money, day];

        await queryAsync(addcart, addcartValues);
      }

      res.send({ success: true, message: "卡片添加成功" });
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

  product.get("/getinfo", (req, res) => {
    // 执行数据库查询，将结果转为JSON并返回
    mysql.query(sql5, function (err, rows) {
      if (err) {
        console.log("提醒取得失敗");
        console.log(err);
        res.status(500).json({ error: "資料庫錯誤" });
        return;
      }
      res.json(rows); // Assuming rows is an array of objects
    });
  });

  product.get("/gettemp", (req, res) => {
    // 执行数据库查询，将结果转为JSON并返回
    mysql.query(sql6, function (err, rows) {
      if (err) {
        console.log("temp取得失敗");
        console.log(err);
        res.status(500).json({ error: "資料庫錯誤" });
        return;
      }
      res.json(rows); // Assuming rows is an array of objects
    });
  });

  product.get("/api/images", (req, res) => {
    // 假設 rows 是您從資料庫獲得的資料，並且每個 row 都有一個 image_path 欄位
    mysql.query(sql7, function (err, rows) {
      if (err) {
        console.log("圖片取得失敗");
        console.log(err);
        res.status(500).json({ error: "資料庫錯誤" });
        return;
      }
      const imagePaths = rows.map((row) => row.image);
      res.json(imagePaths);
    });
  });
});

module.exports = product;
