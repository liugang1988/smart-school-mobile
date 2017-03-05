import Vue from 'vue';
import mixin from 'utils/mixin.js';
import getUrlParameter from 'utils/getUrlParameter.js';
const id = getUrlParameter().id;
new Vue({
    mixins: [mixin],
    data: {
        id: id,
        loading: true,
        courses: null,
        value: 'TODAY',
        types: [{
            name: '事假',
            id: 3
        }, {
            name: '病假',
            id: 4
        }],
        type: 3,
        reason: '',
        link: 'my-attendance.html?id=' + id
    },
    components: {},
    computed: {
        submitText() {
            if (this.submiting) {
                return '正在提交...';
            } else {
                return '提交申请';
            }
        }
    },
    methods: {
        selectDate(data) {
            this.value = data;
        },
        apply() {
            if (this.submiting) {
                return;
            }

            if (!/\S/.test(this.reason)) {
                this.showToast('请输入请假说明', 'warn');
                return;
            }

            this.submiting = true;
            this.$http.post('/api/selin/v3/student/check/applyleave', null, {
                params: {
                    courseId: id,
                    applyTime: this.value,
                    reason: this.reason,
                    type: this.type
                }
            }).then((response) => {
                this.showToast('已提交', 'success');
                this.submiting = false;
                location.href = this.link;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.submiting = false;
            });
        }
    },
    created() {
        this.showToast('正在加载课程信息...', 'loading');
        this.$http.get('/api/selin/v3/student/check/mycheck', {
            params: {
                courseId: id
            }
        }).then((response) => {
            this.courses = response.data.data;
            this.loading = false;
            this.toast.show = false;
        }, (response) => {
            this.showToast(response.statusText, 'warn');
            this.loading = false;
            this.toast.show = false;
        });
    }
});

