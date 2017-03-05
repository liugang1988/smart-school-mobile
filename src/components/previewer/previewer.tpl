<!-- 点击查看大图 -->
<div class="m-show-img" v-if="url" @click="url=''">
    <div class="m-show-img__inner">
        <div class="img-con">
            <div class="img-item">
                <img :src="url">
            </div>
        </div>
    </div>
</div>