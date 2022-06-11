$(function () {
    const form = layui.form
    // 自定义验证规则
    form.verify({
        // 密码验证
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 校验新密码和原密码不能相同
        samePwd: (value) => {
            if (value === $('[name=oldPwd]').val()) return '新密码和原密码不能相同'
        },
        // 校验新密码和确认密码是否一致
        rePwd: (value) => {
            if (value !== $('[name=newPwd]').val()) return '新密码和确认密码不相同'
        }
    })
    // 更新密码
    $('.layui-form').submit((e) => {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: "/my/updatepwd",
            data: $('.layui-form').serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg('更新密码失败')
                layer.msg('更新密码成功')
                // 1.强制清除token
                localStorage.removeItem('token')
                //2.重置表单
                window.parent.location.href = '/home/login.html'
            }
        })
    })
})