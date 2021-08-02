var emailIsOk = false;
var pwdIsOk = false;
var passwordIsOk = false;
var tips = $("#tips");

function checkemail() {
    var email = $("input[name ='email']").val();
    if (email === '') {
        tips.text("邮箱不能为空");
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


function checkPwd() {
    var pwd = $("input[name ='pwd']").val();
    var repwd = $("input[name ='repwd']").val();
    if (pwd === '') {
        tips.text("密码不能为空");
        pwdIsOk = false;
        return;
    }
    if (pwd.length < 6 || pwd.length > 16) {
        tips.text("密码格式不对");
        pwdIsOk = false;
        return;
    }
    pwdIsOk = true;
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
    $("#doLogin").click(function () {
        checkemail();
        checkPwd();
        if (emailIsOk && pwdIsOk) {
            console.log($("#login").serialize());
            ajax("POST", "/hdy/login", $("#login").serialize(),(data)=>{
                if(data.code===200){
                    sessionStorage.setItem("isLogin",true);
                    sessionStorage.setItem("id",data.id);
                    window.location.href = "index.html";
                }
                tips.text(data.msg);

            });
        }
    });


    $("#doforget").click(function (){
        checkemail();
        checkPassword();
        if (emailIsOk && passwordIsOk) {
            console.log($("#update").serialize());
              ajax("POST", "/hdy/update", $("#update").serialize(),(data)=>{
                if(data.code===200){
                    window.location.href = "login.html";
                }
                tips.text(data.msg);
             });
        }
    });
});