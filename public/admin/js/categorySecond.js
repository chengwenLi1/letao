/**
 * Created by lcw on 2018/6/1.
 */
$(function () {
    window.page = 1;
    //初始化页面的渲染
    var render = function () {
        getCateData(function (data) {
            $('table tbody').html(template('list',data));
            var options = {
                bootstrapMajorVersion: 3,
                alignment:'center',
                currentPage:data.page,
                totalPages: Math.ceil(data.total/data.size),
                onPageClicked: function (event,originalEvent,type,page) {
                    window.page = page;
                    render();
                }
            };
            $('.pagination').bootstrapPaginator(options);
        })
    };
    render();
    //初始化模态框
    getCateFirstData(function (data) {
        $('.cateFirst').html(template('cateFirst',data)).find('li').on('click', function () {
            var categoryId = $(this).find('a').data('id');
            var text = $(this).find('a').html();
            $('.first-text').html(text);
            $('[name=categoryId]').val(categoryId);
            $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
        });
    });
    $('.upload_btn').on('click', function () {
        $('#uploadFile').click();
    });
    //初始化图片上传
    initFileUpload();

    $('#form').bootstrapValidator({
        //配置校验的不同状态下显示的图标，一般情况下使用默认的就可以了
        excluded:[],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //需要校验的表单元素 通过名字name来选择
        fields: {
            //表单元素对应的name
            categoryId: {
                //校验规则
                validators: {
                    notEmpty: {
                        message:'选择一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message:'请输入二级分类'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message:'上传图片'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault();
        var $form = $(e.target);
        var data = $form.serialize();
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$form.serialize(),
            dataType:'json',
            success:function (data) {
                if(data.success == true){
                    window.page = 1;
                    render();
                    $('#save').modal('hide');
                }
            }
        });
    });
});
var getCateData = function (callback) {
    $.ajax({
        url: '/category/querySecondCategoryPaging',
        type: 'get',
        data: {
            page: window.page || 1,
            pageSize: 2
        },
        dataType:'json',
        success: function (data) {
            callback && callback(data);
        }
    })
};
var getCateFirstData = function (callback) {
    $.ajax({
        url: '/category/queryTopCategoryPaging',
        type: 'get',
        data: {
            page: window.page || 1,
            pageSize: 1000
        },
        dataType:'json',
        success: function (data) {
            callback && callback(data);
        }
    })
};
var initFileUpload = function () {
    $('#uploadFile').fileupload({
        type:'post',
        url:'/category/addSecondCategoryPic',
        dataType:'json',
        done: function (e, data) {
            $('.uploadImg').attr('src',data.result.picAddr);
            $('[name="brandLogo"]').val(data.result.picAddr);
            $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    })
};
