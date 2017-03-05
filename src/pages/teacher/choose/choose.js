import Vue from 'vue';
import Header from 'components/header/header.js';
import HeaderBack from 'components/header-back/header-back.js';

new Vue({
    data: {
        title: '选择状态',
        selectContent: [{
            selectClass: ['正常', '迟到', '病假', '事假', '早退', '旷课'],
            defaultSelect: 1
        }, {
            selectClass: ['优秀', '良好', '合格', '不合格'],
            defaultSelect: 1
        }],
        selectType: 0 // 0代表 迟到早退  1 代表 优秀良好
    },
    components: {
        'ui-header': Header,
        'ui-header-back': HeaderBack
    }
});

