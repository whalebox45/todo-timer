<template>
    <div class="col-lg-6">
        <div class="card bg-transparent taskcard rounded-3">
            <div class="taskcheck">
                <input type="checkbox" />
                <div>
                    <p class="bi bi-square"></p>
                    <p class="bi bi-check-square-fill"></p>
                </div>
            </div>

            <div class="tasktexts">
                <h1>{{ taskname }}</h1>
                <h2 v-if="isPeriodical">{{ formattedTime }}</h2>
                <!-- <h2 v-else>else</h2> -->
            </div>
            <div class="taskcontrol">
                <a class="bi bi-pencil-square" aria-label="Edit Task"></a>
            </div>
        </div>
    </div>
</template>

<script>
var a = 1;
export default {
    props: {
        taskname: String,
        isChecked: Boolean,
        refreshTime: Number,
        isPeriodical: Boolean
    },
    data() {
        return {
            elapsedTime: 0,
            timerInterval: null,
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
                this.elapsedTime = ( diff < 0 ) ? diff+86400: diff;
            }, 1000); 
        },
        stopTimer() {
            clearInterval(this.timerInterval);
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
    },
    beforeDestroy() {
        this.stopTimer();
    },
}
</script>
<style scoped lang="scss">
.taskcard {
    height: 108px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 0 0 10px;
}

.taskcheck {
    display: grid;

    * {
        height: 64px;
        width: 64px;
        grid-area: 1/2/1/2;
        line-height: 0;
    }

    input[type=checkbox] {
        // visibility: hidden;
        z-index: 2;
        opacity: 0%;

        +div .bi-check-square-fill {
            display: none;
        }
    }
    input[type=checkbox]:checked {
        +div .bi-square {
            display: none;
        }

        +div .bi-check-square-fill {
            display: unset;
        }
    }

    p {
        font-size: 64px;
        line-height: 0;
    }

}

.tasktexts {
    padding-left: 6px;
    overflow: hidden;
    width: 100%;

    * {
        margin: 0 0 0 0;
        line-height: 1em;

    }

    h1 {
        font-size: 56px;
        white-space: nowrap;
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
    }
}
</style>