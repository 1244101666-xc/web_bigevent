// 每次调用$.get() $.post() $.ajax() 时
// 都会调用这个ajaxPrefilter 函数
//在这个函数中 可以拿到我们给ajax提供的 配置对象 ajax( 配置对象)
$.ajaxPrefilter(function(options) {
    //在发起ajax请求之前 jquery默认会走这里拿url地址
    options.url = "http://ajax.frontend.itheima.net" + options.url;
    console.log(options.url);
})