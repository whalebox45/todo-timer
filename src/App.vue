<script>
import { reactive, onMounted } from 'vue';
import {Modal} from 'bootstrap';
import TaskCard from './components/TaskCard.vue';
import TestModal from './components/TestModal.vue';


export default {
  setup() {
    class Timer {
      constructor(name, refreshTime, isPeriodical) {
        this.name = name;
        this.refreshTime = refreshTime;
        this.isPeriodical = isPeriodical;
        this.isChecked = false;
        this.id = crypto.randomUUID();
      }
    }

    const timerDataArray = reactive([]);

    // const showModal = reactive({
    //   value: false,
    //   open: () => {
    //     alert("fuck")
    //     showModal.value = true
    //   },
    //   close: () =>{ showModal.value = false },
    // })

    if (localStorage.getItem("TimerDataArrayStorage") == null) {
      timerDataArray.push(new Timer('Task 1', 0, true));
      localStorage.setItem("TimerDataArrayStorage", JSON.stringify(timerDataArray))
    }

    timerDataArray.push(new Timer('Task 2', 43200, true));
    timerDataArray.push(new Timer('Task 3', 6000, true));
    timerDataArray.push(new Timer('Task 4', 36000, true));
    timerDataArray.push(new Timer('Task 5', 72000, true));
    timerDataArray.push(new Timer('Task 6', 66660, true));
    timerDataArray.push(new Timer('Task 7', 85000, true));

    localStorage.setItem("TimerDataArrayStorage", JSON.stringify(timerDataArray));

    return { timerDataArray };
  },
  mounted(){
    (() => {
      let testModal = document.getElementById('testModal');
      let modal = Modal.getOrCreateInstance(testModal);
      modal.show();
    })();
  },
  components: {
    TaskCard, TestModal
  },
  methods:{
    openModal(){
      let testModal = document.getElementById('testModal');
      let modal = Modal.getOrCreateInstance(testModal);
      modal.show()
    }
  }
}

</script>

<template>
  <div>
    <div style="height:4.5rem"></div>
    <div class="mx-3 maincontrol">
      <div class="control-left">
        <a class="bi bi-sort-down" id="sortbtn" v-on:click="openModal"></a>
      </div>
      <div class="control-right">
        <a class="bi bi-gear-fill"></a>

      </div>
    </div>

    <div class="row gy-1 gx-1 mx-3">
      <!-- <TaskCard v-for="_ in Array(10)"  /> -->
      <TaskCard v-for="t in timerDataArray" v-bind:id="t.id" :taskname="t.name" :isChecked="t.isChecked"
        :refreshTime="t.refreshTime" />
    </div>
    <div style="height:96px"></div>
    <!-- <TestModal id="testm" /> -->
  </div>
  <div class="floatbutton" @click="openModal">
    <a class="bi bi-plus" id="plusicon"></a>
  </div>

  <TestModal />
</template>

<style scoped lang="scss">
.maincontrol {
  display: flex;
  justify-content: space-between;

  * {
    font-size: 36px;
  }
}

.floatbutton {
  z-index: 1;
  height: 72px;
  width: 72px;

  background-color: #4d2b25;

  border-color: transparent;

  border-radius: 100%;
  position: fixed;
  bottom: 48px;
  right: 48px;

  display: flex;
  align-items: center;
  justify-content: center;


  // box-shadow: 2px 2px 4px inset;

  #plusicon {
    font-size: 48px;
    text-align: center;
    vertical-align: middle;
    color: #bffce6;
  }

}
</style>
