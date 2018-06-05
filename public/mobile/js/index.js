/**
 * Created by lcw on 2018/5/26.
 */
$(function () {
    mui('.mui-scroll-wrapper').scroll({
        deceleration:0.0005,
        indicators:false
    });
    mui('.mui-slider').slider({
        interval:1000
    })
});