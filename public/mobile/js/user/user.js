/**
 * Created by lcw on 2018/5/30.
 */
$(function () {
    ct.loginAjax({
        url:'/user/queryUserMessage',
        type:'get',
        dataType:'json',
        data:'',
        beforeSend: function () {
            $('.user_nick_name').html('加载中...');
            $('.user_mobile').html('加载中...');
        },
        success: function (data) {
            setTimeout(function () {
                $('.user_nick_name').html(data.username);
                $('.user_mobile').html(data.mobile);
            },500);
        }
    });
    $('.cz_out_login_btn').on('tap', function () {
        $.ajax({
            url:'/user/logout',
            type:'get',
            dataType:'json',
            data:'',
            success: function (data) {
                console.log(data);
                if(data.success === true) {
                    sessionStorage.removeItem('isLogin');
                    location.href = ct.loginUrl;
                } else {
                    mui.toast(data.message);
                }
            }
        })
    })
});
