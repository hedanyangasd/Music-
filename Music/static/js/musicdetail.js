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

var url = location.href;
var subStr1 = url.indexOf("="),
    mid = url.substring(subStr1 + 1),
    mlist = '.play-form .form-tab ul.mtab',
    numMusic = '.play-ctrl a.icon-list';				//播放列表数目
	
function parseLyric(text) {
    //将文本分隔成一行一行，存入数组
    var lines = text.split('\\n'),
        //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
        pattern1 = /\[\d{2}:\d{2}.\d{3}\]/g,
        //保存最终结果的数组
        result = [];

    for (var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace("\\", "");
    }

    lines[0] = lines[0].substring(11);
    while (!pattern.test(lines[0]) && !pattern1.test(lines[0])) {
        lines = lines.slice(1);
    };

    /* for(var i=0;i<lines.length;i++){
     	console.log(lines[i]);
     }*/
    //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    for (var i = 0; i < lines.length - 1; i++) {
        if (lines[i].match(pattern)) {
            var time = lines[i].match(pattern);
            //提取歌词
            var value = lines[i].replace(pattern, '');
        }
        if (lines[i].match(pattern1)) {
            var time = lines[i].match(pattern1);
            //提取歌词
            var value = lines[i].replace(pattern1, '');
        }
        for (var j = 0; j < time.length; j++) {
            //去掉时间里的中括号得到xx:xx.xx
            var t = time[j].slice(1, -1).split(':');
            //将结果压入最终数组
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        }

    }
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function (a, b) {
        return a[0] - b[0];
    });

    return result;
}

function lyric(lyric) {
    var html = '';
    if (lyric.length > 6) {
        var lrc = parseLyric(lyric);
        for (var i = 0, length = lrc.length; i < length; i++) {
            html += '<p>' + lrc[i][1] + '</p>';
        }
    } else {
        lrc = lyric;
        html = '<p>' + lrc + '</p>';
    }
    $('.content').append(html);



    var lrc_i = 0
    // 歌词滚动
    $('audio').on('timeupdate', function() {			
        if (this.currentTime >= lrc[lrc_i][0]) {
            $('.main .content p').removeClass('active').eq(lrc_i).addClass('active');
            lrc_i += 1;
        }
    }).on('seeked', function() {
        var temp = 0;
        while (this.currentTime > lrc[temp][0]) {
            temp++;
        }
        lrc_i = temp;
        $('.main .content p').removeClass('active').eq(lrc_i).addClass('active');
    });			
        
      
}

function musicinfo() {
    ajax("GET", "/music/musicinfo?mid=" + mid, null, (data) => {
        var html = '';
        $('#cd-des h3').html(data.mname);
        $('.cd-des-p .singer a').text(data.name);
        $('.cd-des-p .singer a').attr('href', 'singerdetail.html?singerid=' + data.singerid);
        $('.cd-des-p .cdlist a').text(data.cdname);
        $('.cd-des-p .cdlist a').attr('href', 'CDdetail.html?cdid=' + data.cdid);
        $('#the-cd-cover').html('<img src="../' + data.mimage + '" class="the-cd-detail-cover">');
        lyric(data.lyric);
    });
}

function lyriczhan() {
    $('body').on('click', '.main a.toggle', function () {

        if ($('.main .content').hasClass('txtOF')) {
            $(this).html('收起∧');
            $('.main .content').removeClass('txtOF');

        } else {
            $(this).html('展开∨');
            $('.main .content').addClass('txtOF');
        }
    });
}

function othersl() {
    ajax("GET", "/music/othersl?mid=" + mid, null, (data) => {
        var html = '';
        $.each(data, function (index, value) {
            html += '<li class="clear"><img src="../' + value.slimage + '">' +
                '<p>' +
                '<a href="sldetail.html?slid=' + value.slid + '">' + value.slname + '</a>' +
                '</p>' +
                '<p>' +
                '<a href="userinfo.html?id=' + value.id + '">by ' + value.name + '</a>' +
                '</p></li>';
        });
        $('.sidebar-photo-right').append(html);
    })
}

function otheruser(){
    ajax("GET", "/music/otheruser?mid=" + mid, null, (data) => {
        var html = '';
        $.each(data, function (index, value) {
            html += '<a href="userinfo.html?id='+value.userid+'" title="name"><img src="../'+value.image+'"></a>';
        });
        $('.result-xh').append(html);
    })
}


/******************* 音乐条  ****************/
function icon() {
    $('.play').on('click','a',function () {
        ajax("GET", "/music/musicinfo?mid=" + mid, null, (data) => {
            $('audio')[0].src = data.src;
            window.sessionStorage.setItem('music',data.src);
            $('audio')[0].play();
            appendEle(mid);
        });
    })

    $('.shoucang').on('click','a',function () {
        let isLogin = sessionStorage.getItem("isLogin")
        if (isLogin === 'true') {
                userid = sessionStorage.getItem("id");
            ajax("GET", "/music/collin?mid=" + mid + '&userid=' + userid, null, (data) => {
                alert(data.msg)
            })

        } else {
            alert('请先登录')
        }ajax("GET", "/music/musicinfo?mid=" + mid, null, (data) => {
            $('audio')[0].src = data.src;
            window.sessionStorage.setItem('music',data.src);
            $('audio')[0].play();
            appendEle(mid);
        });
    })

}


 function appendEle(addID) {
    var self = this,
        existID = 0,
        html = '',
        i = $(mlist ).children('li').length,
        musicList = JSON.parse(window.sessionStorage.getItem('musicList')) || {};
        
    for (  ; i >= 0; i--) {
        existID = $(mlist ).children('li').eq(i).attr('data-id');
        if ( addID == existID ) {
            break;
        } else if ( i == 0) {
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
                musicList[addID]=addID
                // console.log(musicList);
                window.sessionStorage.setItem('musicList',JSON.stringify(musicList))
                $(numMusic).text(++num);
                $(mlist).siblings('.empty').hide();
            });
        }
    };
};

function comment() {
    let isLogin = sessionStorage.getItem("isLogin"),
        userid = sessionStorage.getItem("id"),
        content
    $("body").on("click", "#comment_me", function () {
        content = $("#the-comment-textarea").val()
        if (isLogin === 'true') {
            if (content === '') {
                alert('评论不为空')
            } else {
                ajax("GET", "/hdy/incomment?typeid=" + mid + '&userid=' + userid + '&content=' + content + '&retype=music', null, (data) => {
                    alert(data.msg)
                    $("#the-comment-textarea").val('')
                })
            }
        } else {
            alert('请先登录')
        }
    })

}


function showcomment() {
    ajax("GET", "/hdy/showcomment?typeid=" + mid + '&retype=music', null, (data) => {
        console.log(data)
        var html = '';
        $.each(data, function (index, value) {
            html += '<li class="the-comment-list-li"><a href="userinfo.html?id=' + value.id + '" class="the-comment-photo">' +
                '<img  src="../' + value.image + '" /></a> <a href="userinfo.html?id=' + value.id + '" class="the-comment-name">' + value.name + ':</a>' +
                value.content+'<div class="the-comment-date"><p class="the-comment-date-detail">'+value.time+'</p> </div></li>'
        })
        $('#latestcomments').append(html)
    })
}


$(document).ready(function () {
    musicinfo();
    lyriczhan();
    othersl();
    icon();
    otheruser();
    showcomment();
    comment();
});