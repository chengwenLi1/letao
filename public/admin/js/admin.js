/**
 * Created by lcw on 2018/6/1.
 */
//后台管理系统的公共js文件
/*
1.进度显示，所有页面在发送ajax时需要显示进度条
2.当ajax正在请求时显示进度加载
3.当ajax请求结束时 进度条走完 隐藏
 */
//相关的配置,隐藏右边的圈
NProgress.configure({showSpinner: false});
$(window).ajaxStart(function () {
    NProgress.start();
});
$(window).ajaxComplete(function () {
   NProgress.done();
});
//2.页面简单的点击事件
$('[data-menu]').on('click', function () {
    $('.ad_aside').toggle();
    $('.ad_section').toggleClass('menu');
});
$('.ad_aside [href="javascript:;"]').on('click', function () {
    $(this).siblings('.child').slideToggle()
});
//3.退出功能
//把html格式的字符串转出
var modelHtml = ['<div class="modal bs-login-out-modal-sm fade" id="logoutModal">',
    '    <div class="modal-dialog modal-sm">',
    '        <div class="modal-content">',
    '            <div class="modal-header">',
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
    '                <h4 class="modal-title">温馨提示</h4>',
    '            </div>',
    '            <div class="modal-body">',
    '                <p class="glyphicon glyphicon-info-sign text-danger"> 您确定要退出后台管理系统吗？</p>',
    '            </div>',
    '            <div class="modal-footer">',
    '                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>',
    '                <button type="button" class="btn btn-primary log-out-btn">确定</button>',
    '            </div>',
    '        </div>',
    '    </div>',
    '</div>'].join("");
$('body').append(modelHtml);
$('.log-out-btn').on('click', function () {
    $.ajax({
        url:'/employee/employeeLogout',
        type:'get',
        data:'',
        dataType:'json',
        success: function (data) {
            if(data.success === true) {
                $('#logoutModal').modal('hide');
                location.href = '/a/login.html';
            }
        }
    });
});
if(!(typeof template == "undefined" || template == null || template == "")) {
    //由于模板引擎内部无法访问外部变量，所以在模板引擎内部无法使用jQuery，如果要想使用jQuery，可以使用模板引擎的辅助方法
    template.helper('getJquery', function () {
        return jQuery;
    });
}
var getItemById = function (data,id) {
    var result = {};
    data.forEach(function (item, i) {
        if(item.id === id) {
            result = item;
        }
    });
    return result;
};
