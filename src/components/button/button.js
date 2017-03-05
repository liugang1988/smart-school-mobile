/**
 * 按钮
 */
export default {
    template: __inline('button.tpl'),
    props: {
        exclass: String,
        type: String,
        size: String,
        block: String,
        width: String
    },
    computed: {
        className() {
            var cn = '';
            cn += this.size ? ' btn_' + this.size : '';
            cn += this.type ? ' btn_' + this.type : '';
            cn += this.block ? ' btn_block' : '';
            cn += this.exclass ? ' ' + this.exclass : '';
            return cn;
        },
        style() {
            return this.width ? 'width:' + this.width : '';
        }
    }
};

