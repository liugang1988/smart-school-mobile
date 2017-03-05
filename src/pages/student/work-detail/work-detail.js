import Vue from 'vue';
import sdk from 'rjy-jssdk';
import device from 'utils/device.js';
import share from 'utils/share.js';
import mixin from 'utils/mixin.js';
import getPar from 'utils/getUrlParameter.js';
// 获取作品id
const outcomeIdRank = getPar('outcomeId_rank').outcomeId_rank;

new Vue({
    mixins: [mixin],
    data: {
        typeStatus: false, // 类型状态
        infor: {}, // 信息
        btnText: '', // 投票按钮文字
        isFlag: '', // 是否投票
        zan: '', // 赞数
        outcomeId: '',
        rank: '',
        intro: '',
        playAmount: '',
        videoUrl: __uri('video.html'),
        shareBtnStutas: true,
        playStatus: true, // 隐藏播放按钮
        videoStatus: false, // 当在app时，为false，表示用原生播放，否则用H5播放
        shareUrl: __uri('logo1.png')
    },
    methods: {
        /**
         * 获取信息
         */
        getInfor() {
            this.$http.get('/api/selin/v3/student/outcome/detail', {
                params: {
                    outcomeId: this.outcomeId
                }
            }).then(function(response) {
                const data = response.data;
                this.typeStatus = data.outcomeType === 1; // 类型状态，true为视频，false为图片
                this.infor = data;
                this.isFlag = data.isFlag;
                this.zan = data.zan;
                this.btnText = this.isFlag ? '已投票' : '投票'; // 按钮状态
                this.intro = data.intro.replace(/[\n\r]+/g, '<br>');
                this.playAmount = data.playAmount;
                this.___share.update({
                    link: window.location.href,
                    title: data.name,
                    desc: this.intro,
                    imgUrl: data.coverImg,
                    success: function(bl) {
                        if (bl) {
                            this.showToast('分享成功！', 'success');
                        } else {
                            this.showToast('分享失败!', 'warn');
                        }
                    }
                });
            }, function(response) {
                this.showToast(response.statusText, 'warn');
            });
        },
        //  视频播放
        videoPlay() {
            if (device.isRUNEDU) {
                sdk.switchApp(5, {
                    url: this.infor.outcomeUrl
                });
            } else {
                this.playStatus = false;
                const Media = document.getElementById('video');
                Media.play();
            }


            this.$http.post('/api/selin/v3/student/outcome/play', {
                outcomeId: this.outcomeId
            }).then(function(response) {

            }, function(response) {
                this.showToast(response.statusText, 'warn');
            });
        },
        // 投票
        votes() {
            if (!this.isFlag) {
                this.$http.post('/api/selin/v3/student/outcome/zan', {
                    outcomeId: this.outcomeId
                }).then(function(response) {
                    this.showToast('投票成功！', 'success');
                    this.btnText = '已投票';
                    this.isFlag = 1;
                    this.zan = parseInt(this.zan, 10) + 1;
                }, function(response) {
                    this.showToast(response.statusText, 'warn');
                });
            } else {
                this.showToast('您今天已经赞了，请明天再来!', 'warn');
            }
        },
        // 分享
        shareBtn() {
            this.___share.emit();
        }
    },
    created() {
        if (!device.isRUNEDU) {
            this.shareBtnStutas = false;
            this.videoStatus = true;
        }
        const args = outcomeIdRank.split('-');
        this.outcomeId = args[0];
        this.rank = args[1];
        this.getInfor();

        // 分享初始化
        this.___share = share({
            link: window.location.href,
            title: '分享标题',
            desc: '分享图片',
            imgUrl: location.protocol + this.shareUrl,
            success(bl) {
                if (bl) {
                    this.showToast('分享成功！', 'success');
                } else {
                    this.showToast('分享失败!', 'warn');
                }
            }
        });
    }
});
