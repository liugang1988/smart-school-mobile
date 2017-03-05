<label class='u-radio' :class='{"z-checked": label === model}'>
    <i class="icon-right"></i>
    <input type="radio" v-model='model' :value="label">
    <slot></slot>
</label>