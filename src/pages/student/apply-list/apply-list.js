import Vue from 'vue';
import mixin from 'utils/mixin.js';
import getUrlParameter from 'utils/getUrlParameter.js';
const courseId = getUrlParameter().id;

new Vue({
    mixins: [mixin],
    data: {
        info: null
    },
    methods: {
        getList() {
            this.$http.get('/api/selin/v3/student/change/apply/list', {
                params: {
                    courseId: courseId
                }
            }).then((response) => {
                this.info = response.data.data;
            }, (response) => {
                this.showToast(response.statusText, 'warn');
            });
        },
        getType(value) {
            switch (value) {
                case 1:
                    return '待审核';
                case 2:
                    return '通过';
                case 3:
                    return '不通过';
                default:
                    return '';
            }
        }
    },
    created() {
        this.getList();
    }
});

