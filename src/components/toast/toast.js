/**
 * Toast
 * 一个包含用户点击消息
 */
import Icon from '../icons/icons.js';
export default {
    template: __inline('toast.tpl'),
    components: {
        'ui-icon': Icon
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        time: {
            type: Number,
            default: 2 // 秒为单位
        },
        type: {
            type: String,
            default: 'text'
        },
        text: {
            default: ''
        }
    },
    data() {
        return {
            timeout: null
        };
    },
    computed: {
        iconName() {
            if (this.type === 'warn') {
                return 'warn';
            }
            if (this.type === 'success') {
                return 'success';
            }
            if (this.type === 'loading') {
                return 'loading';
            }
            return '';
        }
    },
    watch: {
        show(val) {
            const that = this;
            if (val) {
                if (that.type !== 'loading') {
                    clearTimeout(that.timeout);
                    that.timeout = setTimeout(() => {
                        that.$emit('on-hide');
                    }, that.time * 1000);
                }
            }
        },
        type(val) {
            const that = this;
            if (that.show) {
                if (val !== 'loading') {
                    clearTimeout(that.timeout);
                    that.timeout = setTimeout(() => {
                        that.$emit('on-hide');
                    }, that.time * 1000);
                }
            }
        }
    }
};

