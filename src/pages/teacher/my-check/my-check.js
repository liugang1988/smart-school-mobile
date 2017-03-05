import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Uploader from 'components/uploader/uploader.js';
import Banner from 'components/banner/banner.js';
import Nofind from 'components/nofind/nofind.js';
import getUrlParameter from 'utils/getUrlParameter';
const getCourseId = getUrlParameter('courseId').courseId;

new Vue({
    mixins: [mixin],
    data: {
        title: '我的签到',
        checkInfo: [],
        photos: [],
        uploadPhotos: [], // 用于上传提交 图片的key用
        progress: 0, // 上传进度
        isUploading: false,
        options: {
            courseId: getCourseId,
            cursor: null,
            pageSize: 10,
            pageNo: 1
        },
        isLastPage: false,
        nofind: false,
        showImg: false,
        isHeights: window.screen.height
    },
    components: {
        'ui-uploader': Uploader,
        'ui-banner': Banner,
        'ui-nofind': Nofind
    },
    methods: {
        getInfo() {
            this.$http.get('/api/selin/v3/teacher/sign/list', {
                params: this.options
            }).then((response) => {
                const data = response.data;
                const len = data.data.length;
                for (let i = 0; i < len; ++i) {
                    const n = data.data[i];
                    const resArr = n.signDate.split(' ');
                    n.signDate = resArr[0];
                    n.signTime = resArr[1];
                }
                this.checkInfo = this.checkInfo.concat(data.data);
                if (!this.checkInfo.length) {
                    this.nofind = true;
                }
                this.options.cursor = data.cursor;
                this.options.pageNo = data.pageNo;
                this.isLastPage = this.options.pageNo * this.options.pageSize >= response.data.dataTotal;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },

        more() {
            this.options.pageNo++;
            this.getInfo();
        },

        showDialog() {
            this.alert('维护成功', null, () => {
                location.href = '/teacher/index.html';
                this.dialog.show = false;
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
        },
        getIndex(value) {
            this.photoIndex = value;
        }
    },
    created() {
        this.getInfo();
    }
});

