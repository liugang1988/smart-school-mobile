<div class="m-header" :class='skin' v-if="show">
    <div class="m-header__left">
        <slot name="left"></slot>
    </div>
    <div class="m-header__title" v-text="title"></div>
    <div class="m-header__right">
        <slot name="right"></slot>
    </div>
</div>