/**
 * Created by lcw on 2018/6/1.
 */
$(function () {
    window.page = 1;
    //初始化页面的渲染
    var render = function () {
        getProData(function (data) {
            $('table tbody').html(template('list', data));
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
        })
    };
    render();
    $('.upload_btn').on('click', function () {
        $('#uploadFile').click();
    });
    //初始化图片上传
    initFileUpload();

    $('#form').bootstrapValidator({
        //配置校验的不同状态下显示的图标，一般情况下使用默认的就可以了
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //需要校验的表单元素 通过名字name来选择
        fields: {
            //表单元素对应的name
            proName: {
                //校验规则
                validators: {
                    notEmpty: {
                        message: '请输入产品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入产品描述'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入产品库存'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入产品尺寸'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入产品价格'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入产品原价'
                    }
                }
            },
            pic: {
                validators: {
                    notEmpty: {
                        message: '请上传图片'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault();
        var $form = $(e.target);
        var data = $form.serialize();
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: $form.serialize(),
            dataType: 'json',
            success: function (data) {
                if (data.success == true) {
                    window.page = 1;
                    render();
                    $('#save').modal('hide');
                }
            }
        });
    });
});
var getProData = function (callback) {
    $.ajax({
        url: '/product/queryProductDetailList',
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
var initFileUpload = function () {
    var img = [];
    $('#uploadFile').fileupload({
        type: 'post',
        url: '/product/addProductPic',
        dataType: 'json',
        done: function (e, data) {
            img.push(data.result);
            if (img.length > 2) {
                $('[name="pic"]').val(JSON.stringify(img));
                img = [];
                $('#form').data('bootstrapValidator').updateStatus('pic','VALID');
            }
        }
    })
};
