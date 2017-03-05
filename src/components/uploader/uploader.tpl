<label class="m-img-upload" :class="{'z-loading':isUploading}" @click="uploadByApp">
    <input type="file" :value='file' @change='change' ref="input" v-if="!isAndroidRunApp">
</label>