<div class="inline-calendar" :class="_className">
    <div class="calendar-header" v-show="!hideHeader">
        <div class="calendar-year">
            <a class="year-prev vux-prev-icon"  @click="go(year - 1, month)"></a>
            <a class="calendar-year-txt calendar-title">{{year}}</a>
            <a class="year-next vux-next-icon"  @click="go(year + 1, month)"></a>
        </div>
        <div class="calendar-month">
            <a @click="prev" class="month-prev vux-prev-icon" href="javascript:"></a>
            <a class="calendar-month-txt calendar-title" href="javascript:">{{months[month]}}</a>
            <a @click="next" class="month-next vux-next-icon" href="javascript:"></a>
        </div>
    </div>
    <table>
        <thead v-show="!hideWeekList">
            <tr>
                <th v-for="(week, index) in weeksList" class="week" :class="'is-week-list-' + index">{{week}}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(day,k1) in days">
                <td :data-date="formatDate(year, month, child)" :data-current="value" v-for="(child,k2) in day" :class="buildClass(k2, child, formatDate(year, month, child) === value && !child.isLastMonth && !child.isNextMonth)" @click="select(k1,k2,$event)">
                    <span v-show="(!child.isLastMonth && !child.isNextMonth ) || (child.isLastMonth && showLastMonth) || (child.isNextMonth && showNextMonth)">{{replaceText(child.day, formatDate(year, month, child))}}</span> 
                </td>
            </tr>
        </tbody>
    </table>
</div>