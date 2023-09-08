window.onload = function(){
    navUser.onclick = function(){
        $('#checkUser').modal('show');
    }
    checkEmail.onclick = function(e){
        e.preventDefault();
        var data = {"mail":""};
        data.mail = document.getElementById('userEmail').value;
        var JSONData = JSON.stringify(data);
        // console.log(JSONData);
        fetch('/login/checkmail', {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    },
                    body: JSONData
                })
                .then(function(response){
                    return response.json();
                })
                .then(function(jsonObj){
                    console.log(jsonObj[0]);
                    if (jsonObj[0] == undefined) {
                        console.log('查無資料');
                        location.href = "/login/register";
                    } else {
                        console.log('是會員喔');
                        location.href = "/login/userlogin";
                    }
                })
    }
}

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

$(function () {

    // Header
    function addHclass() {
        $('#vg-navbar').addClass('change');
        $('#navUser').addClass('navIcon-down change');
        $('#navCart').addClass('navIcon-down');
        $('.bag-count').addClass('bag-count-down');
        $('.fa-cart-shopping').addClass('change');

        // seed-icon
        $('.btn-vg-2').hover(
            function () {
                $(this).addClass('change');
            },
            function () {
                $(this).removeClass('change');
            }
        )
    }

    function removeHclass() {
        $('#vg-navbar').removeClass('change');
        $('#navUser').removeClass('navIcon-down change');
        $('#navCart').removeClass('navIcon-down');
        $('.bag-count').removeClass('bag-count-down');
        $('.fa-cart-shopping').removeClass('change');

        $('.btn-vg-2').hover(function () {
            $(this).removeClass('change');
        })
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
            $(`#title1`).addClass('btn-vg-3-active');
        },
        mouseout: function () {
            $(`#title1`).removeClass('btn-vg-3-active');
        }
    });
    $(`#sec2`).on({
        mouseover: function () {
            // console.log(this);
            $(`#title2`).addClass('btn-vg-3-active');
        },
        mouseout: function () {
            $(`#title2`).removeClass('btn-vg-3-active');
        }
    });
    $(`#sec3`).on({
        mouseover: function () {
            // console.log(this);
            $(`#title3`).addClass('btn-vg-3-active');
        },
        mouseout: function () {
            $(`#title3`).removeClass('btn-vg-3-active');
        }
    })

})

//  購物車側攔的JS設置 

$(document).ready(function ($) {
    // Declare the body variable
    var $body = $('body');

    // Function that shows and hides the sidebar cart
    $(".cart-button").click(function (e) {
        e.preventDefault();
        $body.addClass("show-sidebar-cart");
        $("#sidebar-cart-curtain").fadeIn(500);
    });
    $(".close-button, #sidebar-cart-curtain").click(function (e) {
        e.preventDefault();
        $body.removeClass("show-sidebar-cart");
        $("#sidebar-cart-curtain").fadeOut(500);
    });
    // $(".cart-button, .close-button, #sidebar-cart-curtain").click(function (e) {
    //     e.preventDefault();

    //     // Add the show-sidebar-cart class to the body tag
    //     $body.toggleClass("show-sidebar-cart");

    //     // Check if the sidebar curtain is visible
    //     if ($("#sidebar-cart-curtain").is(":visible")) {
    //         // Hide the curtain
    //         $("#sidebar-cart-curtain").fadeOut(500);
    //     } else {
    //         // Show the curtain
    //         $("#sidebar-cart-curtain").fadeIn(500);
    //     }
    // });

    // Function that adds or subtracts quantity when a 
    // plus or minus button is clicked
    $body.on('click', '.plus-button, .minus-button', function () {
        // Get quanitity input values
        var qty = $(this).closest('.qty').find('.qty-input');
        var val = parseFloat(qty.val());
        var max = parseFloat(qty.attr('max'));
        var min = parseFloat(qty.attr('min'));
        var step = parseFloat(qty.attr('step'));

        // Check which button is clicked
        if ($(this).is('.plus-button')) {
            // Increase the value
            qty.val(val + step);
        } else {
            // Check if minimum button is clicked and that value is 
            // >= to the minimum required
            if (min && min >= val) {
                // Do nothing because value is the minimum required
                qty.val(min);
            } else if (val > 0) {
                // Subtract the value
                qty.val(val - step);
            }
        }
    });
});

function openPolicy() {
    $("#policy").modal('show');
}

function openMemberPolicy() {
    $("#memberPolicy").modal('show');
}
