/**
 * Created by lcw on 2018/5/29.
 */
$(function () {
    var vCode = '';
    //1.提交表单
    $('.register_btn').on('tap', function () {
        var that = this,
            name = $.trim($('.register_name').val()),
            $passwordArr = $('.register_password'),
            telephone = $.trim($('.register_tel').val()),
            verification = $.trim($('.register_verification_text').val());
        if (!name) {
            mui.toast('请输入用户名');
            return false;
        }
        if (!$.trim($passwordArr.eq(0).val())) {
            mui.toast('请输入密码');
            return false;
        }
        if (!$.trim($passwordArr.eq(1).val())) {
            mui.toast('请确认密码');
            return false;
        }
        if (!telephone) {
            mui.toast('请输入手机号');
            return false;
        }
        if (!(/^1[34578]\d{9}$/.test(telephone))) {
            mui.toast('请输入合法的手机号');
            return false;
        }
        if (!verification) {
            mui.toast('请输入验证码');
            return false;
        }
        if (!($.trim($passwordArr.eq(0).val()) === $.trim($passwordArr.eq(1).val()))) {
            mui.toast('两次输入密码不一致');
            return false;
        }
        if (verification !== vCode) {
            mui.toast('请输入合法的验证码');
            return false;
        }
        //提交请求
        mui(that).button('loading');
        register({
            username: name,
            password: $.trim($passwordArr.eq(0).val()),
            mobile: telephone,
            vCode: vCode
        }, function (data) {
            if (data.success === true) {
                setTimeout(function () {
                    mui.toast('注册成功！');
                    location.href = ct.loginUrl;
                },1000);
            } else {
                mui.toast(data.message);
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
var register = function (param, callback) {
    $.ajax({
        url: '/user/register',
        type: 'post',
        data: {
            username: param.username,
            password: param.password,
            mobile: param.mobile,
            vCode: param.vCode
        },
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    });
};