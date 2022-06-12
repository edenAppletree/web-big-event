// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// 请求拦截器 可以在这个函数中，对请求参数进行处理
$.ajaxPrefilter((options) => {
    // 在请求之前拼接上根路径
    options.url = 'http://big-event-api-t.itheima.net' + options.url
    // 注入token
    if(options.url.includes('/my/')) {
        options.headers={
            Authorization: localStorage.getItem("token")
        }
    }
    // 权限校验 身份认证
    options.complete = (res) => {
        if (res.responseJSON.status === 1 &&
            res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
            // 跳转到登录页面
            location.href = '/home/login.html'
        }
    }
})