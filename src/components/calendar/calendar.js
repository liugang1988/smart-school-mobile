import format from '../datetime/format';
import util from './util';
const getDays = util.getDays;
const zero = util.zero;

export default {
    template: __inline('calendar.tpl'),
    props: {
        skin: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: 'TODAY'
        },
        renderMonth: {
            type: Array, // [2018, 8]
            default: function() {
                return [null, null];
            }
        },
        startDate: {
            type: String
        },
        endDate: {
            type: String
        },
        showLastMonth: {
            type: Boolean,
            default: true
        },
        showNextMonth: {
            type: Boolean,
            default: true
        },
        highlightWeekend: {
            type: Boolean,
            default: false
        },
        returnSixRows: {
            type: Boolean,
            default: true
        },
        hideHeader: {
            type: Boolean,
            default: false
        },
        hideWeekList: {
            type: Boolean,
            default: false
        },
        replaceTextList: {
            type: Object,
            default: function() {
                return {};
            }
        },
        weeksList: {
            type: Array,
            default: function() {
                return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
            }
        },
        renderOnValueChange: {
            type: Boolean,
            default: true
        },
        disablePast: {
            type: Boolean,
            default: false
        },
        disableFuture: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            year: 0,
            month: 0,
            days: [],
            current: [],
            today: format(new Date(), 'YYYY-MM-DD'),
            months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        };
    },

    computed: {
        _className() {
            let className = '';
            if (this.highlightWeekend) {
                className += 'is-weekend-highlight';
            }
            if (this.skin) {
                className += this.skin;
            }
            return className;
        },
        _replaceTextList() {
            const rs = {};
            for (const i in this.replaceTextList) {
                rs[this.convertDate(i)] = this.replaceTextList[i];
            }
            return rs;
        },
        model: {
            get: function() {
                return this.value
            },
            set: function(newValue) {
                this.$emit('input', newValue)
            }
        }
    },
    watch: {
        value(val) {
            this.value = this.convertDate(val);
            if (this.renderOnValueChange) {
                this.render(null, null, val);
            } else {
                this.render(this.year, this.month, this.value);
            }
            this.$emit('on-change', val);
        },
        returnSixRows(val) {
            this.render(this.year, this.month, this.value);
        },
        disablePast() {
            this.render(this.year, this.month, this.value);
        },
        disableFuture() {
            this.render(this.year, this.month, this.value);
        }
    },
    methods: {
        replaceText(day, formatDay) {
            return this._replaceTextList[formatDay] || day;
        },
        convertDate(date) {
            return date === 'TODAY' ? this.today : date;
        },
        buildClass(index, child, isCurrent) {
            const className = {
                current: child.current || isCurrent,
                'is-disabled': child.disabled,
                'is-today': child.isToday
            };
            className['is-week-' + index] = true;
            return className;
        },
        render(year, month) {
            const data = getDays({
                year: year,
                month: month,
                value: this.value,
                rangeBegin: this.convertDate(this.startDate),
                rangeEnd: this.convertDate(this.endDate),
                returnSixRows: this.returnSixRows,
                disablePast: this.disablePast,
                disableFuture: this.disableFuture
            });
            this.days = data.days;
            this.year = data.year;
            this.month = data.month;
        },
        formatDate(year, month, child) {
            return [year, zero(month + 1), zero(child.day)].join('-');
        },
        prev() {
            if (this.month === 0) {
                this.month = 11;
                this.year = this.year - 1;
            } else {
                this.month = this.month - 1;
            }
            this.render(this.year, this.month);
        },
        next() {
            if (this.month === 11) {
                this.month = 0;
                this.year = this.year + 1;
            } else {
                this.month = this.month + 1;
            }
            this.render(this.year, this.month);
        },
        go(year, month) {
            this.render(year, month);
        },
        select(k1, k2, event) {
            if (this.current.length > 0) {
                this.days[this.current[0]][this.current[1]].isCurrent = false;
            }
            this.days[k1][k2].current = true;
            this.current = [k1, k2];
            const selectDate = [this.year, zero(this.month + 1), zero(this.days[k1][k2].day)].join('-');
            this.$emit('input', selectDate);
        }
    },
    created() {
        this.$emit('input', this.convertDate(this.value))
        this.render(this.renderMonth[0], this.renderMonth[1] - 1);
    }
};

