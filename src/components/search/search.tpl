<div class="search-hd">
    <a class="search-btn" @click="searchKey">搜索</a>
    <div class="m-search" >
        <i class="icon-search"></i>
        <input class="m-search__input" type="search" :placeholder="placeholder" v-model="model" >
        <!-- 用户输入后的删除按钮 -->
        <i class="icon-close" v-show="value" @click="clear"></i>
    </div>
</div>
