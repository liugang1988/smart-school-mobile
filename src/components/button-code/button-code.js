/**
 * 获取验证码按钮
 */
import Button from '../button/button.js';

export default {
    template: __inline('button-code.tpl'),
    components: {
        'ui-button': Button
    },
    props: {
        // 按钮大小
        size: {
            default: ''
        },
        // 剩余秒数
        time: {
            default: 0
        }
    },
    computed: {
        type() {
            return this.time ? 'gray2' : 'blue';
        },
        msg() {
            return this.time ? this.time + '秒后重新获取' : '获取验证码';
        }
    },
    methods: {
        // 倒计时
        countdown() {
            const that = this;
            setTimeout(function() {
                that.time--;
            }, 1000);
        },
        clicks() {
            this.$emit('click');
        }
    },
    watch: {
        time(val) {
            if (val > 0) {
                this.countdown();
            }
        }
    }
};

