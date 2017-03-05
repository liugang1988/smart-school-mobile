import Vue from 'vue';
import mixin from 'utils/mixin';
import Tab from 'components/tab/tab';
import store from 'utils/store';
import Icon from 'components/icons/icons';

new Vue({
    mixins: [mixin],
    data() {
        return {
            students: [],
            selectedStudentId: null,
            courseNo: 0,
            courseList: [],
            isLoading: true,
            photos: [],
            doorInfor: {}, // 社区入口信息
            doorUrl: __uri('achievement.html') + '?outcomeShowId=', // 社区入口地址
            broadCast: {} // 校园广播信息
        };
    },
    components: {
        'ui-tab': Tab,
        'ui-icon': Icon
    },
    methods: {
        /**
         * 切换学生
         * 备注：选择学生函数后面不能执行其他函数，否则会报错，如果要执行，请在选择学生执行成功后再执行，参考社区入口
         */
        selectStudent(index, id) {
            store.set('studentId', id);
            this.selectedStudentId = id;
            this.$http.post('/api/selin/v3/student/login', null, {
                params: {
                    studentId: id
                }
            }).then((response) => {
                const mobile = response.data.mobile;
                // 行为记录
                if (window.TDAPP && mobile) {
                    window.TDAPP.onEvent('selin_student_visit_home', mobile);
                }
                // 获取可选课程数量
                this.getTotal();
                // 获取社团集体风采信息
                this.getTeamInfor();
                // 获取课程列表
                this.getCourse();
                // 社区成果入口是否显示,选择学生成功之后才能显示入口
                this.communityDoor();
                // 校园广播入口请求
                this.broadCastDoor();
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        /**
         * 获取可选课程数量
         */
        getTotal() {
            this.$http.get('/api/selin/v3/student/course/getcourseno')
                .then((response) => {
                    this.courseNo = response.data.courseNo;
                }, (response) => {
                    this.showToast(response.statusText, 'warn');
                });
        },
        // 获取社团集体风采信息
        getTeamInfor() {
            this.$http.get('/api/selin/v3/student/course/othermien/show')
                .then((response) => {
                    this.photos = response.data.photos;
                    this.isLoading = false;
                }, (response) => {
                    this.showToast(response.statusText, 'warn');
                    this.isLoading = false;
                });
        },
        /**
         * 获取选课信息
         */
        getCourse() {
            this.isLoading = true;
            this.$http.get('/api/selin/v3/student/course/getapplyinfo')
                .then((response) => {
                    this.courseList = response.data.data;
                    this.isLoading = false;
                }, (response) => {
                    this.showToast(response.statusText, 'warn');
                    this.isLoading = false;
                });
        },
        /**
         * 社区成功入口
         */
        communityDoor() {
            this.$http.get('/api/selin/v3/student/outcome/entrance')
                .then((response) => {
                    this.doorInfor = response.data;
                }, (response) => {
                    this.showToast(response.statusText, 'warn');
                });
        },
        /**
         * 社区广播入口
         */
        broadCastDoor() {
            this.$http.get('/api/selin/v3/student/schoollink/entrance')
                .then((response) => {
                    this.broadCast = response.data;
                }, (response) => {
                    this.showToast(response.statusText, 'warn');
                });
        },
        /**
         * 判断学生id是否存在
         * 如果不存在默认返回第一个的id
         */
        getStudentId(id) {
            let bl;
            this.students.map((item) => {
                if (item.id === id) {
                    bl = true;
                }
            });
            return bl ? id : this.students[0].id;
        }
    },
    created() {
        this.students = store.get('students');
        this.selectedStudent = this.getStudentId(store.get('studentId'));
        this.selectStudent(null, this.selectedStudent);
    }
});

