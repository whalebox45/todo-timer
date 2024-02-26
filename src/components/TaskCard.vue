<template>
    <div class="col-lg-6">
        <div class="card taskcard rounded-3">
            <div class="taskcheck">
                <input type="checkbox" @change="handleCheckboxChange" />
                <div>
                    <p class="bi bi-check-square-fill" v-if="this.isChecked"></p>
                    <p class="bi bi-square" v-else></p>
                </div>
            </div>

            <div class="tasktexts w-100">
                <h1>{{ taskTitle }}</h1>
                <h2 v-if="isTimer">{{ formattedTime }}</h2>
            </div>
            <div class="taskcontrol">
                <a class="bi bi-pencil-square" aria-label="Edit Task" @click="editTask"></a>
                <!-- <p>{{ periodType }}</p> -->

                <div class="tasktypeicon">
                    <p class="bi bi-fire" v-if="!isTimer"></p>
                    <p class="bi bi-hourglass" v-if="isTimer && periodType == 0"></p>
                    <p class="bi bi-sun" v-if="isTimer && periodType == 10"></p>
                    <p class="bi bi-calendar3-week" v-if="isTimer && periodType == 20"></p>
                    <p class="bi bi-calendar3" v-if="isTimer && periodType == 30"></p>


                </div>
            </div>
        </div>
        <div style="height: 3px; width:100%"></div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(duration);
dayjs.extend(weekday);
export default {
    props: {
        id: String,
        taskTitle: String,
        isChecked: Boolean,
        setTodoTime: Object,
        isTimer: Boolean,
        periodType: Number
    },
    data() {
        return {
            elapsedTime: 0,
            timerInterval: null,
            localIsChecked: this.isChecked,
        }
    },
    computed: {
        formattedTime() {
            // console.log(this.elapsedTime)

            const duration = dayjs.duration(this.elapsedTime);
            const days = Math.floor(duration.asDays());
            const hours = duration.hours();
            const minutes = duration.minutes();
            let seconds = duration.seconds();

            const ms = duration.milliseconds();
            // console.log(hours, minutes, seconds, ms)
            if (ms >= 500) seconds += 1;

            if (this.periodType !== 10) {
                return `${days}天 ${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
            } else {
                return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
            }

            // return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
        },
    },
    methods: {
        pad(value) {
            return value.toString().padStart(2, '0');
        },
        startTimer() {
            this.timerInterval = setInterval(() => {
                const dt = dayjs(this.setTodoTime)

                const now = dayjs();


                if (this.periodType === this.$root.PERIOD_TYPES.daily) {
                    const todayHHMMSS = dayjs().hour(dt.hour()).minute(dt.minute()).second(dt.second());

                    if (todayHHMMSS.isAfter(now)) {
                        this.elapsedTime = todayHHMMSS.diff(now)
                    } else {
                        this.elapsedTime = todayHHMMSS.add(1, 'day').diff(now)
                    }
                } else if (this.periodType === this.$root.PERIOD_TYPES.weekly) {
                    const thisWeekdayHHMMSS = dayjs().weekday(dt.weekday()).hour(dt.hour()).minute(dt.minute()).second(dt.second());

                    if (dt.isAfter(now)) {
                        this.elapsedTime = dt.diff(now)
                    } else {
                        this.elapsedTime = thisWeekdayHHMMSS.add(7, 'day').diff(now);
                    }
                } else if (this.periodType === this.$root.PERIOD_TYPES.monthly) {
                    const daysInMonth = dt.daysInMonth();
                    const dayOfMonth = Math.min(dt.date(), daysInMonth);

                    const thisMonthDayHHMMSS = dayjs().date(dayOfMonth).hour(dt.hour()).minute(dt.minute()).second(dt.second());

                    if (thisMonthDayHHMMSS.isAfter(now)) {
                        this.elapsedTime = thisMonthDayHHMMSS.diff(now);
                    } else {
                        this.elapsedTime = thisMonthDayHHMMSS.add(1, 'month').diff(now);
                    }
                } else {
                    if (todayHHMMSS.isAfter(now)) {
                        this.elapsedTime = todayHHMMSS.diff(now)
                    } else {
                        this.elapsedTime = 0;
                    }
                }

            }, 250);
        },
        stopTimer() {
            clearInterval(this.timerInterval);
        },
        editTask() {
            // console.log('edit-task')
            this.$emit('edit-task', {
                id: this.id,
                taskTitle: this.taskTitle,
                setTodoTime: this.setTodoTime,
                isTimer: this.isTimer,
                periodType: this.periodType
            });
        },
        handleCheckboxChange() {
            this.localIsChecked = !this.localIsChecked;
            // alert(`Checkbox is now ${this.localIsChecked ? 'checked' : 'unchecked'}`);
            this.$emit('checkbox-change', { id: this.id, isChecked: this.localIsChecked });
            if (!this.localIsChecked && this.elapsedTime <= 0) {
                this.elapsedTime = this.setTodoTime;
                this.startTimer();
            }
        },
    },
    watch: {
        setTodoTime(newVal) {
            this.stopTimer();
            this.elapsedTime = 0;
            this.startTimer();
        },
    },
    created() {
        this.startTimer();
        // console.log(this)
    },
    beforeDestroy() {
        this.stopTimer();
    },
}
</script>
<style scoped lang="scss">
$cardcolor: #333333;
$frontcolor: darkorange;

.taskcard {
    height: 108px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 0 0 15px;
    background-color: $cardcolor;
    filter: drop-shadow(6px 6px 0px #00000088)
}

.taskcheck {
    display: grid;
    color: $frontcolor;

    * {
        height: 64px;
        width: 64px;
        grid-area: 1/2/1/2;
        line-height: 0;
    }

    input[type=checkbox] {
        z-index: 2;
        opacity: 0%;
    }


    p {
        font-size: 64px;
        line-height: 0;
    }

}

.tasktexts {
    padding-left: 9px;
    overflow: hidden;
    color: $frontcolor;

    * {
        margin: 0 0 0 0;
        line-height: 1em;
    }

    h1 {
        font-size: 56px;
        font-weight: bold;
    }

    h2 {
        font-size: 36px;
        margin: 0 0 0 0;
    }
}

.taskcontrol {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: right;

    a {
        font-size: 36px;
        margin: 20px 20px 0 0;
        color: $frontcolor;
    }

    .tasktypeicon p {
        margin: 0 10px 0 0 ;
        font-size: 18px;
        color: #888;
    }
}</style>