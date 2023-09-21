document.addEventListener("DOMContentLoaded", () => {
  var userData = localStorage.getItem("token");
  var userToken = userData ? JSON.parse(userData) : false;
  let userId = userToken.id;

  fetch(`/cart/item/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      const cartItemsContainer = document.getElementById("productss");
      cartItemsContainer.innerHTML = "";

      data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.className = "product";
        listItem.id = `${item.fid}`;

        if (!item.day == "") {
          item.day = "配送日:" + item.day;
        }
        listItem.innerHTML = ` <a class="product-link">
        <span class="product-image me-2">
            <img
            src="${item.img}"
            alt="Product Photo"
            />
        </span>
        <span class="product-details">
            <h3>${item.pname}</h3>
            <span class="qty-price">
            <span class="qty">
            <div class="d-flex flex-column">
            <p class="m-1 fs-6">${item.c_option}</p>
            <p class="m-1 fs-6"><span class='comcon'></span></p>
            <p class="m-1 fs-6"><span class='comcon2'>${item.day}</span></p>
            <p class="m-1 fs-6"><span>數量:</span><span>${item.quantity}</span></p>
            </div>
                <input
                type="hidden"
                name="item-price"
                id="item-price-1"
                value="12.00"
                />
            </span>
            <span class="price">${item.money}</span>
            </span>
        </span>
        </a>
        <a  class="remove-button"
        ><i class="fa-solid fa-trash"></i
        ></a>`;
        cartItemsContainer.appendChild(listItem);
      });

      rset();
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
    })
    .catch((error) => console.error("Error fetching cart items:", error));
});

window.onload = function () {
  // 先抓token跟登入帳號
  var userData = localStorage.getItem("token");
  var userToken = userData ? JSON.parse(userData) : false;

  // 登入與否 會跳出登出的button, 使用者名字 跟 使用者設定的大頭貼
  if (userToken) {
    console.log("登入狀態");
    userToken.name
      ? $("#userName").text(`Hi! ${userToken.name}`)
      : $("#userName").text(`Hi! 新朋友`);
    $("#logoutBTN").css("visibility", "visible");
    $("#navUser").html(
      userToken.img
        ? `<img src="${userToken.img}"/>`
        : `<i class="fa-solid fa-user"></i>`
    );
    $("#navUser").addClass("login");
    $("#nowUserImg").prop("src", `${userToken.img}`);
  } else {
    console.log("非登入狀態");
  }

  // 點選人像的話: 已登入=>導向會員頁面 | 未登入=>跳出登入框
  navUser.onclick = function () {
    if (userToken) {
      location.href = "/member";
    } else {
      var now = new Date();
      var expirationTime = new Date(now.getTime() + 1 * 60 * 60 * 1000);
      var locationLength = window.location.href.length;
      var hereLocation = window.location.href.substring(21, locationLength - 1);
      if (hereLocation == "") {
        hereLocation = "/";
      }
      // console.log(location);
      document.cookie = `location=${hereLocation}; expires=${expirationTime.toUTCString()}; Domain=127.0.0.1; path=/; port=2407`;
      $("#checkUser").modal("show");
    }
  };

  // 點選登出 會更新token並更新頁面
  logoutBTN.onclick = function (e) {
    e.preventDefault();
    var JSONData = JSON.stringify(userToken);
    fetch("/login/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: userToken.token,
      },
      body: JSONData,
    }).then(function (response) {
      localStorage.removeItem("token");
      localStorage.removeItem("oName");
      localStorage.removeItem("oTel");
      localStorage.removeItem("oMail");
      localStorage.removeItem("convName");
      localStorage.removeItem("convTel");
      localStorage.removeItem("optionPrice");
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
    var now = new Date();
    var expirationTime = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    document.cookie = `email=${
      data.mail
    }; expires=${expirationTime.toUTCString()}; Domain=127.0.0.1; path=/; port=2407`;

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
    $("#logoutBTN").addClass("change");
    $("#userName").addClass("change");
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
    $("#logoutBTN").removeClass("change");
    $("#userName").removeClass("change");
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
      $(`#title1`).addClass("btn-vg-3-active");
    },
    mouseout: function () {
      $(`#title1`).removeClass("btn-vg-3-active");
    },
  });
  $(`#sec2`).on({
    mouseover: function () {
      $(`#title2`).addClass("btn-vg-3-active");
    },
    mouseout: function () {
      $(`#title2`).removeClass("btn-vg-3-active");
    },
  });
  $(`#sec3`).on({
    mouseover: function () {
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
  // 開啟購物車頁面
  let $body = $("body");
  function open() {
    $body.addClass("show-sidebar-cart");
    $("#sidebar-cart-curtain").fadeIn(500);
  }

  // 點選當前選addCard 的打開開購物車新增產品
  let productCount = 0;

  // 新增產品
  function addProduct(addButton) {
    let container = addButton.closest(".middle_Con");

    let section = addButton.closest("section");
    let sumValue = container.find(".sum").text();
    let productName = section.find("h3").text();
    let commodity = container.find(".commodity:first option:selected").text();
    let lostcommodity = container
      .find(".commodity:last option:selected")
      .text();
    let doublePriceText = container.find(".price1").text();
    let familyPriceText = container.find(".price3").text();
    let wowprice = container.find(".price4").text();
    let price = 0;
    let Img = "";
    let commodity2 = $(".fv_con .buyfv").text();

    let productImageMap = {
      蔬果健康箱: "img/蔬果健康箱.png",
      蔬果減脂箱: "img/蔬果減脂箱.png",
      果果箱: "img/果果箱.png",
      菜菜箱: "img/菜菜箱.png",
      盛產箱: "img/盛產箱.png",
      中秋箱: "img/中秋箱.png",
      自選蔬果箱: "img/自選蔬果箱.png",
    };

    let defaultImage = "img/自選蔬果箱.png";
    Img = productImageMap[productName] || defaultImage;

    if (productName === "自選蔬果箱") {
      price = parseInt(wowprice, 10); // 解析为整数
    } else {
      if (commodity == "雙人箱(1~2人)") {
        price = parseInt(doublePriceText, 10); // 解析为整数
      } else if (commodity == "家庭箱(3~4人)") {
        price = parseInt(familyPriceText, 10); // 解析为整数
      } else if (commodity == "雙人箱(30day)" || commodity == "雙人箱(60day)") {
        price = parseInt(doublePriceText, 10) * 4;
      } else if (commodity == "家庭箱(30day)" || commodity == "家庭箱(60day)") {
        price = parseInt(familyPriceText, 10) * 4;
        console.log($(".price3"));
      } else {
        Swal.fire({
          title: "請選擇產品規格",
          icon: "warning",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {});
        evt.preventDefault();
        return;
      }
    }

    let money = price * sumValue;
    if (!lostcommodity == "") {
      lostcommodity =
        "配送日: " + container.find(".commodity:last option:selected").text();
    }

    console.log(money);
    let newProduct = `
        <li class="product" id="Newprod${productCount}" >
        <a  class="product-link">
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
            <p class="m-1 fs-6">${commodity}</p>
            <p class="m-1 fs-6"><span class='comcon2'>${lostcommodity}</span></p>
            <p class="m-1 fs-6"><span class='comcon'>${commodity2}</span></p>
            <p class="m-1 fs-6"><span>數量:</span><span>${sumValue}</span></p>
            </div>
                <input
                type="hidden"
                name="item-price"
                id="item-price-1"
                value="12.00"
                />
            </span>
            <span class="price">${money}</span>
            </span>
        </span>
        </a>
        <a class="remove-button"
        ><i class="fa-solid fa-trash"></i
        ></a>
        </li>
        `;
    $(".products").append(newProduct);
    productCount += 1;
    rset();
  }

  $("select").on("change", function (evt) {
    let container = $(this).closest(".middle_Con");
    let div = $(this).closest("div");
    let days = div.find(".day");
    let day = div.find(".day option:selected").text();
    let commodity = container.find(".commodity:first option:selected").text();
    if (commodity == "雙人箱(30day)" || commodity == "雙人箱(60day)") {
      days.css("display", "inline");
    } else if (commodity == "家庭箱(30day)" || commodity == "家庭箱(60day)") {
      days.css("display", "inline");
    } else {
      days.css("display", "none");
    }
  });

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
          }, 500)
        );
      } else {
        let div = $(this).closest("div");

        let days = div.find(".day");
        let day = div.find(".day option:selected").text();
        if (day === "" && days.css("display") === "inline") {
          Swal.fire({
            title: "請選擇配送日",
            icon: "warning",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {});
          evt.preventDefault();
          return;
        }
        // 获取产品信息
        // var selectedSize = $("#commodity option:selected").data("size");
        let container = $(this).closest(".middle_Con");

        let section = $(this).closest("section");
        let sumValue = container.find(".sum").text();
        let productName = section.find("h3").text();
        let commodity = container
          .find(".commodity:first option:selected")
          .text();
        let lostcommodity = container
          .find(".commodity:last option:selected")
          .text();
        let freq = container.find(".commodity option:selected").val();
        let newProductId = `Newprod${productCount}`;
        let addButton = $(this);
        let commodity2 = $(".fv_con .buyfv").text().replace(/\s+/g, "");
        let selectedSize = div.find(".commodity option:selected").data("size");
        let price = 0;
        let doublePriceText = container.find(".price1").text();
        let familyPriceText = container.find(".price3").text();
        let wowprice = container.find(".price4").text();

        if (productName === "自選蔬果箱") {
          price = parseInt(wowprice, 10); // 解析为整数
        } else {
          if (commodity == "雙人箱(1~2人)") {
            price = parseInt(doublePriceText, 10); // 解析为整数
          } else if (commodity == "家庭箱(3~4人)") {
            price = parseInt(familyPriceText, 10); // 解析为整数
          } else if (
            commodity == "雙人箱(30day)" ||
            commodity == "雙人箱(60day)"
          ) {
            price = parseInt(doublePriceText, 10) * 4;
            $(".day").css("display", "inline");
          } else if (
            commodity == "家庭箱(30day)" ||
            commodity == "家庭箱(60day)"
          ) {
            price = parseInt(familyPriceText, 10) * 4;
            $(".day").css("display", "inline");
            console.log($(".price3"));
          } else {
            Swal.fire({
              title: "請選擇產品規格",
              icon: "warning",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {});
            evt.preventDefault();
            return;
          }
        }

        let money = price * sumValue;

        if (productName === "自選蔬果箱") {
          commodity = sanitizeString(commodity);
          commodity2 = sanitizeString(commodity2);

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
            }).then(() => {
              $(".fv_box, .black").show();
              $("body").addClass("body-no-scroll");
            });

            evt.preventDefault();
            return;
          }
        }
        open();
        addProduct(addButton);

        var cardData = {
          fid: newProductId,
          uid: userToken.id,
          quantity: sumValue,
          c_option: commodity,
          product: productName,
          size: selectedSize,
          freq: freq,
          money: money,
          day: lostcommodity,
        };
        cardDataArr.push(cardData);

        $.ajax({
          type: "POST",
          url: "/cardData",
          data: JSON.stringify(cardDataArr),
          contentType: "application/json",
          success: function (response) {
            console.log("成功添加卡片:", response);
            console.log(cardDataArr); // 在异步操作的回调函数中处理数据
          },
          error: function (error) {
            console.error("添加卡片錯誤:", error);
          },
        });
      }
    });

  function sanitizeString(str) {
    return str.replace(/\s+/g, " ").trim();
  }

  $(".products")
    .off("click", ".remove-button")
    .on("click", ".remove-button", function () {
      let delDataArr = [];
      var userData = localStorage.getItem("token");
      var userToken = userData ? JSON.parse(userData) : false;
      let product = $(this).closest(".product");
      let productId = product.attr("id");
      let userId = userToken.id;

      let delcart = {
        productId: productId,
        userId: userId,
      };
      removeProduct(productId);
      rset();

      delDataArr.push(delcart);
      $.ajax({
        type: "POST",
        url: "/delcartData",
        data: JSON.stringify(delDataArr),
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
  function removeProduct(productId) {
    $("#" + productId).remove();
  }
});
