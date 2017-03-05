/**
 * 多选
 */
export default {
    template: __inline('checkbox.tpl'),
    props: {
        model: {
            default: false
        },
        value: {
            default: true
        }
    },
    computed: {
        checked() {
            if (Object.prototype.toString.call(this.model) === '[object Array]') {
                for (var i = 0, l = this.model.length; i < l; i++) {
                    if (this.model[i] === this.value) {
                        return true;
                    }
                }
                return false;
            } else {
                return this.model === this.value;
            }
        }
    }
};

