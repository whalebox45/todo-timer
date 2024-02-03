<script>
import { reactive, onMounted } from 'vue';
import { Modal } from 'bootstrap';

import TaskCard from './components/TaskCard.vue';
import AddTaskModal from './components/AddTaskModal.vue';
import SettingModal from './components/SettingModal.vue';
import EditTaskModal from './components/EditTaskModal.vue';

class Timer {
  constructor(taskTitle, refreshTime, isPeriodical, isChecked) {
    this.taskTitle = taskTitle;
    this.refreshTime = refreshTime;
    this.isPeriodical = isPeriodical;
    this.isChecked = isChecked;
    this.id = crypto.randomUUID();
  }
  static createTask(taskTitle, refreshTime, isPeriodical, isChecked) {
    return new Timer(taskTitle, refreshTime, isPeriodical, false);
  }
}

export default {
  setup() {


    const timerDataArray = reactive([]);
    const editTaskData = reactive({});

    // Load data from localStorage if it exists
    const storedData = localStorage.getItem('TimerDataArrayStorage');

    

    if (storedData !== null) {
      // Parse the stored data and push it to the timerDataArray
      const storedTasks = JSON.parse(storedData);
      storedTasks.forEach(task => {
        // console.log(task)
        timerDataArray.push(new Timer(task.taskTitle, task.refreshTime, task.isPeriodical, task.isChecked));
      });
    } else {
      // If localStorage is empty, add default tasks
      timerDataArray.push(Timer.createTask('Task 1', 0, false, true));
      timerDataArray.push(Timer.createTask('Task 2', 43200, true, false));

      // Save the default tasks to localStorage
      localStorage.setItem('TimerDataArrayStorage', JSON.stringify(timerDataArray));
    }

    // debugger;
    return { timerDataArray, Timer, editTaskData };
  },
  mounted() {
  },
  components: {
    TaskCard, AddTaskModal, EditTaskModal, SettingModal
  },
  data() {
    return {
      showEditModal: false,
    };
  },
  methods: {
    openModal() {
      const AddTaskModal = document.getElementById('AddTaskModal');
      const modal = Modal.getOrCreateInstance(AddTaskModal);
      modal.show()
    },
    openSettingModal() {
      const settingModal = document.getElementById('settingModal');
      const modal = Modal.getOrCreateInstance(settingModal);
      modal.show();
    },
    handleCheckboxChange({ id, isChecked }) {
      console.log(1);
      const index = this.timerDataArray.findIndex((timer) => timer.id === id);
      if (index !== -1) {
        // this.$set(this.timerDataArray, index, { ...this.timerDataArray[index], isChecked });
        this.timerDataArray[index].isChecked = isChecked;
        localStorage.setItem('TimerDataArrayStorage', JSON.stringify(this.timerDataArray));
      }
    },
    openEditModal(taskData) {
      this.editTaskData = taskData;
      this.showEditModal = true;
    },
    resetEditModal() { this.showEditModal = false; },
    updateTimerById(id, newData) {
      const index = this.timerDataArray.findIndex(timer => timer.id === id);
      if (index !== -1) {
        this.timerDataArray[index] = { ...this.timerDataArray[index], ...newData };
      }
    },
    deleteTimerById(id) {
      console.log(id);
      const index = this.timerDataArray.findIndex(timer => timer.id === id);
      if (index !== -1) this.timerDataArray.splice(index, 1);
    },

  }
}
</script>






<template>
  <div>
    <div style="height:4.5rem"></div>
    <div class="mx-3 maincontrol">
      <div class="control-left">
        <a class="bi bi-sort-down" id="sortbtn"></a>
      </div>
      <div class="control-right">
        <a class="bi bi-gear-fill" @click="openSettingModal"></a>

      </div>
    </div>

    <div class="row gy-1 gx-1 mx-3">
      <TaskCard v-for="t in timerDataArray" v-bind:key="t.id" :id="t.id" :taskTitle="t.taskTitle" :isChecked="t.isChecked"
        :refreshTime="t.refreshTime" :isPeriodical="t.isPeriodical" @edit-task="openEditModal"
        @checkbox-change="handleCheckboxChange" />
    </div>


    <div style="height:9rem"></div>
  </div>
  <div class="floatbutton" @click="openModal">
    <a class="bi bi-plus" id="plusicon"></a>
  </div>

  <AddTaskModal />
  <EditTaskModal :show="showEditModal" @modal-hidden="resetEditModal" :editTaskData="editTaskData" />
  <SettingModal />
</template>






<style scoped lang="scss">
.maincontrol {
  display: flex;
  justify-content: space-between;

  * {
    font-size: 36px;
  }

  a {
    color: #171717;
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

  #plusicon {
    font-size: 48px;
    text-align: center;
    vertical-align: middle;
    color: #bffce6;
  }

}
</style>
