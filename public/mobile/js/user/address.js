/**
 * Created by lcw on 2018/5/31.
 */
$(function () {
    //1.利用模板引擎渲染数据
    ct.loginAjax({
        url:'/address/queryAddress',
        type:'get',
        data:'',
        dataType:'json',
        success: function (data) {
            console.log(data);
            $('.address_message').html(template('addressTemplate',{data:data}));
        }
    });
    //2.删除收货地址
    $('.address_message').on('tap','.delete-message', function () {
        var that = $(this);
        var id = that.data('id');
        $.ajax({
            url:'/address/deleteAddress',
            type:'post',
            dataType:'json',
            data:{id:id},
            success: function (data) {
                if(data.success === true) {
                    that.parent().parent('li').remove();
                    mui.toast('删除成功');
                } else {
                    mui.toast(data.message);
                }
            }
        });
    })
});