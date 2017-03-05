/**
 * 通过status（getCode存储的数据时生成的值）获取数据,并删除本地版本
 * @param {any} status  在调用getCode时，会创建state值，微信回调时将参数绑定到回调地址
 * @returns
 */
import store from '../store';
export default (status) => {
    const data = store.get(status);
    store.remove(status);
    return data;
};

