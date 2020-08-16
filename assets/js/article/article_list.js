$(function() {

    //创建 弹出框对象
    var layer = layui.layer;

    //下拉框可以展示
    var form = layui.form;

    //创建分页的对象
    var laypage = layui.laypage;

    //ajax 的data 数据对象
    var q = {
        pagenum: 1, //当前页
        pagesize: 3, //每页展示多少行
        cate_id: '', //文章类别id
        state: '' //文章的发布状态
    }

    //获取数据初始化页面
    initTable();
    //获取下拉文章列表
    initCate();

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    //初始化文章list  展示
    function initTable() {
        //发起获取文章列表的ajax请求
        console.log("发起获取文章列表的ajax请求");
        $.ajax({
            method: "get",
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败");
                }
                //模板引擎  渲染页面html 结构 tbody
                var htmlStr = template("tpl-list", res);
                $("tbody").html(htmlStr);

                //调用分页标签设置方法
                renderPage(res.total);
            }
        })
    }


    //动态获取文章分类的下拉
    function initCate() {
        //发起动态获取文章分类下拉的选项
        console.log("发起动态获取文章分类下拉的选项");
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取文章分类下拉内容失败");
                }
                var htmlStr = template("tmp-cates", res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    //给筛选按钮绑定提交事件
    $("#form-search").on("submit", function(e) {
        e.preventDefault();
        q.cate_id = $("[name=cate_id]").val();
        q.state = $("[name=state]").val();
        initTable();
    });


    //文章列表 删除具体文章 通过 tbody代理
    $("tbody").on("click", ".btn-del", function() {
        //在行内 设置一个自定义属性来存 id
        var id = $(this).attr("data-id");

        //获取删除的按钮长度个数
        var len = $(".btn-del").length;

        //发起弹窗询问
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //发起ajxa删除单行文章的请求
            console.log("发起ajxa删除单行文章的请求");
            $.ajax({
                method: "get",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败");
                    }
                    layer.msg("删除成功");
                    //重新获取文章列表
                    if (len == 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });

    })

    //分页标签设置
    function renderPage(total) {
        console.log(total);
        //执行一个laypage实例
        laypage.render({
            elem: 'renderPage', //分页容器
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认选中的页码
            //[总条数 每页显示 上一页  当前页 下一页的位置 跳转页]
            layout: ["count", "limit", "pre", "page", "next", "skip"],
            limits: [2, 3, 5, 10, 20, 50], //修改默认的下拉条数
            //1.当页码切换的时候出触发回调函数
            // 2.调用laypage.render会触发回调函数
            jump: function(obj, first) {
                // console.log(obj.curr); //当前页
                // console.log(first); //是否是点击页面跳转的  默认 render方法触发 会进入死循环，所以if判断
                q.pagenum = obj.curr; //将点击的页码重新赋值给全局对象q
                q.pagesize = obj.limit; //设置每页展示行
                if (!first) { //判断不等于 true 就执行 重新获取list 文章列表
                    initTable();
                }

            }
        })
    }



})