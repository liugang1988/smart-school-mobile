/*
 *  搜索组件
 *  作者: 刘刚
 *  placeholder: 占位符信息
 *  searchStr： 搜索关键字
 *  isLocation： 跳转地址，如果有就调整搜索，没有就本页搜索
 *   _searchKey: 搜索
 *   _clear： 清除
 *   _toLocation： 是否跳转搜索
 */

export default {
    template: __inline('search.tpl'),
    props: {
        placeholder: {
            type: String,
            default: ''
        },
        value: {
            type: [String, Number]
        },
        isLocation: {
            type: String,
            default: ''
        },
        keyValue: String
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(newValue) {
                this.$emit('input', newValue);
            }
        }
    },
    methods: {
        searchKey() {
            if (!this.value) {
                return;
            };
            this.$emit('search', this.value);
            this.toLocation();
        },
        clear() {
            this.$emit('input', '');
        },
        toLocation() {
            if (this.isLocation) {
                this.isLocation = this.isLocation.indexOf('?') === -1 ? this.isLocation + '?' : this.isLocation + '&' + 'searchStr=';
                window.location.href = this.isLocation + this.value;
            } else {
                document.body.click();
            }
        }
    }
};

