function getRandom(x) {
    return Math.floor(Math.random() * x);
};
let likeQuan =  [100, 190, 141, 108, 178, 180, 150, 90, 85, 83, 192, 141, 65, 51, 107, 137, 96, 154, 151, 179, 70, 81, 85, 168, 54, 127, 103, 78, 174, 66, 109]; 

let likepeople = document.querySelectorAll(".likePeople");
let buttons = document.querySelectorAll(".check1");



likepeople.forEach(function(val,key){
    val.textContent = likeQuan[key];
})


// $('.check1').on('click', function () {
//     let text = $(this).parent().parent().parent().find('p');
//     textPlus = $(this).parent().parent().parent().find('p').text();
//     if ($(this).prop("checked") == 1) {
//         textPlus++;
//         text.text(textPlus);
//     } else {
//         textPlus--;
//         text.text(textPlus);
//     }
// });


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

