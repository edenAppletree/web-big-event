$(function () {
    const form = layui.form
    const laypage = layui.laypage
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 8, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    };
    // 获取文章列表数据
    const initTable = function () {
        $.ajax({
            type: 'GET',
            url: "/my/article/list",
            data: q,
            success: (res) => {
                if (res.status !== 0) return layer.msg('文章列表获取失败')
                layer.msg('文章列表获取成功')
                console.log(res);
                // 使用模板引擎渲染页面的数据
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类数据
    const initCate = () => {
        $.ajax({
            type: 'GET',
            url: "/my/article/cates",
            success: (res) => {
                if (res.status !== 0) return layer.msg('文章分类数据获取失败')
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-cate', res)
                $("[name=cate_id]").html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()

            }
        })
    }
    // 筛选功能
    $('#form-search').submit((e) => {
        e.preventDefault()
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    })

    // 分页函数
    const renderPage = (total) => {
        laypage.render({
            elem: 'pageBox',//渲染分页的盒子
            count: total,//数据的总条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//当前页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8, 10],// 每页展示多少条
            // 切换分页时 触发的事件
            // jump 函数的触发时机
            // 1.执行render函数时就会执行（首次加载）
            // 2.当我们切换分页的时候会执行
            // 目的：首次加载的时候不去执行 initTable
            jump: (obj, first) => {
                console.log(first);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除文章数据
    $('tbody').on('click', '.btn-delete', function () {
        const btnNum = $('.btn-delete').length
        const id = $(this).attr('data-id')
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除文章失败')
                    layer.msg('删除文章成功')
                    if (btnNum === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index)
                }
            })
        })
    })

    initTable()
    initCate()

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
})