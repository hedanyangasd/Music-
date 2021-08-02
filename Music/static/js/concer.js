var url = location.href;
var subStr1 = url.indexOf("="),
    userid = url.substring(subStr1 + 1);

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



function usinfo(id) {
    ajax("GET", "/hdy/info?id=" + id, null, (data) => {
        $(".photo>img").attr("src", `../` + data.image);
        $("#username>span").text(data.name);
        $("#introduction>span").text(data.intro);
    });
}

function showfans() {
    ajax("GET", "/music/fans?concer=" + userid, null, (data) => {
        $("#fan").html(data.length)
    })
    ajax("GET", "/music/concer?fanid=" + userid, null, (data) => {
        $("#follow").html(data.length)
        $("#fanscount").html("(" + data.length + ")")
        $.each(data, function (index, value) {
            fansinfo(value.concer)
        })
    })

}

 function fansinfo(fanid) {
     console.log(fanid)
    var html = '';
    var fan = 0,
        concer = 0;
    ajax("GET", "/hdy/info?id=" + fanid, null, (data) => {
        html += '<li><img src="../' + data.image + '" class="fans-img">' +
            '<div class="per-detail">' +
            '<a href="userinfo.html?id=' + fanid + '" class="per-name">' + data.name + '</a>'
        let p1 = new Promise((resolve, reject) => {
            ajax("GET", "/music/fans?concer=" + fanid, null, (data) => {
                fan = data.length
                resolve(fan)
            })
        })
        let p2 = new Promise((resolve, reject) => {
            ajax("GET", "/music/concer?fanid=" + fanid, null, (data) => {
                concer = data.length
                resolve(concer)
            })
        })
        Promise.all([p1, p2]).then((result) => {
            console.log(result);
            html += '<ul>' +
                '<li><a href="concer.html?concerid='+ fanid +'">关注<span>' + result[1] + '</span></a>&nbsp;&nbsp;&nbsp;&nbsp;|' +
                '</li>' +
                '<li><a href="fans.html?fanid=' + fanid + '">粉丝<span>' + result[0] + '</span></a></li>' +
                '</ul>' +
                '</div>' +
                '</li>'
            console.log(html)
            $("#alternatecolor").append(html)
        })

    });


 }


$(function () {
    usinfo(userid);
    showfans();

    $("#fan").attr("href", "fans.html?id=" + userid)
    $("#follow").attr("href", "concer.html?id=" + userid)
})