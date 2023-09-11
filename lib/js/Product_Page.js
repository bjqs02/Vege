// ------顯示第一个 "middle_box1" 元素
var middleBoxElements = document.getElementsByClassName("middle_box1");
// 隐藏所有的 "middle_box1" 元素
for (var i = 0; i < middleBoxElements.length; i++) {
  middleBoxElements[i].style.display = "none";
}
if (middleBoxElements.length > 0) {
  middleBoxElements[0].style.display = "flex";
}
// ------顯示第一个 "middle_box1" 元素

// ------點選產品展開內容
function openCity(evt, IdName) {
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
}

// ------點選菜單展開內容
function openMnav(index) {
  $(".middle_Con").css("display", "none");

  $(".middle_Con:eq(" + index + ")")
    .css("display", "block")
    .prev(".fu_nav");
}
$(document).ready(function () {
  const firstMiddleCon = $(".middle_Con").first();
  const firstFuNav = $(".fu_nav").first();
  if (firstMiddleCon.length > 0 && firstFuNav.length > 0) {
    const index = $(".fu_nav").index(firstFuNav);
    openMnav(index);
  }
});
// ------點選菜單展開內容

$(document).ready(function () {
  $("section").each(function () {
    $(this).find(".middle_Con").eq(0).css("display", "block");
  });

  $(".fu_nav").click(function () {
    $("section").each(function () {
      $(this).find(".middle_Con").eq(0).css("display", "block");
    });
    let $section = $(this).closest("section");
    let index = $(this).closest(".fu_Mnav").find(".fu_nav").index(this);
    $section.find(".middle_Con").css("display", "none");
    $section.find(".middle_Con").eq(index).css("display", "block");
  });
});
// 圖片切換
$(document).ready(function () {
  $(".ch").click(function () {
    var newImageUrl = $(this).attr("src");
    var parentBlock = $(this).closest(".middle_img");
    parentBlock.find(".mainImg").attr("src", newImageUrl);
  });
});
// 加減數量
$(".fa-plus").on("click", function () {
  // 找到相關的 span 元素
  var $sumSpan = $(this).siblings(".sum");
  // 獲取目前的數字並將其轉換為整數
  var currentNumber = parseInt($sumSpan.text(), 10);
  // 更新數字+1
  currentNumber += 1;
  // 更新 span 元素的文本
  $sumSpan.text(currentNumber);
});

$(".fa-minus").on("click", function () {
  // 找到相關的 span 元素
  var $sumSpan = $(this).siblings(".sum");
  // 獲取目前的數字並將其轉換為整數
  var currentNumber = parseInt($sumSpan.text(), 10);
  // 更新數字-1
  currentNumber -= 1;
  // 更新 span 元素的文本
  currentNumber = currentNumber > 1 ? currentNumber - 1 : 1;
  $sumSpan.text(currentNumber);
});

$(document).ready(function () {
  // 默认显示每个 section 中的第一个 middle_Con
  $("section").each(function () {
    $(this).find(".middle_Con").eq(0).css("display", "block");
  });

  // 点击按钮切换中间内容的显示和隐藏

  var minTotalPay = 400;
  var maxTotalPay = 600;

  var selectedTotalPay = 0;
  $(".fu_nav").click(function () {
    $(".f_1.clt").removeClass("clt");
    $(".middle_Con .price4").empty();
    selectedTotalPay = 0;
    console.log(selectedTotalPay);
    $(".fv_con .buyfv").empty();
    // 获取按钮所在的 section
    let $section = $(this).closest("section");
    // 获取按钮在当前 section 中的索引
    let index = $(this).closest(".fu_Mnav").find(".fu_nav").index(this);

    // 隐藏当前 section 中的所有 middle_Con
    $section.find(".middle_Con").css("display", "none");

    // 显示当前 section 中对应索引的 middle_Con
    $section.find(".middle_Con").eq(index).css("display", "block");
  });
  $(".cons").each(function () {
    var cons = $(this); // 当前的 .cons 元素

    // 在当前 .cons 元素内部查找 .f_1 按钮并绑定点击事件
    cons.find(".f_1").on("click", function () {
      var dataPay = parseInt($(this).data("pay")); // 获取并转换data-pay属性值为整数
      var itemCount = parseInt($(this).find(".item-count").text()); // 获取当前数量

      if ($(this).hasClass("clt")) {
        // 如果已经被选中，取消选中
        $(this).removeClass("clt");
        selectedTotalPay -= dataPay; // 减去取消选中的按钮的data-pay值
      } else {
        // 如果未被选中，选中它
        $(this).addClass("clt");
        selectedTotalPay += dataPay; // 增加选中按钮的data-pay值
      }

      console.log(selectedTotalPay);

      // 查找包含当前按钮的父元素中的 .over 元素
      var over = $(this).closest(".mo_con").find(".over");

      // 在这里可以根据需要执行其他操作，例如更新总金额等
      if (selectedTotalPay < minTotalPay) {
        over.text("您少於" + minTotalPay + "元");
      } else if (selectedTotalPay > maxTotalPay) {
        over.text("您超過" + maxTotalPay + "元");
      } else {
        over.text(" ");
      }
    });
  });

  // 在需要时访问tota变量获取当前区块内的data-pay总和

  $(".btn-close").on("click", function () {
    $(".fv_box, .black").hide();
    $("body").removeClass("body-no-scroll");
    selectedTotalPay = 0;
    console.log(selectedTotalPay); // 输出重置后的值
    $(".f_1.clt").removeClass("clt");
    $(".fv_con .buyfv").empty();
  });

  $(".chage").on("click", function () {
    $(".fv_box, .black").show();
    $("body").addClass("body-no-scroll");
  });

  // 當我點選確認
  // 所選取的值會給予內容然後保留原本的
  // 但我點選了X 就會全部清空
  // 當我切換畫面所選取金額歸0
  $(".mo_con .goSure").on("click", function () {
    let middle_Con = $(this).closest(".middle_Con").find(".price4");
    // 查找包含类名为 "clt" 的按钮，并获取其文本内容
    middle_Con.empty();
    var selectedButtons = $(this).closest(".mo_con").find(".f_1.clt");
    var selectedFruits = selectedButtons
      .map(function () {
        return $(this).text();
      })
      .get();
    // 将选中按钮的文本内容显示在 <strong class="buyfv commodity"></strong> 元素中
    var buyfvElement = $(".fv_con .buyfv");
    console.log(buyfvElement);
    function applyShakingEffect(overElement) {
      overElement.addClass("shaking");
      setTimeout(function () {
        overElement.removeClass("shaking");
      }, 1000); // 设置震动持续时间，单位为毫秒
    }

    buyfvElement.text(selectedFruits.join(", ")); // 使用逗号分隔文本内容
    var over = $(this).closest(".mo_con").find(".over");
    if (selectedTotalPay < minTotalPay || selectedTotalPay > maxTotalPay) {
      var over = $(this).closest(".mo_con").find(".over");
      applyShakingEffect(over); // 触发震动效果
    } else {
      buyfvElement.text(selectedFruits.join(", ")); // 使用逗号分隔文本内容
      var over = $(this).closest(".mo_con").find(".over");
      over.text(" ");
      $(".fv_box, .black").hide();
      $("body").removeClass("body-no-scroll");
      let middle_Con = $(this).closest(".middle_Con").find(".price4");
      middle_Con.text(selectedTotalPay);
    }
  });
});
