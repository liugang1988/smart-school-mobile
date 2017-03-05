/**
 * 获取微信的网页授权码，并创建临时存储
 * 参考文档：http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html
 * @param {string}  redirectUri     微信回调地址
 * @param {any}     data            任何需要存储的数据，不支持null、undefined。函数或者方法会在存储json转换过程中被过滤掉
 */
import store from '../store';
const wechatAppid = '';
export default (redirectUri, data) => {
    let status;
    if (data !== undefined && data !== null) {
        status = 'wechatPay' + (+new Date());
        store.set(status, data); // 存储数据
    }

    location.href =
        'https://open.weixin.qq.com/connect/oauth2/authorize' +
        '?appid=' + wechatAppid + // 微信唯一授权码
        '&redirect_uri=' + window.encodeURIComponent(redirectUri) + // 重定向地址
        '&response_type=code' +
        '&scope=snsapi_base' + // 授权类型 snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid）
        '&state=' + (typeof status !== 'undefined' ? status : '') +
        '#wechat_redirect';
};

