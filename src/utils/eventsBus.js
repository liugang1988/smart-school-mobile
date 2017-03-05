/**
 * 全局事件订阅发布中心
 */
const Vue = require('vue');
const bus = new Vue();
export default {
    emit: () => {
        bus.$emit.apply(bus, arguments);
    },
    on: (name, cb) => {
        bus.$on(name, cb);
    }
}

