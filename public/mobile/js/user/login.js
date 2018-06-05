/**
 * Created by lcw on 2018/5/29.
 */
$(function () {
    var oldUrl = ct.getParamsByUrl().returnUrl;
    //1.验证登录逻辑
    $('.login_btn').on('tap', function () {
        var that = this;
        var userName = $.trim($('.login_name').val());
        var password = $.trim($('.login_password').val());
        if(!(password && userName)) {
            mui.toast('请输入用户名或密码');
            return false;
        }
        mui(that).button('loading');
        login({
            username:userName,
            password:password
        }, function (data) {
            setTimeout(function () {
                mui(that).button('reset');
                if(data.error === 403) {
                    mui.toast(data.message);
                    return false;
                }
                if(data.success) {
                    sessionStorage.setItem('isLogin',true);
                    location.href = oldUrl || ct.userUrl;
                }
            },1000);
        })
    });
});
var login = function (param, callback) {
    $.ajax({
        url: '/user/login',
        type: 'post',
        data: {
            username: param.username,
            password: param.password
        },
        dataType:'json',
        success: function (data) {
            callback && callback(data);
        }
    });
};
