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


function fenye() {
    loadsingerpage(1)
    //显示页面
    var totalcount;
    ajax("GET", "/soasi/singercount", null, (data) => {
        console.log(data.count);
        totalcount = data.count;
        var totalpage;
        //除以每页的条数 15条
        if (totalcount % 15 != 0) {
            totalpage = Math.floor(totalcount / 15) + 1
        } else {
            totalpage = totalcount / 15
        }
        $(".tcdPageCode").createPage({
            pageCount: totalpage,
            current: 1,
            backFn: function (p) {
                $('.the-cd-list').html("")
                loadsingerpage(p)
            }
        });
    })
}


function loadsingerpage(p) {
    ajax("GET", "/soasi/singer?page=" + p, null, (data) => {
        var html = '';
        $.each(data, function (index, value) {
            html += '<li>' +
                '<div class="u-cover">' +
                '<a href="singerdetail.html?singerid='+value.singerid+'"><img src="../' + value.image + '" class="cover"></a>' +
                '</div>' +
                '<p class="cd-tit">' +
                '<a href="singerdetail.html?singerid='+value.singerid+'" class="cd-txt">' + value.name + '</a>' +
                '</p>' +
                '</li>';
        });
        $('.the-cd-list').append(html);
    });
}


$(document).ready(function () {
    fenye();
});