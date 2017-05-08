var apiUrl = 'http://jfxd.losta.net/apiv1/';
var path = '';
var userId;
var accessKey;
var projectId = localStorage.projectId;
var projectName = localStorage.projectName;
var orgId = '';


const TIMEFORMATCOMPLETE = 'yyyy-MM-dd hh:mm:ss';
const TIMEFORMAT = 'yyyy-MM-dd';
const ALERTKIND = ['', '正常', '警报', '一般故障', '严重故障', '硬件失败'];
const WEEKKIND = ['日', '一', '二', '三', '四', '五', '六'];


// accessKey = '2f229bfc5a224af7a01cee2dddad1ef5';
// userId = 'yan';

toGetBasicInfo();

function toGetBasicInfo() {
    accessKey = toGetParameter('accesskey');
    userId = toGetParameter('userid');
    if (!accessKey || !userId) {
        if (!localStorage.accessKey || !localStorage.userId) {
            var href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2ef322e64147298f&redirect_uri='
                     + encodeURI('http://jfxd.losta.net/apiv1/Auth/Wechat/Authorize')
                     + '&response_type=code&scope=snsapi_base&state=home#wechat_redirect';
            window.location.href = href;
        } else {
            accessKey = localStorage.accessKey;
            userId= localStorage.userId;
        }
    } else {
        localStorage.accessKey = accessKey;
        localStorage.userId = userId;
    }
};

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

function toGetParameter(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg) ?
        window.location.search.substr(1).match(reg)[2] : '';
    return r;
};

var alertMsg = function(msg) {
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
    $('.msg').html(msg);
    $('.msg').fadeIn();
    $('.msg').css('margin-top', '-' + $('.msg').get(0).clientHeight / 2 + 'px')
        .css('margin-left', '-' + $('.msg').get(0).clientWidth / 2 + 'px');
    setTimeout(function() {
        $('.msg').fadeOut().remove();
    }, 2000);
};

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
    if (accessKey) {
        xhr.setRequestHeader('accesskey', accessKey);
    }
    // xhr.setRequestHeader('userId', userId);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('cache-control', 'no-cache');

    xhr.send(data);
};


$(function() {
    $('.tabs .title').on('click', 'li', function() {
        $(this).addClass('active').siblings().removeClass('active');
        $('.tab-panel-item').eq($(this).index()).show().siblings().hide();
    });
});