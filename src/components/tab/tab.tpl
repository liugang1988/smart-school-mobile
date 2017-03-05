<ul class="m-tab" :class="skin">
    <li class="m-tab__item" v-for="(item, index) in items" :class="{'z-active':getClass(item,index)}" @click="select(index,item.id)">
        <span v-if='item.schoolName'>{{item.schoolName}}</span>
        <span v-if='!item.schoolName'>{{item.name}}</span>
    </li>
</ul>