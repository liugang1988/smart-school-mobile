<div class="m-list-wrap">
    <slot></slot>
    <div class="m-list-wrap__loading" v-if='isLoading'>
        <i class="icon-loading"></i>
        <span v-html="loadingMessage"></span>
    </div>
    <div class="m-list-wrap__more" v-if='!isLoading && !isLastPage' @click='loadMore'>
        {{moreMessage}}
    </div>
</div>