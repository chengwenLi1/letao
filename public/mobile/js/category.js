/**
 * Created by lcw on 2018/5/26.
 */
$(function () {
    var firstCategoryUl = $('.cat_left ul');
    getFirstCategoryData(function (res) {
        //初始化渲染一级分类
        firstCategoryUl.html(template('firstTemplate',res));
        var categoryId = $('.cat_left ul li:first-child').find('a').data('id');
        //初始化渲染二级分类
        getSecondCategoryData({id:categoryId}, function (res) {
            $('.cat_right ul').html(template('secondTemplate',res));
        })
    });
    //点击一级分类渲染二级分类
    firstCategoryUl.on('click','a', function () {
        if($(this).parent().hasClass('now')) return false;
        firstCategoryUl.children('.now').removeClass('now');
        $(this).parent('li').addClass('now');
        var categoryId = $(this).data('id');
        getSecondCategoryData({id:categoryId}, function (res) {
            $('.cat_right ul').html(template('secondTemplate',res));
        })
    })
});
var getFirstCategoryData = function (callback) {
    $.ajax({
        type:'get',
        url:'/category/queryTopCategory',
        data:'',
        dataType:'json',
        success: function (res) {
            callback && callback(res);
        }
    })
};
var getSecondCategoryData = function (param,callback) {
    $.ajax({
        type:'get',
        url:'/category/querySecondCategory',
        data:param,
        dataType:'json',
        success: function (res) {
            callback && callback(res);
        }
    })
};