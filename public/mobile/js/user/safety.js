/**
 * Created by lcw on 2018/5/30.
 */
$(function () {
    //判断是否登录，如果没有登录跳转到登录页
    ct.loginAjax({
        url:'/user/queryUserMessage',
        type:'get',
        dataType:'json',
        data:''
    });
    var vCode = '';
    //1.提交表单
    $('.register_btn').on('tap', function () {
        var that = this,
            oldPassword = $.trim($('.old_password').val()),
            newPassword = $.trim($('.new_password').val()),
            againPassword = $.trim($('.again_password').val()),
            verification = $.trim($('.register_verification_text').val());
        if (!oldPassword) {
            mui.toast('原密码');
            return false;
        }
        if (!newPassword ) {
            mui.toast('请输入新密码');
            return false;
        }
        if (!againPassword) {
            mui.toast('请确认新密码');
            return false;
        }
        if (!verification) {
            mui.toast('请输入验证码');
            return false;
        }
        if (newPassword !== againPassword) {
            mui.toast('两次输入密码不一致');
            return false;
        }
        if (verification !== vCode) {
            mui.toast('请输入合法的验证码');
            return false;
        }
        //提交请求
        mui(that).button('loading');
        $.ajax({
            url:'/user/updatePassword',
            type:'post',
            dataType:'json',
            data:{
                oldPassword:oldPassword,
                newPassword:newPassword,
                vCode:vCode
            },
            success: function (data) {
                if (data.success === true) {
                    setTimeout(function () {
                        mui.toast('修改成功！');
                    },1000);
                } else {
                    mui.toast(data.message);
                }
            }
        })
    });
    //2.获取验证码
    $('.register_verification_btn').on('tap', function () {
        var that = $(this);
        if (that.hasClass('verification_active')) return false;
        that.addClass('verification_active').html('正在发送...');
        $.ajax({
            url: '/user/vCode',
            type: 'get',
            data: '',
            dataType: 'json',
            success: function (data) {
                setTimeout(function () {
                    mui.toast('验证码已发送到console');
                    vCode = data.vCode;
                    console.log(vCode);
                    var num = 60;
                    var timer = setInterval(function () {
                        num--;
                        that.html(num + '之后再获取');
                        if (num == 1) {
                            that.removeClass('verification_active').html('获取验证码');
                            clearInterval(timer);
                        }
                    }, 1000)
                }, 1000)
            }
        })
    })

});