<div class='m-dialog' @touchmove="!this.scroll && $event.preventDefault()" v-if="show">
    <div class="m-dialog__inner">
        <div class="m-dialog__hd">{{title}}</div>
        <div class="m-dialog__bd">{{content}}</div>
        <div class="m-dialog__ft">
            <button class="m-dialog__btn" @click="confirm">
                {{confirmText}}
            </button>
            <button class="m-dialog__btn" @click="cancel" v-if="type ==='confirm'">
                {{cancelText}}
            </button>
        </div>
    </div>
</div>