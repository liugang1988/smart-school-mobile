<div>
    <div :class="{'m-banner__auto': !isShowDots , 'm-banner': isShowDots}" 
    :style="{height: isHeight + 'px'}" 
    @touchstart.stop='onStart($event)'>
    <div class="m-banner__bd" ref="el" :style='boxStyle'>
        <a v-for='(item, index) in items' class="m-banner__item" :href="item.url" :style='curStyles[index - oldactive + 1]||{}'>
            <img :src="item.imgUrl" @touchstart="tapStart($event)" @touchmove="tapMove" @touchend="tapEnd">
        </a>
    </div>

    <div v-if='isShowDots' class="m-banner__mask"></div>

    <div class="m-banner__dots" v-if='items.length > 1 && isShowDots'>
        <i class='m-banner__dot' v-for='(item, index) in items' :class='index==active?"z-on":""' @click='change(index)'></i>
    </div>
    <!-- 已看人数 -->
    <div class="m-banner__number" v-if='lookNumber'><i class="icon-see"></i>{{lookNumber}}</div>
</div>

<ui-toast :show="toast.show" :text='toast.text' :type='toast.type' @on-hide="hideToast"></ui-toast>
<ui-dialog :show="dialog.show" confirm-text='确定' cancel-text='取消' :title="dialog.title" :type="dialog.type" @on-confirm="dialogOnHide" @on-cancel="dialogOnCancel"></ui-dialog>
</div>
