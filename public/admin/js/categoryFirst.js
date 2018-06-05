/**
 * Created by lcw on 2018/6/2.
 */
/**
 * Created by lcw on 2018/6/2.
 */
$(function () {
    window.page = 1;
    var render = function () {
        //初始化数据
        getFirstData(function (data) {
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
    $('#form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //需要校验的表单元素 通过名字name来选择
        fields: {
            //表单元素对应的name
            categoryName: {
                //校验规则
                validators: {
                    notEmpty: {
                        message:'请填写分类名称'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault();
        var $form = $(e.target);
        $.ajax({
            type:'post',
            url:' /category/addTopCategory',
            data:$form.serialize(),
            dataType:'json',
            success:function (data) {
                if(data.success == true){
                    window.page = 1;
                    render();
                    $('#cateFirstModal').modal('hide');
                }
            }
        });
    });
});
var getFirstData = function (callback) {
    $.ajax({
        url: '/category/queryTopCategoryPaging',
        type: 'get',
        data: {
            page: window.page || 1,
            pageSize: 2
        },
        dataType: 'json',
        success: function (data) {
            window.data = data;
            console.log(data);
            callback && callback(data);
        }
    })
};
