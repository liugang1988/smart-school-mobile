<label class='u-checkbox' :class='{"z-checked":checked}'>
    <i class="icon-right"></i>
    <input type="checkbox" v-model='model' :value='value'>
    <slot></slot>
</label>