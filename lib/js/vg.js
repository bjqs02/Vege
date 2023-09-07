$(document).ready(function ($) {
    // Declare the body variable
    var $body = $("body");

    // Function that shows and hides the sidebar cart
    $(".cart-button, .close-button, #sidebar-cart-curtain").click(function (e) {
        e.preventDefault();

        // Add the show-sidebar-cart class to the body tag
        $body.toggleClass("show-sidebar-cart");

        // Check if the sidebar curtain is visible
        if ($("#sidebar-cart-curtain").is(":visible")) {
            // Hide the curtain
            $("#sidebar-cart-curtain").fadeOut(500);
        } else {
            // Show the curtain
            $("#sidebar-cart-curtain").fadeIn(500);
        }
    });

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

window.onscroll = function () {
    scrollFunction();
    stickyFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById("vg-navbar").style.padding = "0px";
        document.getElementById("vg-navbar").style.fontSize = "1rem";
    } else {
        document.getElementById("vg-navbar").style.padding = "30px 10px";
        document.getElementById("vg-navbar").style.fontSize = "1.25rem";
    }
}

var navbars = document.getElementById("vg-navbar-2");
var sticky = navbars.offsetTop;

function stickyFunction() {
    if (window.pageYOffset >= sticky) {
        navbars.classList.add("vg-sticky");
    } else {
        navbars.classList.remove("vg-sticky");
    }
}

$(function () {
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

function openPolicy() {
    $("#policy").modal('show');
}

function openMemberPolicy() {
    $("#memberPolicy").modal('show');
}