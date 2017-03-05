import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Calendar from 'components/calendar/calendar.js';
import ChooseType from 'components/choose-type/choose-type.js';
import getPar from 'utils/getUrlParameter';

const getCourseId = getPar('courseId').courseId;

// 获取当前时间，格式YYYY-MM-DD
const getNowFormatDate = function() {
    const date = new Date();
    const seperator1 = '-';
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    const currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
};

const Data = {
    title: '课堂评价',
    value: getNowFormatDate(), // 获取日期
    showCalens: false, // 是否显示日历组件
    evaluateInfor: {},
    gardesNum: {
        perfect: 0,
        good: 0,
        qualified: 0,
        unqualified: 0
    },
    isFinishedMsg: '完成课堂评价',

    selecting: true, // 用于选择的 蒙层的展示和隐藏
    selectType: 1, // 用于选择的 类型：0: 迟到早退  1: 优秀良好  2 ：动态加载数据
    selectedInfo: 0, // 选择学生的的默认成绩
    selectIndex: 0 // 默认选中的学生
};


// 不带xhr 的同步操作
const mutations = {
    getGradeNum: (data) => {
        Data.gardesNum.perfect = 0;
        Data.gardesNum.good = 0;
        Data.gardesNum.qualified = 0;
        Data.gardesNum.unqualified = 0;
        if (data) {
            for (let i = 0, l = data.length; i < l; ++i) {
                const n = data[i];
                if (n.grade === 1) {
                    Data.gardesNum.perfect += 1;
                } else if (n.grade === 2) {
                    Data.gardesNum.good += 1;
                } else if (n.grade === 3) {
                    Data.gardesNum.qualified += 1;
                } else {
                    Data.gardesNum.unqualified += 1;
                }
            }
        }
    },
    isFinished: (data) => {
        Data.isFinishedMsg = data && data === 1 ? '完成课堂评价' : '修改课堂评价';
    }
};
const actions = {
    getInfor() {
        this.$http.get('/api/selin/v3/teacher/evaluate/getstueva', {
            params: {
                courseId: getCourseId,
                evaDate: Data.value
            }
        }).then((response) => {
            Data.evaluateInfor = response.data;
            // 课程存在，显示考勤信息
            if (!Data.evaluateInfor.isExist) {
                // 统计 优秀 良好等 等级的人数
                mutations.getGradeNum(Data.evaluateInfor.evas);
                mutations.isFinished(Data.evaluateInfor.status);
            } else {
                // 课程不存在，清空考勤信息
                Data.gardesNum.perfect = 0;
                Data.gardesNum.good = 0;
                Data.gardesNum.qualified = 0;
                Data.gardesNum.unqualified = 0;
                Data.isFinishedMsg = '当前日期没有课哦~';
            }
        }, (response) => {
            Data.isFinishedMsg = '当前日期没有课哦~';
            Data.showCalens = false;
            this.showToast(response.statusText, 'warn');
        });
    },
    finalScore(index) {
        // 有课程时才能修改状态
        if (!Data.evaluateInfor.isExist) {
            Data.selectedInfo = Data.evaluateInfor.evas[index].grade - 1;
            Data.selectIndex = index;
            Data.title = '选择状态';
            Data.selecting = !Data.selecting;
        }
    },
    // 打分
    selected(index) {
        Data.title = '期末打分';
        Data.selecting = true;
        Data.selectedInfo = index;
        Data.evaluateInfor.evas[Data.selectIndex].grade = index + 1;
        mutations.getGradeNum(Data.evaluateInfor.evas);
    },
    // 更新
    updata() {
        if (!Data.evaluateInfor.isExist) {
            const newEvas = Data.evaluateInfor.evas.map(item => ({
                studentId: item.studentId,
                grade: item.grade
            }));
            this.$http.post('/api/selin/v3/teacher/evaluate/submitstueva', {
                courseId: getCourseId,
                evaDate: Data.value,
                evas: JSON.stringify(newEvas)
            }).then(() => {
                this.showDialog();
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        } else {
            this.showToast('当前日期没有课哦！', 'warn');
        }
    },
    showDialog() {
        this.alert('修改成功', null, () => {
            location.href = '/teacher/index.html';
            this.dialog.show = false;
        });
    },
    // 日历组件相关
    showCalendar() {
        Data.showCalens = !Data.showCalens;
    },
    // 选择日期
    hideCalendar(value) {
        Data.values = value;
        this.getInfor();
    },
    // 隐藏日历组件
    hideToday: (event) => {
        if (event.target.nodeName === 'SPAN' || event.target.nodeName === 'TD') {
            Data.showCalens = false;
        }
    }
};

new Vue({
    mixins: [mixin],
    data: Data,
    components: {
        'ui-calendar': Calendar,
        'ui-choose-type': ChooseType
    },
    methods: actions,
    created() {
        this.getInfor();
    },
    watch: {
        value(val) {
            Data.value = val;
            this.hideCalendar(val);
        }
    }
});

