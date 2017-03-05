<div class="m-toast" v-if="show">
    <ui-icon :name="iconName" v-if="iconName"></ui-icon>
    <div class="m-toast__text" v-html="text"></div>
</div>