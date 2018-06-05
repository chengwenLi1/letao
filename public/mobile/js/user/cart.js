/**
 * Created by lcw on 2018/5/29.
 */
$(function () {
    //1.初始化区域滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005,
        indicators: false
    });
    //2.下拉刷新
    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper",
            down: {
                auto: true,
                callback: function () {
                    var that = this;
                    getCartData(function (data) {
                        setTimeout(function () {
                            $('.commodity').html(template('cartTemplate', {data: data}));
                            that.endPulldownToRefresh();
                            //3.点击刷新，刷新页面
                            //这里先使用off事件是防止多次绑定，先解除绑定才能再次绑定事件
                            $('.icon_refresh').off('click').on('tap', function () {
                                mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                            });
                        }, 500)
                    })
                }
            }
        }
    });
    //4.点击删除商品
    $('body').on('tap', '.delete_pro', function () {
        var that = $(this);
        var li = that.parent().parent('li');
        var param = {id: [that.data('id')]};
        mui.confirm('你要删除这件商品吗?', '温馨提示', ['确定', '取消'], function (e) {
            if (e.index == 0) {
                delete_pro(param, function (data) {
                    if (data.success === true) {
                        li.remove();
                        setAmount();
                    } else {
                        mui.toast(data.message);
                    }
                });
            } else {
                //只有dom对象才能触发往左滑动事件
                mui.swipeoutClose(li[0]);
            }
        });//5.点击编辑弹出编辑框
    }).on('tap', '.compile_pro', function () {
        var that = $(this);
        var li = that.parent().parent('li');
        var productId = that.data('id');
        //获取对应的数据
        var product = ct.getItemById(window.data, productId);
        var html = template('compileTemplate', product);
        //mui在解释字符串是会把换行自动解释为br，所以如果模板字符串中有换行那么显示出来的html就会有br标签
        mui.confirm(html.replace(/\n/g, ''), '编辑商品', ['确定', '取消'], function (e) {
            if (e.index == 0) {
                var num = $('.updateNum').val();
                var size = $('.updateSize.now').html();
                if (!num) {
                    mui.toast('请提交数量');
                    return false;
                }
                if (!size) {
                    mui.toast('请提交尺码');
                    return false;
                }
                updateCart({
                    id: productId,
                    size: size,
                    num: num
                }, function (data) {
                    if (data.success == true) {
                        product.num = num;
                        product.size = size;
                        li.find('.amount').html('×' + num + '双').data('num',num);
                        li.find('.productSize').html(size);
                        mui.toast('编辑成功');
                        mui.swipeoutClose(li[0]);
                        setAmount();
                    } else {
                        mui.toast(data.message);
                    }
                })
            } else {
                mui.swipeoutClose(li[0]);
            }
        });//数量编辑事件
    }).on('tap', '.c_num span', function () {
        var $input = $(this).siblings('input');
        var num = $input.val();
        var max = $input.data('max');
        if ($(this).hasClass('minus')) {
            num--;
            num = num < 1 ? 1 : num;
        } else {
            num++;
        }
        if (num > max) {
            mui.toast('没有更多库存了');
            num--;
        }
        $input.val(num);
    }).on('tap', '.c_size span', function () {
        $(this).addClass('now').siblings('.now').removeClass('now');
    }).on('change','[type=checkbox]', function () {
        setAmount();
    })
});
//1.获取所有产品数据函数
var getCartData = function (callback) {
    ct.loginAjax({
        url: '/cart/queryCart',
        type: 'get',
        data: '',
        dataType: 'json',
        success: function (data) {
            window.data = data;
            callback && callback(data);
        }
    })
};

//2.删除产品
var delete_pro = function (param, callback) {
    $.ajax({
        url: '/cart/deleteCart',
        type: 'get',
        data: param,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
};
//3.编辑产品
var updateCart = function (param, callback) {
    $.ajax({
        url: '/cart/updateCart',
        type: 'post',
        data: param,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
};
//4.计算金额函数
var setAmount = function () {
    var sumAmount = 0;
    var $checked = $('input:checked');
    $checked.each(function (i, item) {
        var li = $(this).parent().parent().parent().parent('li');
        var num = li.find('.amount').data('num');
        var price = li.find('.nowPrice').html();
        var amount = num * price;
        sumAmount += amount;
    });
    if(Math.floor(sumAmount * 100) % 10 === 0) {
        sumAmount = (Math.floor(sumAmount * 100) / 100).toString() + '0';
    } else {
        sumAmount = (Math.floor(sumAmount * 100) / 100);
    }
    $('.sum_amount').html(sumAmount);
};