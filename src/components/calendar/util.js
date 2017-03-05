import format from '../datetime/format';

function zero(n) {
    return n < 10 ? '0' + n : n;
}

function splitValue(value) {
    const split = value.split('-');
    return {
        year: parseInt(split[0], 10),
        month: parseInt(split[1], 10) - 1,
        day: parseInt(split[2], 10)
    };
}

function getPrevTime(year, month) {
    if (month === 0) {
        return {
            month: 11,
            year: year - 1
        };
    } else {
        return {
            year: year,
            month: month - 1
        };
    }
}

function getNextTime(year, month) {
    if (month === 11) {
        return {
            month: 0,
            year: year + 1
        };
    } else {
        return {
            year: year,
            month: month + 1
        };
    }
}

function getTime(str) {
    if (typeof str === 'number') {
        return str;
    }
    return typeof str === 'string' ? new Date(str.replace(/-/g, '/')).getTime() : str.getTime();
}

function isBetween(value, start, end) {
    value = getTime(value);
    const isGte = start ? value >= getTime(start) : true;
    const isLte = end ? value <= getTime(end) : true;
    return isGte && isLte;
}


function getDays(configs) {
    configs = configs || {};
    let year = configs.year;
    let month = configs.month;
    const value = configs.value;
    let rangeBegin = configs.rangeBegin;
    let rangeEnd = configs.rangeEnd;
    const returnSixRows = configs.returnSixRows || true;
    const disablePast = configs.disablePast || false;
    const disableFuture = configs.disableFuture || false;

    const today = format(new Date(), 'YYYY-MM-DD');
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const _splitValue = splitValue(value || today);

    // if year or month is not specified, get them from value
    if (typeof year !== 'number' || typeof month !== 'number' || month < 0) {
        year = _splitValue.year;
        month = _splitValue.month;
    }

    // if disablePast === true
    if (disablePast) {
        if (!rangeBegin) {
            rangeBegin = startOfToday;
        } else {
            rangeBegin = Math.max(startOfToday.getTime(), getTime(rangeBegin));
        }
    }

    // if disableFuture === true
    if (disableFuture) {
        if (!rangeEnd) {
            rangeEnd = startOfToday;
        } else {
            rangeEnd = Math.min(startOfToday.getTime(), getTime(rangeEnd));
        }
    }

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfLastMonth = new Date(year, month, 0).getDate();

    let rs;
    let k;
    let i;
    let start;
    let line = 0;
    const temp = [];
    for (i = 1; i <= lastDateOfMonth; i++) {
        let dow = new Date(year, month, i).getDay();
        // 第一行
        if (dow === 0) {
            temp[line] = [];
        } else if (i === 1) {
            temp[line] = [];

            k = lastDayOfLastMonth - firstDayOfMonth + 1;
            for (let j = 0; j < firstDayOfMonth; j++) {
                rs = getPrevTime(year, month);
                temp[line].push({
                    year: rs.year,
                    month: rs.month,
                    month_str: rs.month + 1,
                    day: k,
                    disabled: true,
                    isLastMonth: true
                });
                k++;
            }
        }

        const _format = format(new Date(year + '/' + (month + 1) + '/' + i), 'YYYY/MM/DD');
        const options = {
            year: year,
            month: month,
            month_str: month + 1,
            day: i,
            isCurrent: value && format(new Date(value), 'YYYY/MM/DD') === _format,
            disabled: !isBetween(_format, rangeBegin, rangeEnd),
            isToday: format(new Date(), 'YYYY/MM/DD') === _format
        };
        temp[line].push(options);

        if (dow === 6) {
            line++;
        } else if (i === lastDateOfMonth) {
            k = 1;
            for (dow; dow < 6; dow++) {
                rs = getNextTime(year, month);
                temp[line].push({
                    year: rs.year,
                    month: rs.month,
                    month_str: rs.month + 1,
                    day: k,
                    disabled: true,
                    isNextMonth: true
                });
                k++;
            }
        }
    }

    if (returnSixRows && temp.length === 5) {
        rs = getNextTime(year, month);
        start = temp[4][6].isNextMonth ? temp[4][6].day : 0;
        temp[6] = [];
        for (i = 0; i < 7; i++) {
            temp[6].push({
                year: rs.year,
                month: rs.month,
                month_str: rs.month + 1,
                day: ++start,
                disabled: true,
                isNextMonth: true
            });
        }
    }

    // 2026-02, there is only 4 lines
    if (returnSixRows && temp.length === 4) {
        rs = getNextTime(year, month);
        start = 0;
        temp[5] = [];
        temp[6] = [];
        for (i = 0; i < 7; i++) {
            temp[5].push({
                year: rs.year,
                month: rs.month,
                month_str: rs.month + 1,
                day: ++start,
                disabled: true,
                isNextMonth: true
            });
            temp[6].push({
                year: rs.year,
                month: rs.month,
                month_str: rs.month + 1,
                day: ++start,
                disabled: true,
                isNextMonth: true
            });
        }
    }

    return {
        year: year,
        month: month,
        month_str: month + 1,
        days: temp
    };
}

export default {
    zero: zero,
    splitValue: splitValue,
    getPrevTime: getPrevTime,
    getNextTime: getNextTime,
    getDays: getDays
};

