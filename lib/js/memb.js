$(function () {

    // 設定使用者
    var userData = localStorage.getItem('token');
    var userToken = userData ? JSON.parse(userData) : false;
    // 設定目前使用者id
    var uid = userToken.id;

    // 設定各頁面的連結
    $('#basicInfo').attr('href', `/member/basicInfo/${uid}`);
    $('#mycards').attr('href', `/member/myCards/${uid}`);
    $('#address').attr('href', `/member/address/${uid}`);
    morder.onclick =  function(){ window.location.href = `/member/order/${uid}`; }
    coins.onclick =  function(){ window.location.href = `/member/bonus/${uid}`; }
    mark.onclick =  function(){ window.location.href = `/member/articles/${uid}`; }

    // 首頁
    console.log();
    $('.welcome').text(`Welcome back ${userToken.name}🥕`)


})