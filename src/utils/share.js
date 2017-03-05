import rjySDK from 'rjy-jssdk';
import wxSDK from './wechat/jssdk';
import device from './device';
let share;

if (device.isWeChat) {
    share = (options) => {
        wxSDK((wx) => {
            wx.onMenuShareTimeline(options);
            wx.onMenuShareAppMessage(options);
            wx.onMenuShareQQ(options);
            wx.onMenuShareQZone(options);
        });

        return {
            emit() {
                alert('点击右上角分享按钮');
            },
            update(op) {
                wxSDK((wx) => {
                    wx.onMenuShareTimeline(op);
                    wx.onMenuShareAppMessage(op);
                    wx.onMenuShareQQ(op);
                    wx.onMenuShareQZone(op);
                });
            }
        };
    };
} else if (device.isRUNEDU) {
    share = (options) => {
        let cur = options;
        rjySDK.showShareBtn(cur);
        return {
            emit() {
                rjySDK.share(cur);
            },
            update(op) {
                cur = op;
                rjySDK.showShareBtn(cur);
            }
        };
    };
} else {
    share = () => {
        return {
            emit() {},
            update() {}
        };
    };
}
export default options => share(options);

