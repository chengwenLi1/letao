/**
 * Created by lcw on 2018/5/26.
 */
$(function () {
    var $searchBox = $('.cz_search');
    var $button = $searchBox.find('a');
    var $input = $searchBox.find('input');
    var history = $('.cz_history');
    //1.页面加载时显示历史记录
    showHistory();
    //2.点击搜索储存历史记录,并且跳转到搜索列表页
    $button.on('tap', function () {
        var value = $.trim($input.val());
        if(!value) {
            mui.toast('请输入关键字');
            return false;
        }
        $input.val('');
        var data = JSON.parse(localStorage.getItem('cz_search_history')) || [];
        if(data.indexOf(value) > -1) {
            data.splice(data.indexOf(value),1);
        }
        data.push(value);
        localStorage.setItem('cz_search_history',JSON.stringify(data));
        location.href = 'searchList.html?key='+ value;
    });
    //3.单击删除按钮删除当前历史记录
    history.on('tap','.delete_history', function () {
        var data = JSON.parse(localStorage.getItem('cz_search_history'));
        data.splice($(this).data('id'),1);
        localStorage.setItem('cz_search_history',JSON.stringify(data));
        showHistory();
    });
    //4.点击清空，删除所有历史记录
    history.on('tap','.clear', function () {
        localStorage.removeItem('cz_search_history');
        showHistory();
    })
});
var showHistory = function () {
    var data = JSON.parse(localStorage.getItem('cz_search_history')) || [];
    $('.cz_history').html(template('historyTemplate',{arr:data}));
};