/**
 * 单选
 */
export default {
    template: __inline('radio.tpl'),
    props: {
        value: [String, Number],
        label: {
            type: [String, Number],
            required: true
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
    }
};

