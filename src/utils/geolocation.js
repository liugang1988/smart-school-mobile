/**
 * 地理定位
 */
import store from 'store.js';

/**
 * 获取错误提示信息
 * @param  {string} error 错误表示
 * @return {string}       提示
 */
const getErrorTip = (error) => {
    let tip = '';
    if (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                tip = '用户拒绝使用地理定位';
                break;
            case error.POSITION_UNAVAILABLE:
                tip = '定位信息不可用';
                break;
            case error.TIMEOUT:
                tip = '请求超时';
                break;
            case error.UNKNOWN_ERROR:
                tip = '发生一个未知错误';
                break;
        }
    } else {
        tip = '不支持地理定位';
    }
    return tip;
};

/**
 * 地理定位
 * @param {any} success         成功回调
 * @param {any} error           失败回调
 * @param {any} options         定位配置
 * @param {any} cacheMinute     最大缓存时间，按分钟计数。默认不缓存
 * @returns
 */
export default (success, error, options, cacheMinute) => {
    // 处理回调
    let _success, _error;

    if (typeof success !== 'function') {
        return;
    }

    _success = (position) => {
        const coords = position.coords;
        const lon = coords.longitude;
        const lat = coords.latitude;
        if (cacheMinute) {
            store.set('geolocation', {
                lon: lon,
                lat: lat,
                times: +new Date()
            });
        }
        success(lon, lat);
    };

    if (typeof error === 'function') {
        _error = (data) => {
            error(getErrorTip(data), data);
        };
    }

    // 处理缓存
    if (cacheMinute > 0) {
        const cacheData = store.get('geolocation');
        // 是否存在缓存数据
        if (cacheData) {
            const cacheTimes = cacheData.times;
            // 是否小于最大缓存时间
            if (
                (+new Date() - cacheTimes < 1000 * 60 * cacheMinute) &&
                cacheData.lon &&
                cacheData.lat
            ) {
                success(cacheData.lon, cacheData.lat);
                return;
            }
        }
    }
    // 开始定位
    const g = window.navigator.geolocation;

    // 如果用户拒绝过获取地理定位，代码会同步执行
    if (g) {
        // 修改配置
        const setting = {
            enableHighAccuracy: true, // 是否使用高精度设备获取值，gps>wifi>ip
            maximumAge: 30000, // 表示浏览器重新获取位置信息的时间间隔
            timeout: 3000 // 设定请求超时时间
        };
        if (options) {
            for (let a in options) {
                setting[a] = options[a];
            }
        }
        g.getCurrentPosition(_success, _error, setting);
    } else {
        _error && _error(getErrorTip());
    }
};

