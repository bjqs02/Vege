window.onload = function () {
  // 先抓token跟登入帳號
  var userData = localStorage.getItem("token");
  var userToken = userData ? JSON.parse(userData) : false;
  console.log(userToken);
  

  // 登入與否 會跳出登出的button, 使用者名字 跟 使用者設定的大頭貼
  if (userToken) {
    console.log("登入狀態");
    $("#userName").text(userToken.name || "hi user");
    $("#logoutBTN").css("visibility", "visible");
    $("#navUser").html(
      userToken.img
        ? `<img src="${userToken.img}" class="img-fluid"/>`
        : `<i class="fa-solid fa-user"></i>`
    );
    $('#nowUserImg').prop('src',`${userToken.img}`);
  } else {
    console.log("非登入狀態");
  }

  

  // 點選人像的話: 已登入=>導向會員頁面 | 未登入=>跳出登入框
  navUser.onclick = function () {
    if (userToken) {
      location.href = "/member";
    } else {
      $("#checkUser").modal("show");
    }
  };

  // 點選登出 會更新token並更新頁面
  logoutBTN.onclick = function (e) {
    e.preventDefault();
    var JSONData = JSON.stringify(userToken);
    console.log(JSONData);
    fetch("/login/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: userToken.token,
      },
      body: JSONData,
    }).then(function (response) {
      console.log(response);
      localStorage.removeItem("token");
      document.cookie = `token = ${userToken.token}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `user=${userToken.id}; expires=Thu, 01 Jan 1970 00:00:00 UTC; Domain=127.0.0.1; path=/; port=2407`;
      location.reload();
    });
  };

  // 登入按鈕按下去會先確認email, 依照回傳值重新導向註冊/登入頁面
  checkEmail.onclick = function (e) {
    e.preventDefault();
    var data = { mail: "" };
    data.mail = document.getElementById("userEmail").value;
    var JSONData = JSON.stringify(data);
    // console.log(JSONData);
    fetch("/login/checkmail", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSONData,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonObj) {
        console.log(jsonObj[0]);
        if (jsonObj[0] == undefined) {
          console.log("查無資料");
          location.href = "/login/register";
        } else {
          console.log("是會員喔");
          location.href = "/login/userlogin";
        }
      });
  };

  // Header
  function addHclass() {
    $("#vg-navbar").addClass("change");
    $("#navUser").addClass("navIcon-down change");
    $("#navCart").addClass("navIcon-down");
    $(".bag-count").addClass("bag-count-down");
    $(".fa-cart-shopping").addClass("change");

    // seed-icon
    $(".btn-vg-2").hover(
      function () {
        $(this).addClass("change");
      },
      function () {
        $(this).removeClass("change");
      }
    );
  }

  function removeHclass() {
    $("#vg-navbar").removeClass("change");
    $("#navUser").removeClass("navIcon-down change");
    $("#navCart").removeClass("navIcon-down");
    $(".bag-count").removeClass("bag-count-down");
    $(".fa-cart-shopping").removeClass("change");

    $(".btn-vg-2").hover(function () {
      $(this).removeClass("change");
    });
  }

  // navbar-2 slideDown
  // function slideFunction() {
  //     let scrollH = $(this).scrollTop();
  //     // 306 = {$('.vg-navbar-2').offset().top} - {$('.vg-navbar-2').height}
  //     if (scrollH > 306) {
  //         $('.vg-navbar-2').addClass('sticky');
  //     } else {
  //         $('.vg-navbar-2').removeClass('sticky');
  //     }
  // }

  // let beforeY = $(window).scrollTop();
  // function upSlidownFunction() {
  //     const afterY = $(this).scrollTop();
  //     // const yDirection = ( afterY > beforeY)? 'down' : ((afterY === beforeY)? 'none' : 'up');
  //     // console.log(yDirection);
  //     if (afterY > beforeY) {
  //         $('.vg-navbar-2').removeClass('sticky');
  //     } else {
  //         $('.vg-navbar-2').addClass('sticky');
  //     }

  //     beforeY = afterY;  // update last scroll position
  // }

  // 視窗滾動時
  // Header: 判斷視窗是否 > 800 且 滾動 > 80
  // navbar-2 :視窗 < 800時，scrollup navbar-2 slideDown ;
  //                        scrolldown navbar-2 slideUp && hidden
  // console.log('add');
  // console.log('remove');
  function scrollFunction() {
    if (this.innerWidth > 800) {
      if (this.scrollY > 80) {
        addHclass();
      } else {
        removeHclass();
      }
      // slideFunction();  // navbar-2
    } else {
      removeHclass();
      // upSlidownFunction();  // navbar-2
    }
  }

  // 視窗resize
  function resizeFunction() {
    if (this.scrollY > 80) {
      if (this.innerWidth < 800) {
        removeHclass();
        // slideFunction();  // navbar-2
      } else {
        addHclass();
        // upSlidownFunction();  // navbar-2
      }
    }
  }

  scrollFunction();
  $(window).scroll(scrollFunction);
  $(window).resize(resizeFunction);

  // 文章段落
  $(`#sec1`).on({
    mouseover: function () {
      // console.log(this);
      $(`#title1`).addClass("btn-vg-3-active");
    },
    mouseout: function () {
      $(`#title1`).removeClass("btn-vg-3-active");
    },
  });
  $(`#sec2`).on({
    mouseover: function () {
      // console.log(this);
      $(`#title2`).addClass("btn-vg-3-active");
    },
    mouseout: function () {
      $(`#title2`).removeClass("btn-vg-3-active");
    },
  });
  $(`#sec3`).on({
    mouseover: function () {
      // console.log(this);
      $(`#title3`).addClass("btn-vg-3-active");
    },
    mouseout: function () {
      $(`#title3`).removeClass("btn-vg-3-active");
    },
  });

  // })

  //  購物車側攔的JS設置

  var $body = $("body");

  $(".cart-button").click(function (e) {
    e.preventDefault();
    if (!userToken) {
      alert("請先登入");
    } else {
      $body.addClass("show-sidebar-cart");
      $("#sidebar-cart-curtain").fadeIn(500);
    }
  });
  $(".close-button, #sidebar-cart-curtain").click(function (e) {
    e.preventDefault();
    $body.removeClass("show-sidebar-cart");
    $("#sidebar-cart-curtain").fadeOut(500);
  });


};

function myDropNav1() {
  var x = document.getElementById("vg-navbar");
  if (x.className === "vg-nav") {
    x.className += " responsive";
  } else {
    x.className = "vg-nav";
  }
}

function myDropNav2() {
  var y = document.getElementById("vg-navbar-2");
  if (y.className === "vg-navbar-2") {
    y.className += " responsive";
  } else {
    y.className = "vg-navbar-2";
  }
}

function openPolicy() {
  $("#policy").modal("show");
}

function openMemberPolicy() {
  $("#memberPolicy").modal("show");
}

$(document).ready(function () {
  let $body = $("body");
  // 打開開購物車
  function open() {
    $body.addClass("show-sidebar-cart");
    $("#sidebar-cart-curtain").fadeIn(500);
  }

  // 點選當前選addCard 的打開開購物車新增產品
  let productCount = 0;

  //   $(".addCard").on("click", function () {});

  // 新增產品
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
    if (!commodity) {
      commodity = $(".fv_con .buyfv").text();
      price = wowprice;
    }
    let newProduct = `
        <li class="product" id="product-${productCount}" >
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
            <p class="m-1"></p>
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
    .on("click", function () {
      var cardDataArr = []; // 创建一个空数组来存储卡片数据

      // 获取产品信息
      let container = $(this).closest(".middle_Con");
      let section = $(this).closest("section");
      let sumValue = container.find(".sum").text();
      let productName = section.find("h3").text();
      let commodity = container.find(".commodity option:selected").text();
      let newProductId = `product-${productCount}`;
      let addButton = $(this); // 获取点击的按钮
      addProduct(addButton);
      open();
      // 创建卡片数据对象
      var cardData = {
        productId: newProductId,
        productName: productName,
        commodity: commodity,
        sumValue: sumValue,
      };

      // 将卡片数据添加到数组
      cardDataArr.push(cardData);

      // 发送AJAX请求
      $.ajax({
        type: "POST",
        url: "/cardData",
        data: JSON.stringify(cardDataArr), // 将卡片数据数组转换为JSON字符串
        contentType: "application/json",
        success: function (res) {
          console.log("傳送成功");
        },
        error: function (error) {
          console.log("傳送失敗" + error);
        },
      });
    });

  $(".products")
    .off("click", ".remove-button")
    .on("click", ".remove-button", function () {
      let product = $(this).closest(".product");
      let productId = product.attr("id");
      console.log(productId);
      let productName = product.find("h3").text();

      let delcon = `pid = ${productId}`;

      let deleteQuery = `DELETE FROM text WHERE ${delcon}`;
      removeProduct(productId);
      rset();
      // 执行删除操作
      $.ajax({
        type: "POST",
        url: "/delcardData",
        data: JSON.stringify({ productId: productId }),
        contentType: "application/json",
        success: function (res) {
          console.log("成功刪除");
        },
        error: function (error) {
          console.log("刪除失敗" + error);
        },
      });
    });

  function rset() {
    total = 0;
    $(".product").each(function () {
      var productPrice = parseFloat($(this).find(".price").text());
      total += isNaN(productPrice) ? 0 : productPrice;
    });

    $(".amount").text(total);
    var count = $(".product").length;
    count = $(".product").length;
    $(".bag-count").text(count);
    $(".count").text(count);
  }
  // 點選remove-button 刪除當前產品id
  function removeProduct(productId) {
    $("#" + productId).remove();
  }

  // $(".close-button, #sidebar-cart-curtain").click(function (e) {
  //   e.preventDefault();
  //   $body.removeClass("show-sidebar-cart");
  //   $("#sidebar-cart-curtain").fadeOut(500);
  // });
});
