/**
 * vue实例初始化通用配置
 * 针对最外层实例使用
 */
import Header from 'components/header/header';
import HeaderBack from 'components/header-back/header-back';
import Toast from 'components/toast/toast';
import Dialog from 'components/dialog/dialog';
import NoFind from 'components/nofind/nofind';
import bus from 'utils/eventsBus';
import 'utils/http';
export default {
    el: '#wrap',
    components: {
        'ui-header': Header,
        'ui-header-back': HeaderBack,
        'ui-nofind': NoFind,
        'ui-toast': Toast,
        'ui-dialog': Dialog
    },
    data: {
        title: '',
        toast: {
            show: false,
            text: '',
            type: 'text'
        },
        dialog: {
            show: false,
            title: '',
            content: '',
            onconfirm: null
        }
    },
    methods: {
        /**
         * 显示消息框
         */
        showToast(text, type) {
            this.toast = {
                show: true,
                text: text,
                type: type
            };
        },
        /**
         * 隐藏消息框
         */
        hideToast() {
            this.toast.show = false;
        },
        /**
         * alert
         */
        alert(title, content, confirm) {
            this.dialog = {
                show: true,
                title: title,
                content: content,
                confirm: confirm
            };
        },
        /**
         * alert
         */
        confirm(title, content, confirm) {
            this.dialog = {
                show: true,
                type: 'confirm',
                title: title,
                content: content,
                confirm: confirm
            };
        },
        /**
         * 隐藏弹出框
         */
        hideDialog() {
            this.dialog.show = false;
        },
        /**
         * 按了确定（过时的）
         */
        dialogOnHide() {
            this.dialogOnConfirm();
        },
        /**
         * 按了确定
         */
        dialogOnConfirm() {
            if (typeof this.dialog.confirm === 'function') {
                this.dialog.confirm.call(this);
            } else {
                this.hideDialog();
            }
        },
        /**
         * 按了取消
         */
        dialogOnCancel() {
            if (typeof this.dialog.cancel === 'function') {
                this.dialog.cancel.call(this);
            } else {
                this.hideDialog();
            }
        }
    },
    created() {
        const that = this;
        bus.on('show-toast', function(text, type) {
            that.showToast(text, type);
        });
        bus.on('hide-toast', function(text, type) {
            that.hideToast();
        });
        bus.on('alert', function(title, content, confirm) {
            that.alert(title, content, confirm);
        });
        bus.on('hide-dialog', function() {
            that.hideDialog();
        });
    }
}

