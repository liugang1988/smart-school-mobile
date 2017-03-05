/**
 * 工具集
 */

/**
 * 创建script
 * @param  {string}     src 地址
 * @param  {function}   resolve 加载成功回调
 * @param  {function}   reject  加载失败回调
 * @return {object}     script元素
 */
const createScript = (src, resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    const s = document.getElementsByTagName('body')[0];
    s.appendChild(script);
    return script;
};

/**
 * 创建iframe
 * @param  {string} src 地址
 * @return {object}     frame元素
 */
const createFrame = (src) => {
    const frame = document.createElement('iframe');
    frame.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;visibility:hidden;';
    frame.frameBorder = '0';
    frame.src = src;
    document.body.appendChild(frame);
    return frame;
};

/**
 * 简单随机数
 * @return {string} 简单的随机数
 */
const createGuid = () => {
    return 'xxxxxxxy'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * 创建全局的临时函数
 * @param  {Function} callback 回调函数
 * @param  {object}   thisObj  上下文
 * @return {string}            创建的全局函数的函数名
 */
const createFunction = (callback, thisObj) => {
    const name = '__RUNEDUCallback' + createGuid() + '__';
    window[name] = () => {
        typeof callback === 'function' && callback.apply(thisObj, arguments);
        delete window[name];
        callback = null;
        thisObj = null;
    };
    return name;
};

const setCookie = (name, value, domain, path, hour) => {
    if (hour) {
        const expire = new Date();
        expire.setTime(expire.getTime() + 3600000 * hour);
    }
    document.cookie = name + '=' + value + '; ' + (expire ? ('expires=' + expire.toGMTString() + '; ') : '') + (path ? ('path=' + path + '; ') : 'path=/; ') + (domain ? ('domain=' + domain + ';') : ('domain=' + document.domain + ';'));
    return true;
};
export default {
    createScript: createScript,
    createFrame: createFrame,
    createGuid: createGuid,
    createFunction: createFunction,
    setCookie: setCookie
};

