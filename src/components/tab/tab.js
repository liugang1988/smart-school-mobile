/**
 * tab切换
 */
export default {
    template: __inline('tab.tpl'),
    props: {
        skin: {
            default: ''
        },
        selectedId: {
            default: undefined
        },
        items: {
            default: []
        },
        selected: {
            default: 0
        }
    },
    methods: {
        select(index, id) {
            this.$emit('select', index, id);
        },
        getClass(item, index) {
            if (this.selectedId !== undefined) {
                return item.id === this.selectedId;
            } else {
                return index === this.selected;
            }
        }
    }
};

