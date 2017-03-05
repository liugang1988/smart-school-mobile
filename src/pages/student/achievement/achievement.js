import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Tab from 'components/tab/tab.js';
import Search from 'components/search/search.js';
import showShareBtn from 'utils/share.js';
import listWrap from 'components/list-wrap/list-wrap.js';
import getPar from 'utils/getUrlParameter';
// 获取社区展id
const outcomeShowId = getPar('outcomeShowId').outcomeShowId;
new Vue({
    mixins: [mixin],
    data: {
        types: [], // 类型列表
        selectedType: 0, // 类型索引
        id: '', // 类型id
        list: [], // 列表
        searchInfo: '编号、表演者、节目', // 默认搜索框值
        url: __uri('index-search.html') + '?outcomeShowId=' + outcomeShowId, // 搜索跳转地址
        itemUrl: __uri('work-detail.html'), // 列表项地址
        rankUrl: __uri('ranking.html') + '?outcomeShowId=' + outcomeShowId, // 排行榜地址
        shareUrl: __uri('share.png'),

        searchKey: '',

        isLoading: true,
        cursor: null,
        pageNo: 1,
        pageSize: 5,
        isLastPage: true // 是否是最后一页
    },
    components: {
        'ui-tab': Tab,
        'ui-search': Search,
        'ui-list': listWrap
    },
    methods: {
        // 获取类型
        getType() {
            this.$http.get('/api/selin/v3/student/outcome/type', {
                params: {
                    outcomeShowId: outcomeShowId
                }
            }).then((response) => {
                const data = response.data;
                if (data) {
                    data.data.unshift({
                        id: '',
                        name: '全部'
                    });
                    this.types = data.data;
                    this.selectType(this.selectedType, '');
                } else {
                    this.showToast('没有找到任何分类', 'warn');
                }
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        // 切换分类
        selectType(index, id) {
            this.selectedType = index;
            this.id = id;
            if (id !== this.id) { // 重置数据，防止重复加载
                this.list = [];
                this.pageNo = 1;
            };
            if (this.isLoading) return;
            this.isLoading = true;
            this.$http.get('/api/selin/v3/student/outcome/list', {
                params: {
                    typeId: id,
                    queryWords: '',
                    outcomeShowId: outcomeShowId,
                    cursor: this.cursor,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                }
            }).then((response) => {
                const data = response.data;
                this.cursor = data.cursor;
                this.isLastPage = this.pageNo >= data.pageTotal;
                this.list = this.list.concat(data.data);
                this.isLoading = false;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.isLoading = false;
            });

        },
        loadMore() {
            this.pageNo++;
            this.selectType(this.selectedType, this.id);
        }
    },
    created() {
        this.getType();
        // 分享
        showShareBtn({
            link: window.location.href,
            title: '秀视频，晒靓照，就上社团成果展！',
            desc: '我在智慧校园社团移动平台发现一个秀才艺的视频，简直太精彩了！',
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

