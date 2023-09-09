window.onload = function () {
    // 先抓token跟登入帳號
    var userData = localStorage.getItem('token');
    var userToken = userData ? JSON.parse(userData) : false;
    console.log(userToken);

    // 登入與否 會跳出登出的button, 使用者名字 跟 使用者設定的大頭貼
    if (userToken) {
        console.log('登入狀態');
        $('#userName').text(userToken.name || 'hi user');
        $('#logoutBTN').css('visibility', 'visible');
        $('#navUser').html(userToken.img ? `<img src="${userToken.img}" class="img-fluid"/>` : `<i class="fa-solid fa-user"></i>`);
    } else {
        console.log('非登入狀態');
    }

    // 點選人像的話: 已登入=>導向會員頁面 | 未登入=>跳出登入框
    navUser.onclick = function () {
        if (userToken) {
            location.href = "/member";
        } else {
            $('#checkUser').modal('show');
        }
    }
    
    // 點選登出 會更新token並更新頁面
    logoutBTN.onclick = function (e) {
        e.preventDefault();
        var JSONData = JSON.stringify(userToken);
        console.log(JSONData);
        fetch('/login/logout', {
            method: 'post',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": userToken.token
            },
            body: JSONData
        })
            .then(function (response) {
                console.log(response)
                localStorage.removeItem("token");
                location.reload();
            });
    }

    // 登入按鈕按下去會先確認email, 依照回傳值重新導向註冊/登入頁面
    checkEmail.onclick = function (e) {
        e.preventDefault();
        var data = { "mail": "" };
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
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonObj) {
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

// })

//  購物車側攔的JS設置 

    var $body = $('body');

    $(".cart-button").click(function (e) {
        e.preventDefault();
        if (userToken) {
            $body.addClass("show-sidebar-cart");
            $("#sidebar-cart-curtain").fadeIn(500);
        } else {
            alert('請先登入');
        }

    });
    $(".close-button, #sidebar-cart-curtain").click(function (e) {
        e.preventDefault();
        $body.removeClass("show-sidebar-cart");
        $("#sidebar-cart-curtain").fadeOut(500);
    });
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


function openPolicy() {
    $("#policy").modal('show');
}

function openMemberPolicy() {
    $("#memberPolicy").modal('show');
}