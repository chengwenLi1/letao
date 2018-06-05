/**
 * Created by lcw on 2018/6/1.
 */
$(function () {
    //初始化校验插件
    //1.必须是form表单结构，并且有一个提交按钮
    //2.这个插件就是一个jQuery插件 样式基于boostrap
    $('#login').bootstrapValidator({
        //配置校验的不同状态下显示的图标，一般情况下使用默认的就可以了
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //需要校验的表单元素 通过名字name来选择
        fields: {
            //表单元素对应的name
            username: {
                //校验规则
                validators: {
                    notEmpty: {
                        message:'请输入用户名'
                    },
                    //为后台校验失败配置一个校验规则
                    callback: {
                       message:'用户名错误'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message:'密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 18,
                        message: '密码长度6-18位之间'
                    },
                    callback: {
                        message:'密码错误'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        //只有校验成功时才会触发
        //阻止表单默认的提交事件,需要使用ajax提交
        e.preventDefault();
        var $form = $(e.target);
        //发送ajax请求给后台
        $.ajax({
            url:'/employee/employeeLogin',
            type:'post',
            data:$form.serialize(),
            dataType:'json',
            success: function (data) {
                if(data.success === true) {
                    //校验成功
                    location.href = '/a/index.html';
                } else {
                    if(data.error === 1000) {
                        //用户名错误,需要设置用户名这个表单的校验状态为失败
                        //校验状态：NOT_VALIDATED 还没有校验,VALIDATING 校验中，INVALID 失败 ，VALID成功
                        /*sf
                        1.获取校验组件
                        2.使用更改校验状态的函数
                        3.这个函数的参数：校验的表单，更改为什么状态，使用哪个规则
                         */
                        $form.data('bootstrapValidator').updateStatus('username','INVALID','callback');
                    } else if (data.error === 1001) {
                        $form.data('bootstrapValidator').updateStatus('password','INVALID','callback');
                    }
                }
            }
        })
    })
});