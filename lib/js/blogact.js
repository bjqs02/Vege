function getRandom(x) {
    return Math.floor(Math.random() * x);
};
let likeQuan =  [100, 190, 141, 108, 178, 180, 150, 90, 85, 83, 192, 141, 65, 51, 107, 137, 96, 154, 151, 179, 70, 81, 85, 168, 54, 127, 103, 78, 174, 66, 109]; 

let likepeople = document.querySelectorAll(".likePeople");
let buttons = document.querySelectorAll(".check1");

// [].forEach.call(likepeople, function (div, idx) {
//     // likeQuan = getRandom(150);
//     // console.log(div)
//         div.innerText = likeQuan[idx];

// });

likepeople.forEach(function(val,key){
    // console.log(val, key)
    val.textContent = likeQuan[key];
})


$('.check1').on('click', function () {
    let text = $(this).parent().parent().parent().find('p');
    aa = $(this).parent().parent().parent().find('p').text();
    if ($(this).prop("checked") == 1) {
        aa++;
        text.text(aa);
    } else {
        aa--;
        text.text(aa);
    }
});

$('.keep1').on('click', function () {
    if ($(this).prop("checked") == 1) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: '已加入收藏夾',
            showConfirmButton: false,
            timer: 1500
        })
    } else {
    }
});


$('.searchMore').on('click', function () {
    console.log($(this))
    $('.searchMoredown').toggle(1000);
});

// actlotto
let lottoBg = document.querySelector('.lottoBg');
let closeBtn = document.querySelector('.closeBtn');
lotto.addEventListener('click', function () {
    lottoBg.style.visibility = 'visible';
    lottoBg.style.opacity = '1';
    lottoBg.style.transition = '2s'
})

closeBtn.addEventListener('click', function(){
    lottoBg.style.visibility = 'hidden';
    lottoBg.style.opacity = '0';
    lottoBg.style.transition = '0s'
})




// // 假設您已經有了輪盤的初始角度和旋轉速度
// let initialAngle = 0; // 輪盤的初始角度
// let rotationSpeed = 3; // 旋轉速度，設置為3秒
// let minRevolutions = 5; // 最少旋轉五圈
// let spanValue;
// // 獲取spin按鈕
// let spinBtn = document.querySelector('.spinBtn');

// spinBtn.onclick = function () {

//     // 計算所需的旋轉角度增量
//     let minAngle = 360 * minRevolutions;
//     let angleIncrement = Math.ceil(Math.random() * minAngle + minAngle);

//     // 更新旋轉角度
//     initialAngle += angleIncrement;

//     // 將旋轉角度轉換為0到360度的範圍
//     let normalizedAngle = (initialAngle % 360 + 360) % 360;

//     // 計算對應的number div的索引
//     let numberOfDivs = 5; // 假設有5個number div
//     let divIndex = Math.floor((normalizedAngle / 360) * numberOfDivs);

//     // 獲取所有number divs
//     let numberDivs = document.querySelectorAll('.lottoContainer .wheel .number');

//     // 獲取對應的number div
//     let targetNumberDiv = numberDivs[divIndex];

//     // 獲取對應的span值
//     spanValue = targetNumberDiv.querySelector('span').textContent;

//     // 更新輪盤的旋轉角度
//     let wheel = document.querySelector('.wheel');
//     wheel.style.transition = `transform ${rotationSpeed}s ease-in-out`;
//     wheel.style.transform = `rotate(${360 - initialAngle}deg)`; // 反向旋轉到對應的數字

//     // // 打印span值
//     // console.log('對應的span值：', spanValue);

//     setTimeout(() => {
//         Swal.fire({ text: `您已獲得${spanValue}點`, confirmButtonColor: '#a1c181' }).then(function(result){
//         if(result.value){
//             lottoBg.style.display = 'none';
//         }
//     })
//     }, 3700)

// }

// let outttt = spanValue;