/**
 * 获取url参数
 */
export default () => {
    let n;
    const o = {};
    const arr = location.search.substr(1).split('&');
    for (let i = 0, l = arr.length; i < l; i++) {
        n = arr[i].split('=');
        o[n[0]] = decodeURIComponent(n[1]);
    }
    return o;
};

