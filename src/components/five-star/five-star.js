/**
 * 五星打分
 */
export default {
    template: __inline('five-star.tpl'),
    props: {
        // 分数
        value: {
            type: Number,
            default: 0
        },
        // 是否禁止修改
        immutable: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        model: {
            get: function() {
                return this.value
            },
            set: function(newValue) {
                this.$emit('input', newValue)
            }
        }
    },
    methods: {
        change(index) {
            if (!this.immutable) {
                this.$emit('input', index + 1);
            }
        }
    }
};

