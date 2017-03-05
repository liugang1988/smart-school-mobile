import Vue from 'vue';
import mixin from 'utils/mixin.js';
import ChooseType from 'components/choose-type/choose-type.js';
import getPar from 'utils/getUrlParameter';
// 获取到当前的课程ID
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
    dialog: {
        show: false,
        title: '',
        content: '',
        onconfirm: null
    },
    title: '期末打分',
    today: getNowFormatDate(),
    evas: [],

    courseInfor: '',
    gardesNum: {
        perfect: 0, //优秀
        good: 0, // 良好
        qualified: 0, // 合格
        unqualified: 0 // 不合格
    },

    isFinishedMsg: '完成期末打分',
    selectType: 1, // 传给 choose-type 组件 的 优秀良好 打分类型
    selecting: true, // 用于选择的 蒙层的展示和隐藏

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
                    Data.gardesNum.perfect = Data.gardesNum.perfect + 1;
                } else if (n.grade === 2) {
                    Data.gardesNum.good = Data.gardesNum.good + 1;
                } else if (n.grade === 3) {
                    Data.gardesNum.qualified = Data.gardesNum.qualified + 1;
                } else {
                    Data.gardesNum.unqualified = Data.gardesNum.unqualified + 1;
                }
            }
        }
    },
    isFinished: (data) => {
        Data.isFinishedMsg = data && data === 1 ? '完成期末打分' : '修改期末打分';
    }
};
// 可能会带 xhr 的异步操作
const actions = {
    finalScore(index) {
        Data.selectedInfo = Data.evas[index].grade - 1;
        Data.selectIndex = index;
        Data.title = '选择状态';
        Data.selecting = !Data.selecting;
    },
    selected(index) {
        Data.title = '期末打分';
        Data.selecting = true;
        Data.selectedInfo = index;
        Data.evas[Data.selectIndex].grade = index + 1;
        mutations.getGradeNum(Data.evas);
    },
    updata() {
        this.$http.post('/api/selin/v3/teacher/evaluate/submit/stuendeva', {
            courseId: getCourseId,
            evas: JSON.stringify(Data.evas)
        }).then(() => {
            this.showDialog();
        }, (response) => {
            this.showToast(response.statusText, 'warn');
        });
    },
    showDialog() {
        this.alert('完成期末打分', null, () => {
            location.href = '/teacher/index.html';
            this.dialog.show = false;
        });
    }
};

new Vue({
    mixins: [mixin],
    data: Data,
    components: {
        'ui-choose-type': ChooseType
    },
    methods: actions,
    created() {
        this.$http.get('/api/selin/v3/teacher/evaluate/getstu/endeva', {
            params: {
                courseId: getCourseId
            }
        }).then((response) => {
            const data = response.data;
            this.courseInfor = data;
            if (data.evas) {
                for (let i = 0, l = data.evas.length; i < l; ++i) {
                    const n = data.evas[i];
                    if (n.studentId < 9) {
                        n.studentId = '0' + n.studentId;
                    }
                }
            }
            Data.evas = data.evas;
            // 统计 优秀 良好等 等级的人数
            mutations.getGradeNum(Data.evas);
            mutations.isFinished(data.status);
        }, (response) => {
            this.showToast(response.statusText, 'warn');
        });
    }
});

