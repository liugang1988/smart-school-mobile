const path = require('path');
const qiniuUpload = require('qiniu_cdn_upload');

qiniuUpload({
    src: path.resolve(__dirname, '../../build/runselin-mobile/static') + '/**',
    dest: 'static/'
}, {
    accessKey: '',
    secretKey: '',
    bucket: 'runedu-h5'
});

