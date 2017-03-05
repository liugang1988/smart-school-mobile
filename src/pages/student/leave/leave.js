import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Radio from 'components/radio/radio.js';
import Calendar from 'components/calendar/calendar.js';
import getUrlParameter from 'utils/getUrlParameter.js';
const id = getUrlParameter().id;
new Vue({
    mixins: [mixin],
    data: {
        id: id,
        weeksList: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        loading: true,
        course: null,
        date: 'TODAY',
        types: [{
            name: '事假',
            id: 3
        }, {
            name: '病假',
            id: 4
        }],
        type: 3,
        reason: '',
        submiting: false,
        link: 'my-attendance.html?id=' + id
    },
    components: {
        'ui-radio': Radio,
        'ui-calendar': Calendar
    },
    computed: {
        submitText() {
            return this.submiting ? '正在提交...' : '提交申请';
        }
    },
    methods: {
        getInfor() {
            this.$http.get('/api/selin/v3/student/course/getdetail', {
                params: {
                    courseId: id
                }
            }).then((response) => {
                this.course = response.data;
                this.loading = false;
                this.toast.show = false;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.loading = false;
                this.toast.show = false;
            });
        },
        apply() {
            if (!this.reason) {
                this.showToast('请输入请假说明', 'warn');
                return;
            }
            if (this.submiting) return;
            this.submiting = true;
            this.$http.post('/api/selin/v3/student/check/applyleave', null, {
                params: {
                    courseId: id,
                    applyTime: this.date,
                    reason: this.reason,
                    type: this.type
                }
            }).then((response) => {
                this.showToast('提交成功！', 'success');
                this.submiting = false;
                setTimeout(() => {
                    location.href = this.link;
                }, 1000);
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.submiting = false;
            });
        }
    },
    created() {
        this.showToast('正在加载课程信息...', 'loading');
        this.getInfor();
    }
});

