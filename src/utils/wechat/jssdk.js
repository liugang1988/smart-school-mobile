/**
 * 获取微信jssdk引用
 * http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
 */

import createScript from '../utils';
import http from '../http';

let isLoading = false;
let jssdk = window.wx; // 可能被全局引入了
let callbackList = [];

const doCallbackList = () => {
    for (let i = 0, l = callbackList.length; i < l; i += 1) {
        callbackList[0](jssdk);
    }
    callbackList = [];
};

// 获取jssdk配置
const getConfig = () => {
    http.get('/api/student/v1/weixin/signjsapi', {
        params: {
            url: location.href.replace(/#.*/, '') // 不带hash值的url
        }
    }).then((res) => {
        const data = res.data;
        // 需要使用的JS接口列表
        const jsApiList = [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView'
            // 'addCard',
            // 'chooseCard',
            // 'openCard'
        ];

        jssdk.config({
            debug: false, // 开启调试模式。
            appId: data.appid, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.noncestr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        jssdk.ready(() => {
            console.log('微信签名就绪');
            doCallbackList();
        });

        jssdk.error((res) => {
            console.error('微信报错', res);
        });
    }, (error) => {
        console.error(error.statusText);
    });
};

// 加载微信jssdk
const load = () => {
    createScript('//res.wx.qq.com/open/js/jweixin-1.0.0.js', () => {
        isLoading = false;
        jssdk = window.wx;
        getConfig();
    }, () => {
        isLoading = false;
        console.error('加载微信jssdk失败!');
    });
};

export default (callback) => {
    if (typeof callback !== 'function') {
        return;
    }

    // 如果已经存在，那么直接回调
    if (jssdk) {
        callback(jssdk);
        return;
    }

    callbackList.push(callback);

    // 如果正在请求
    if (!isLoading) {
        isLoading = true;
        load();
    }
};

