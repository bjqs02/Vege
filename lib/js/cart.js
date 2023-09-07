
// 側開購物車
var isOpen = false;

function addtocart() {
    isOpen = !isOpen;
    const cartswitch = document.getElementById('cartswitch');
    const sidecart = document.getElementById('sidecart');
    cartswitch.style.right = isOpen ? '280px' : '0';
    cartswitch.style.opacity = isOpen ? '1' : '0.5';
    sidecart.style.right = isOpen ? '0' : '-280px';
};

// 評價訂單 slder
$(function () {
    $(".rateslider").each(function () {
        var slider = $(this);
        var handle = slider.find(".ratecustom-handle");

        slider.slider({
            create: function () {
                handle.text($(this).slider("value"));
            },
            slide: function (event, ui) {
                handle.text(ui.value);
            },
            max: 5, min: 1, step: 1
        });
    });
});

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
                    var closeBtn = $('<button class="close-btn">x</button>');
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
                    $(this).find('.close-btn').remove();
                });
            }
        }
    });
}

$('#moremsg').on('click', function () {
    addInputRow();
});

setupDragAndDrop($('.input-row'));




// GSAP套件 - 水平平移
const wrapper = document.querySelector("#wishlistitems");
const boxes = gsap.utils.toArray(".myItem");

let activeElement;
const loop = horizontalLoop(boxes, {
    paused: true,
    draggable: true, // make it draggable
    center: true, // active element is the one in the center of the container rather than th left edge
    onChange: (element, index) => { // when the active element changes, this function gets called.
        activeElement && activeElement.classList.remove("active");
        element.classList.add("active");
        activeElement = element;
    }
});

boxes.forEach((box, i) => box.addEventListener("click", () => loop.toIndex(i, { duration: 0.8, ease: "power1.inOut" })));

function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let onChange = config.onChange,
        lastIndex = 0,
        tl = gsap.timeline({
            repeat: config.repeat, onUpdate: onChange && function () {
                let i = tl.closestIndex();
                if (lastIndex !== i) {
                    lastIndex = i;
                    onChange(items[i], i);
                }
            }, paused: config.paused, defaults: { ease: "none" }, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
        }),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        spaceBefore = [],
        xPercents = [],
        curIndex = 0,
        indexIsDirty = false,
        center = config.center,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
        timeOffset = 0,
        container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
        totalWidth,
        getTotalWidth = () => items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + spaceBefore[0] + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0),
        populateWidths = () => {
            let b1 = container.getBoundingClientRect(), b2;
            items.forEach((el, i) => {
                widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
                xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
                b2 = el.getBoundingClientRect();
                spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
                b1 = b2;
            });
            gsap.set(items, {
                xPercent: i => xPercents[i]
            });
            totalWidth = getTotalWidth();
        },
        timeWrap,
        populateOffsets = () => {
            timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalWidth : 0;
            center && times.forEach((t, i) => {
                times[i] = timeWrap(tl.labels["label" + i] + tl.duration() * widths[i] / 2 / totalWidth - timeOffset);
            });
        },
        getClosest = (values, value, wrap) => {
            let i = values.length,
                closest = 1e10,
                index = 0, d;
            while (i--) {
                d = Math.abs(values[i] - value);
                if (d > wrap / 2) {
                    d = wrap - d;
                }
                if (d < closest) {
                    closest = d;
                    index = i;
                }
            }
            return index;
        },
        populateTimeline = () => {
            let i, item, curX, distanceToStart, distanceToLoop;
            tl.clear();
            for (i = 0; i < length; i++) {
                item = items[i];
                curX = xPercents[i] / 100 * widths[i];
                distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
                distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
                tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
                    .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
                    .add("label" + i, distanceToStart / pixelsPerSecond);
                times[i] = distanceToStart / pixelsPerSecond;
            }
            timeWrap = gsap.utils.wrap(0, tl.duration());
        },
        refresh = (deep) => {
            let progress = tl.progress();
            tl.progress(0, true);
            populateWidths();
            deep && populateTimeline();
            populateOffsets();
            deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
        },
        proxy;
    gsap.set(items, { x: 0 });
    populateWidths();
    populateTimeline();
    populateOffsets();
    window.addEventListener("resize", () => refresh(true));
    function toIndex(index, vars) {
        vars = vars || {};
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex && index !== curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        if (time < 0 || time > tl.duration()) {
            vars.modifiers = { time: timeWrap };
        }
        curIndex = newIndex;
        vars.overwrite = true;
        gsap.killTweensOf(proxy);
        return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
    }
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.closestIndex = setCurrent => {
        let index = getClosest(times, tl.time(), tl.duration());
        if (setCurrent) {
            curIndex = index;
            indexIsDirty = false;
        }
        return index;
    };
    tl.current = () => indexIsDirty ? tl.closestIndex(true) : curIndex;
    tl.next = vars => toIndex(tl.current() + 1, vars);
    tl.previous = vars => toIndex(tl.current() - 1, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
    }
    if (config.draggable && typeof (Draggable) === "function") {
        proxy = document.createElement("div")
        let wrap = gsap.utils.wrap(0, 1),
            ratio, startProgress, draggable, dragSnap, lastSnap, initChangeX,
            align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
            syncIndex = () => tl.closestIndex(true);
        typeof (InertiaPlugin) === "undefined" && console.warn("InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club");
        draggable = Draggable.create(proxy, {
            trigger: items[0].parentNode,
            type: "x",
            onPressInit() {
                let x = this.x;
                gsap.killTweensOf(tl);
                startProgress = tl.progress();
                refresh();
                ratio = 1 / totalWidth;
                initChangeX = (startProgress / -ratio) - x;
                gsap.set(proxy, { x: startProgress / -ratio });
            },
            onDrag: align,
            onThrowUpdate: align,
            overshootTolerance: 0,
            inertia: true,
            snap(value) {
                if (Math.abs(startProgress / -ratio - this.x) < 10) {
                    return lastSnap + initChangeX
                }
                let time = -(value * ratio) * tl.duration(),
                    wrappedTime = timeWrap(time),
                    snapTime = times[getClosest(times, wrappedTime, tl.duration())],
                    dif = snapTime - wrappedTime;
                Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
                lastSnap = (time + dif) / tl.duration() / -ratio;
                return lastSnap;
            },
            onRelease() {
                syncIndex();
                draggable.isThrowing && (indexIsDirty = true);
            },
            onThrowComplete: syncIndex
        })[0];
        tl.draggable = draggable;
    }
    tl.closestIndex(true);
    lastIndex = curIndex;
    onChange && onChange(items[curIndex], curIndex);
    return tl;
}



// 地址套件
/** 預設選擇器 .twzipcode */
// const twzipcode = new TWzipcode();

let twzipcode = new TWzipcode({
    "district": {
        onChange: function (id) {
            console.log(this.nth(id).get());
        }
    }
});


/** 預設選擇器 & 參數 */
// const twzipcode = new TWzipcode({...});

/** 自訂選擇器 & 參數 */
// const twzipcode = new TWzipcode('.hello-world', {...});

/** Element 或 NodeList */
// const twzipcode = new TWzipcode(document.querySelectorAll('.hello-world'));
