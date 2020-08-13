$(function() {
    var form = layui.form;

    //layui 的form 表单正则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        newPwd: function(value) {
            if (value == $("[name=oldPwd]").val()) {
                return '新旧密码不能一样';
            }
        },
        rePwd: function(value) {
            if (value !== $("[ name=newPwd]").val()) {
                return '两次输入的密码不一致';
            }
        }
    });

    //修改密码 监听表单提交行为 
    $(".layui-form").on("submit", function(e) {
        //组织表单默认行为
        e.preventDefault();

        console.log("发起更新密码的ajxa请求");
        $.ajax({
            method: "post",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("更新密码失败");
                }
                layui.layer.msg("更新密码成功");
                //重置表单为空  需要将jq 元素 转化为dom 元素  reset()  清空
                $(".layui-form")[0].reset();
            }
        })
    })
})