/**
 * Created by lcw on 2018/6/1.
 */
$(function () {

    barCharts();
    pieCharts();
});
var barCharts = function () {
    var box = echarts.init(document.querySelector('.picTable:first-child'));
    var option = {
        title: {
            text: '2017年注册人数'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'none'
            }
        },
        legend: {
            data: ['人数']
        },
        xAxis: {
            data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            barWidth: '60%',
            data: [100, 500, 300, 800, 600, 900]
        }]
    };
    box.setOption(option);
};
var pieCharts = function () {
    var box = echarts.init(document.querySelector('.picTable:last-child'));
    var option = {
        title: {
            text: '热门品牌销售',
            subtext: '2017年6月',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['耐克', '李宁', '安踏', '阿迪', '新百伦', '回力']
        },
        series: [
            {
                name: '销售情况',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: 335, name: '耐克'},
                    {value: 310, name: '李宁'},
                    {value: 234, name: '安踏'},
                    {value: 135, name: '阿迪'},
                    {value: 1548, name: '新百伦'},
                    {value: 1048, name: '回力'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    box.setOption(option);
};