let express = require("express");
let product = express.Router();
let mysql = require("../db");
product.get("/", function (req, res) {
  let sql = "SELECT product FROM product WHERE category = '蔬果箱';";
  let sql1 =
    "SELECT info.product, product_content.image FROM info JOIN product_content ON info.product = product_content.product WHERE info.season ORDER BY RAND() LIMIT 6;";
  let sql2 =
    "SELECT product.pid, product.product, product_content.content, product_content.feature, product_content.price, activity.off_act, activity.act_content,activity.act_content2,activity.act_content3,activity.act_time FROM product_content INNER JOIN product ON product_content.product = product.product LEFT JOIN activity ON product_content.product = activity.product WHERE product.category = '蔬果箱';"; // 新增的查询语句
  let sql3 =
    "SELECT product.product, product.category, product.firm, info.season FROM product INNER JOIN info ON product.product = info.product WHERE (product.category = '蔬菜' ) AND (info.season = '9,10,11' OR info.season = '全年' or info.season = '12,1,2');";
  let sql4 =
    "SELECT product.product, product.category, product.firm, info.season FROM product INNER JOIN info ON product.product = info.product WHERE (product.category = '水果' ) AND (info.season = '9,10,11' OR info.season = '全年' or info.season = '12,1,2'or info.season = '3,4,5');";
  // 定义一个对象来存储三组数据

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
      res.status(500).send("数据库错误");
      return;
    }
    // 将查询结果存储在data对象中
    data.names = rows;

    // 在第一个查询完成后，执行第二个查询
    mysql.query(sql1, function (err, rows) {
      if (err) {
        console.log("圖片取得失敗");
        console.log(err);
        res.status(500).send("数据库错误");
        return;
      }
      // 将第二个查询结果存储在data对象中
      data.images = rows;

      // 在第二个查询完成后，执行第三个查询
      mysql.query(sql2, function (err, rows) {
        if (err) {
          console.log("產品資訊取得失敗");
          console.log(err);
          res.status(500).send("数据库错误");
          return;
        }
        // 将第三个查询结果存储在data对象中
        data.con = rows;

        mysql.query(sql3, function (err, rows) {
          if (err) {
            console.log("蔬菜品項取得失敗");
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
  product.post("/cardData", (req, res) => {
    const cardDataArr = req.body; // 获取请求中的JSON数据

    // 循环遍历 cardDataArr 数组并插入数据库
    cardDataArr.forEach((cardData) => {
      const { productId, productName, commodity, sumValue } = cardData;

      const sql =
        "INSERT INTO text(bid, productName, commodity, sumValue) VALUES (?, ?, ?, ?)";
      const values = [productId, productName, commodity, sumValue];

      mysql.query(sql, values, function (err, results) {
        if (err) {
          console.error("插入数据时出错: " + err.message);
          return;
        }
        console.log("成功插入数据，插入ID:", results.insertId);
      });
    });

    res.send("数据插入成功"); // 发送响应
  });

  product.post("/delcardData", (req, res) => {
    const productIdToDelete = req.body.productId; // 从请求中获取要删除的产品ID

    // 使用 productIdToDelete 编写 SQL 查询语句
    const deleteQuery = "DELETE FROM text WHERE bid = ?";

    // 使用 MySQL 连接执行删除操作
    mysql.query(deleteQuery, [productIdToDelete], (err, results) => {
      if (err) {
        console.error("删除数据时出错: " + err.message);
        res.status(500).send("删除数据时出错");
        return;
      }

      console.log("成功删除行数: " + results.affectedRows);
      res.send("数据删除成功"); // 发送响应
    });
  });
});

module.exports = product;
