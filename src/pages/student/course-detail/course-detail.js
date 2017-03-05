import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Tab from 'components/tab/tab.js';
import Previewer from 'components/previewer/previewer.js';
import Banner from 'components/banner/banner.js';
import getUrlParameter from 'utils/getUrlParameter.js';

const id = getUrlParameter().id;

new Vue({
    mixins: [mixin],
    data: {
        info: null,
        isLoading: true,
        submiting: false,
        photos: [],
        photoIndex: 0,
        showImg: false
    },
    components: {
        'ui-tab': Tab,
        'ui-previewer': Previewer,
        'ui-banner': Banner
    },
    computed: {
        submitText() {
            if (this.submiting) {
                return '正在提交...';
            } else {
                return this.info.applyStatus ? '取消报名' : '立即报名';
            }
        }
    },
    methods: {
        applyCourse() {
            const that = this;
            const info = this.info;
            const applyStatus = info.applyStatus;
            if (this.submiting) return;
            if (applyStatus) {
                that.confirm('是否确定取消？', null, () => {
                    that.cancel();
                });
            } else {
                that.apply();
            }
        },
        cancel() {
            this.submiting = true;
            const info = this.info;
            this.$http.post('/api/selin/v3/student/course/apply', null, {     
                params: {
                    courseId: id,
                    type: 2,
                    applyId: info.applyId
                }
            }).then(() => {
                this.showToast('取消报名成功', 'success');
                this.submiting = false;
                location.reload();
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.submiting = false;
            });
        },
        apply() {
            this.submiting = true;
            this.$http.post('/api/selin/v3/student/course/apply', null, {
                params: {
                    courseId: id,
                    type: 1,
                    applyId: this.info.applyId
                }
            }).then(() => {
                this.showToast('报名成功', 'success');
                this.submiting = false;
                // location.reload();
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.submiting = false;
            });
        },
        checkbigPic(index) {
            this.isHeights = window.screen.height;
            this.photoIndex = index;
            this.showImg = !this.showImg;
        },
        getIndex(value) {
            this.photoIndex = value;
        }
    },
    created() {
        this.showToast('正在加载课程信息...', 'loading');
        this.$http.get('/api/selin/v3/student/course/getdetail', {
            params: {
                courseId: id
            }
        }).then((response) => {
            const data = response.data;
            data.intro = data.intro ? data.intro.replace(/[\n\r]+/g, '<br>') : '';
            this.photos = [];
            // 格式化数据
            if (data.photos && data.photos.length) {
                for (let i = 0, l = data.photos.length; i < l; ++i) {
                    const n = data.photos[i];
                    this.photos.push({
                        imgUrl: n.url
                    });
                }
            }
            this.info = data;
            this.isLoading = false;
            this.toast.show = false;
        }, (response) => {
            this.showToast(response.statusText, 'warn');
            this.isLoading = false;
            this.toast.show = false;
        });
    }
});

