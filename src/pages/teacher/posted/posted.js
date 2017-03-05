import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Calendar from 'components/calendar/calendar.js';
import Uploader from 'components/uploader/uploader.js';
import ChooseType from 'components/choose-type/choose-type.js';
import getPar from 'utils/getUrlParameter';
const getCourseId = getPar('courseId').courseId;

// 获取当前时间，格式YYYY-MM-DD
const getNowFormatDate = () => {
    const date = new Date();
    const seperator1 = '-';
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    const currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
};

const Data = {
    title: '发帖',
    courserInfo: {},
    value: getNowFormatDate(),
    showCalens: false,

    photos: [],
    uploadPhotos: [], // 用于上传提交 图片的key用
    progress: 0, // 上传进度
    remarkOn: '', // 老师点评

    selecting: true, // 用于选择的 蒙层的展示和隐藏
    selectArr: [],
    selectType: 2, // 用于选择的 类型：0: 迟到早退  1: 优秀良好  2 ：动态加载数据
    selectedInfo: 0, // 被选中索引

    hasSelectName: '集体',
    hasSelectId: null,

    allStu: []
};

const actions = {
    uploadSuccess(url, key, isUploading) {
        this.isUploading = false;
        if (!this.photos) {
            this.photos = [];
        }
        this.photos.push({
            url: url
        });
        // 专门用于 图片提交给 后台的数据
        if (!this.uploadPhotos) {
            this.uploadPhotos = [];
        }
        this.uploadPhotos.push({
            url: key
        });
    },
    uploaderStart() {
        this.isUploading = true;
    },

    uploadError() {
        this.isUploading = false;
        this.showToast('上传出错', 'warn');
    },

    uploadPro(p) {
        this.progress = p;
    },

    closePhotos(index) {
        this.photos.splice(index, 1);
        this.uploadPhotos.splice(index, 1);
    },

    selectStu() {
        Data.title = '选择学生';
        Data.selecting = !Data.selecting;
    },

    selected(index) {
        Data.title = '发帖';
        Data.selecting = true;
        Data.selectedInfo = index;
        Data.hasSelectId = Data.allStu[index].id;
        Data.hasSelectName = Data.allStu[index].name;
    },

    submit() {
        if (Data.hasSelectName === '请选择学生') {
            this.showToast('请先选择学生', 'warn');
            return;
        }
        if (!Data.remarkOn) {
            this.showToast('请先填写点评', 'warn');
            return;
        }
        if (!!Data.photos && !Data.photos.length) {
            this.showToast('请先上传图片', 'warn');
            return;
        }
        if (this.isUploading) {
            this.showToast('图片正在上传中...', 'warn');
            return;
        }
        this.$http.post('/api/selin/v3/teacher/mien/submitmien', {
            courseId: getCourseId,
            comment: Data.remarkOn,
            mienDate: Data.value,
            studentId: Data.hasSelectId ? Data.hasSelectId : 0,
            photos: JSON.stringify(Data.uploadPhotos)
        }).then(() => {
            this.showDialog('提交成功！', 'success');
        }, (response) => {
            this.showToast(response.statusText, 'warn');
        });
    },


    showDialog() {
        this.confirm('发帖成功', null, () => {
            location.href = '/teacher/index.html';
            this.dialog.show = false;
        });
    },

    dialogOnCancel() {
        location.href = '/teacher/posted.html?courseId=' + getCourseId;
        this.dialog.show = false;
    },

    showCalendar() {
        Data.showCalens = !Data.showCalens;
    },

    hideCalendar(value) {
        Data.showCalens = false;
    },

    hideToday(event) {
        if (event.target.nodeName === 'SPAN' || event.target.nodeName === 'TD') {
            Data.showCalens = false;
        }
    }
};

new Vue({
    mixins: [mixin],
    data: Data,
    components: {
        'ui-calendar': Calendar,
        'ui-uploader': Uploader,
        'ui-choose-type': ChooseType
    },
    methods: actions,
    created() {
        this.$http.get('/api/selin/v3/teacher/course/getdetail', {
            params: {
                courseId: getCourseId
            }
        }).then((response) => {
            Data.courserInfo = response.data;
        }, (response) => {
            this.showToast(response.statusText, 'warn');
        });

        this.$http.get('/api/selin/v3/teacher/course/getstulist', {
            params: {
                courseId: getCourseId
            }
        }).then((response) => {
            Data.allStu = response.data.data;

            for (let i = 0, l = Data.allStu.length; i < l; ++i) {
                const n = Data.allStu[i];
                if (n.studentId < 9) {
                    n.studentId = '0' + n.studentId;
                }
            }

            Data.allStu.unshift({
                studentId: null,
                name: '集体'
            });
        }, (response) => {
            this.showToast(response.statusText, 'warn');
        });
    }
});

