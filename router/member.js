var express = require("express");
var bodyParser = require("body-parser");
var dayjs = require("dayjs");
var member = express.Router();
var db = require("../db");

var bluebird = require("bluebird");
bluebird.promisifyAll(db);

// 解析客戶端POST的資料
member.use(bodyParser.json());
member.use(bodyParser.urlencoded({ extended: true }));


// 讀取-基本資料
member.use("/basicInfo/", express.static("lib"));
member.get("/basicInfo/:id", function (req, res) {
  var sqlInfo = `SELECT *,SUBSTRING(Name, 1, 1) as firstN, SUBSTRING(Name, 2, 2) as lastN FROM userinfo where uId = ?;`;
  db.query(sqlInfo, [req.params.id], function (err, basicInfo) {
    if (basicInfo[0]) {
      console.log("這位顧客已有基本資料了鴨");
      var bDate = dayjs(basicInfo[0].Birthday).format("YYYY-MM-DD");
      res.render("m_basicInfo", {
        dataInfo: basicInfo,
        Birthday: bDate,
      });
    }
  });
});

// 修改-基本資料
member.post("/basicInfo/edit", function (req, res) {
  var editInfo = `UPDATE userinfo SET Name = ?, Birthday = ?, Gender = ?, Phone = ?, carrier = ? where Email = ?;`;
  var newdata = [req.body.Name, req.body.Birthday, req.body.Gender, req.body.Phone, req.body.carrier, req.body.Email]
  db.query(editInfo, newdata, function (err, newInfo) {
    if (err) {
      console.log("沒有資料可以更新喔");
    } else {
      console.log("更新資料了鴨");
      res.send(JSON.stringify(req.body));
    }
  });
});


// 讀取-信用卡資料與種類
member.use('/myCards', express.static('lib')); //記得刪掉
member.get('/myCards/:id', function(req, res) {
    var sqlCard = `SELECT * 
                   FROM (SELECT *, SUBSTRING(card, 1, 1) as ctId, SUBSTRING(card, 14) as lastN FROM usercard) as newcard
                   JOIN cardtype ON newcard.ctId = cardtype.ctId
                   WHERE uId = ? ORDER by newcard.default DESC;`;
    db.query(sqlCard, [req.params.id], function(err ,mycards) {
        var cardJson = { datacard: mycards };
        if( mycards[0] ){
            console.log('抓到野生的信用卡了');
            res.render('m_mycards', cardJson);
        }else {
            // 還沒有空白狀態的UI  // 可以考慮render空白的靜態ejs
            console.log( '這裡還未新增信用卡' );
            res.render('m_mycards', cardJson);
        }
    })
})


// 讀取-常用地址
member.use('/address', express.static('lib')); //記得刪掉
member.get('/address/:id', function(req, res) {
    var sqlHaddress = `SELECT *, SUBSTRING(Phone, 2) as babaliu FROM useraddress where uId = ?;`;
    var sqlSaddress = `SELECT *, SUBSTRING(Phone, 2) as babaliu FROM ushopaddress where uId = ?;`;
    db.query(sqlHaddress, [req.params.id], function(err, haddress){
        db.query(sqlSaddress, [req.params.id], function(err, saddress){
                console.log( '瑪莉小姐: 現在在你附近♥' );
                res.render('m_address', { datahouse: haddress, datashop: saddress });
            })
    })

})


// 讀取-訂單總覽
member.use('/order', express.static('lib')); //記得刪掉
member.get('/order/:id', async function(req, res) {
    var sqlOrderSum = `SELECT vgorder.uid, vgorder.oid, vgorder.o_ceatetime, SUM(cart.quantity) AS sumitem, SUM(cart.money) AS sumMoney FROM vgorder
                       JOIN cart ON vgorder.oid = cart.oid
                       WHERE vgorder.uid = ?
                       GROUP BY vgorder.oid;`;
    var sqlOrder = `SELECT vgorder.uid, vgorder.oid, cart.pid, product.size, product.freq, cart.quantity, product_content.product, product_content.image FROM vgorder
                    JOIN cart ON vgorder.oid = cart.oid
                    JOIN product ON cart.pid = product.pid
                    JOIN product_content ON product.product = product_content.product
                    WHERE vgorder.uid = ? AND vgorder.oid = ?
                    LIMIT 1;`;
    try {
        // 第一個查詢
        const OrderSum = await db.queryAsync(sqlOrderSum, [req.params.id]);
        
        let arrayCT = [];
        let arrayOrder = [];
        
        // OrderSum.forEach( async(item) =>{}
        // 不使用forEach，原因參考:https://reurl.cc/edOEOQ
        for( const item of OrderSum ) {
            // 日期格式轉換
            const cTime = dayjs(item.o_ceatetime).format('YYYY-MM-DD H:mm');
            arrayCT.push(cTime);

            // 第二個查詢:用陣列儲存迴圈查詢的總結果
            const Order = await db.queryAsync(sqlOrder, [item.uid, item.oid]);
            arrayOrder.push(Order[0]);
        }

        // bluebird.all: 等待所有查詢完成，並取得所有的結果
        // 因此 arrayOrder 可以在迴圈外被取得
        const Orderone = await bluebird.all(arrayOrder);
        console.log(arrayOrder);

        
        console.log('店小二: 好咧來訂單囉');
        res.render( 'm_order', { dataot: arrayCT, dataosum: OrderSum, dataorder: arrayOrder });
    } catch (error) {
        console.error(error);
    }
})


// 讀取-購物金
member.use('/bonus', express.static('lib')); //記得刪掉
member.get('/bonus/:id', function(req, res) {
    var sqlBonus = `SELECT uid as uId, lottotime as Time, lottobonus as bonus, "lotto" as state FROM activitylotto WHERE uId = ?
                   UNION
                   SELECT *, "order" as state FROM userbonus WHERE uId = ?
                   ORDER by Time DESC;`;
    db.query(sqlBonus, [req.params.id, req.params.id], function(err ,bonus) {
        let arrayT = [];
        let sum = 0;
        // 取得點數最舊的日期資料
        let earliest = bonus[ bonus.length - 1 ].Time;
        bonus.forEach(item => {
            // 日期格式轉換
            var bTime = dayjs( item.Time ).format('YYYY-MM-DD HH:mm');
            arrayT.push(bTime);
            // 購物金總和
            sum += item.bonus;
        });
        var bonusJson = {databonus: bonus, dataET: earliest, dataTime: arrayT, datasum: sum};

        if( bonus[0] ){
            console.log('挖到金閃閃啦');
            res.render('m_bonus', bonusJson);
        }else {
            console.log( '此處無銀還須努力' );
            res.render('m_bonus', bonusJson);
        }
    })
})


// 讀取-個人收藏
member.use('/articles', express.static('lib'));
member.get('/articles/:id', function(req, res) {
    var sqlArticle = `SELECT uid, atckeep.atcid, atcTitle, atcimg, atcText FROM atckeep 
                      JOIN article ON atckeep.atcid = article.atcid WHERE uid = ?
                      ORDER BY atcid;`;
    db.query(sqlArticle, [req.params.id], function(err, articles) {
        var articleJson = { datarticle: articles };
        if( articles[0] ){
            console.log('一天一閱讀，宇智波又');
            res.render('m_article', articleJson);
        }else {
            console.log('佐助失去了哥哥QQ');
            res.render('m_article', articleJson);

        }
    })
})

module.exports = member;
