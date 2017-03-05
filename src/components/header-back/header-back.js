/**
 * 后退按钮
 */
import icons from '../icons/icons.js';
export default {
    template: __inline('header-back.tpl'),
    components: {
        'ui-icon': icons
    },
    methods: {
        back() {
            window.history.back();
        }
    }
};

