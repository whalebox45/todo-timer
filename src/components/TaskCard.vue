<template>
    <div class="col-lg-6">
        <div class="card taskcard rounded-3">
            <div class="taskcheck">
                <input type="checkbox" @change="handleCheckboxChange"/>
                <div>
                    <p class="bi bi-check-square-fill" v-if="this.isChecked"></p>
                    <p class="bi bi-square" v-else></p>
                </div>
            </div>

            <div class="tasktexts w-100">
                <h1>{{ taskTitle }}</h1>
                <h2 v-if="isPeriodical">{{ formattedTime }}</h2>
            </div>
            <div class="taskcontrol">
                <a class="bi bi-pencil-square" aria-label="Edit Task" @click="editTask"></a>
            </div>
        </div>
        <div style="height: 3px; width:100%"></div>
    </div>
</template>

<script>
export default {
    props: {
        id: String,
        taskTitle: String,
        isChecked: Boolean,
        refreshTime: Number,
        isPeriodical: Boolean
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
            const hours = Math.floor(this.elapsedTime / 3600);
            const minutes = Math.floor((this.elapsedTime % 3600) / 60);
            const seconds = this.elapsedTime % 60;
            return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
        },
    },
    methods: {
        pad(value) {
            return value.toString().padStart(2, '0');
        },
        startTimer() {
            this.timerInterval = setInterval(() => {
                const dt = new Date();
                const secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
                const diff = this.refreshTime - secs
                this.elapsedTime = (diff < 0) ? diff + 86400 : diff;

                if(this.elapsedTime < 1 && this.isPeriodical) {
                    this.localIsChecked = false;
                    this.$emit('checkbox-change',{ id: this.id, isChecked: false });
                }
            }, 1000);
        },
        stopTimer() {
            clearInterval(this.timerInterval);
        },
        editTask() {
            // console.log('edit-task')
            this.$emit('edit-task', {
                id: this.id,
                taskTitle: this.taskTitle,
                refreshTime: this.refreshTime,
                isPeriodical: this.isPeriodical
            });
        },
        handleCheckboxChange() {
            this.localIsChecked = !this.localIsChecked;
            // alert(`Checkbox is now ${this.localIsChecked ? 'checked' : 'unchecked'}`);
            this.$emit('checkbox-change', { id: this.id, isChecked: this.localIsChecked });
            if (!this.localIsChecked && this.elapsedTime <= 0) {
                this.elapsedTime = this.refreshTime;
                this.startTimer();
            }
        },
    },
    watch: {
        refreshTime(newVal) {
            this.stopTimer();
            this.elapsedTime = 0;
            this.startTimer();
        },
    },
    created() {
        this.startTimer();
        console.log(this)
    },
    beforeDestroy() {
        this.stopTimer();
    },
}
</script>
<style scoped lang="scss">
$cardcolor:  #333333;
$frontcolor: darkorange;
.taskcard {
    height: 108px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 0 0 15px;
    background-color: $cardcolor;
    filter:drop-shadow(6px 6px 0px #00000088)
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
    padding-left:9px;
    overflow: hidden;
    color: $frontcolor;
    * {
        margin: 0 0 0 0;
        line-height: 1em;
    }

    h1 {
        font-size: 56px;
        white-space: nowrap;
        font-weight: bold;
    }

    h2 {
        font-size: 36px;
        margin: 0 0 0 0;
    }
}

.taskcontrol {
    margin-right: 20px;

    a {
        font-size: 36px;
        text-align: right;
        color: $frontcolor;
        // color: #171717;  
    }
}
</style>