import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Uploader from 'components/uploader/uploader.js';
import getPar from 'utils/getUrlParameter';
const getCourseId = getPar('courseId').courseId;

new Vue({
    mixins: [mixin],
    data: {
        title: '课程维护',
        courserInfo: {},
        photos: [],
        uploadPhotos: [], // 用于上传提交 图片的key用
        progress: 0, // 上传进度
        isUploading: false
    },
    components: {
        'ui-uploader': Uploader
    },
    methods: {
        getInfo() {
            this.$http.get('/api/selin/v3/teacher/course/getdetail', {
                params: {
                    courseId: getCourseId
                }
            }).then((response) => {
                this.courserInfo = response.data;
                this.photos = response.data.photos;
                // 保存原有图
                const regx = /([^\/]+)/g;
                if (this.photos) {
                    for (let i = 0, l = this.photos.length; i < l; ++i) {
                        const n = this.photos[i].url;
                        const res = n.match(regx);
                        this.uploadPhotos.push({
                            url: res[2]
                        });
                    }
                }
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        uploaderStart() {
            this.isUploading = true;
        },
        uploadSuccess(url, key) {
            this.isUploading = false;
            if (!this.photos) {
                this.photos = [];
            }
            this.photos.push({
                url: url
            });
            if (!this.uploadPhotos) {
                this.uploadPhotos = [];
            }
            this.uploadPhotos.push({
                url: key
            });
        },

        uploadError() {
            this.isUploading = false;
            this.showToast('上传出错', 'warn');
        },

        uploadPro(p) {
            this.progress = p;
        },

        submite() {
            if (!this.courserInfo.intro) {
                this.showToast('请先填写课程介绍', 'warn');
                return;
            } else if (this.photos && !this.photos.length) {
                this.showToast('请先上传课程图片', 'warn');
                return;
            } else if (this.isUploading) {
                this.showToast('图片正在上传中...', 'warn');
                return;
            }

            this.$http.post('/api/selin/v3/teacher/course/update', {
                courseId: getCourseId,
                intro: this.courserInfo.intro,
                photos: JSON.stringify(this.uploadPhotos)
            }).then(() => {
                this.showDialog();
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        closePhotos(index) {
            this.photos.splice(index, 1);
            this.uploadPhotos.splice(index, 1);
        },

        showDialog() {
            this.alert('维护成功', null, () => {
                location.href = '/teacher/index.html';
                this.dialog.show = false;
            });
        }
    },
    created() {
        this.getInfo();
    }
});

