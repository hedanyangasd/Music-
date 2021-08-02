function threepart() {
    $(".show-item:nth-child(1)").click(function () {
        $("#the-singer-mess-content1").show();
        $("#the-singer-mess-content2").hide();
        $("#the-singer-mess-content3").hide();
    });
    $(".show-item:nth-child(2)").click(function () {
        $("#the-singer-mess-content1").hide();
        $("#the-singer-mess-content2").show();
        $("#the-singer-mess-content3").hide();
    });
    $(".show-item:nth-child(3)").click(function () {
        $("#the-singer-mess-content1").hide();
        $("#the-singer-mess-content2").hide();
        $("#the-singer-mess-content3").show();
    });

    $(".show-item").click(function () {
        if ($(this).attr("class") == "show-item") {
            $(this).addClass("choosed");
        } else {
            $(this).removeClass("choosed");
            $("#the-singer-mess-content").removeAttr("class");
        }
        $(this).siblings().removeClass("choosed");
    });
}

var rankALLPlay = '#the-songer-list-icon a.play';
var rankLIPlay = '.dd-oper a.icon-play';
var rankLIAdd = '.dd-oper a.icon-add';
var rankLIStore = '.dd-oper a.icon-store';
var rankLISl = '.dd-oper a.icon-scdgd';


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

function singerinfo() {
    var url = location.href;
    var subStr1 = url.indexOf("="),
        singerid = url.substring(subStr1 + 1);
    ajax("GET", "/soasi/singerinfo?singerid=" + singerid, null, (data) => {
        $('#the-singer-top p').html(data.name);
        $('#the-cd-cover').html('<img src="../' + data.image + '" class="the-cd-detail-cover">');
        $('#the-singer-descrip').html('<h3>' + data.name + '简介</h3><p>' + data.intro + '</p>');
    });
}

function othersinger() {
    var url = location.href;
    var subStr1 = url.indexOf("="),
        singerid = url.substring(subStr1 + 1);
    ajax("GET", "/soasi/othersinger?singerid=" + singerid, null, (data) => {
        var html = '';
        $.each(data, function (index, value) {
            html += '<li class="clear"><a href="singerdetail.html?singerid=' + value.singerid + '">' +
                '<img src="../' + value.image + '"></a>' +
                '<p>' +
                '<a href="singerdetail.html?singerid=' + value.singerid + '">' + value.name + '</a>' +
                '</p>' +
                '<p>' +
                '<a href="singerdetail.html?singerid=' + value.singerid + '">' + value.intro + '</a>' +
                '</p>' +
                '</li>';
        });
        $('.sidebar-photo-right').append(html);
    });

}

function singerCD() {
    var url = location.href;
    var subStr1 = url.indexOf("="),
        singerid = url.substring(subStr1 + 1);
    ajax("GET", "/soasi/singerCD?singerid=" + singerid, null, (data) => {
        var html = '';
        $.each(data, function (index, value) {
            html += '<li>' +
                '<div class="u-cover">' +
                '<img src="../' + value.cdimage + '" class="cover">' +
                '<img src="../image/cd.png" class="msk">' +
                '</div>' +
                '<p class="cd-tit">' +
                '<a href="CDdetail.html?cdid=' + value.cdid + '" class="cd-txt">' + value.cdname + '</a>' +
                '</p>' +
                '</li>';
        });
        $('.the-cd-list').append(html);
    });
}

function singersong() {
    var url = location.href;
    var subStr1 = url.indexOf("="),
        singerid = url.substring(subStr1 + 1);
    ajax("GET", "/soasi/singersong?singerid=" + singerid, null, (data) => {
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
            var singer_name = $('#the-singer-name').text();
            html += '<tr class="song-detail" data-id="' + value.mid + '">' +
                '<td>' + i + '</td>' +
                '<td>' +
                '<div class="the-title-hidden">' +
                '<a href="musicdetail.html?mid='+value.mid+'" title="' + value.mname + '">' + value.mname + '</a>' +
                '</div>' +
                '</td>' +

                '<td>' +
                '<div  class="dd-oper">' +
                '<a href="javascript:;" class="icon-play"></a>' +
                '<a href="javascript:;" class="icon-add"></a>' +
                '<a href="javascript:;" class="icon-store"></a>' +
                '<a href="javascript:;" class="icon-scdgd"></a>' +
                '</div>' +
                '</td>' +

                '<td>' +
                '<div class="the-songer-hidden">' +
                '<a href="javascript:;" title="' + singer_name + '">' + singer_name + '</a>' +
                '</div>' +
                '</td>' +

                '<td>' +
                '<div class="the-cd-hidden">' +
                '<a href="CDdetail.html?cdid=' + value.cdid + '" title="' + value.cdname + '">' + value.cdname + '</a>' +
                '</div>' +
                '</td>' +
                '</tr>';
        });
        $('.altrowstable').append(html);
    });
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
                // console.log(musicList);
                window.sessionStorage.setItem('musicList', JSON.stringify(musicList))
                $(numMusic).text(++num);
                $(mlist).siblings('.empty').hide();
            });
        }
    };
};

$(document).ready(function () {
    threepart();
    singerinfo();
    othersinger();
    singerCD();
    singersong();


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
            var mid = $(this).parents('tr').attr('data-id'),
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
        mid = $(this).parents('tr').attr('data-id');
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
                       console.log(slid,mid)
                    ajax("GET", "/music/insl?slid=" + slid + '&mid=' + mid, null, (data) => {
                        alert(data.msg)
                        $('#dialog').remove()
                    })
                })
            })
        } else {
            alert('请先登录')
        }
    })



    $('#cd-mes').on('click', rankALLPlay, function () {
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
    })
});