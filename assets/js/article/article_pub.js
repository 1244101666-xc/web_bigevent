$(function() {

    var layer = layui.layer;
    var form = layui.form;

    //调用初始化文章类别的下拉选择
    initSelectCate();
    // 初始化富文本编辑器
    initEditor()
        // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)



    //初始化文章类别的下拉选择函数
    function initSelectCate() {
        console.log("发起获取文章类别的下拉选择");
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取文章下拉类别失败");
                }
                //选染模板类型下拉
                var htmlStr = template("tmp-pub", res);
                //将下拉的select的元素获取并将模板引擎给到他
                $("[name=cate_id]").html(htmlStr);
                //让下拉可以弹出
                form.render();
            }
        })
    }


    //为选择封面绑定文件点击事件
    $("#selFace").on("click", function() {
        console.log("click");
        $("#coverImg").click();
    });

    //为更换图片绑定change事件
    $("#coverImg").on("change", function(e) {

        //1.拿到图片元素文件
        var file = e.target.files[0];
        if (file.length <= 0) { //更具文件长度 判断用户是否选择了图片
            return
        }
        //2.根据选择的图片创建一个url
        var newImgURL = URL.createObjectURL(file);

        //3.更换画布图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    //为保存草稿 按钮设置初始值 ，并绑定点击事件
    var art_save = "已发布";
    $("#btnSave").on("click", function() {
        art_save = "草稿";
    });

    //点击发布，提交表单数据
    $("#form-commit").on("submit", function(e) {
        e.preventDefault();
        // art_save = "已发布"; //修改 art_save 状态值
        //1.创建formDate格式的值
        var fd = new FormData($(this)[0]);

        //2.将状态追加
        fd.append("state", art_save);
        //  循环打印下k,v
        fd.forEach(function(v, k) {
            console.log(k, v);
        });

        //3.将封面裁剪的图片，输出为一个对象
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append("cover_img", blob);
            //发表文章
            publishArticle(fd);
        })
    });

    // 发布文章的函数
    function publishArticle(fd) {
        console.log("发起新增文章的ajax请求");
        //发起新增文章的ajax请求
        $.ajax({
            method: "post",
            url: "/my/article/add",
            data: fd,
            //如果要提交的数据是 FormData格式的，需要写两个属性
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("发布文章失败");
                }
                layer.msg("文章发布成功");
                //发布文章成功后 跳转到 文章列表页
                location.href = "/article/article_list.html";

            }
        })

    }
})