/**
 * Created by lcw on 2018/5/28.
 */
$(function () {
    var key = ct.getParamsByUrl().productId;
    getProductData(key, function (res) {
        var sizeArr = res.size.split('-');
        sizeArr[1] = parseInt(sizeArr[1]);
        sizeArr[0] = parseInt(sizeArr[0]);
        //1.渲染页面
        $('.mui-scroll').html(template('product', {data: res, sizeArr: sizeArr}));
        $('.loading').css('display', 'none');
        //2.初始化页面滑动和轮播图
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005,
            indicators: false
        });
        mui('.mui-slider').slider({
            interval: 1000
        });
        //3.绑定点击尺码事件
        var $btnSize = $('.btn_size');
        $btnSize.on('tap', function () {
            $(this).addClass('now').siblings('.now').removeClass('now');
        });
        //4.点击修改数量
        var amount = 0;
        var $input = $('.p_number input');
        $('.p_number').on('click', 'span', function () {
            $(this).hasClass('jia') ? amount++ : amount--;
            amount < 0 ? amount++ : amount;
            if (amount > res.num) {
                mui.toast('库存不足');
                amount--;
                return false;
            }
            $input.val(amount);
        });
        //5.点击加入购物车事件
        $('.btn_addCart').on('tap', function () {
            var size = $('.btn_size.now').html();
            if (!size) {
                mui.toast('请选择尺码');
                return false;
            }
            if (!amount) {
                mui.toast('请选择数量');
                return false;
            }
            ct.loginAjax({
                url: '/cart/addCart',
                type: 'post',
                data: {
                    productId: res.id,
                    num: amount,
                    size: size
                },
                success: function (res) {
                    if (res.success === true) {
                        mui.confirm('前往购物车？', '添加成功', ['是', '否'], function (e) {
                            if (e.index == 0) {
                                location.href = ct.cartUrl;
                            } else {
                                //TODO
                            }
                        })
                    }
                }

            });
        })

    });
});
var getProductData = function (productId, callback) {
    $.ajax({
        url: '/product/queryProductDetail',
        type: 'get',
        data: {
            id: productId
        },
        dataType: 'json',
        success: function (res) {
            setTimeout(function () {
                callback && callback(res);
            }, 1000)
        }
    })
};


