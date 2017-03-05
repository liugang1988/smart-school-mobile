/*
 * 设备检测
 */
const userAgent = navigator.userAgent;
const isWeChat = /MicroMessenger/i.test(userAgent);
const isQQ = userAgent.match(/QQ/i) !== null; // QQ 全部浏览器(QQ浏览器 和 QQ内置浏览器)
const isAndroid = userAgent.indexOf('Android') > -1;
const isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
const isRUNEDU = /RUNEDU/i.test(userAgent);
export default {
    isWeChat: isWeChat, // 是否是微信
    isQQ: isQQ,
    isIOS: isIOS,
    isAndroid: isAndroid,
    isRUNEDU: isRUNEDU // 润教育APP
};

