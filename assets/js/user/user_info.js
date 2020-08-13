$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称的长度必须在1-6位之间";
            }
        }
    })

    initUserInfo();


    //在修改用户资料页面获取用户信息
    function initUserInfo() {
        $.ajax({
            method: "get",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败");
                }
                // layui 的form表单的自行填充
                form.val("formUserInfo", res.data);
                console.log("给表单自动赋值");
            }
        })
    }

    // 点击重置按钮，把用户信息还原
    $("#btnReset").on("click", function(e) {
        e.preventDefault(); //阻止重置表单的默认清除数据行为
        initUserInfo(); //重新调用获取用户资料的方法
    });

    //点击修改信息按钮，触发表单的提交事件
    $(".layui-form").on("submit", function(e) {
        //阻止表单的默认提交跳转网页行为
        e.preventDefault();

        console.log("发起更新用户的ajax行为");
        //发起更新用户的ajax行为
        $.ajax({
            method: "post",
            url: "/my/userinfo",
            //data 的参数 从表单的序列化 来获取
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败");
                }
                console.log(res);
                //需要重新调用index的（父）页面的更新图像和昵称的行为
                //iframe (子)页面调用index (父)页面的方法
                window.parent.getUserinfo();
            }
        })
    })
})