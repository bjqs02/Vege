
// 服務協議modal
function serviceinfo() {
    Swal.fire({
        title: '服務協議',
        html:
            '<div class="text-start">'+
            '<p>您同意在得以使用任何付款、運送、貨款計算或本服務其他選項之前，須先簽訂任何必要之第三方使用者協議。您也同意簽訂任何本服務自訂及運作內容必要之 vege 及附屬之使用者協議、隱私權政策。</p>' +
            '</div>',
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#80c97e',
        confirmButtonText: '同意',
    })
}


// 購物提醒modal
function noticeinfo() {
    Swal.fire({
        title: '購物提醒',
        html:
            '<div class="text-start">'+
            '<p>1. 台灣氣候多變，造就美妙多變的農產滋味外也可能造成延後出貨或數量不穩定的風險，若出貨有問題我們必會致電通知處理，請您包容。</p>' +
            '<p>2. 可備註收貨時段，但各種交通因素與天候狀況，無法保證送貨時間毫無誤差，請多包涵。</p>' +
            '<p>3. 發票注意事項：我同意辦理退貨時，由vege代為處理發票及銷貨退回證明單，以加速退貨退款作業。</p>' +
            '<p class="text-center">我已經閱讀以上重要提醒，並認同！</p>'+
            '</div>',
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#80c97e',
        confirmButtonText: '同意',
    })
}

// 運費說明modal
function shippingfeeinfo() {
    Swal.fire({
        title: '運費',
        html:
            '<p>各品項運費獨立計算</p>' +
            '<p>1~2人160元</p>' +
            '<p>3~4人290元</p>',
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#80c97e',
        confirmButtonText: '確定'
    })
}

// 備註說明modal
function cnotemodal() {
    Swal.fire({
        title: '備註',
        html:
            '<p>家有兒童：可配送適合兒童的蔬果（如：少籽、易咀嚼）</p>' +
            '<p>辛香料：勾選此項目可隨機配送少量辛香料（如：蔥、薑、蒜）</p>',
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#80c97e',
        confirmButtonText: '確定'
    })
}

// 側開購物車
// var isOpen = false;

// function addtocart() {
//     isOpen = !isOpen;
//     const cartswitch = document.getElementById('cartswitch');
//     const sidecart = document.getElementById('sidecart');
//     cartswitch.style.right = isOpen ? '280px' : '0';
//     cartswitch.style.opacity = isOpen ? '1' : '0.5';
//     sidecart.style.right = isOpen ? '0' : '-280px';
// };


// 新增評價欄位 與 drag/drop 功能
var maxInputs = 3;
var draggedRateItems = [];

function addInputRow() {
    if ($('#inputContainer .input-row').length < maxInputs) {
        var newInput = $('<div class="input-row d-flex align-items-center">');
        newInput.append('<input type="text" class="form-control my-1 input-with-tag" placeholder="請將品項拖曳至此"><br>');
        $('#inputContainer').append(newInput);
        setupDragAndDrop(newInput);
    }
}

function setupDragAndDrop(container) {
    $('.rateitem').draggable({
        helper: 'clone'
    });

    container.find('.input-with-tag').droppable({
        accept: '.rateitem:not(.dragged)',
        drop: function (event, ui) {
            var text = ui.helper.text();
            var rateItem = $(ui.helper[0]);
            var existingRateItems = $(this).parent('.input-row').find('.rateitem');

            // Check if the rate item already exists in the current input row
            var rateItemExists = existingRateItems.filter(function () {
                return $(this).text() === text;
            }).length > 0;

            if (!rateItemExists) {
                var rateItemTag = $('<span class="tag rateitem vg-ps w-25">' + text + '</span>');
                rateItem.addClass('dragged'); // Mark the rate item as dragged
                draggedRateItems.push(rateItem); // Add to global list
                $(this).before(rateItemTag);

                rateItemTag.on('mouseenter', function () {
                    var closeBtn = $('<button class="rateclose-btn">x</button>');
                    $(this).append(closeBtn);

                    closeBtn.on('click', function () {
                        var parentRateItem = $(this).parent('.rateitem');
                        parentRateItem.remove();
                        var index = draggedRateItems.indexOf(parentRateItem);
                        if (index !== -1) {
                            draggedRateItems.splice(index, 1); // Remove from global list
                        }
                    });
                }).on('mouseleave', function () {
                    $(this).find('.rateclose-btn').remove();
                });
            }
        }
    });
}

$('#moremsg').on('click', function () {
    addInputRow();
});

setupDragAndDrop($('.input-row'));


// 地址套件
/** 預設選擇器 .twzipcode */
// const twzipcode = new TWzipcode();

// let twzipcode = new TWzipcode({
//     "district": {
//         onChange: function (id) {
//             console.log(this.nth(id).get());
//         }
//     }
// });


/** 預設選擇器 & 參數 */
// const twzipcode = new TWzipcode({...});

/** 自訂選擇器 & 參數 */
// const twzipcode = new TWzipcode('.hello-world', {...});

/** Element 或 NodeList */
// const twzipcode = new TWzipcode(document.querySelectorAll('.hello-world'));
