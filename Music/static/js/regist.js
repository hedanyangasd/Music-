var usernameIsOk = false;
var emailIsOk = false;
var passwordIsOk = false;
var tips = $("#tips");


function checkusername() {
    var name = $("input[name ='name']").val();
    if (name === '') {
        tips.text("昵称不能为空");
        usernameIsOk = false;
        return;
    }
    usernameIsOk = true;
}


function checkEmail() {
    var email = $("input[name ='email']").val();
    var reg = /^\w+([-.]\w)*@[A-Za-z0-9]+([-.][A-Za-z0-9]+)*(\.[A-Za-z0-9]+)$/;
    if (email === '') {
        tips.text("邮箱不能为空");
        emailIsOk = false;
        return;
    }
    if (!reg.test(email)) {
        tips.text("邮箱格式不对");
        emailIsOk = false;
        return;
    }
    emailIsOk = true;
}

function checkPassword() {
    var pwd = $("input[name ='pwd']").val();
    var repwd = $("input[name ='repwd']").val();
    if (pwd === '') {
        tips.text("密码不能为空");
        passwordIsOk = false;
        return;
    }
    if (pwd.length < 6 || pwd.length > 16) {
        tips.text("密码格式不对");
        passwordIsOk = false;
        return;
    }
    if (pwd !== repwd) {
        tips.text("两次密码不同");
        passwordIsOk = false;
        return;
    }
    passwordIsOk = true;
}

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


$(function () {
    $("#doRegist").click(function () {
        checkusername();
        checkEmail();
        checkPassword();
        if (usernameIsOk && passwordIsOk && emailIsOk) {
            console.log($("#regist").serialize());
            ajax("POST", "/hdy/regist", $("#regist").serialize(),(data)=>{
                if(data.code === 200){
                    window.location.href = "index.html";
                }
                tips.text(data.msg);
            });
        }
    });
});