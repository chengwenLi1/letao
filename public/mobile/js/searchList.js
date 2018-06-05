/**
 * Created by lcw on 2018/5/27.
 */
$(function () {
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005,
        indicators: false
    });
    var key = decodeURI(ct.getParamsByUrl().key || ''),
        $input = $('.cz_search input'),
        $searchButton = $('.cz_search a');
    //1.初始化input输入框中的值
    $input.val(key);
    //2.初始化产品
    /*getProduct({
        page: 1,
        pageSize: 4,
        proName: $input.val()
    }, function (res) {
        $('.cz_product').html(template('proTemplate', res));
    });*/
    //3.搜索功能
    $searchButton.on('tap', function () {
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        getProduct({
            page: 1,
            pageSize: 4,
            proName: key
        }, function (res) {
            $('.cz_product').html(template('proTemplate', res));
        });
        location.search = '?key=' + key;
    });
    //4.用户点击排序的时候根据排序的选项排序，默认为升序，再次点击为降序
    $('.cz_options a').on('tap', function () {
        var $this = $(this);
        var orderVal = 2;
        var order = $this.data('order');
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        if (!$this.hasClass('now')) {
            $this.addClass('now').siblings().removeClass('now')
                .find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
        } else {
            if ($this.find('span').hasClass('fa-angle-down')) {
                orderVal = 1;
                $this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                $this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }
        var param = {
            page: 1,
            pageSize: 4,
            proName: key
        };
        param[order] = orderVal;
        getProduct(param, function (res) {
            $('.cz_product').html(template('proTemplate', res));
        });
    });
    //5.下拉刷新
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            down: {
                auto: true,
                callback: function () {
                    var that = this;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }
                    getProduct({
                        page: 1,
                        pageSize: 4,
                        proName: key
                    }, function (res) {
                        setTimeout(function () {
                            $('.cz_product').html(template('proTemplate', res));
                            var $actionA = $('.cz_options a.now');
                            if($actionA) {
                                $actionA.removeClass('now').find('span')
                                    .removeClass('fa-angle-up').addClass('fa-angle-down');
                            }
                            that.endPulldownToRefresh();
                            that.refresh(true);
                        },1000);
                    });
                }
            },
            up: {
                height:50,//可选.默认50.触发上拉加载拖动距离
                contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback : function () {
                    var that = this;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }
                    window.page++;
                    var param = {
                        page: window.page,
                        pageSize: 4,
                        proName: key
                    };
                    var $actionA = $('.cz_options a.now');
                    if($actionA) {
                        var order = $actionA.data('order');
                        var orderVal = $actionA.find('span').hasClass('fa-angle-down') ? 2 : 1;
                        param[order] = orderVal;
                    }
                    getProduct(param,function (res) {
                        setTimeout(function () {
                            $('.cz_product').append(template('proTemplate', res));
                            that.endPullupToRefresh(!res.data.length);
                        },1000);
                    });
                }
            }
        }
    });
});

var getProduct = function (param, callback) {
    $.ajax({
        type: 'get',
        url: '/product/queryProduct',
        dataType: 'json',
        data: param,
        success: function (res) {
            window.page = res.page;
            callback && callback(res);
        }
    });
};
