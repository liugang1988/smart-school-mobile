import Vue from 'vue';
import mixin from 'utils/mixin.js';
import getUrlParameter from 'utils/getUrlParameter.js';
const id = getUrlParameter().id;

new Vue({
    mixins: [mixin],
    data: {
        loading: true,
        items: [],
        pageNo: 1,
        pageSize: 3,
        dataTotal: 0
    },
    methods: {
        load() {
            this.showToast('正在加载请假信息...', 'loading');
            this.$http.get('/api/selin/v3/student/check/myapply', {
                params: {
                    courseId: id,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                }
            }).then((response) => {
                this.dataTotal = response.data.dataTotal;
                this.items = this.items.concat(response.data.data);
                this.loading = false;
                this.toast.show = false;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.loading = false;
                this.toast.show = false;
            });
        },
        loadMore() {
            this.pageNo++;
            this.load();
        }
    },
    created() {
        this.load();
    }
});

