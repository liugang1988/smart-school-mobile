/*
 * 异步请求
 * bug：https://github.com/vuejs/vue-resource/issues/370
 */
import Vue from 'vue';
import VueResource from 'vue-resource';
import loginFail from './loginFail';
import loginSelinFail from './loginSelinFail';
const version = 'v3'; // api版本号

// 数据交互
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push((request, next) => {
    // 使用业务相关配置，如果要使用默认配置resetOptions = true
    if (!request.resetOptions) {
        // 与后台约定的头信息
        request.headers._c = 'h5';

        // 更新版本号
        request.url = request.url.replace(/\/v\d+\//, '/' + version + '/');

        // 防止浏览器缓存url。如果是get请求，则默认开启清缓存
        const cache = request.cache;
        if (cache === false || (cache === undefined && request.method.toLowerCase() === 'get')) {
            request.params._ = +new Date();
        }

        next((response) => {
            if (response.ok) {
                const data = response.data;
                const h = data && data.h;
                const code = h && h.code;
                const msg = h && h.msg;
                // 业务数据请求成功
                if (code === 200) {
                    response.data = data.b;
                } else {
                    response.ok = false;
                    response.statusText = msg;
                    response.data = data;
                    // 选课系统登录失效
                    if (code === 10) {
                        alert('登录失败！请重新登录');
                        loginSelinFail();
                    } else if (code === 14 && !request.disableAutoLogin) {
                        alert('登录失败！请重新登录');
                        // token失效且自动登录
                        loginFail();
                    }
                }
            }
        });
    } else {
        next();
    }
});
export default Vue.http;

