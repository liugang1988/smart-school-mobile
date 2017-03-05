import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Search from 'components/search/search.js';
import listWrap from 'components/list-wrap/list-wrap.js';
import getUrlParameter from 'utils/getUrlParameter';
const id = getUrlParameter().outcomeShowId;
const searchStr = getUrlParameter().searchStr;

new Vue({
    mixins: [mixin],
    data: {
        outcomeShowId: '',
        list: [], // 列表
        searchInfo: '编号、表演者、节目', // 默认搜索框值
        keyValue: '', // 搜索框的值
        itemUrl: __uri('work-detail.html'), // 列表项地址

        isLoading: true,
        cursor: null,
        pageNo: 1,
        pageSize: 5,
        isLastPage: true // 是否是最后一页
    },
    components: {
        'ui-search': Search,
        'ui-list': listWrap
    },
    methods: {
        /**
         * 搜索
         */
        searchList(value) {
            this.$http.get('/api/selin/v3/student/outcome/list', {
                params: {
                    typeId: '',
                    queryWords: value,
                    outcomeShowId: this.outcomeShowId,
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
            this.searchList(this.selectedType, this.id);
        },
        search(value) {
            this.list = [];
            this.pageNo = 1;
            // 重置hash值
            location.search = '?outcomeShowId=' + id + '&searchStr=' + value;
            this.searchList(value);
        }
    },
    created() {
        this.outcomeShowId = id;
        this.keyValue = searchStr;
        this.searchList(this.keyValue);
    }
});

