/**
 *
 * 轮播图
 */
import sdk from 'rjy-jssdk';
import Toast from 'components/toast/toast';
import Dialog from 'components/dialog/dialog';

export default {
    template: __inline('banner.tpl'),
    props: {
        // 数据
        items: {
            type: Array,
            default: function() {
                return [];
            }
        },
        //  是否有观看 人数
        lookNumber: {
            default: 0
        },
        // 是否显示下方banner__dots
        isShowDots: {
            default: true
        },
        isHeight: {
            default: 0
        },
        // 当前页码
        active: {
            default: 0,
            // 转换成非负整数
            coerce: function(val) {
                val = parseInt(val);
                return val > 0 ? val : 0;
            }
        },
        // 最小移动距离
        baseDistance: {
            default: 100,
            // 大于100的数
            coerce: function(val) {
                val = parseFloat(val);
                return val > 100 ? val : 100;
            }
        },
        // 动画延时
        delay: {
            default: 300,
            // 大于100的数
            coerce: function(val) {
                val = parseFloat(val);
                return val > 300 ? val : 300;
            }
        },
        speed: {
            default: 5000
        }
    },

    data() {
        return {
            longTop: 0, // 长按定时器
            downImgUrl: '', // 需要下载的图片链接
            timer: null, // 自动播放的定时器
            coordinateX: 0,
            oldactive: 0,
            _isLast: true,
            _isFirst: true,
            activeIndex: 0,
            boxStyle: {
                'transition-duration': 0,
                'transform': 'translate(0, 0) translateZ(0)'
            },
            curStyles: [{
                'left': '-100%'
            }, {
                'left': 0
            }, {
                'left': '100%'
            }],
            toast: {
                show: false,
                text: '',
                type: 'text'
            },
            dialog: {
                show: false,
                title: '',
                content: '',
                onconfirm: null
            }
        };
    },
    components: {
        'ui-toast': Toast,
        'ui-dialog': Dialog
    },
    methods: {
        _setCss(distance, delay) {
            this.boxStyle = {
                'transition-duration': delay + 'ms',
                'transform': 'translate(' + distance + ', 0) translateZ(0)'
            };
        },
        _init() {
            if (!this.items || !this.items.length) return;
            this.activeIndex = this.active;
            const children = this.$refs.el.children;
            this.oldactive = this.activeIndex;
            this._isFirst = !children[this.activeIndex - 1];
            this._isLast = !children[this.activeIndex + 1];
            this._setCss(0, 0);
        },
        _page(distance) {
            const delay = this.delay;
            if (distance >= this.baseDistance && !this._isFirst) {
                this._setCss('100%', delay);
                this.activeIndex--;
                this.$emit('changes', this.activeIndex);
            } else if (distance <= -this.baseDistance && !this._isLast) {
                this._setCss('-100%', delay);
                this.activeIndex++;
                this.$emit('changes', this.activeIndex);
            } else {
                this._setCss(0, delay);
            }
        },
        change(index) {
            if (index > this.items.length - 1) {
                index = 0;
            }
            this.activeIndex = this.oldactive = index;
            this.$emit('changes', this.activeIndex);
        },
        onStart(e) {
            this.coordinateX = e.changedTouches[0].clientX;
            this._init();
            this.stopPlay();
            document.body.addEventListener('touchmove', this._onMove);
            document.body.addEventListener('touchend', this._onEnd);
        },
        autoPlay() {
            const that = this;
            if (this.activeIndex !== this.active) {
                this.timer = setTimeout(function() {
                    that.change(that.activeIndex + 1);
                    that.autoPlay();
                }, this.speed);
            }
        },
        stopPlay() {
            if (this.timer) {
                window.clearTimeout(this.timer);
                this.timer = null;
            }
        },
        tapStart(e) {
            this.downImgUrl = e.target.src;
            this.longTop = setTimeout(this.longPress, 500);
            return false;
        },
        tapEnd() {
            clearTimeout(this.longTop);
            return false;
        },
        tapMove() {
            clearTimeout(this.longTop);
            this.longTop = 0;
        },
        longPress() {
            this.longTop = 0;
            this.showDialog();
        },
        showDialog() {
            this.confirm('您确认需要保存图片吗?', null, function() {
                var that = this;
                sdk.downloadImg(this.downImgUrl, function(code) {
                    if (code === 1) {
                        that.showToast('保存成功', 'success');
                    } else {
                        that.showToast('保存未成功', 'warn');
                    }
                });
                this.hideDialog();
            });
        },
        /**
         * 显示消息框
         */
        showToast(text, type) {
            this.toast = {
                show: true,
                text: text,
                type: type
            };
        },
        /**
         * 隐藏消息框
         */
        hideToast() {
            this.toast.show = false;
        },
        /**
         * alert
         */
        alert(title, content, confirm) {
            this.dialog = {
                show: true,
                title: title,
                content: content,
                confirm: confirm
            };
        },
        /**
         * alert
         */
        confirm(title, content, confirm) {
            this.dialog = {
                show: true,
                type: 'confirm',
                title: title,
                content: content,
                confirm: confirm
            };
        },
        /**
         * 隐藏弹出框
         */
        hideDialog() {
            this.dialog.show = false;
        },
        /**
         * 按了确定（过时的）
         */
        dialogOnHide() {
            this.dialogOnConfirm();
        },
        /**
         * 按了确定
         */
        dialogOnConfirm() {
            if (typeof this.dialog.confirm === 'function') {
                this.dialog.confirm.call(this);
            } else {
                this.hideDialog();
            }
        },
        /**
         * 按了取消
         */
        dialogOnCancel() {
            if (typeof this.dialog.cancel === 'function') {
                this.dialog.cancel.call(this);
            } else {
                this.hideDialog();
            }
        }
    },
    created() {
        const that = this;
        this._onMove = (e) => {
            e.preventDefault(); // 解决 微信以及部分安卓浏览器无法点击的问题
            let distance = e.changedTouches[0].clientX - that.coordinateX;
            // 如果向两端翻页，增加阻力
            if ((!that._isFirst && distance > 0) || (!that._isLast && distance < 0)) {
                distance = distance / 2;
            }
            that._setCss(distance + 'px', 0);
        };

        this._onEnd = (e) => {
            that._page(e.changedTouches[0].clientX - that.coordinateX);
            that.autoPlay();

            document.body.removeEventListener('touchmove', that._onMove);
            document.body.removeEventListener('touchend', that._onEnd);
        };
        this.autoPlay();
    },
    mounted() {
        this._init();
    }
};

