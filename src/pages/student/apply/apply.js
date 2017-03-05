import Vue from 'vue';
import mixin from 'utils/mixin.js';
import getUrlParameter from 'utils/getUrlParameter.js';
const courseId = getUrlParameter().id;
const must = getUrlParameter().must;
const types = ['待审核', '通过', '不通过']; // 审核类型

new Vue({
    mixins: [mixin],
    data: {
        id: courseId,
        name: '',
        reason: '',
        info: null,
        isSelecting: false, // 是否正在选新课程
        isLoading: true,
        newCourse: null,
        courseList: '',
        submiting: false,
        applyUrl: __uri('apply.html?id='),
        redirect: location.href + '&must=1'
    },
    computed: {
        submitText() {
            return this.submiting ? '正在提交...' : '确定';
        },
        newName() {
            return (this.newCourse && this.newCourse.courseName) || '请选择新课程';
        },
        newId() {
            return this.newCourse && this.newCourse.courseId;
        }
    },
    methods: {
        getCourse() {
            this.$http.get('/api/selin/v3/student/course/baseinfo', {
                params: {
                    courseId: courseId
                }
            }).then((response) => {
                this.name = response.data.courseName;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        changeCourse() {
            this.isSelecting = true;
            this.getCourseList();
        },
        submit() {
            if (!this.newId) {
                this.showToast('请选择新的课程', 'warn');
                return;
            }

            if (!this.reason) {
                this.showToast('请写下调课理由', 'warn');
                return;
            }

            if (this.submiting) return;

            this.submiting = true;
            this.$http.post('/api/selin/v3/student/change/apply', {
                oldCourseId: courseId,
                newCourseId: this.newId,
                reason: this.reason
            }).then((response) => {
                this.showToast('已经提交调课申请', 'success');
                this.submiting = false;
                setTimeout(() => {
                    location.reload();
                }, 1000)
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.submiting = false;
            });
        },


        getCourseList() {
            // 查询全部课程
            this.$http.get('/api/selin/v3/student/change/course/list', {
                params: {
                    oldCourseId: courseId
                }
            }).then((response) => {
                this.courseList = response.data.data;
                this.isLoading = false;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.isLoading = false;
            });
        },
        select(item) {
            this.newCourse = item;
            this.isSelecting = false;
        },

        getDetail() {
            this.$http.get('/api/selin/v3/student/change/myapply', {
                params: {
                    courseId: courseId
                }
            }).then((response) => {
                const data = response.data;
                // 如果存在说明已经申请过了
                if (data) {
                    data.type = types[data.status - 1];
                    this.info = data;
                }
                this.isLoading = false;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        }
    },
    created() {
        if (!must) {
            this.getDetail();
        } else {
            this.isLoading = false;
        }
        this.getCourse();
    }
});

