import Vue from 'vue';
import mixin from 'utils/mixin.js';
import getPar from 'utils/getUrlParameter';
// 获取到当前的课程ID
const getCourseId = getPar('courseId').courseId;

new Vue({
    mixins: [mixin],
    data: {
        title: '学生评价',
        averageEva: 0,
        evas: [],
        isLoading: true,

        cursor: null,
        pageNo: 1,
        pageSize: 10,

        isLoadingList: true,
        dataTotal: 0
    },
    methods: {
        getInfo() {
            this.$http.get('/api/selin/v3/teacher/evaluate/getteaeva', {
                params: {
                    courseId: getCourseId,
                    cursor: this.cursor,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                }
            }).then((response) => {
                const data = response.data;
                this.isLoading = false;
                this.cursor = data.cursor;
                this.isLoadingList = data.pageNo * data.pageSize >= data.dataTotal;
                this.dataTotal = data.dataTotal;
                this.evas = this.evas.concat(data.data);
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        getavggrade() {
            this.$http.get('/api/selin/v3/teacher/evaluate/getavggrade', {
                params: {
                    courseId: getCourseId
                }
            }).then((response) => {
                this.averageEva = response.data ? response.data.averageEva : null;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        showMore() {
            this.pageNo += 1;
            this.getInfo();
        }
    },
    created() {
        this.getInfo();
        this.getavggrade();
    }
});

