// 每次调用$.get() $.post() $.ajax() 时
// 都会调用这个ajaxPrefilter 函数
//在这个函数中 可以拿到我们给ajax提供的 配置对象 ajax( 配置对象)
$.ajaxPrefilter(function(options) {
    //在发起ajax请求之前 jquery默认会走这里拿url地址
    console.log("在发起ajax请求之前 jquery默认会走这里拿url地址拼接 成完整的url地址");
    options.url = "http://ajax.frontend.itheima.net" + options.url;
    console.log(options.url);
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ''
        }
    }

    //无论get post  ajax请求时失败成功都是执行这个回调函数
    options.complete = function(res) {
        console.log("无论get post  ajax请求时失败成功都是执行这个回调函数来判断身份认证成功否");
        // console.log(res);
        if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
            localStorage.removeItem("token");
            location.href = "/login.html";
        }
    }
})