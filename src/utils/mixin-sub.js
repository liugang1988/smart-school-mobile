/**
 * vue实例初始化通用配置
 * 针对子模块使用
 */
import bus from 'utils/eventsBus.js';
import NoFind from 'components/nofind/nofind.js';

export default {
    components: {
        'ui-nofind': NoFind
    },
    methods: {
        /**
         * 显示消息框
         */
        showToast(text, type) {
            bus.emit('show-toast', text, type);
        },
        /**
         * 隐藏消息框
         */
        hideTtoast() {
            bus.emit('hide-toast');
        },
        /**
         * alert
         */
        alert(title, content, confirm) {
            bus.emit('alert', title, content, confirm);
        },
        /**
         * 隐藏弹出框
         */
        hideDialog() {
            bus.emit('hide-dialog');
        }
    }
};

