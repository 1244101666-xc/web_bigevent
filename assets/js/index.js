$(function() {
    //调用获取用户登录信息的方法
    getUserinfo();
    var layer = layui.layer;
    //点击退出按钮，

    $("#btnLogout").on("click", function() {
        layer.confirm('是否退出?', { icon: 3, title: '提示' }, function(index) {
            //清理用户的身份认证
            localStorage.removeItem("token");
            //跳转到登录页面
            location.href = "/login.html";

            //自带关闭弹窗
            layer.close(index);
        });
    })

});
//获取用户的登录信息
function getUserinfo() {
    $.ajax({
        method: "get",
        url: "/my/userinfo",
        //headers 是请求权限的模块中 需要携带的身份认证头参数  (写在了baseAPI中)
        // headers: {
        //     Authorization: localStorage.getItem("token") //获取localStorage 存的用户登录时信息
        // },
        success: function(res) {
            console.log(res);
            if (res.status != 0) {
                return layui.layer.msg("获取用户信息失败");
            }
            //设置用户的图像
            renderAvatar(res.data);
        },
        //写在ajax的ajaxPrefilter中 无论get post  ajax请求时失败成功都是执行这个回调函数
        // complete: function(res) {
        //     console.log("进来这个complete函数了");
        //     console.log(res);
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
        //         localStorage.removeItem("token");
        //         location.href = "/login.html";
        //     }
        // }

    })
}

//获取用户的基本信息并设置图像
function renderAvatar(user) {
    // 1.获取用户的昵称或者名字
    var name = user.nickname || user.username;
    // 2.将欢迎语后面显示为 用户名称
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);

    // 3.显示图片还是图片文字
    if (user.user_pic !== null) {
        //渲染 图片
        $(".layui-nav-img").attr("src", user.user_pic).show(); //显示图片
        $(".text-avatar").hide(); //隐藏图片文字
    } else {
        //渲染 图片文字
        $(".layui-nav-img").hide(); //隐藏图片
        var first = name[0].toUpperCase(); //获取到用户名的第一个字符
        $(".text-avatar").html(first).show(); //显示第一文字， 
    }
}