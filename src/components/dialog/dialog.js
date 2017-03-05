/**
 * 对话框
 */
export default {
    template: __inline('dialog.tpl'),
    props: {
        show: {
            type: Boolean,
            default: false
        },
        type: {
            default: 'alert' // 支持alert confirm
        },
        title: {
            default: ''
        },
        content: {
            default: ''
        },
        confirmText: {
            default: '确定'
        },
        cancelText: {
            default: '取消'
        },
        scroll: {
            default: false
        }
    },
    methods: {
        confirm() {
            this.$emit('on-confirm');
        },
        cancel() {
            this.$emit('on-cancel');
        }
    }
};

