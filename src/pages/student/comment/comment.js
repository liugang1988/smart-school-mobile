import Vue from 'vue';
import mixin from 'utils/mixin.js';
import mixinSub from 'utils/mixin-sub.js';
import FiveStar from 'components/five-star/five-star.js';
import getUrlParameter from 'utils/getUrlParameter.js';
const urlParameter = getUrlParameter();

/**
 * 评论组件
 */
const Comment = {
    mixins: [mixinSub],
    template: __inline('comment.tpl'),
    props: ['courseId'],
    data() {
        return {
            isSubmiting: false,
            evaluateId: null,
            evaluateTime: '',
            clothingEvaluate: 0,
            interestEvaluate: 0,
            lessonEvaluate: 0,
            comment: '',
            isEvaluate: 0,
            buttonMessage: ''
        };
    },
    components: {
        'ui-five-star': FiveStar
    },
    methods: {
        submit() {
            // 判断是否可以评论，可以评论才能提交
            if (this.isEvaluate) {
                if (this.isSubmiting) {
                    return;
                }
                if (!this.clothingEvaluate) {
                    this.showToast('请为老师的着装礼仪打分', 'warn');
                    return;
                }
                if (!this.interestEvaluate) {
                    this.showToast('请为课程内容打分', 'warn');
                    return;
                }
                if (!this.lessonEvaluate) {
                    this.showToast('请为老师的专业水平打分', 'warn');
                    return;
                }
                if (!this.comment) {
                    this.showToast('请输入对老师的评价', 'warn');
                    return;
                }
            } else {
                this.showToast(this.buttonMessage, 'warn');
                return;
            }
            if (this.isSubmiting) return;
            this.isSubmiting = true;
            this.$http.post('/api/selin/v3/student/evaluate/submit', null, {
                params: {
                    id: this.evaluateId,
                    clothingEvaluate: this.clothingEvaluate,
                    interestEvaluate: this.interestEvaluate,
                    lessonEvaluate: this.lessonEvaluate,
                    comment: this.comment
                }
            }).then((response) => {
                this.isSubmiting = false;
                this.showToast('已提交评论！', 'success');
                setTimeout(() => {
                    location.href = 'index.html';
                }, 1000);
            }, (response) => {
                this.isSubmiting = false;
                this.showToast(response.statusText, 'warn');
            });
        }
    },
    created() {
        // 查询是否未评论
        this.$http.get('/api/selin/v3/student/evaluate/teacher/list', {
            params: {
                status: 1,
                courseId: this.courseId
            }
        }).then((response) => {
            const evaluateTime = response.data && response.data.evaluateTime;
            const evaluateId = response.data && response.data.id;
            // evaluateTime为false表示没有评论
            if (!evaluateTime && evaluateId) {
                // 评论组建显示
                this.evaluateId = response.data.id;
                // isEvaluate为0表示不可以评价，1为可以评价
                // buttonMessage表示不可评价时的按钮文字说明
                this.isEvaluate = response.data.isEvaluate;
                if (this.isEvaluate) {
                    this.buttonMessage = this.isSubmiting ? '正在提交' : '匿名评论';
                } else {
                    this.buttonMessage = response.data.buttonMessage;
                }
            }
        }, (response) => {
            this.showToast(response.statusText, 'warn');
        });
    }
};


new Vue({
    mixins: [mixin],
    data: {
        courseId: urlParameter.id,
        info: null,
        evaluateTime: '',
        detail: null
    },
    components: {
        'ui-comment': Comment,
        'ui-five-star': FiveStar
    },
    methods: {
        courseInfor() {
            this.$http.get('/api/selin/v3/student/course/getdetail', {
                params: {
                    courseId: this.courseId
                }
            }).then((response) => {
                this.info = response.data;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        isEvaluate() {
            this.$http.get('/api/selin/v3/student/evaluate/teacher/list', {       
                params: {
                    status: 2,
                    courseId: this.courseId
                }
            }).then((response) => {
                const evaluateId = response.data && response.data.id;
                // 有evaluateId表示已经评论过，直接到评论详情页
                if (evaluateId) {
                    this.evaluateTime = response.data.evaluateTime;
                    this.getDetail(evaluateId);
                }
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        getDetail(evaluateId) {
            this.$http.get('/api/selin/v3/student/evaluate/detail', {
                params: {
                    id: evaluateId
                }
            }).then((response) => {
                this.detail = response.data;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        }
    },
    created() {
        // 课程详情
        this.courseInfor();
        // 查询是否已评论
        this.isEvaluate();
    }
});

