/**
 * 头部
 */
import device from 'utils/device';
export default {
    template: __inline('header.tpl'),
    props: {
        title: {
            default: ''
        },
        skin: {
            default: ''
        }
    },
    data() {
        return {
            show: !(device.isRUNEDU || device.isWeChat)
        };
    },
    created() {
        this.$watch('title', function(v) {
            document.title = v;
        });
        if (this.title) {
            document.title = this.title;
        }
    }
};

