import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Calendar from 'components/calendar/calendar.js';
import ChooseType from 'components/choose-type/choose-type.js';
import getPar from 'utils/getUrlParameter';
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
// 获取课程id
const getCourseId = getPar('courseId').courseId;

const Data = {
    isLoading: true, // 修改考勤组件是否隐藏
    showCalens: false, // 日历显示状态
    title: '课堂考勤',
    values: getNowFormatDate(), // 获取当前日期

    courseInfor: {}, // 获取课程信息
    gardesNum: {
        normal: 0, // 正常
        leave: 0, // 请假
        late: 0, // 迟到
        early: 0,
        absent: 0 // 缺席
    },
    stuNum: 0, // 学生总人数
    isFinishedMsg: '修改考勤记录', // 按钮文案

    selecting: true, // 用于选择的 蒙层的展示和隐藏
    selectType: 0, // 用于选择的 类型：0: 迟到早退  1: 优秀良好  2 ：动态加载数据
    selectedInfo: 0, // 选择学生的的默认成绩
    selectIndex: 0 // 默认选中的学生
};

// 不带xhr 的同步操作
const mutations = {
    getstatusNum(data) {
        Data.gardesNum.normal = 0;
        Data.gardesNum.leave = 0;
        Data.gardesNum.late = 0;
        Data.gardesNum.early = 0;
        Data.gardesNum.absent = 0;
        if (data) {
            for (let i = 0, l = data.length; i < l; ++i) {
                const n = data[i];
                if (n.status === 1) {
                    Data.gardesNum.normal += 1;
                } else if (n.status === 2) {
                    Data.gardesNum.late += 1;
                } else if (n.status === 3 || n.status === 4) {
                    Data.gardesNum.leave += 1;
                } else if (n.status === 5) {
                    Data.gardesNum.early += 1;
                } else {
                    Data.gardesNum.absent += 1;
                }
            }
        }
    },
    isFinished(data) {
        Data.isFinishedMsg = data && data === 1 ? '完成考勤记录' : '修改考勤记录';
    }
};

new Vue({
    mixins: [mixin],
    data: Data,
    components: {
        'ui-calendar': Calendar,
        'ui-choose-type': ChooseType
    },
    methods: {
        // 考勤信息
        getInfor() {
            Data.isLoading = true;
            this.$http.get('/api/selin/v3/teacher/check/getstucheck', {
                params: {
                    courseId: getCourseId,
                    checkDate: Data.values
                }
            }).then((response) => {
                const data = response.data;
                Data.isLoading = false;
                Data.courseInfor = data;
                // 课程存在，显示考勤信息
                if (!Data.courseInfor.isExist) {
                    // 统计 优秀 良好等 等级的人数
                    mutations.getstatusNum(Data.courseInfor.checks);
                    mutations.isFinished(Data.courseInfor.status);
                    Data.stuNum = Data.courseInfor.checks ? Data.courseInfor.checks.length : 0;
                } else {
                    // 课程不存在，清空考勤信息
                    Data.stuNum = 0;
                    Data.gardesNum.normal = 0;
                    Data.gardesNum.leave = 0;
                    Data.gardesNum.late = 0;
                    Data.gardesNum.early = 0;
                    Data.gardesNum.absent = 0;
                    Data.isFinishedMsg = '当前日期没有课哦~';
                }
            }, (response) => {
                Data.isLoading = false;
                Data.isFinishedMsg = '当前日期没有课哦~';
                Data.showCalens = false;
                Data.stuNum = 0;
                this.showToast(response.statusText, 'warn');

            });
        },
        finalScore(index) {
            // 有课程，则可以修改
            if (!Data.courseInfor.isExist) {
                Data.title = '选择状态';
                Data.selecting = !Data.selecting;
                Data.selectedInfo = Data.courseInfor.checks[index].status - 1;
                Data.selectIndex = index;
            }
        },
        // 选择考勤栏
        selected(index) {
            Data.title = '课堂考勤';
            Data.selecting = true;
            Data.selectedInfo = index;
            Data.courseInfor.checks[Data.selectIndex].status = index + 1;
            mutations.getstatusNum(Data.courseInfor.checks);
        },
        // 电话弹窗
        telDialog(name, tel) {
            this.confirm(name, tel, () => {
                location.href = 'tel:' + tel;
                this.dialog.show = false;
            });
        },
        updata() {
            if (!Data.courseInfor.isExist) {
                const newChecks = Data.courseInfor.checks.map(item => ({
                    studentId: item.studentId,
                    status: item.status
                }));
                this.$http.post('/api/selin/v3/teacher/check/submitstucheck', {
                    courseId: getCourseId,
                    checkDate: Data.values,
                    checks: JSON.stringify(newChecks)
                }).then(() => {
                    this.showDialog();
                }, (response) => {
                    this.showToast(response.statusText, 'warn');
                });
            } else {
                this.showToast('当前日期没有课哦！', 'warn');
            }
        },
        // 成功跳转
        showDialog() {
            this.alert('修改成功', null, () => {
                location.href = '/teacher/index.html';
                this.dialog.show = false;
            });
        },
        // 显示日历组件
        showCalendar() {
            Data.showCalens = !Data.showCalens;
        },
        // 选择日期
        hideCalendar(value) {
            Data.values = value;
            this.getInfor();
        },
        // 隐藏日历组件
        hideToday(event) {
            if (event.target.nodeName === 'SPAN' || event.target.nodeName === 'TD') {
                Data.showCalens = false;
            }
        }
    },
    created() {
        this.getInfor();
    },
    watch: {
        values(val) {
            Data.values = val;
            this.hideCalendar(val);
        }
    }
});

