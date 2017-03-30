Date.prototype.Format = function(fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var toDefaultSlider = function() {
    $dragBln = false;
    $('#carouselMain').touchSlider({
        flexible: true,
        speed: 200,
        btn_prev: $('#btnPrev'),
        btn_next: $('#btnNext'),
        paging: $('#carouselIcon' + ' a'),
        counter: function(e) {
            $('#carouselIcon' + ' a').removeClass('current').eq(e.current - 1).addClass('current');
        }
    });
    $('#carouselMain').bind('mousedown', function() {
        $dragBln = false;
    })
    $('#carouselMain').bind('dragstart', function() {
        $dragBln = true;
    })
    $('#carouselMain a').click(function() {
        if ($dragBln) {
            return false;
        }
    })
    timer = setInterval(function() {
        $('#btnNext').click();
    }, 3000);
    $('#carouselMain').hover(function() {
        clearInterval(timer);
    })
    $('#carouselMain').bind('touchstart', function() {
        clearInterval(timer);
    }).bind('touchend', function() {
        timer = setInterval(function() {
            $('#btnNext').click();
        }, 3000);
    });
};

var reload = function() {
    window.location.reload();
};

var toGetParameter = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg) ?
        window.location.search.substr(1).match(reg)[2] : '';
    return r;
};

// 小黑框
// function msgAlert(type,msg) {
//     $('.msg_'+type).html(msg);
//     $('.msg_'+type).animate({'top': 0},500);
//     setTimeout(function(){$('.msg_'+type).animate({'top': '-3rem'},500)},2000);
// }

// $(document).ready(function(){
//     var htmlstyle = "<style>body{padding:0;margin:0;}.msg{color:#FFF;width:100%;height:3rem;text-align:center;font-size:1.2rem;line-height:3rem;position:fixed;top:-3rem;z-index:20;}"
//     +".msg_success{background-color:#1fcc6c;}"
//     +".msg_warning{background-color:#e94b35;}"
//     +".msg_primary{background-color:#337ab7;}"
//     +".msg_info{background-color:#5bc0de;}</style>";
// $('head').append(htmlstyle);
//     $('body').prepend('<div class="msg msg_success"></div>'
//         +'<div class="msg msg_warning"></div>'
//         +'<div class="msg msg_primary"></div>'
//         +'<div class="msg msg_info"></div>');
// });


var alertMsg = function(msg) {
    $('.msg').html(msg);
    $('.msg').fadeIn();
    $('.msg').css('margin-top', '-' + $('.msg').get(0).clientHeight / 2 + 'px')
        .css('margin-left', '-' + $('.msg').get(0).clientWidth / 2 + 'px');
    setTimeout(function() {
        $('.msg').fadeOut();
    }, 2000);
};

$(function() {
    $('body').prepend('<div class="msg"></div>');
    $('.msg').css({
        'display': 'none',
        'position': 'fixed',
        'top': '50%',
        'left': '50%',
        'z-index': '99999',
        'max-width': '50%',
        'min-width': '100px',
        'padding': '16px',
        'color': '#fff',
        'font-size': '14px',
        'text-align': 'center',
        'line-height': '18px',
        'border-radius': '2px',
        'background-color': 'rgba(0, 0, 0, .6)'
    });
});

var showOverlay = function() {
    $('body').append('<div class="overlay"></div>');
};

var hideOverlay = function() {
    $('.overlay').remove();
};

var toDoAjax = function(param, type, url, callBack, callBackData) {
    var data = JSON.stringify(param);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
            if (Object.prototype.toString.call(callBack) === '[object Function]') {
                if (callBackData) {
                    if (this.responseText) {
                        callBack(JSON.parse(this.responseText), callBackData);
                    } else { callBack(this.responseText, callBackData); }
                } else {
                    if (this.responseText) {
                        callBack(JSON.parse(this.responseText));
                    } else { callBack(this.responseText); }
                }
            }
        }
    });

    xhr.open(type, url);
    if (accesskey) {
        xhr.setRequestHeader('accesskey', accessKey);
    }
    // xhr.setRequestHeader('userId', userId);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('cache-control', 'no-cache');

    xhr.send(data);
};
