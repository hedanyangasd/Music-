slides = '.slides'; //滚动框
sliUL = '.slides ul.points'; //滚动框 图片
sliTips = '.slides ul.sub-tips li'; //滚动图小按钮
var SIZE = $(sliUL).find('img').width();
var LENGTH = $(sliUL).find('img').length;
var timer;
var rankLI = '.rank dl dd';

var rankALLPlay = '.rank dl dt .dt-txt a.icon-play';
var rankALLAdd = '.rank dl dt .dt-txt a.icon-add';
var rankLIPlay = '.rank dl dd .dd-oper a.icon-play'; //排行榜li的播放按钮
var rankLIAdd = '.rank dl dd .dd-oper a.icon-add'; //排行榜li的添加按钮
var rankLIStore = '.rank dl dd .dd-oper a.icon-store'; //排行榜li的收藏按钮
var rankLISl = '.rank dl dd .dd-oper a.icon-scdgd'; //排行榜li的收藏按钮
var objList = '.play-form .form-tab ul.mtab', //列表
    list = '.play-form .form-tab ul.mtab li', //li单元
    mlist = '.play-form .form-tab ul.mtab', //播放列表ul
    numMusic = '.play-ctrl a.icon-list'; //播放列表数目

function lunbo() {
    $(sliUL).css('width', SIZE * LENGTH + 'px');
    fnTimer(0);
}


function fnTimer(i) {
    var index = i || 0;
    timer && clearInterval(timer);
    ahead();

    $(".right").click(function () {
        ahead();
    });

    $(".left").click(function () {
        apro();
    });

    timer = setInterval(ahead, 4000);

    function ahead() {
        $(sliUL).animate({
            left: -index * SIZE + 'px'
        }, 500);

        $(sliTips).removeClass('active').eq(index).addClass('active');

        if (index == 0) {
            $("#change").css({
                "background-color": "mediumpurple"
            });
        } else if (index == 1) {
            $("#change").css({
                "background-color": "#914648"
            });
        } else if (index == 2) {
            $("#change").css({
                "background-color": "#021545"
            });
        } else if (index == 3) {
            $("#change").css({
                "background-color": "lightseagreen"
            });
        } else if (index == 4) {
            $("#change").css({
                "background-color": "#6e4f59"
            });
        }
        index = (++index >= LENGTH ? 0 : index);
    }

    function apro() {
        index = (--index <= -1 ? 4 : index);

        $(sliUL).animate({
            left: -index * SIZE + 'px'
        }, 500);

        $(sliTips).removeClass('active').eq(index).addClass('active');

        if (index == 0) {
            $("#change").css({
                "background-color": "mediumpurple"
            });
        } else if (index == 1) {
            $("#change").css({
                "background-color": "#914648"
            });
        } else if (index == 2) {
            $("#change").css({
                "background-color": "#021545"
            });
        } else if (index == 3) {
            $("#change").css({
                "background-color": "lightseagreen"
            });
        } else if (index == 4) {
            $("#change").css({
                "background-color": "#6e4f59"
            });
        }

    }
}



function newsong() {
    var arr = [0, 1, 2, 3, 4, 5];
    change();

    function change() {
        /*沿着x轴移动，x、y轴放大倍数，展示的层数，透明度*/
        $(".sidebar-one li").eq(arr[0]).css({
            "transform": "translateX(10px) translateY(-15px)",
            "z-index": "2",
            "opacity": "0.1"
        });
        $(".sidebar-one li").eq(arr[1]).css({
            "transform": "translateX(10px) translateY(-15px)",
            "z-index": "3",
            "opacity": "0.1"
        });
        $(".sidebar-one li").eq(arr[2]).css({
            "transform": "translateX(10px) translateY(-15px)",
            "z-index": "4",
            "opacity": "0.1"
        });
        $(".sidebar-one li").eq(arr[3]).css({
            "transform": "translateX(10px) translateY(-15px)",
            "z-index": "5",
            "opacity": "0.1"
        });
        $(".sidebar-one li").eq(arr[4]).css({
            "transform": "translateX(10px) translateY(-15px)",
            "z-index": "6",
            "opacity": "0.8"
        });
        $(".sidebar-one li").eq(arr[5]).css({
            "transform": "translateX(20px) translateY(-100px)",
            "z-index": "7",
            "opacity": "1"
        });

        $(".main-pro-next p").text((arr[0] + 1 + "/6"));

    }

    $(".pro-pro").click(function () {
        getright();

    });
    $(".pro-next").click(function () {
        getleft();
    });

    function getleft() {
        arr.push(arr[0]); //数组末尾添加第一个元素
        arr.shift(); //将第一个元素删除
        change();
    }

    function getright() {
        arr.unshift(arr[5]); //数组头添加最后一个元素
        arr.pop(); //将最后一个元素删除
        change();
    }
}

function singer() {
    ajax("GET", "/soasi/allsinger", null, (data) => {
        var html = '';
        $.each(data, function (index, value) {
            html += '<li singer-id="' + value.singerid + '">' +
                '<a href="singerdetail.html?id=' + value.singerid + '"><img src="../' + value.image + '"></a>' +
                '<a href="singerdetail.html?id=' + value.singerid + '"><p>' + value.name + '</p></a>' +
                '</li>';
        });
        $('.sidebar-photo').append(html);
    });
}

function ranknew() {
    ajax("GET", "/soasi/ranknew", null, (data) => {
        var html = '';
        $.each(data, function (index, value) {
            html += '<dd data-id="' + value.mid + '">' +
                '<span>' + (index + 1) + '</span>' +
                '<a href="musicdetail.html?id=' + value.mid + '">' + value.mname + '</a>' +
                '<div class="dd-oper">' +
                '<a href="javascript:;" class="icon-play"></a>' +
                '<a href="javascript:;" class="icon-add"></a>' +
                '<a href="javascript:;" class="icon-store"></a>' +
                '<a href="javascript:;" class="icon-scdgd"></a>' +
                '</div>' +
                '</dd>';
        });
        html += '<div class="dd"><a href="rank.html" class="dd-more">查看更多&gt;</a></div>';
        $(".rank dl").eq(1).append(html);
        $(".rank dl").eq(1).children('dd:even').css('background', '#e8e8e8');
    })
}

function rankcreat() {
    ajax("GET", "/soasi/rankcreat", null, (data) => {
        var html = '';
        $.each(data, function (index, value) {
            html += '<dd data-id="' + value.mid + '">' +
                '<span>' + (index + 1) + '</span>' +
                '<a href="musicdetail.html?id=' + value.mid + '">' + value.mname + '</a>' +
                '<div class="dd-oper">' +
                '<a href="javascript:;" class="icon-play"></a>' +
                '<a href="javascript:;" class="icon-add"></a>' +
                '<a href="javascript:;" class="icon-store"></a>' +
                '<a href="javascript:;" class="icon-scdgd"></a>' +
                '</div>' +
                '</dd>';
        });
        html += '<div class="dd"><a href="rank.html" class="dd-more">查看更多&gt;</a></div>';
        $(".rank dl").eq(2).append(html);
        $(".rank dl").eq(2).children('dd:even').css('background', '#e8e8e8');
    })
}

function rankstore() {
    ajax("GET", "/soasi/rankstore", null, (data) => {
        var html = '';
        $.each(data, function (index, value) {
            html += '<dd data-id="' + value.mid + '">' +
                '<span>' + (index + 1) + '</span>' +
                '<a href="musicdetail.html?mid=' + value.mid + '">' + value.mname + '</a>' +
                '<div class="dd-oper">' +
                '<a href="javascript:;" class="icon-play"></a>' +
                '<a href="javascript:;" class="icon-add"></a>' +
                '<a href="javascript:;" class="icon-store"></a>' +
                '<a href="javascript:;" class="icon-scdgd"></a>' +
                '</div>' +
                '</dd>';
        });
        html += '<div class="dd"><a href="rank.html" class="dd-more">查看更多&gt;</a></div>';
        $(".rank dl").eq(0).append(html);
        $(".rank dl").eq(0).children('dd:even').css('background', '#e8e8e8');
    })
}

let musicList = JSON.parse(window.sessionStorage.getItem('musicList')) || {};

function appendEle(addID) {
    var self = this,
        existID = 0,
        html = '',
        i = $(mlist).children('li').length;
    for (; i >= 0; i--) {
        existID = $(mlist).children('li').eq(i).attr('data-id');
        if (addID == existID) {
            break;
        } else if (i == 0) {
            ajax("GET", "/music/musicinfo?mid=" + addID, null, (data) => {
                html = '<li data-id="' + data.mid + '">' +
                    '<div class="abs-stus"><span class="icn-stus"></span></div>' +
                    '<div class="col col-1">' + data.mname + '</div>' +
                    '<div class="col col-2">' +
                    '<a href="javascript:;" class="icn-col" title="收藏"></a>' +
                    '<a href="javascript:;" class="icn-del" title="删除"></a>' +
                    '</div>' +
                    '<div class="col col-3">' + data.name + '</div>' +
                    '</li>';
                $(mlist).append(html);
                var num = $(numMusic).text();
                musicList[addID] = addID
                window.sessionStorage.setItem('musicList', JSON.stringify(musicList));
                $(numMusic).text(++num);
                $(mlist).siblings('.empty').hide();
            });
        }
    };
};


$(document).ready(function () {
    lunbo();
    newsong();
    singer();
    ranknew();
    rankcreat();
    rankstore();


    $('.wrap .main-rank').on({

        mouseover: function () {
            $(this).children('a').first().attr('class', 'title');
            $(this).children('div.dd-oper').show();
        },
        mouseleave: function () {
            $(this).children('a').first().removeClass('title');
            $(this).children('div.dd-oper').hide();
        }

    }, rankLI).on('click', rankLIPlay, function () {
        var mid = $(this).parents('dd').attr('data-id');
        ajax("GET", "/music/musicinfo?mid=" + mid, null, (data) => {
            $('audio')[0].src = data.src;
            window.sessionStorage.setItem('music', data.src);
            $('audio')[0].play();
            appendEle(mid);
        });
    }).on('click', rankLIAdd, function () {
        var mid = $(this).parents('dd').attr('data-id');
        appendEle(mid);
    }).on('click', rankALLPlay, function () {
        var ddlength = $(this).parents('dl').children('dd')
        for (var i = 0; i < ddlength.length; i++) {
            var mid = $(ddlength[i]).attr('data-id')
            if (i == 0) {
                ajax("GET", "/music/musicinfo?mid=" + mid, null, (data) => {
                    $('audio')[0].src = data.src;
                    window.sessionStorage.setItem('music', data.src);
                    $('audio')[0].play();
                });
            }
            appendEle(mid);
        }
    }).on('click', rankLIStore, function () {
        let isLogin = sessionStorage.getItem("isLogin")
        if (isLogin === 'true') {
            var mid = $(this).parents('dd').attr('data-id'),
                userid = sessionStorage.getItem("id");
            ajax("GET", "/music/collin?mid=" + mid + '&userid=' + userid, null, (data) => {
                alert(data.msg)
            })

        } else {
            alert('请先登录')
        }
    }).on('click', rankLISl, function () {
        let isLogin = sessionStorage.getItem("isLogin")
        let userid = sessionStorage.getItem("id"),
        mid = $(this).parents('dd').attr('data-id');
        if (isLogin === 'true') {
            ajax("GET", "/music/mymusiccreate?id=" + userid, null, (data) => {
                var html = ''
                $('#createnum').text('(' + data.length + ')')
                $.each(data, function (index, value) {
                    html += '<li style="width:250px; height:110px;cursor:pointer;" class="clear coll-li"  data-id="' + value.slid + '">' +
                        '<img style="width:100px;height:100px;float:left;" src="../' + value.slimage + '" class="the-mumusic-delete-tou">' +
                        ' <p style="width:95px;height:90px;float:left;padding:10px">' +
                        ' <span>' + value.slname + '</span>' +
                        '</p>' +
                        '</li>'
                })
                let allhtml =
                    `
                       <div id="dialog" style="background:#ffffff;border:1px solid #000000;position:fixed; top:50%;left:50%;transform:translate(-50%,-50%); width:250px;height:auto">
                           <ul style="height:330px; overflow-y:auto;">${html}</ul>
                           <div style="margin:0 auto;cursor:pointer;width:50px; height:20px; line-height:20px; text-align:center; border:1px solid #666666; border-radius: 3px;" id="dialogBtn">关闭</button>
                       </div>
                   `
                $('body').append(allhtml).on('click', '#dialogBtn', function (event) {
                    $('#dialog').remove()
                }).on('click', '.coll-li', function () {
                       var slid = $(this).attr('data-id');
                    ajax("GET", "/music/insl?slid=" + slid + '&mid=' + mid, null, (data) => {
                        alert(data.msg)
                        $('#dialog').remove()
                    })
                })
            })
        } else {
            alert('请先登录')
        }
    }).on('click', rankALLAdd, function () {
        var ddlength = $(this).parents('dl').children('dd')
        for (var i = 0; i < ddlength.length; i++) {
            var mid = $(ddlength[i]).attr('data-id')
            appendEle(mid);
        }
    })
});