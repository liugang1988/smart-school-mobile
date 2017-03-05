import Vue from 'vue';
import mixin from 'utils/mixin.js';
import getUrlParameter from 'utils/getUrlParameter.js';
import Previewer from 'components/previewer/previewer.js';
import Banner from 'components/banner/banner.js';
const courseId = getUrlParameter().id;
new Vue({
    mixins: [mixin],
    data: {
        course: null,
        grade: '',
        photos: [],
        showImg: false,
        photoIndex: 0,
        isHeights: 0,
        // 每日成绩列表
        list: [],
        pageSize: 5,
        pageNo: 1,
        dataTotal: 0,
        isLoadingList: false
    },
    components: {
        'ui-previewer': Previewer,
        'ui-banner': Banner
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
        getList() {
            if (this.isLoadingList) {
                return;
            }
            this.isLoadingList = true;
            this.$http.get('/api/selin/v3/student/course/mymien', {
                params: {
                    courseId: courseId,
                    pageNo: this.pageNo++,
                    pageSize: this.pageSize
                }
            }).then((response) => {
                const data = response.data;
                const list = data.data;
                this.list = this.list.concat(list);
                this.dataTotal = data.dataTotal;
                this.isLoadingList = false;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.isLoadingList = false;
            });
        },
        checkbigPic(index, item, e) {
            if (e) {
                this.isHeights = window.screen.height;
            }
            this.photos = [];
            // 格式化数据
            if (item && item.photos) {
                for (let k = 0, j = item.photos.length; k < j; ++k) {
                    const m = item.photos[k];
                    this.photos.push({
                        imgUrl: m.url + '?imageMogr2/size-limit/200k!'
                    });
                }
            }
            this.photoIndex = index;
            this.showImg = !this.showImg;
        },
        getIndex(value) {
            this.photoIndex = value;
        }
    },
    created() {
        this.getCourse();
        this.getList();
    }
});

