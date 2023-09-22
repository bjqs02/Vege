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
    let nav = $(this).closest("div");
    nav.children(".fu_nav").eq(0).addClass("act");
    fetchImagesFromDatabase();
    $(".f_2").find("i, img").remove();
    selectedTotalPay = 0;
    $(".f_1.clt").removeClass("clt");
    $(".fv_con .buyfv").empty();
    $(".price4").text(0);
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
  $(".f_1").find("i, img").remove();
  let sel = $(this).closest("section");
  sel.find(".fu_nav").removeClass("act");
  var index = $(".fu_nav").index(this);
  $(".middle_Con").eq(index).show();
  $(this).addClass("act");
});

let fv_all = $(this).closest(".fv_all");
let selectedSize = fv_all.find(".commodity option:selected").data("size");

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
  $(".f_1").find("i,img");
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
  var cons = $(this);
  cons.find(".f_1").on("click", function () {
    var dataPay = parseInt($(this).data("pay")); // 获取并转换data-pay属性值为整数

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
  $(".f_2").find("i, img").remove();
  $("body").css("overflow", "auto");
  $(".modal-backdrop.show").css("display", "none");
  $(".fv_box, .black").hide();
  $("body").removeClass("body-no-scroll");
  selectedTotalPay = 0;
  $(".f_1.clt").removeClass("clt");
  $(".fv_con .buyfv").empty();
  $(".price4").text(0);
});

// chage 選擇蔬果 按鈕 點擊顯示水果頁面
$(".chage").on("click", function () {
  $(".fv_box, .black").show();
  $("body").addClass("body-no-scroll");
});

//  前往商品頁 =>  選擇蔬果頁面打開

// 處理json資料
let f1Elements; // 在全局作用域下声明
function set(responseData) {
  let f1Elements = document.querySelectorAll(".f_2");

  for (let i = 0; i < f1Elements.length; i++) {
    let f1Text = f1Elements[i].textContent.trim();
    let dataPay = parseInt($(f1Elements[i]).data("pay"));

    for (let j = 0; j < responseData.length; j++) {
      if (responseData[j].product.trim() === f1Text) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/gettemp", true);

        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              let newData = JSON.parse(xhr.responseText);

              newData.forEach((item) => {
                if (f1Text === item.product) {
                  let iconElement;
                  if (item.Temp === "hot") {
                    iconElement = createIconElement("fa-fire", "#ff0000");
                    $(f1Elements[i]).addClass("clt");
                  } else if (item.Temp === "cold") {
                    iconElement = createIconElement(
                      "fa-snowflake",
                      "rgb(142, 169, 215)"
                    );
                    $(f1Elements[i]).addClass("clt");
                  } else {
                    iconElement = createImageElement("/img/天平.png");
                    $(f1Elements[i]).addClass("clt");
                  }

                  f1Elements[i].appendChild(iconElement);
                }
              });
            } else {
              console.log("Error");
            }
          }
        };

        xhr.send();

        if ($(f1Elements[i]).hasClass("clt")) {
          $(f1Elements[i]).removeClass("clt");
          dataPay *= -1;
        } else {
          $(f1Elements[i]).addClass("clt");
        }

        selectedTotalPay += dataPay;
        updateTotalPayMessage();
      }
    }
  }
}

function createIconElement(className, color) {
  let iconElement = document.createElement("i");
  iconElement.className = "fa-solid " + className;
  iconElement.style.color = color;
  return iconElement;
}

function createImageElement(src) {
  let imgElement = document.createElement("img");
  imgElement.className = "bs";
  imgElement.src = src;
  return imgElement;
}

function updateTotalPayMessage() {
  var over = $(".over");

  if (selectedTotalPay < minTotalPay) {
    over.text("您少於" + minTotalPay);
  } else if (selectedTotalPay > maxTotalPay) {
    over.text("您超過" + maxTotalPay);
  } else {
    over.text(" ");
  }

  $(".mo_con .goSure").on("click", function () {
    $(".modal-backdrop.show").css("display", "none");
    function applyShakingEffect(overElement) {
      overElement.addClass("shaking");
      setTimeout(function () {
        overElement.removeClass("shaking");
      }, 1000);
    }

    let over = $(this).closest(".mo_con").find(".over");
    if (!$(".f_1").hasClass("clt")) {
      applyShakingEffect($(".f_1"));
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

      let buyText = $(".f_1.clt").text();
      let buyTextArray = buyText.split("\n").map((item) => item.trim()); // 将文本按换行符分割成数组，并去除首尾空格

      // 去除空字符串并拼接成字符串
      let formattedBuyText = buyTextArray
        .filter((item) => item !== "")
        .join(",");

      let buyfvElement = $(this).closest(".middle_Con").find(".buyfv");
      // var buyfvElement = $(".fv_con .buyfv");
      buyfvElement.text(formattedBuyText);
      $(".fv_box, .black").hide();
      $("body").removeClass("body-no-scroll");
      $("body").css("overflow", "auto");
    }
  });
}
// ----------商品確認鍵
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

    var formattedBuyText = buyTextArray.filter((item) => item !== "").join(",");

    let buyfvElement = $(this).closest(".middle_Con").find(".buyfv");
    buyfvElement.text(formattedBuyText);
    $(".fv_box, .black").hide();
    $("body").removeClass("body-no-scroll");
    $("body").css("overflow", "auto");
  }
});

$(".f_1").on("click", function () {
  let selectedBook = $(this).text().replace(/\s+/g, ""); // 获取当前点击的典籍的文本内容
  let xhr2 = new XMLHttpRequest();
  let $selectedBook = $(this); // 转换为jQuery对象
  let iconElement; // 用于存储图标元素
  if ($selectedBook.hasClass("clt")) {
    xhr2.open("GET", "/gettemp", true);
    xhr2.onreadystatechange = function () {
      if (xhr2.readyState === XMLHttpRequest.DONE) {
        if (xhr2.status === 200) {
          let newData = JSON.parse(xhr2.responseText);
          newData.forEach((item) => {
            if (selectedBook.includes(item.product)) {
              if (item.Temp === "hot") {
                iconElement = document.createElement("i");
                iconElement.className = "fa-solid fa-fire";
                iconElement.style.color = "#ff0000";
              } else if (item.Temp === "cold") {
                iconElement = document.createElement("i");
                iconElement.className = "fa-solid fa-snowflake";
                iconElement.style.color = "rgb(142, 169, 215)";
              } else {
                iconElement = document.createElement("img");
                iconElement.className = "bs";
                iconElement.src = "/img/天平.png";
              }
            }
          });
          $selectedBook.find("i, img").remove();
          if (iconElement) {
            $selectedBook.append(iconElement);
          }
        } else {
          console.log("Failed to retrieve data");
        }
      }
    };
    xhr2.send(); // 发送XMLHttpRequest请求
  } else {
    // 删除已有的图标元素
    $selectedBook.find("i, img").remove();
  }
});

$("select").on("click", function () {
  if ($(this).val() === "") {
    $(this).css("background-color", "white");
    $(this).css("color", "black"); // 或者你想要的文字颜色
  } else {
    $(this).css("background-color", "#0D5946");
    $(this).css("color", "white");
  }
});

function refreshData() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/getinfo", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let newData = JSON.parse(xhr.responseText)[0];

        // 選擇所有符合條件的元素並更新內容
        for (let i = 0; i < 7; i++) {
          $(".smtext .productInfo")[i].textContent = newData.product;
          $(".smtext .saveOrigin")[i].textContent = newData.Origin;
          $(".smtext .saveInfo")[i].textContent = newData.save;
          $(".smtext .noteInfo")[i].textContent = newData.note;
        }
      } else {
        console.log("Failed to retrieve data");
      }
    }
  };
  xhr.send();
}

setInterval(refreshData, 2000);
const imagesFromDatabase = [];

function fetchImagesFromDatabase() {
  fetch("/api/images")
    .then((response) => response.json())
    .then((image) => {
      const imgElements = document.querySelectorAll(".ch");
      imgElements.forEach((img, index) => {
        img.src = image[index];
      });
    })
    .catch((error) => console.error("Error fetching images:", error));
}
