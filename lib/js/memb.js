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

    // console.log();
    // 使用者頭貼
    $('.img-container img').prop('src', `${userToken.img}`);

    // 首頁
    $('.welcome').text(`Welcome back ${userToken.name}🥕`)

    // 蔬果曆
    fetch(`/member/vgCalendar/${uid}`)
    .then(function (res) {
        return res.json();
    })
    .then(function (timedata) {
        let allTrange = [];

        for( const time of timedata){
            // 判斷訂單成立日的星期 並 計算訂閱開始日
            const week = dayjs(time.o_ceatetime).day();
            let addWD;   
            if( week === 0 || week === 1 ){
                addWD = 3;
            }else if( week === 2 ){
                addWD = 6;
            }else {
                addWD = 5;
            }
            
            // 判斷品項配送頻率 並 計算訂閱結束日
            const freq = time.freq;
            let addfreq;
            let arraydays = [];

            if( freq == "30d" ){
                addfreq = 30;
            }else if( freq == "60d" ){
                addfreq = 60;
            }else {
                addfreq = 0;
            }

            const startime = dayjs(time.o_ceatetime).add(addWD, 'day').format('YYYY-MM-DD');
            const endtime = dayjs(startime).add(addfreq, 'day').format('YYYY-MM-DD');
            let subTrange = [ startime, endtime ];
            allTrange.push(subTrange);
        }
        // console.log(allTrange);


        // 將訂閱時間記錄於蔬果曆(小)
        $('.vgcalendar').pignoseCalendar({
            lang: 'ch',
            disabledRanges: allTrange,
            init: function(context){
                const today = dayjs().format('YYYY-MM-DD');
                $(`[data-date='${today}']`).removeClass("pignose-calendar-unit-disabled pignose-calendar-unit-disabled-range pignose-calendar-unit-disabled-multiple-range");
                $(`[data-date='${today}']`).addClass("pignose-calendar-unit-active pignose-calendar-unit-first-active");
            },
        });

        // 將訂閱時間記錄於蔬果曆(大)
        $('.open-calendar').pignoseCalendar({
            lang: 'ch',
            disabledRanges: allTrange,
            init: function(context){
                const today = dayjs().format('YYYY-MM-DD');
                $(`[data-date='${today}']`).removeClass("pignose-calendar-unit-disabled pignose-calendar-unit-disabled-range pignose-calendar-unit-disabled-multiple-range");
                $(`[data-date='${today}']`).addClass("pignose-calendar-unit-active pignose-calendar-unit-first-active");
            },
            scheduleOptions: {
                colors: {
                    自選蔬果箱1: 'var(--sc-r-Dark)',
                    自選蔬果箱2: 'var(--secondary-r)'
                }
            },

            schedules: [
                {
                    name: '自選蔬果箱1',
                    date: '2023-09-04'
                }, {
                    name: '自選蔬果箱2',
                    date: '2023-09-25'
                }, {
                    name: '自選蔬果箱2',
                    date: '2023-10-02'
                }, {
                    name: '自選蔬果箱2',
                    date: '2023-10-09'
                }, {
                    name: '自選蔬果箱2',
                    date: '2023-10-16'
                }
            ]
        });
    })


})