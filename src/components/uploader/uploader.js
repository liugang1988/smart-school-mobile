/**
 * 上传组件
 */
import http from 'utils/http';
import device from 'utils/device';
import rjyjssdk from 'rjy-jssdk';
const qiniuUploadUrl = location.protocol === 'https:' ? 'https://up.qbox.me' : 'http://upload.qiniu.com'; // 七牛上传地址
/**
 * 图片上传
 */
const uploader = (options) => {
    options = options || {};
    const noop = function() {};
    const key = options.key;
    const token = options.token;
    const actionUrl = options.actionUrl;
    const accessUrl = options.accessUrl;
    const file = options.file;

    // 回调方法
    const success = options.success || noop;
    const progress = options.progress || noop;
    const fail = options.fail || noop;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', actionUrl, true);
    xhr.addEventListener('progress', function(evt) {
        // 上传进度
        if (evt.lengthComputable) {
            progress(Math.round(evt.loaded / evt.total * 100));
        }
    }, false);

    const formData = new FormData();
    if (key !== null && key !== undefined) {
        formData.append('key', key);
        formData.append('token', token);
        formData.append('file', file);
    }

    xhr.send(formData);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            let body = xhr.responseText;
            body = JSON.parse(body);
            if (xhr.status >= 200 && xhr.status < 300 ||
                xhr.status === 304) {
                const key = body.key;
                success(accessUrl + '/' + key, key);
            } else {
                fail(body);
            }
        }
    };
};

export default {
    template: __inline('uploader.tpl'),
    data() {
        return {
            isAndroidRunApp: device.isRUNEDU && device.isAndroid,
            isUploading: false,
            file: ''
        };
    },
    methods: {
        uploadByApp() {
            if (!(this.isAndroidRunApp)) return;
            if (this.isUploading) return;
            this.$emit('upload');
            this.isUploading = true;
            const that = this;
            rjyjssdk.uploadImg(function(status, obj) {
                if (status && obj) {
                    that.$emit('success', obj.url, obj.key);
                } else {
                    that.$emit('error');
                }
                that.isUploading = false;
            });
        },
        change() {
            if (this.isUploading) return;
            this.$emit('upload');
            this.isUploading = true;

            const that = this;
            const el = this.$refs.input;
            http.get('/api/selin/v3/teacher/upload/token')
                .then((response) => {
                    const d = response.data[0];
                    if (d) {
                        const file = el.files[0]; // 上传内容
                        uploader({
                            key: d.key,
                            token: d.uploadToken,
                            actionUrl: qiniuUploadUrl,
                            accessUrl: d.accessUrl,
                            file: file,
                            success(url, key) {
                                el.value = '';
                                that.$emit('success', url, key);
                                that.isUploading = false;
                            },
                            progress(progress) {
                                that.$emit('progress', progress);
                            },
                            fail(error) {
                                el.value = '';
                                that.$emit('error', error);
                                that.isUploading = false;
                            }
                        });
                    }
                }, (response) => {
                    console.log('error', response);
                    that.$emit('error', response);
                    that.isUploading = false;
                });
        }
    }
};

