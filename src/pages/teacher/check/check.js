import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Uploader from 'components/uploader/uploader.js';
import getPar from 'utils/getUrlParameter';
import rjyJsSdk from 'rjy-jssdk';
const getCourseId = getPar('courseId').courseId;

new Vue({
    mixins: [mixin],
    data: {
        title: '签到',
        checkInfo: {},
        photos: [],
        uploadPhotos: [], // 用于上传提交 图片的key用
        progress: 0, // 上传进度
        isUploading: false,
        remark: '',
        courseId: getCourseId,
        options: {
            lat: 22.5596181,
            lon: 113.952893
        },
        isCheck: false
    },
    components: {
        'ui-uploader': Uploader
    },
    methods: {
        getInfo() {
            this.$http.post('/api/selin/v3/teacher/sign/add', {
                courseId: getCourseId,
                signAddress: this.checkInfo.address,
                lat: this.options.lat,
                lon: this.options.lon,
                remark: this.remark,
                photos: JSON.stringify(this.uploadPhotos)
            }).then(() => {
                this.showDialog();
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
            if (!this.isCheck) {
                this.getInfo();
            } else {
                this.showToast('您今天已经签到过一次了哦~', 'warn');
                return;
            }
        },

        closePhotos(index) {
            this.photos.splice(index, 1);
            this.uploadPhotos.splice(index, 1);
        },

        showDialog() {
            this.alert('签到成功', null, () => {
                location.href = '/teacher/index.html';
                this.dialog.show = false;
            });
        },
        getBaseInfo() {
            this.$http.get('/api/selin/v3/teacher/sign/baseinfo', {
                params: this.options
            }).then((response) => {
                this.checkInfo = response.data;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });

            // 是否签到
            this.$http.get('/api/selin/v3/teacher/sign/check', {
                params: {
                    courseId: this.courseId
                }
            }).then((response) => {
                this.isCheck = response.data.flag;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        }
    },
    created() {
        const that = this;
        rjyJsSdk.geolocation((code, lonlat) => {
            if (code) {
                const geoArr = lonlat.split(',');
                that.options.lon = geoArr[0];
                that.options.lat = geoArr[1];
                that.getBaseInfo();
            } else {
                that.showToast('未获取到定位', 'warn');
                that.getBaseInfo();
            }
        });
    }
});

