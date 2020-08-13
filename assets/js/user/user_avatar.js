$(function() {

    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    //给上传绑定点击事件 
    $("#btnChooseImage").on("click", function() {
        $("#updownImage").click();
    });

    //监听上传文件元素  发生变化
    $("#updownImage").on("change", function(e) {

        //获取选择的图片文件
        var fileList = e.target.files;
        console.log(fileList);
        if (fileList.length === 0) {
            return layer.msg('请选择图片');
        }

        //拿到用户选择的图片文件
        var files = e.target.files[0];
        //创建拿到的图片文件的url路径
        var imgUrl = URL.createObjectURL(files);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    //点击确认，更新用户图片  绑定点击事件
    $("#btnUpload").on("click", function() {
        //获取用户的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        console.log("图片参数的类型是：" + typeof(dataURL));
        //更新服务器上的图片 ajax
        console.log("发起更新服务器图像的ajax请求");
        $.ajax({
            method: "post",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("图片更新失败");
                }
                layer.msg("图片更新成功");
                //重新调用父级的获取用户信息方法
                window.parent.getUserinfo();
            }
        })

    })

})