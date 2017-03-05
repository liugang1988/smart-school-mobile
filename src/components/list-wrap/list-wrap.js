/**
 * 通用列表组件包装模块
 */
export default {
    template: __inline('list-wrap.tpl'),
    props: {
        isLoading: {
            default: true
        },
        isLastPage: {
            default: true
        },
        loadingMessage: {
            type: String,
            default: '正在加载...'
        },
        moreMessage: {
            type: String,
            default: '点击加载更多'
        }
    },
    methods: {
        loadMore() {
            this.$emit('load-more');
        }
    }
};

