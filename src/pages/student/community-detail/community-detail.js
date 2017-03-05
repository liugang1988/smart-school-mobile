import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Banner from 'components/banner/banner.js';
import getUrlParameter from 'utils/getUrlParameter.js';
// 获取社团风采id
const mienId = getUrlParameter().mienId;
new Vue({
    mixins: [mixin],
    data: {
        infor: {}, // 获取信息
        showImg: false,
        isHeights: window.screen.height,
        photos: [],
        photoIndex: 0,
        isLoading: false
    },
    components: {
        'ui-banner': Banner
    },
    methods: {
        // 获取社团风采详情信息
        getInfor() {
            this.$http.get('/api/selin/v3/student/course/othermien/detail', {
                params: {
                    mienId: mienId
                }
            }).then((response) => {
                this.infor = response.data;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        praise() {
            if (!this.infor.isFlag) {
                if (!this.isLoading) {
                    this.isLoading = true;
                    this.$http.post('/api/selin/v3/student/course/othermien/zan', { mienId })
                        .then((response) => {
                            this.showToast('点赞成功！', 'success');
                            this.isLoading = false;
                            this.getInfor();
                        }, (response) => {
                            this.isLoading = false;
                            this.showToast(response.statusText, 'warn');
                        });
                }
            } else {
                this.showToast('您已经点过赞了！', 'warn');
            }

        },
        // 查看大图
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
        },
        getIndex(value) {
            this.photoIndex = value;
        }
    },
    created() {
        this.getInfor();
    }
});

