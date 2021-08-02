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

function openme() {

    document.getElementById('div1').style.display = 'block';
}

function closeme() {
    document.getElementById('div1').style.display = 'none';
}

function introhide() {
    $(".the-cd-toggle").click(function () {
        if ($('.the-cd-content').hasClass('the-cd-descri')) {
            $(this).html('收起∧');
            $('.the-cd-content').removeClass('the-cd-descri');

        } else {
            $(this).html('展开∨');
            $('.the-cd-content').addClass('the-cd-descri');
        }
    });

    $(".mymusic-nav a").click(function () {
        if ($(this).siblings().css("display") == "none") {
            $(this).siblings().css("display", "block")
        } else {
            $(this).siblings().css("display", "none")
        }
    })

}

var url = location.href;
var subStr1 = url.indexOf("="),
    userid = url.substring(subStr1 + 1);
var slli = '.mymusic-nav-li'
var rankALLPlay = '#the-cd-icon a.play';
var rankdelsl = '#the-cd-icon a.del';

var rankLIPlay = '.dd-oper a.icon-play';
var rankLIAdd = '.dd-oper a.icon-add';
var rankLIStore = '.dd-oper a.icon-store';
var rankLIdel = '.dd-oper a.icon-del';

function mycreate() {
    ajax("GET", "/music/mymusiccreate?id=" + userid, null, (data) => {
        var html = '',
            slids = [];
        $('#createnum').text('(' + data.length + ')')
        $.each(data, function (index, value) {
            html += '<li class="clear mymusic-nav-li"  data-id="' + value.slid + '">' +
                '<img src="../' + value.slimage + '" class="the-mumusic-delete-tou">' +
                ' <p>' +
                ' <span>' + value.slname + '</span>' +
                '</p>' +
                '</li>'
            slids.push(value.slid)
        })
        $('#create .mymusic-nav-ul').append(html);

        ajax("GET", "/soasi/slinfo?slid=" + slids[0], null, (data) => {
            $('#the-cd-cover').html('<img src="../' + data.slimage + '" class="the-cd-detail-cover">');
            $('#cd-des h3').html(data.slname);
            $('.the-cd-content p').text('介绍：' + data.slname + '<br>' + data.slintro);
        });

        ajax("GET", "/soasi/slsongs?slid=" + slids[0], null, (data) => {
            var html = '<tr>' +
                '<th class="list1"></th>' +
                '<th class="list2">歌曲标题</th>' +
                '<th class="list3">操作</th>' +
                '<th class="list4">歌手</th>' +
                '<th class="list5">专辑</th>' +
                '</tr>';
            var i = 0;
            $.each(data, function (index, value) {
                i = i + 1;
                html += '<tr class="song-detail" data-id="' + value.mid + '">' +
                    '<td>' + i + '</td>' +
                    '<td>' +
                    '<div class="the-title-hidden">' +
                    '<a href="musicdetail.html?mid=' + value.mid + '" title="' + value.mname + '">' + value.mname + '</a>' +
                    '</div>' +
                    '</td>' +

                    '<td>' +
                    '<div  class="dd-oper">' +
                    '<a href="javascript:;" class="icon-play"></a>' +
                    '<a href="javascript:;" class="icon-add"></a>' +
                    '<a href="javascript:;" class="icon-store"></a>' +
                    '<a href="javascript:;" class="icon-del"></a>' +
                    '</div>' +
                    '</td>' +

                    '<td>' +
                    '<div class="the-songer-hidden">' +
                    '<a href="singerdetail.html?singerid=' + value.singerid + '" title="' + value.name + '">' + value.name + '</a>' +
                    '</div>' +
                    '</td>' +

                    '<td>' +
                    '<div class="the-cd-hidden">' +
                    '<a href="CDdetail.html?cdid=' + value.cdid + '" title="' + value.cdname + '">' + value.cdname + '</a>' +
                    '</div>' +
                    '</td>' +
                    '</tr>';
            })
            $('#f-cd-number a').html(i + '首歌');
            $('.altrowstable').append(html);
        });

    });

}


let musicList = JSON.parse(window.sessionStorage.getItem('musicList')) || {}

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
                // console.log(musicList);
                window.sessionStorage.setItem('musicList', JSON.stringify(musicList))
                $(numMusic).text(++num);
                $(mlist).siblings('.empty').hide();
            });
        }
    };
};



$(document).ready(function () {
    introhide();
    mycreate();
    var slid = 0;
    $('#create').on('click', slli, function () {
        slid = $(this).attr('data-id');

        ajax("GET", "/soasi/slinfo?slid=" + slid, null, (data) => {
            $('#the-cd-cover').html('<img src="../' + data.slimage + '" class="the-cd-detail-cover">');
            $('#cd-des h3').html(data.slname);
            $('.the-cd-content p').text('介绍：' + data.slname + '<br>' + data.slintro);
        });


        ajax("GET", "/soasi/slsongs?slid=" + slid, null, (data) => {
            var html = '<tr>' +
                '<th class="list1"></th>' +
                '<th class="list2">歌曲标题</th>' +
                '<th class="list3">操作</th>' +
                '<th class="list4">歌手</th>' +
                '<th class="list5">专辑</th>' +
                '</tr>';
            var i = 0;
            $.each(data, function (index, value) {
                i = i + 1;
                html += '<tr class="song-detail" data-id="' + value.mid + '">' +
                    '<td>' + i + '</td>' +
                    '<td>' +
                    '<div class="the-title-hidden">' +
                    '<a href="musicdetail.html?mid=' + value.mid + '" title="' + value.mname + '">' + value.mname + '</a>' +
                    '</div>' +
                    '</td>' +

                    '<td>' +
                    '<div  class="dd-oper">' +
                    '<a href="javascript:;" class="icon-play"></a>' +
                    '<a href="javascript:;" class="icon-add"></a>' +
                    '<a href="javascript:;" class="icon-store"></a>' +
                    '<a href="javascript:;" class="icon-del"></a>' +
                    '</div>' +
                    '</td>' +

                    '<td>' +
                    '<div class="the-songer-hidden">' +
                    '<a href="singerdetail.html?singerid=' + value.singerid + '" title="' + value.name + '">' + value.name + '</a>' +
                    '</div>' +
                    '</td>' +

                    '<td>' +
                    '<div class="the-cd-hidden">' +
                    '<a href="CDdetail.html?cdid=' + value.cdid + '" title="' + value.cdname + '">' + value.cdname + '</a>' +
                    '</div>' +
                    '</td>' +
                    '</tr>';
            })
            $('#f-cd-number a').html(i + '首歌');
            $('.altrowstable').html(html);
        });

    })


    $('.cd-left').on('click', rankALLPlay, function () {
        var trlength = $('.song-detail')
        for (var i = 0; i < trlength.length; i++) {
            var mid = $(trlength[i]).attr('data-id')
            if (i == 0) {
                ajax("GET", "/music/musicinfo?mid=" + mid, null, (data) => {
                    $('audio')[0].src = data.src;
                    window.sessionStorage.setItem('music', data.src);
                    $('audio')[0].play();
                });
            }
            appendEle(mid);
        }
    }).on('click', rankdelsl, function () {
        ajax("GET", "/music/delslist?slid=" + slid, null, (data) => {
            alert(data.msg)
        }) 

        ajax("GET", "/hdy/delcomment?slid=" + slid, null, (data) => {
            console.log(data.msg)
        }) 

    })


    $('.wrap .altrowstable').on('click', rankLIPlay, function () {
        var mid = $(this).parents('tr').attr('data-id');

        ajax("GET", "/music/musicinfo?mid=" + mid, null, (data) => {
            $('audio')[0].src = data.src;
            window.sessionStorage.setItem('music', data.src);
            $('audio')[0].play();
            appendEle(mid);
        });
    }).on('click', rankLIAdd, function () {
        var mid = $(this).parents('tr').attr('data-id');
        appendEle(mid);
    }).on('click', rankLIStore, function () {
        let isLogin = sessionStorage.getItem("isLogin")
        if (isLogin === 'true') {
            var mid = $(this).parents('tr').attr('data-id');
            console.log("lll", mid, userid)
            ajax("GET", "/music/collin?mid=" + mid + '&userid=' + userid, null, (data) => {
                alert(data.msg)
            })

        } else {
            alert('请先登录')
        }
    }).on('click', rankLIdel, function () {
        var mid = $(this).parents('tr').attr('data-id');
        console.log(mid, slid)
        ajax("GET", "/music/delsl?mid=" + mid + '&slid=' + slid, null, (data) => {
            alert(data.msg)
        })
        $(this).parents('tr').remove();
    })

    if (window.sessionStorage.getItem('img')) {
        document.getElementById('div1').style.display = 'block';
        $('#user').attr('src', `../${window.sessionStorage.getItem('img')}`);
    }
    

    $("#the-dongtai-footer-icon1").click(function () {
        var sname = $("#sname").val(),
        sintro = $('#sintro').val();
        console.log('vv', sname, sintro)
        var slimage = window.sessionStorage.getItem('img');
        if (sname === '' || sintro === '' || slimage === '') {
            alert('三个选项不能为空')
        } else {
            ajax("GET", "/music/creatsl?id=" + userid+'&slname='+sname+'&slimage='+slimage+'&slintro='+sintro, null, (data) => {
                alert(data.msg)
            });
            closeme()
            window.sessionStorage.setItem('img', '')
            location.reload() 
        }

    })


    /* 图片上传 */
    $("#file").on("change", function (e) {
        var file = e.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        formData.append("id", userid);
        $.ajax({
            type: 'POST',
            url: ' http://127.0.0.1:3000/music/uploadimg',
            data: formData,
            processData: false,
            contentType: false,
            async: false,
            success: function (res) {
                window.sessionStorage.setItem('img', res[0])
            }
        })
    });
})