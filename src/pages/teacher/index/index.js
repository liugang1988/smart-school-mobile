import Vue from 'vue';
import Tab from 'components/tab/tab.js';
import mixin from 'utils/mixin.js';
import store from 'utils/store';

new Vue({
    mixins: [mixin],
    data: {
        teachers: [],
        selectedTeacherId: null,
        courseInfo: [],
        isLoading: true,
        photos: []
    },
    components: {
        'ui-tab': Tab
    },
    methods: {
        /**
         * 切换学校
         */
        selectTeacher(index, id) {
            store.set('teacherId', id);
            this.selectedTeacherId = id;
            this.$http.post('/api/selin/v3/teacher/login', null, {
                params: {
                    teacherId: id
                }
            }).then((response) => {
                const mobile = response.data.mobile;
                // 行为记录
                if (window.TDAPP && mobile) {
                    window.TDAPP.onEvent('selin_teacher_visit_home', mobile);
                }
                this.getTeachInfo();
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },

        getTeachInfo() {
            this.$http.get('/api/selin/v3/teacher/homepage')
                .then((response) => {
                    this.courseInfo = response.data.data;
                    this.isLoading = false;
                }, (response) => {
                    this.showToast(response.statusText, 'warn');
                });
            // 获取社团集体风采信息
            this.$http.get('/api/selin/v3/teacher/mien/othermien/show')
                .then((response) => {
                    this.photos = response.data.photos;
                }, (response) => {
                    this.showToast(response.statusText, 'warn');
                });
        },
        /**
         * 判断老师id是否存在
         * 如果不存在默认返回第一个的id
         */
        getTeacherId(id) {
            let bl;
            this.teachers.map((n, i) => {
                if (n.id === id) {
                    bl = true;
                }
            });
            if (bl) {
                return id;
            } else {
                return this.teachers[0].id;
            }
        },

        editor(index) {
            if (this.courseInfo[index].courseStatus === 4) {
                this.showToast('该课程为已结束状态', 'warn');
                return;
            }
            window.location.href = '/teacher/course-editor.html?courseId=' + this.courseInfo[index].courseId;
        },

        goTarget(event, index) {
            if (this.courseInfo[index].courseStatus === 1) {
                this.showToast('该课程为未报名状态', 'warn');
                if (event.target.href) {
                    event.target.href = '#';
                } else {
                    event.target.parentNode.href = '#';
                }
                return;
            } else if (this.courseInfo[index].courseStatus === 2) {
                this.showToast('该课程为报名中状态', 'warn');
                if (event.target.href) {
                    event.target.href = '#';
                } else {
                    event.target.parentNode.href = '#';
                }
                return;
            } else if (this.courseInfo[index].courseStatus === 4) {
                this.showToast('该课程为已结束状态', 'warn');
                if (event.target.href) {
                    event.target.href = '#';
                } else {
                    event.target.parentNode.href = '#';
                }
                return;
            }
        }
    },
    created() {
        this.teachers = store.get('teachers');
        this.selectedTeacher = this.getTeacherId(store.get('teacherId'));
        this.selectTeacher(null, this.selectedTeacher);
    }
});

