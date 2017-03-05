import Vue from 'vue';
import mixin from 'utils/mixin.js';
import Tab from 'components/tab/tab.js';

new Vue({
    mixins: [mixin],
    data: {
        types: [],
        selectedType: 0,
        courseList: [],
        isLoading: true
    },
    components: {
        'ui-tab': Tab
    },
    methods: {
        /**
         * 切换分类
         */
        selectType(index) {
            const type = this.types[index];
            if (type) {
                this.selectedType = index;
                this.isLoading = true;
                this.$http.get('/api/selin/v3/student/course/getlist', {
                    params: {
                        typeId: type.id
                    }
                }).then((response) => {
                    this.courseList = response.data.data;
                    this.isLoading = false;
                }, (response) => {
                    this.showToast(response.statusText, 'warn');
                    this.isLoading = false;
                });
            }
        }
    },
    created() {
        this.$http.get('/api/selin/v3/student/course/gettype', {
            autoLogin: true
        }).then((response) => {
            const data = response.data;
            if (data) {
                data.data.unshift({
                    id: '',
                    name: '全部'
                });
                this.types = data.data;
                this.selectType(this.selectedType);
            } else {
                this.showToast('没有找到任何分类', 'warn');
            }
        }, (response) => {
            this.showToast(response.statusText, 'warn');
        });
    }
});
