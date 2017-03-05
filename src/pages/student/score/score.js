import Vue from 'vue';
import mixin from 'utils/mixin.js';
import getUrlParameter from 'utils/getUrlParameter.js';
const courseId = getUrlParameter().id;
const evaluateText = ['优秀', '良好', '合格', '不及格'];
new Vue({
    mixins: [mixin],
    data: {
        course: null,
        grade: '',

        // 每日成绩列表
        list: [],
        pageSize: 10,
        pageNo: 0,
        dataTotal: 0,
        isLoadingList: false
    },
    methods: {
        getCourse() {
            this.$http.get('/api/selin/v3/student/course/baseinfo', {
                params: {
                    courseId: courseId
                }
            }).then((response) => {
                this.course = response.data;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        getGrade() {
            this.$http.get('/api/selin/v3/student/course/grade', {
                params: {
                    courseId: courseId
                }
            }).then((response) => {
                this.grade = evaluateText[response.data.endEvaluate - 1] || '待定';
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        getList() {
            if (this.isLoadingList) {
                return;
            }
            this.isLoadingList = true;
            this.$http.get('/api/selin/v3/student/course/pergrade', {
                params: {
                    courseId: courseId,
                    pageNo: ++this.pageNo,
                    pageSize: this.pageSize
                }
            }).then((response) => {
                const data = response.data;
                const list = data.data;
                if (list) {
                    list.forEach((n) => {
                        n.courseEvaluateText = evaluateText[n.courseEvaluate - 1];
                    });
                    this.list = this.list.concat(list);
                }

                this.dataTotal = data.dataTotal;
                this.isLoadingList = false;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.isLoadingList = false;
            });
        }
    },
    created() {
        this.getCourse();
        this.getGrade();
        this.getList();
    }
});

