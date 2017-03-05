<div v-if="evaluateId">
    <div class="m-box comment">
        <div class="m-scores">
            <div class="m-scores__item">
                <span>着装礼仪：</span>
                <ui-five-star v-model="clothingEvaluate" :immutable="false"></ui-five-star>
            </div>
            <div class="m-scores__item">
                <span>课程内容：</span>
                <ui-five-star v-model="interestEvaluate" :immutable="false"></ui-five-star>
            </div>
            <div class="m-scores__item">
                <span>专业水平：</span>
                <ui-five-star v-model="lessonEvaluate" :immutable="false"></ui-five-star>
            </div>
        </div>
        <textarea class="u-textarea" placeholder="请输入评论内容..." v-model="comment"></textarea>
    </div>
    <div class="g-con-b">
        <button class="btn btn_big btn_block btn_primary" :class="{'z-disabled':!isEvaluate}" @click="submit" v-text="buttonMessage"></button>
        <p style="text-align:center;">一个课程只能评论一次哦！</p>
    </div>
</div>