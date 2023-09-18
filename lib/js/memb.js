$(function () {

    // 設定使用者
    var userData = localStorage.getItem('token');
    var userToken = userData ? JSON.parse(userData) : false;
    // 設定目前使用者id
    var uid = userToken.id;
    $('#myuserInfo').attr('href', `/member/basicInfo/${uid}`)
    // console.log($('#myuserInfo').attr('href'))
})