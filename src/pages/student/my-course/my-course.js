import Vue from 'vue';
import mixin from 'utils/mixin.js';

new Vue({
    mixins: [mixin],
    data: {
        courseList: [],
        isLoading: true
    },
    created() {
        this.showToast('正在加载课程信息...', 'loading');
        this.$http.get('/api/selin/v3/student/course/mycourse', {
            autoLogin: true
        }).then((response) => {
            this.isLoading = false;
            this.courseList = response.data.data;
            this.toast.show = false;
        }, (response) => {
            this.isLoading = false;
            this.showToast(response.statusText, 'warn');
        });
    }
});
