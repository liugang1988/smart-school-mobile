<div class="m-five-star">
    <i v-for='(item, index) in 5' :class="(item-1) < value ? 'icon-collected' : 'icon-collect'" @click='change(index)'></i>
</div>