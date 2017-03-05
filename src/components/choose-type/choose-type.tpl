<div class="p-choose">
    <div class="choose-list" v-if="type ===2">
        <div class="choose-item" 
             v-for="(item,index) in selectContent[type]"
             :class="{'z-checked' : index === graded }"
             @click="selected(index)">
            <div class="content" >
                <span class='textspan fl'>
                    {{item.name}}
                </span>
                <span class='textspan fr'>{{item.className}}</span>
            </div>
            <i class="icon-right"></i>
        </div>        
    </div>

    <div class="choose-list" v-else>
        <div class="choose-item" 
             v-for="(item,index) in selectContent[type]"
             :class="{'z-checked' : index === graded }"
             @click="selected(index)">
            <div class="content" >
                    {{item}}
            </div>
            <i class="icon-right"></i>
        </div>        
    </div>
</div>