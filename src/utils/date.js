/**
 * 日期操作集
 */

const fmtString = 'yyyy-MM-dd hh:mm:ss'; // 默认格式化
const daysOnMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * 是不是闰年
 */
const isLeapYear = (y) => {
    if (y) {
        // 如果整除100还需要判断是否能整除400
        if (y % 100) {
            return !(y % 4);
        } else {
            return !(y % 400);
        }
    }
    return false;
};

/**
 * 计算指定月份共几天
 */
const getDaysOnMonth = (year, month) => {
    month = parseInt(month, 10);
    if (month >= 0 && month < 12) {
        if (month === 1) {
            return isLeapYear(year) ? 29 : 28;
        }
        return daysOnMonth[month];
    }
    return NaN;
};

/**
 * 根据正则获取字符串
 */
const getStringByReg = (reg, str, fmt) => {
    const match = fmt.match(reg);
    const index = fmt.search(reg);
    if (str && index >= 0 && match !== null) {
        return str.substr(index, match[0].length);
    }
    return '';
};

/**
 * 字符串转日期
 */
const string2date = (str, fmt) => {
    const date = new Date();
    if (str !== undefined) {
        fmt = fmt || fmtString;
        const y = getStringByReg(/y+/, str, fmt); // 年
        const M = getStringByReg(/M+/, str, fmt); // 月
        const d = getStringByReg(/d+/, str, fmt); // 日
        const h = getStringByReg(/h+/, str, fmt); // 时
        const m = getStringByReg(/m+/, str, fmt); // 分
        const s = getStringByReg(/s+/, str, fmt); // 秒

        y && date.setFullYear(y);
        M && date.setMonth(M - 1);
        d && date.setDate(d);
        h && date.setHours(h);
        m && date.setMinutes(m);
        s && date.setSeconds(s);
        date.setMilliseconds(0);
    }
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
    };
};

/**
 * 日期转字符串
 */
const date2string = (date, fmt) => {
    date = date || new Date();
    fmt = fmt || fmtString;
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds() // 秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};

/**
 * 获取指定日期是星期几
 */
const getWeek = (y, M, d) => {
    const date = new Date();
    (y || y === 0) && date.setFullYear(y);
    (M || M === 0) && date.setMonth(M);
    (d || d === 0) && date.setDate(d);
    return date.getDay();
};
export default {
    string2date: string2date,
    date2string: date2string,
    getDaysOnMonth: getDaysOnMonth,
    getWeek: getWeek
};

