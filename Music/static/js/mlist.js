function ajax(methods, url, data, fn) {
    url = "http://127.0.0.1:3000" + url;
    var xhr = new XMLHttpRequest();
    xhr.open(methods, url, true);
    // 添加http头，发送信息至服务器时内容编码类型
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            let data = JSON.parse(xhr.responseText);
            fn(data);
        }
    };
    // 发送post
    xhr.send(data);
}

var divPlay = '.fix-play', //播放条
    divList = '.play-form', //播放列表

    btnEmpty = '.play-form .form-title .icon-empty', //清空按钮
    btnFClose = '.play-form .form-title .table-close', //关闭按钮

    btnScl = '.play-form .scrol .icon-scl', //下拉按钮
    objList = '.play-form .form-tab ul.mtab', //列表
    list = '.play-form .form-tab ul.mtab li', //li单元
    ulempty = '.play-form .form-tab .empty',

    liCOL = 'ul.mtab li .col-2 a.icn-col', //收藏按钮
    liDEL = 'ul.mtab li .col-2 a.icn-del', //删除按钮

    numLi = '.play-ctrl .music-list a'; //曲数




function bindUI() {
    var allowMove = false,
        off = 0;

    $('.fix-bottom').on('mousedown', divList, function () {
        return false;
    }).on('click', btnEmpty, function () {
        if ($(list).length > 0) {
            $(objList).empty();
            window.sessionStorage.setItem('musicList', null);
            $(numLi).text(0);
            $('audio')[0].src = '';
            window.sessionStorage.setItem('music', '');
        }
    }).on('click', btnFClose, function () {
        $(divList).hide();
    }).on({
        dblclick: function () {
            ajax("GET", "/music/musicinfo?mid=" + $(this).attr('data-id'), null, (data) => {
                console.log("ss", data.src)
                $('audio')[0].src = data.src;
                $('audio')[0].play();
            });
        }

    }, list).on('click', liCOL, function () {
        let isLogin = sessionStorage.getItem("isLogin")
        if (isLogin === 'true') {
            var mid = $(this).parents('li').attr('data-id'),
                userid = sessionStorage.getItem("id");
                ajax("GET", "/music/collin?mid=" + mid+'&userid='+userid, null, (data) => {
                    alert(data.msg)
                })

        } else {
            alert('请先登录')
        }
    }).on('click', liDEL, function () {
        let musicList = JSON.parse(window.sessionStorage.getItem('musicList'));
        delete musicList[$(this).parents('li').attr('data-id')]
        var length = 0;
        for (var ever in musicList) {
            length++;
        }
        window.sessionStorage.setItem('musicList', JSON.stringify(musicList))
        $(this).parents('li').remove();
        $(numLi).text(length);
    }).on({

        mousemove: function () {
            var _p,
                _dis,
                _parent = $(btnScl).parent('div'),
                MAX_TOP = $(_parent).innerHeight() - $(btnScl).innerHeight();

            if (allowMove) {
                _dis = event.pageY - $(_parent).offset().top - off;

                if (_dis < 0) {
                    _dis = 0;

                } else if (_dis > MAX_TOP) {
                    _dis = MAX_TOP;

                }

                $(btnScl).css('top', _dis + 'px'); //滚动按钮移动

                _p = parseInt(_dis / $(_parent).innerHeight() * $(objList).height());

                $(objList).css('top', -_p + 'px'); //页面滚动
            }
        },
        mouseup: function () {
            if (allowMove) {
                allowMove = false;
            }
        }
    }, divList).on('mousedown', btnScl, function () {

        allowMove = true;
        event.preventDefault();
        off = event.pageY - $(this).offset().top;

    });


    $('audio').on('canplay', function () {
        var isset = false,
            dataSrc = $('audio')[0].src;
        var l = dataSrc.split('=').length;
        var mid = dataSrc.split('=')[l - 1];
        mid = mid.split('.')[0];
        ajax("GET", "/music/musicinfo?mid=" + mid, null, (data) => {
            var dataID = mid;

            // 检查歌曲列表中有没有存在该歌曲，没有则添加
            for (var i = 0, length = $(list).length; i < length; i++) {
                if ($(list).eq(i).attr('data-id') == dataID) {
                    isset = true;
                    $(list).children('.abs-stus').hide();
                    $(list).eq(i).children('.abs-stus').show();
                    break;
                }
            }
            if (!isset) {
                $(list).children('.abs-stus').hide(); //先全部隐藏
                var html = '<li data-id="' + data.mid + '">' +
                    '<div class="abs-stus" style="display:block"><span class="icn-stus"></span></div>' +
                    '<div class="col col-1">' + data.name + '</div>' +
                    '<div class="col col-2">' +
                    '<a href="javascript:;" class="icn-col" title="收藏"></a>' +
                    '<a href="javascript:;" class="icn-del" title="删除"></a>' +
                    '</div>' +
                    '<div class="col col-3">' + data.name + '</div>' +
                    '</li>';
                $(objList).append(html);
                var num = $(numLi).text();
                $(numLi).text(++num);
                $(objList).siblings('.empty').hide();
            }
        });

    });


}

function scroll() {
    var delta = 0, //偏移量		
        isWheel, //计算溢出
        _per = 0, //下拉条 位移
        _ceil = 30; //位移单位

    if (document.addEventListener) {
        /*注册事件*/

        document.addEventListener("DOMMouseScroll", fnWheel, false); //W3C

    }

    document.getElementById('form-tab').onmousewheel = fnWheel;

    /*执行函数*/
    function fnWheel(e) {

        /* 火狐的this指代不明 问题 */
        var _objList = '.play-form .form-tab .mtab';
        var _btnScl = '.play-form .scrol .icon-scl';
        delta = -parseInt($(_objList).css('top')) || 0;

        isWheel = $(_objList).innerHeight() - $(_objList).parent('div').innerHeight();

        if (wheel(e) === 1 && delta >= 0) { //向上 && 允许
            delta = delta - _ceil;
            if (delta < 0) {
                delta = 0;
            }
            $(_objList).css('top', -delta + 'px');
            _per = parseInt(delta / $(_objList).height() * 1000) / 10;
            $(_btnScl).css('top', _per + '%');

        } else if (wheel(e) === -1 && isWheel > 0) { //向下 && 允许
            delta = delta + _ceil;
            if (delta >= isWheel) {
                delta = isWheel;
            }
            $(_objList).css('top', -delta + 'px');
            _per = parseInt(delta / $(_objList).height() * 1000) / 10;
            $(_btnScl).css('top', _per + '%');

        }
    }


}


function wheel(e) {

    var delta = 0;
    var id = document.getElementById('mtab');

    EVT = e || window.event;

    if (EVT.wheelDelta) {
        /*IE Opera*/
        delta = EVT.wheelDelta / 120;

    } else if (EVT.detail) {
        /*FireFox*/
        delta = -EVT.detail / 3;

    }

    /* 禁用滚轮 */
    if (EVT.preventDefault) {
        EVT.preventDefault();

    }
    EVT.returnValue = false;


    if (delta > 0) {
        return 1; // do something

    } else if (delta < 0) {
        return -1; // do another thing

    }


}

$(document).ready(function () {
    bindUI();
    scroll();
});