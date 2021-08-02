var usermemb = $("#user-memb");
var login = $("#login");
var slidedown = $("#slide-down");

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


function getPhoto() {
    var user_id = sessionStorage.getItem("id");
    ajax("GET", "/hdy/info?id=" + user_id, null, (data) => {
        $(".user-memb>img").attr("src", `../` + data.image);
        $("#homepage").attr("href", "userinfo.html?id=" + user_id)
    });
}


function retop() {
    $(".retu-top").hide();


    $(function () {
        $(window).scroll(function () {
            if ($(window).scrollTop() > 100) {
                $(".retu-top").fadeIn(500);
            } else {
                $(".retu-top").fadeOut(500);
            }
        });
        //当点击跳转链接后，回到页面顶部位置
        $(".retu-top").click(function () {
            $('body,html').animate({
                    scrollTop: 0
                },
                1000);
            return false;
        });
    });
}


function search() {
    var input = '.header .top-tool .top-search input', //搜索框
        result = '.header .top-tool .top-search ul.result', //搜索结果
        resultLI = '.header .top-tool .top-search ul.result li';
    var url = '';
    $('body').on({
        keyup: function () {
            keycode = event.which;
            if (keycode == 13) {
                //window.location.href = url;

            } else if (keycode == 38 && $(resultLI).length > 0) {
                this.index < 1 ? (this.index = $(resultLI).length - 1) : (this.index--);

                $(resultLI).children('a').removeClass('active');
                $(resultLI).eq(this.index).children('a').addClass('active');
                this.value = $(resultLI).eq(this.index).find('.result-name').html();

            } else if (keycode == 40 && $(resultLI).length > 0) {
                this.index > $(resultLI).length - 2 ? (this.index = 0) : (this.index++);
                $(resultLI).children('a').removeClass('active');
                $(resultLI).eq(this.index).children('a').addClass('active');
                this.value = $(resultLI).eq(this.index).find('.result-name').html();

            } else if (!!$.trim(this.value)) {
                var content = $.trim(this.value).toString();
                console.log("content", content);
                $(result).empty();
                ajax("GET", "/soasi/searchSinger?content=" + content, null, (data) => {
                    var html = '';
                    $.each(data, function (index, value) {
                        html += '<li type="singerdetail.html?singerid=" data-id="' + value.singerid + '"><a href="javascript:;"><div class="col result-master"> 歌手：' + value.name + '</div></a></li>'
                    });
                    $(result).append(html);
                });

                ajax("GET", "/soasi/searchMusic?content=" + content, null, (data) => {
                    var html = '';
                    $.each(data, function (index, value) {
                        html += '<li type="musicdetail.html?mid=" data-id="' + value.mid + '"><a href="javascript:;"><div class="col result-master"> 歌曲：' + value.mname + '</div></a></li>'
                    });
                    $(result).append(html);
                });

            }
            $(result).show();
        },
        blur: function () {
            $(result).hide();
        }
    }, input).on('mousedown', resultLI, function () {
        url = $(this).attr('type');
        url += $(this).attr('data-id');
        window.location.href = url;
    })
}



$(function () {
    retop();

    let isLogin = sessionStorage.getItem("isLogin")
    if (isLogin === 'true') {
        usermemb.css("display", "block");
        login.css("display", "none");
        getPhoto();
    } else {
        usermemb.css("display", "none");
        login.css("display", "block");
    }

    usermemb.mouseover(function () {
        slidedown.css("display", "block");
    });

    usermemb.mouseout(function () {
        slidedown.css("display", "none");
    });

    $("#logout").click(function () {
        sessionStorage.setItem("isLogin", false);
        sessionStorage.setItem("id", 0);
        window.location.href = "index.html";
    });

    $(".mymusic").click(function () {
        var userid = sessionStorage.getItem("id");
        if (isLogin === 'true') {
            window.location.href = "mymusic.html?id=" + userid;
        } else {
            alert("请先登录")
        }
    });


    search();

});