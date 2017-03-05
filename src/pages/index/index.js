import Vue from 'vue';
import mixin from 'utils/mixin';
import device from 'utils/device';
import rjyjssdk from 'rjy-jssdk';
import store from 'utils/store';

const init = () => {
    new Vue({
        mixins: [mixin],
        data: {
            students: null,
            teachers: null,
            isLoading: true
        },
        methods: {
            loginTeacher() {
                store.set('teachers', this.teachers);
                const id = this.getTeacherId(store.get('teacherId'));
                this.$http.post('/api/selin/v3/teacher/login', null, {
                    params: {
                        teacherId: id
                    }
                }).then(() => {
                    location.href = '/teacher/index.html';
                }, (res) => {
                    this.showToast(res.statusText, 'warn');
                });
            },
            loginStudent() {
                store.set('students', this.students);
                const id = this.getStudentId(store.get('studentId'));
                this.$http.post('/api/selin/v3/student/login', null, {
                    params: {
                        studentId: id
                    }
                }).then(() => {
                    location.href = '/student/index.html';
                }, (res) => {
                    this.showToast(res.statusText, 'warn');
                });
            },
            /**
             * 判断学生id是否存在
             * 如果不存在默认返回第一个
             */
            getStudentId(id) {
                let bl = null;
                this.students.map((n, i) => {
                    if (n.id === id) {
                        bl = true;
                    }
                });
                if (bl) {
                    return id;
                } else {
                    return this.students[0].id;
                }
            },

            getTeacherId(id) {
                let bls = null;
                this.teachers.map((n, i) => {
                    if (n.id === id) {
                        bls = true;
                    }
                });
                if (bls) {
                    return id;
                } else {
                    return this.teachers[0].id;
                }
            }

        },
        created() {
            this.showToast('正在获取信息...', 'loading');
            this.$http.get('/api/selin/v3/user/select')
                .then((res) => {
                    const data = res.data;
                    const students = this.students = data.students;
                    const teachers = this.teachers = data.teachers;
                    const isStudent = students && students.length;
                    const isTeacher = teachers && teachers.length;

                    // 只是老师
                    if (isTeacher && !isStudent) {
                        this.loginTeacher();
                        return;
                    }

                    // 只是学生
                    if (!isTeacher && isStudent) {
                        this.loginStudent();
                        return;
                    }

                    // 又是老师，又是学生
                    if (isTeacher && isStudent) {
                        this.isLoading = false;
                        this.hideToast();
                        return;
                    }
                    // 都不是，跳转到触屏版首页
                    this.hideToast();
                    this.alert('您还不是《智慧校园社团管理平台》用户', null, () => {
                        location.href = location.origin.replace('mschool', 'h5');
                    });
                }, (res) => {
                    this.showToast(res.statusText, 'warn');
                });
        }
    });
};

// app进来的必须强制登录一次
if (device.isRUNEDU) {
    rjyjssdk.login(true, init, '_ss_v1');
} else {
    init();
}

