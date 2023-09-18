function openCity(evt, IdName) {
  if (evt) {
    let middle_box1 = document.getElementsByClassName("middle_box1");
    for (let i = 0; i < middle_box1.length; i++) {
      middle_box1[i].style.display = "none";
    }
    let tab = document.getElementsByClassName("tab");

    for (let i = 0; i < tab.length; i++) {
      tab[i].className = tab[i].className.replace("action", "");
    }
    document.getElementById(IdName).style.display = "flex";
    evt.currentTarget.classList.toggle("action");
    $(this).find(".fu_nav").eq(0).addClass("act");

    // $(".fu_nav").removeClass("act");
  } else {
    // Handle the case when 'evt' is undefined or null
  }
}

$(document).ready(function () {
  $("section").each(function () {
    $(this).find(".fu_nav").eq(0).addClass("act");
    $(this).find(".middle_Con").eq(0).css("display", "block");
  });
});

$(".tab").eq(0).addClass("action");

function openMnav(evt, IdName) {
  let middle_Con = $(".middle_Con");
  middle_Con.css("display", "none");

  let fu_nav = $(".fu_nav");
  fu_nav.removeClass("act");

  $("#" + IdName).css("display", "block");
  $(evt.currentTarget).addClass("act");
}

// ------顯示第一个 "middle_box1" 元素
var middleBoxElements = document.getElementsByClassName("middle_box1");
for (var i = 0; i < middleBoxElements.length; i++) {
  middleBoxElements[i].style.display = "none";
}
if (middleBoxElements.length > 0) {
  middleBoxElements[0].style.display = "flex";
}

// ---------索引菜單index
let firstFuNav = $(".fu_nav").first();
let firstMiddleCon = $(".middle_Con").first();
if (firstMiddleCon.length > 0 && firstFuNav.length > 0) {
  let index = $(".fu_nav").index(firstFuNav);
  openMnav(index);
}

// ------點選菜單展開內容
$(".fu_nav").eq(0).addClass("act");

$(".fu_nav").on("click", function () {
  // $(".middle_Con").hide();
  $(".fu_nav").removeClass("act");
  var index = $(".fu_nav").index(this);
  $(".middle_Con").eq(index).show();
  $(this).addClass("act");
});

// ------點選產品展開內容

// document.addEventListener("DOMContentLoaded", function () {
//   const firstMiddleCon = document.querySelector(".middle_Con");
//   const firstFuNav = document.querySelector(".fu_nav");
//   if (firstMiddleCon && firstFuNav) {
//     openMnav({ currentTarget: firstFuNav }, firstMiddleCon.id);
//   }
// });

// 圖片切換

$(".ch").click(function () {
  var newImageUrl = $(this).attr("src");
  var parentBlock = $(this).closest(".middle_img");
  parentBlock.find(".mainImg").attr("src", newImageUrl);
});

// 加減數量
$(".fa-plus").on("click", function () {
  var $sumSpan = $(this).siblings(".sum");
  var currentNumber = parseInt($sumSpan.text(), 10);
  currentNumber += 1;
  $sumSpan.text(currentNumber);
});

$(".fa-minus").on("click", function () {
  var $sumSpan = $(this).siblings(".sum");
  var currentNumber = parseInt($sumSpan.text(), 10);
  currentNumber -= 1;
  currentNumber = currentNumber > 1 ? currentNumber - 1 : 1;
  $sumSpan.text(currentNumber);
});

$("section").each(function () {
  // 默认显示每个 section 中的第一个 middle_Con
  $(this).find(".middle_Con").eq(0).css("display", "block");
  // 点击按钮切换中间内容的显示和隐藏
});

var minTotalPay = 400;
var maxTotalPay = 600;

var selectedTotalPay = 0;
$(".fu_nav").click(function () {
  $(".f_1.clt").removeClass("clt");
  $(".middle_Con .price4").empty();
  selectedTotalPay = 0;
  $(".fv_con .buyfv").empty();
  let $section = $(this).closest("section");
  let index = $(this).closest(".fu_Mnav").find(".fu_nav").index(this);
  $section.find(".middle_Con").css("display", "none");
  $section.find(".middle_Con").eq(index).css("display", "block");
});
$(".cons").each(function () {
  var cons = $(this); // 当前的 .cons 元素

  cons.find(".f_1").on("click", function () {
    var dataPay = parseInt($(this).data("pay")); // 获取并转换data-pay属性值为整数
    // var itemCount = parseInt($(this).find(".item-count").text()); // 获取当前数量

    if ($(this).hasClass("clt")) {
      $(this).removeClass("clt");
      selectedTotalPay -= dataPay;
    } else {
      $(this).addClass("clt");
      selectedTotalPay += dataPay;
    }

    var over = $(this).closest(".mo_con").find(".over");

    if (selectedTotalPay < minTotalPay) {
      over.text("您少於" + minTotalPay);
    } else if (selectedTotalPay > maxTotalPay) {
      over.text("您超過" + maxTotalPay);
    } else {
      over.text(" ");
    }
  });
});

// bcl 選擇蔬果 按鈕 點擊關閉水果頁面
// 重給予  selectedTotalPay = 0;
$(".bcl").on("click", function () {
  $("body").css("overflow", "auto");
  $(".modal-backdrop.show").css("display", "none");
  $(".fv_box, .black").hide();
  $("body").removeClass("body-no-scroll");
  selectedTotalPay = 0;
  $(".f_1.clt").removeClass("clt");
  $(".fv_con .buyfv").empty();
});

// chage 選擇蔬果 按鈕 點擊顯示水果頁面
$(".chage").on("click", function () {
  $(".fv_box, .black").show();
  $("body").addClass("body-no-scroll");
});

//  前往商品頁 =>  選擇蔬果頁面打開
$(".go_shop").on("click", function () {
  openCity(event, "fu_tab7");
  $("#dxING").modal("hide");
  $(".modal").hide();
  $(".modal-dialog").hide();
  $(".fv_box, .black").show();
  $("body").addClass("body-no-scroll");
});
$(".mo_con .goSure").on("click", function () {
  $(".modal-backdrop.show").css("display", "none");

  function applyShakingEffect(overElement) {
    overElement.addClass("shaking");
    setTimeout(function () {
      overElement.removeClass("shaking");
    }, 1000);
  }

  var over = $(this).closest(".mo_con").find(".over");
  if (!$(".f_1").hasClass("clt")) {
    applyShakingEffect(over);
    $(".over").text("您沒有選擇蔬果");
  }
  if (selectedTotalPay < minTotalPay || selectedTotalPay > maxTotalPay) {
    applyShakingEffect(over);
  } else {
    // let toa2 = $(this).closest(".middle_Con").find(".toa2");
    $(".toal").text(selectedTotalPay);
    let tol2 = document.getElementsByClassName("toal2");
    // $(".toa2").text(selectedTotalPay);
    if (tol2.length > 0) {
      tol2[0].textContent = selectedTotalPay * 4; // 修改第一个元素的文本内容
    }

    var buyText = $(".f_1.clt").text();
    var buyTextArray = buyText.split("\n").map((item) => item.trim()); // 将文本按换行符分割成数组，并去除首尾空格

    // 去除空字符串并拼接成字符串
    var formattedBuyText = buyTextArray.filter((item) => item !== "").join(",");

    let buyfvElement = $(this).closest(".middle_Con").find(".buyfv");
    // var buyfvElement = $(".fv_con .buyfv");
    buyfvElement.text(formattedBuyText);
    $(".fv_box, .black").hide();
    $("body").removeClass("body-no-scroll");
    $("body").css("overflow", "auto");
  }
});
// 處理json資料
function set(responseData) {
  let f1Elements = document.querySelectorAll(".f_2");

  for (let i = 0; i < f1Elements.length; i++) {
    let f1Text = f1Elements[i].textContent.trim();
    let dataPay = parseInt($(f1Elements[i]).data("pay"));
    for (let j = 0; j < responseData.length; j++) {
      if (responseData[j].product.trim() === f1Text) {
        if ($(f1Elements[i]).hasClass("clt")) {
          $(f1Elements[i]).removeClass("clt");
          dataPay *= -1;
        } else {
          $(f1Elements[i]).addClass("clt");
        }

        selectedTotalPay += dataPay;
        var over = $(f1Elements[i]).closest(".mo_con").find(".over");

        if (selectedTotalPay < minTotalPay) {
          over.text("您少於" + minTotalPay);
        } else if (selectedTotalPay > maxTotalPay) {
          over.text("您超過" + maxTotalPay);
        } else {
          over.text(" ");
        }
      }
    }
  }

  $(".mo_con .goSure").on("click", function () {
    $(".modal-backdrop.show").css("display", "none");

    var buyfvElement = $(".fv_con .buyfv");

    function applyShakingEffect(overElement) {
      overElement.addClass("shaking");
      setTimeout(function () {
        overElement.removeClass("shaking");
      }, 1000);
    }

    var over = $(this).closest(".mo_con").find(".over");

    if (selectedTotalPay < minTotalPay || selectedTotalPay > maxTotalPay) {
      applyShakingEffect(over);
    } else {
      over.text(selectedTotalPay);
      $(".toal").text(selectedTotalPay);
      $(".fv_con .buyfv").empty();

      var buy = "";
      $(".f_1.clt").each(function () {
        buy += $(this).text() + ",";
      });

      buy = buy.slice(0, -1);

      buyfvElement.text(buy);

      $(".fv_box, .black").hide();
      $("body").removeClass("body-no-scroll");
      $("body").css("overflow", "auto");
    }
  });
}
function addProduct(addButton) {
  let container = addButton.closest(".middle_Con"); // 获取最近的 .middle_Con 元素
  let section = addButton.closest("section"); // 获取最近的 .middle_Con 元素
  let sumValue = container.find(".sum").text(); // 获取 .sum 元素的文本
  let productName = section.find("h3").text();
  let commodity = container.find(".commodity option:selected").text();
  let doublePriceText = container.find(".price1").text();
  let familyPriceText = container.find(".price3").text();
  let wowprice = container.find(".price4").text();
  let price = 0;
  let Img = "";
  let concon = $(this).closest(".middle_Con").find("concon").text();
  let concon2 = $(this).closest(".middle_Con").find("concon2").text();
  if (productName === "蔬果健康箱") {
    Img = "img/蔬果健康箱.png";
  } else if (productName === "蔬果減脂箱") {
    Img = "img/蔬果減脂箱.png";
  } else if (productName === "果果箱") {
    Img = "img/果果箱.png";
  } else if (productName === "菜菜箱") {
    Img = "img/菜菜箱.png";
  } else if (productName === "盛產箱") {
    Img = "img/盛產箱.png";
  } else if (productName === "中秋箱") {
    Img = "img/中秋箱.png";
  } else {
    Img = "img/自選蔬果箱.png";
  }
  if (
    commodity === "雙人箱(1~2人)" ||
    commodity === "雙人箱(30day)" ||
    commodity === "雙人箱(60day)"
  ) {
    price = doublePriceText;
  } else {
    price = familyPriceText;
  }
  if (commodity === "雙人箱(60day)" || commodity === "家庭箱(60day)") {
    price *= 2;
  }
  if (productName === "自選蔬果箱") {
    var commodity2 = $(".fv_con .buyfv").text();
    price = wowprice;
  } else {
    if (commodity === "雙人箱(1~2人)") {
      commodity2 = concon;
    } else {
      commodity2 = concon2;
    }
  }
  let newProduct = `
      <li class="product" id="Newprod${productCount}" >
      <a href="JavaScript:vold(0)" class="product-link">
      <span class="product-image me-2">
          <img
          src="${Img}"
          alt="Product Photo"
          />
      </span>
      <span class="product-details">
          <h3>${productName}</h3>
          <span class="qty-price">
          <span class="qty">
          <div class="d-flex flex-column">
          <p class="m-1">${commodity}</p>
          <p class="m-1"><span class='comcon'>${commodity2}</span></p>
          <p class="m-1"><span>數量:</span><span>${sumValue}</span></p>
          </div>
              <input
              type="hidden"
              name="item-price"
              id="item-price-1"
              value="12.00"
              />
          </span>
          <span class="price">${price * sumValue}</span>
          </span>
      </span>
      </a>
      <a href="#remove" class="remove-button"
      ><i class="fa-solid fa-trash"></i
      ></a>
      </li>
      `;
  $(".products").append(newProduct);
  productCount += 1;
  rset();
}
$(".addCard")
  .off("click")
  .on("click", function (evt) {
    var cardDataArr = [];
    var userData = localStorage.getItem("token");
    var userToken = userData ? JSON.parse(userData) : false;
    if (userToken == false) {
      Swal.fire({
        title: "請先登入會員",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500,
      }).then(
        setTimeout(() => {
          $("#checkUser").modal("show");
        }, 2000)
      );
    } else {
      // 获取产品信息
      const selectElement = document.querySelector(".commodity");
      const selectedSize =
        selectElement.options[selectElement.selectedIndex].getAttribute(
          "data-size"
        );
      let container = $(this).closest(".middle_Con");
      let section = $(this).closest("section");
      let sumValue = container.find(".sum").text();
      let productName = section.find("h3").text();
      var commodity = container.find(".commodity option:selected").text();
      let freq = container.find(".commodity option:selected").val();
      let newProductId = `Newprod${productCount}`;
      let addButton = $(this);
      var commodity2 = $(".fv_con .buyfv").text().replace(/\s+/g, "");

      if (productName === "自選蔬果箱") {
        if (commodity !== "") {
          commodity += ",";
        }
        commodity += commodity2 + ",";

        if ($(".buyfv").text() === "") {
          Swal.fire({
            title: "請先添加水果",
            icon: "warning",
            showConfirmButton: false,
            timer: 1500,
          }).then(function () {
            $(".fv_box, .black").show();
            $("body").addClass("body-no-scroll");
          });

          // 阻止表單提交
          evt.preventDefault(); // 如果這裡有 evt 對象的話，否則你需要獲取事件對象
          return;
        }
      }

      addProduct(addButton);
      open();

      var cardData = {
        fid: newProductId,
        uid: userToken.id,
        quantity: sumValue,
        c_option: commodity,
        product: productName,
        size: selectedSize,
        freq: freq,
      };

      cardDataArr.push(cardData);

      $.ajax({
        type: "POST", // 使用 POST 发送数据
        url: "/cardData",
        data: JSON.stringify(cardDataArr),
        contentType: "application/json",
        success: function (response) {
          console.log("成功添加卡片:", response);
        },
        error: function (error) {
          console.error("添加卡片錯誤:", error);
        },
      });
    }
  });
