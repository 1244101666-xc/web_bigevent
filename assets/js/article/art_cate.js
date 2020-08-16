$(function() {

    initArtCateList();

    var layer = layui.layer;
    var form = layui.form;


    //获取文章类别方法
    function initArtCateList() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function(res) {
                console.log(res);

                //template 的数据源  直接用返回来的数据，但是模板那边需要定位到 data
                var htmlStr = template("tdTemplate", res);
                $("tbody").html(htmlStr);
            }
        })
    }

    //用layer弹出一个层后，最后需要再拿到这个layer.close（index） 去关闭
    var indexAdd = null;
    //点击添加文章类别，弹出添加对话框 
    $("#addArticle").on("click", function() {
        indexAdd = layer.open({
            // 1 不要按钮，去自定义
            type: 1,
            // 自动宽高
            area: ["500px", "250px"],
            title: '添加文章类型',
            // content 指向script脚本的html标签
            content: $("#dialog-add").html()
        });
    });


    //点击确认添加按钮后，需要提交新增的数据
    // 因为这个表单不是原本存在的，是通过js事件在某一时刻触发的，所以需要代理到某一个页面加载的时候就生成的标签身上 body
    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault(); //组织默认行为

        //发起新增文章的ajax请求
        console.log("发起新增文章的ajax请求");
        $.ajax({
            method: 'post',
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("新增失败");
                }
                layer.msg("新增成功");
                layer.close(indexAdd); //关闭这个open的新增文章弹窗
                initArtCateList(); //重新获取下最新的文章并渲染
            }
        })

    });

    //修改文章 因为这个表单不是原本存在的，是通过js事件在某一时刻触发的，所以需要代理到某一个页面加载的时候就生成的标签身上 tbody 
    var indexEdit = null;
    $("tbody").on("click", ".dialog-edit", function() {
        indexEdit = layer.open({
            // 1 不要按钮，去自定义
            type: 1,
            // 自动宽高
            area: ["500px", "250px"],
            title: '修改章类型',
            // content 指向script脚本的html标签
            content: $("#dialog-edit").html()
        });

        var id = $(this).attr("data-id");

        //发起用id 获取文章信息的ajax请求
        console.log("发起用id 获取文章信息的ajax请求");
        $.ajax({
            method: 'get',
            url: "/my/article/cates/" + id,
            success: function(res) {
                console.log(res);
                //layui中的form对象的val() 快速的给表单赋值 lay-filter
                form.val("form-edit", res.data);
            }
        })
    });

    //给修改文章按钮 代理form表单提交事件
    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault();

        //发起修改文章的ajax请求
        console.log("发起修改文章的ajax请求");

        $.ajax({
            method: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新文章失败");
                }
                layer.msg("更新文章成功");
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    });

    //为删除文章类别 代理点击事件
    $("body").on("click", ".dialog-del", function() {
        console.log("ok");
        //获取要删除的文章id
        var id = $(this).attr("data-id");
        console.log(id);

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {

            //发起删除具体文章的ajax请求
            $.ajax({
                method: "get",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章类别失败");
                    }
                    layer.msg("删除文章类别成功");
                    layer.close(index);
                    //重获获取文章类别
                    initArtCateList();
                }
            })


        });
    })


})