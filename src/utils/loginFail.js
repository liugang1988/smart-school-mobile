/**
 * 润教育系统token失效
 */
const device = require('./device');
const rjyjssdk = require('rjy-jssdk');
const wechatLoginUrl = location.origin.replace('mschool.', 'h5.') + '/user/login-wechat.html'; // 微信登录页,必须是全路径
const loginUrl = '/user/login.html';

const ref = encodeURIComponent(location.href); // 当前页面
let locked = false; // 上锁，防止重定向期间被多次调用

let login;
if (device.isRUNEDU) {
    login = () => {
        rjyjssdk.login(true, (bl) => {
            locked = false;
            if (bl) {
                location.reload();
            }
        }, '_ss_v1');
    };
} else if (device.isWeChat) {
    login = () => {
        location.href = wechatLoginUrl + '?ref=' + ref;
    };
} else {
    login = () => {
        location.href = location.origin.replace('mschool.', 'h5.') + loginUrl + '?ref=' + ref;
    };
}
export default () => {
    if (locked) return;
    locked = true;
    login();
};

