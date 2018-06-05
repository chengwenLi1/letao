/**
 * Created by lcw on 2018/6/2.
 */
$(function () {
    window.page = 1;
    var render = function () {
        //初始化数据
        getUserData(function (data) {
            $('table tbody').html(template('list', data));
            //分页插件
            var options = {
                bootstrapMajorVersion: 3,
                alignment: 'center',
                currentPage: data.page,
                totalPages: Math.ceil(data.total / data.size),
                onPageClicked: function (event, originalEvent, type, page) {
                    window.page = page;
                    render();
                }
            };
            $('.pagination').bootstrapPaginator(options);
        });
    };
    render();
    $('body').on('click', '.click_btn', function () {
        var id = $(this).data('id');
        var userName = getItemById(window.data.rows, id).username;
        var text = $(this).html() + userName;
        $('.user_text').html(text);
        $('.post_user').data('id', id);
    }).on('click', '.post_user', function () {
        var id = $(this).data('id');
        var isDelete = getItemById(window.data.rows, id).isDelete;
        isDelete = isDelete === 1 ? 0 : 1;
        $.ajax({
            url: '/user/updateUser',
            type: 'post',
            data: {
                id: id,
                isDelete: isDelete
            },
            dataType: 'json',
            success: function (data) {
                if(data.success === true) {
                    render();
                    $('#userModal').modal('hide');
                }
            }
        })

    });
});
var getUserData = function (callback) {
    $.ajax({
        url: '/user/queryUser',
        type: 'get',
        data: {
            page: window.page || 1,
            pageSize: 2
        },
        dataType: 'json',
        success: function (data) {
            window.data = data;
            callback && callback(data);
        }
    })
};