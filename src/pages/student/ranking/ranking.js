import Vue from 'vue';
import mixin from 'utils/mixin.js';
import listWrap from 'components/list-wrap/list-wrap.js';
import getPar from 'utils/getUrlParameter.js';
// 获取社区展id
const outcomeShowId = getPar('outcomeShowId').outcomeShowId;

new Vue({
    mixins: [mixin],
    data: {
        types: [{
            outcomeType: 1,
            name: '视频',
            option: {
                cursor: null,
                pageNo: 1,
                pageSize: 10,
                isLastPage: true, // 是否是最后一页
                loadM: true // 加载状态
            },
            data: [] // 类型数据
        }, {
            outcomeType: 2,
            name: '图片',
            option: {
                cursor: null,
                pageNo: 1,
                pageSize: 10,
                isLastPage: true, // 是否是最后一页
                loadM: true
            },
            data: []
        }],
        selectedType: 0, // 当前类型索引
        tabActive: true, // 选中状态
        vPlay: true, // 视频播放按钮

        detailUrl: __uri('work-detail.html'), // 列表跳转地址
        isLoading: true
    },
    components: {
        'ui-list': listWrap
    },
    methods: {
        /**
         * 切换分类
         */
        selectType(index) {
            this.selectedType = index;
            if (index === 0) {
                this.vPlay = true;
                this.tabActive = true;
            } else {
                this.vPlay = false;
                this.tabActive = false;
            };
            if (this.types[index].option.loadM) { // 防止重复加载
                this.loadList(index);
            }
        },
        // 列表请求
        loadList(index) {
            this.isLoading = true;
            this.$http.get('/api/selin/v3/student/outcome/ranklist', {
                params: {
                    outcomeType: this.types[index].outcomeType,
                    outcomeShowId: outcomeShowId,
                    cursor: this.types[index].option.cursor,
                    pageNo: this.types[index].option.pageNo,
                    pageSize: this.types[index].option.pageSize
                }
            }).then((response) => {
                const data = response.data;
                this.types[index].option.cursor = data.cursor;
                this.types[index].option.isLastPage = this.types[index].option.pageNo >= data.pageTotal;
                this.types[index].data = this.types[index].data.concat(data.data);
                this.types[index].option.loadM = false;
                this.isLoading = false;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
                this.isLoading = false;
            });
        },
        // 加载更多
        loadMore(index) {
            this.types[index].option.loadM = true;
            this.types[index].option.pageNo++;
            this.selectType(index);
        }
    },
    created() {
        this.selectType(this.selectedType);
    }
});
