import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Tab from 'components/tab/tab.js';
import Banner from 'components/banner/banner.js';
import Nofind from 'components/nofind/nofind.js';
new Vue({
    mixins: [mixin],
    data: {
        types: [],
        type: '',
        selectedType: 0,
        courseList: [],
        isLoading: true,
        showImg: false,
        isHeights: window.screen.height,
        photos: [],
        photoIndex: 0,

        pageSize: 5,
        pageNo: 1,
        dataTotal: 0
    },
    components: {
        'ui-tab': Tab,
        'ui-banner': Banner,
        'ui-nofind': Nofind
    },
    methods: {
        /**
         * 切换分类
         */
        selectType(index) {
            this.courseList = [];
            this.pageNo = 1;
            this.type = this.types[index];
            this.selectedType = index;
            this.getComInfo(this.type);
        },

        // 获取社团集体风采
        getComInfo(type) {
            this.isLoading = true;
            this.$http.get('/api/selin/v3/student/course/othermien/list', {
                params: {
                    typeId: type.id,
                    pageNo: this.pageNo++,
                    pageSize: this.pageSize
                }
            }).then((response) => {
                const data = response.data;
                this.courseList = this.courseList.concat(data.data);
                this.dataTotal = data.dataTotal;
                this.isLoading = false;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.isLoading = false;
            });
        },
        checkbigPic(index, item) {
            // 格式化数据
            this.photos = [];
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
        }
    },
    created() {
        // 获取课程信息
        this.$http.get('/api/selin/v3/student/course/gettype', {
            autoLogin: true
        }).then((response) => {
            const data = response.data;
            if (data) {
                data.data.unshift({
                    id: '',
                    name: '全部'
                });
                this.types = data.data;
                this.selectType(this.selectedType);
            } else {
                this.showToast('没有找到任何分类', 'warn');
            }
        }, (response) => {
            this.showToast(response.statusText, 'warn');
        });

    }
});

