$(function() {
    $("#link_red").on("click", function() {
        $(".login-box").hide();
        $(".reg-box").show();
    });

    $("#link_login").on("click", function() {
        $(".reg-box").hide();
        $(".login-box").show();
    });

    // 给密码设置正则规定

    // 1.从layui中获取form对象
    var form = layui.form;
    // 弹窗  创建 layer 对象
    var layer = layui.layer;

    // 获取用户名值，并转dom对象
    // var username = $("#name").val();
    // var item = username[0];

    // 2.通过form.verify()来自定义用户名/密码校验规则

    form.verify({
        //用户名规则  在用户名标签中lay-verify的属性添加 | username 才可生效
        // username: function(username, item) {
        //     //value：表单的值、item：表单的DOM对象
        //     if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(username)) {
        //         return '用户名不能有特殊字符';
        //     }
        //     if (/(^\_)|(\__)|(\_+$)/.test(username)) {
        //         return '用户名首尾不能出现下划线\'_\'';
        //     }
        //     if (/^\d+\d+\d$/.test(username)) {
        //         return '用户名不能全为数字';
        //     }
        // },
        // \s 不能为空， 长度6-12
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空'],
        repwd: function(value) {
            //形参是确认密码框中的值
            console.log(value);
            //还需要拿到密码框中值
            var repwd = $(".reg-box [name=password]").val();
            //进行密码等于比较
            if (repwd !== value) {
                return '两次输入的密码不一致！';
            }
            // 不等于返回提示消息

        }

    });

    // 监听 注册事件
    $("#form-reg").on("submit", function(e) {
        //阻止表单默认跳转行为
        e.preventDefault();

        // 拿到ajax需要的data参数    注册的接口 必填的两个参数
        var uname = $("#form-reg [name=username]").val();
        var upwd = $("#form-reg [name=password]").val();
        var data = { username: uname, password: upwd };

        $.ajax({
            method: "post",
            url: "/api/reguser",
            data, //提交的参数值
            success: function(res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //注册完后  直接触发点击  去登录按钮
                $("#link_login").click();
            }
        })
    });

    //监听 登录事件 
    $("#form-login").submit(function(e) {
        //组织表单的默认行为
        e.preventDefault();

        $.ajax({
            method: "post",
            url: "/api/login",
            data: $("#form-login").serialize(), //通过serialize 序列化表单 直接拿到表单中的值
            success: function(res) {
                console.log(res);
                console.log(res.token);
                if (res.status != 0) {
                    return layer.msg("登录失败");
                }
                layer.msg("登录成功");
                //存用户的权限认证值
                localStorage.setItem('token', res.token);
                location.href = "/index.html";
            }
        })
    })

})