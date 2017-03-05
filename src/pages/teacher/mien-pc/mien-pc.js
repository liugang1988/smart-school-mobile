import Vue from 'vue';
import mixin from 'utils/mixin.js';
import getPar from 'utils/getUrlParameter';
import Banner from 'components/banner/banner.js';
// 获取到当前的课程ID
const getCourseId = getPar('courseId').courseId;

const Data = {
    title: '课程风采',
    isLoading: true,
    courseInfo: [],
    showPhotoUrl: '',
    showMeng: false,

    cursor: null,
    pageNo: 1,
    pageSize: 5,

    isLoadingList: true,
    dataTotal: 0,

    showImg: false,
    photos: [],
    photoIndex: 0,
    isHeights: 0
};

new Vue({
    mixins: [mixin],
    data: Data,
    components: {
        'ui-banner': Banner
    },
    methods: {
        getInfo() {
            this.$http.get('/api/selin/v3/teacher/mien/coursemienview', {
                params: {
                    courseId: getCourseId,
                    cursor: Data.cursor,
                    pageNo: Data.pageNo,
                    pageSize: Data.pageSize
                }
            }).then((response) => {
                const data = response.data;
                Data.isLoading = false;
                Data.cursor = data.cursor;
                Data.isLoadingList = data.pageNo * data.pageSize >= data.dataTotal;
                Data.dataTotal = data.dataTotal;
                Data.courseInfo = Data.courseInfo.concat(data.data);
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },

        showPhoto(index, event, item) {
            if (event.target.nodeName === 'IMG') {
                Data.showMeng = !Data.showMeng;
                Data.showPhotoUrl = item.photos[index].url;
            }
        },

        hiddenPic() {
            Data.showMeng = !Data.showMeng;
        },

        showMore() {
            Data.pageNo += 1;
            this.getInfo();
        },

        checkbigPic(index, item) {
            Data.isHeights = window.screen.height;
            // 格式化数据
            Data.photos = [];
            if (item && item.photos) {
                for (let k = 0, j = item.photos.length; k < j; ++k) {
                    const m = item.photos[k];
                    Data.photos.push({
                        imgUrl: m.url
                    });
                }
            }
            Data.photoIndex = index;
            Data.showImg = !Data.showImg;
        },
        getIndex(value) {
            Data.photoIndex = value;
        }
    },
    created() {
        this.getInfo();
    }
});

