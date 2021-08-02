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

var user_id = sessionStorage.getItem("id");
var url = location.href;
var subStr1 = url.indexOf("="),
    userid = url.substring(subStr1 + 1);

var rankLIPlay = '.main-mlist a.icon-play';
var rankLIAdd = '.main-mlist a.icn-add';
var rankLISdel = '.main-mlist a.icn-del';

/*信息修改 */
function usinfo(id) {
    ajax("GET", "/hdy/info?id=" + id, null, (data) => {
        $(".photo>img").attr("src", `../` + data.image);
        $("#username>span").text(data.name);
        $("#introduction>span").text(data.intro);
        $("#updatename").val(data.name);
        $("#updateintro").val(data.intro);
        $("#header_box>img").attr("src", `../` + data.image);
    });
}

function upinfo() {
    $(".u-btn1").on("click", function () {
        var name = $("#updatename").val();
        var intro = $("#updateintro").val();
        $(".personal-setting>p").text("");
        if (name === "" || intro === "") {
            $(".personal-setting>p").text("呢称和介绍不能为空");
        } else {
            var data = {
                name: name,
                intro: intro,
                id: user_id
            }
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:3000/hdy/updateinfo",
                data: data,
                dataType: 'json',
                success: (data) => {
                    if (data.code === 200) {
                        $(".personal-setting>p").text("修改成功");
                    }
                }
            });
        }
    });
}

function songlist() {
    ajax("GET", "/soasi/othersonglist?id=" + userid, null, (data) => {
        html = '';
        $.each(data, function (index, value) {
            html += '<li>' +
                '<div class="u-cover">' +
                '<a href="sldetail.html?slid=' + value.slid + '"><img src="../' + value.slimage + '" class="cover" /></a>' +
                '</div>' +
                '<p class="song-tit">' +
                '<a href="sldetail.html?slid=' + value.slid + '" class="song-txt">' + value.slname + '</a>' +
                '</p>' +
                '</li>';
        });
        $("#creatlist").append(html)
    })
}

function collsing() {
    ajax("GET", "/music/collsto?id=" + userid, null, (data) => {
        var html = '';
        $.each(data, function (index, value) {
            html += '<li data-id="' + value.mid + '">' +
                '<a href="javascript:;" class="icon-play"></a>' +
                '<div class="col col-1">' +
                '<h4><a href="musicdetail.html?mid=' + value.mid + '">' + value.mname + '</a></h4>' +
                '<div class="master"> - <a href="singerdetail.html?singerid?=' + value.singerid + '">' + value.name + '</a></div>' +
                '</div>' +
                '<div class="col col-2">' +
                '<a href="javascript:;" class="icn-add" title="添加"></a>' +
                '<a href="javascript:;" class="icn-del" title="删除"></a>' +
                '</div>' +
                '</li>';
        });
        $('.main-mlist ul').append(html);
    })
}

function collsl() {
    ajax("GET", "/music/collsonglist?id=" + userid, null, (data) => {
        $.each(data, function (index, value) {
            var html = '<li>' +
                '<div class="u-cover">' +
                '<a href="sldetail.html?slid=' + value.slid + '">' +
                '<img src="../' + value.slimage + '" class="cover"></a>' +
                '</div>' +
                '<p class="song-tit">' +
                '<a href="sldetail.html?slid=' + value.slid + '" class="song-txt">' + value.slname + '</a>' +
                '</p>' +
                '</li>'

            $("#collist").append(html)

        });
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
                // console.log(musicList);
                window.sessionStorage.setItem('musicList', JSON.stringify(musicList))
                $(numMusic).text(++num);
                $(mlist).siblings('.empty').hide();
            });
        }
    };
};


function isfans() {
    var isfollow;
    ajax("GET", "/music/isfollow?fanid=" + user_id + '&userid=' + userid, null, (data) => {
        isfollow = data.msg;
        if (isfollow == "no") {
            $("#userbutton").html("<a href=\"javascript:;\">+&nbsp;关注</a>")
            $("#userbutton").addClass("following")
        }
        if (isfollow == "yes") {
            $("#userbutton").html("<a href=\"javascript:;\">已关注</a>")
            $("#userbutton").addClass("cancelFollow")
        }
    })
}


function showfans(){
    ajax("GET", "/music/fans?concer=" + userid, null, (data) => {
        $("#fan").html(data.length)
    })
    ajax("GET", "/music/concer?fanid=" + userid, null, (data) => {
        $("#follow").html(data.length)
    })

}


$(function () {
    if (userid === user_id) {
        $("#editPerson").css("display", "block");
        $("#userbutton").css("display", "none");
    } else {
        $("#editPerson").css("display", "none");
    }

    $("#editPerson").attr("href", "usersetting.html?id=" + user_id)
    $("#fan").attr("href", "fans.html?id=" + userid)
    $("#follow").attr("href", "concer.html?id=" + userid)

    usinfo(userid);

    /* 图片上传 */
    $("#file").on("change", function (e) {
        var file = e.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        formData.append("id", user_id);
        console.log(formData)
        $.ajax({
            type: 'POST',
            url: ' http://127.0.0.1:3000/hdy/uploadimg',
            data: formData,
            processData: false,
            contentType: false,
            async: false,
            success: function (res) {
                console.log(res);
            }
        })
    });


    $('.wrap-in').on('click', rankLIPlay, function () {
        var mid = $(this).parents('li').attr('data-id');
        ajax("GET", "/music/musicinfo?mid=" + mid, null, (data) => {
            $('audio')[0].src = data.src;
            window.sessionStorage.setItem('music', data.src);
            $('audio')[0].play();
            appendEle(mid);
        });
    }).on('click', rankLIAdd, function () {
        var mid = $(this).parents('li').attr('data-id');
        appendEle(mid);
    }).on('click', rankLISdel, function () {
        if (userid === user_id) {
            var mid = $(this).parents('li').attr('data-id');
            $(this).parents('li').remove();
            ajax("GET", "/music/delcollsong?mid=" + mid +'&userid=' + user_id, null, (data) => {
                alert(data.msg)
            })
        } else {
            alert("不允许操作")
        }
    })


    upinfo();
    songlist();
    collsing();
    collsl();
    isfans();

    //当功能是点上去要取消关注时 鼠标移动上去
    $("body").delegate(".cancelFollow", "mouseover", function () {
        $("#userbutton").html("取消关注")

    })
    $("body").delegate(".cancelFollow", "mouseout", function () {
        $("#userbutton").html("已关注")
    })


    $("body").on("click", ".following", function () {
        let isLogin = sessionStorage.getItem("isLogin")
        if (isLogin === 'true') {
            ajax("GET", "/music/follow?fanid=" + user_id + '&userid=' + userid, null, (data) => {
                if (data.code === 200) {
                    $("#userbutton").removeClass("following")
                    $("#userbutton").html("<a href=\"javascript:;\">已关注</a>")
                    $("#userbutton").addClass("cancelFollow")
                }
            })
        } else {
            alert('请先登录')
        }
    }).on("click",".cancelFollow",function(){
        ajax("GET", "/music/delfollow?fanid=" + user_id + '&userid=' + userid, null, (data) => {
            if (data.code === 200) {
                $("#userbutton").removeClass("cancelFollow")
                $("#userbutton").html("<a href=\"javascript:;\">+&nbsp;关注</a>")
                $("#userbutton").addClass("following")
            }
        })
    })

    showfans();

})