/**
 * 按钮
 */
export default {
    template: __inline('choose-type.tpl'),
    props: {
        show: { // 组件显示\隐藏 状态
            default: false
        },
        type: { // 选择类型 0代表 迟到早退  1 代表 优秀良好 2代表 自定义
            default: 1
        },
        graded: { // 默认选中
            default: 0
        },
        selectList: Array, // 自定义数组
        selectArr: Array // 选中的最终的返回数组
    },
    data() {
        return {
            selectContent: [
                ['正常', '迟到', '事假', '病假', '早退', '旷课'],
                ['优秀 (4分)', '良好 (3分)', '合格 (2分)', '不合格 (1分)']
            ]
        };
    },
    methods: {
        selected(index) {
            // 反馈给 之前的页面
            this.$emit('selected', index, this.selectContent[this.type][index]);
        }
    },
    created() {
        if (this.type === 2) {
            this.selectContent.push(this.selectList);
        }
    }
};

