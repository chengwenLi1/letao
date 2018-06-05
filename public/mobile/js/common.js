/**
 * Created by lcw on 2018/5/26.
 */
var ct = {};
//获取地址中的信息函数
ct.getParamsByUrl = function () {
    var params = {};
    var search = location.search;
    var searchArr = search.replace('?', '').split('&');
    searchArr.forEach(function (item, i) {
        var data = item.replace('=','*').split('*');
        params[data[0]] = encodeURI(data[1]);
    });
    return params;
};
ct.loginUrl = '/m/user/login.html';
ct.cartUrl = '/m/user/cart.html';
ct.userUrl = '/m/user/user.html';
ct.addressUrl = '/m/user/address.html';
//验证是否登录函数
ct.loginAjax = function (params) {
    if(!params.url) return false;
    $.ajax({
        url: params.url,
        type: params.type || 'get',
        data:params.data || '',
        dataType:params.dataType,
        beforeSend: function () {
            params.beforeSend && params.beforeSend();
        },
        success: function (res) {
            if(res.error === 400) {
                location.href = ct.loginUrl + '?returnUrl=' + location.href;
                return false;
            } else {
                params.success && params.success(res);
            }
        },
        error: function () {
            mui.toast('数据库连接失败');
            params.error && params.error(res);
        }
    })
};
//获取数组中id相同的元素
ct.getItemById = function (data, id) {
    var message = null;
    data.forEach(function (item,i) {
        if(item.id === id) {
            message = item;
        }
    });
    return message;
};
ct.serialize2object = function (data) {
    var param = {};
    if(data) {
        var dataString = decodeURI(data);
        var dataArr = dataString.split('&');
        dataArr.forEach(function (item, i) {
            var itemArr = item.split('=');
            param[itemArr[0]] = itemArr[1];
        });
    }
    return param;
};
