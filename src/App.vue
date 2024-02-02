<script>
import { reactive, onMounted } from 'vue';
import { Modal } from 'bootstrap';

import TaskCard from './components/TaskCard.vue';
import AddTaskModal from './components/AddTaskModal.vue';
import SettingModal from './components/SettingModal.vue';
import EditTaskModal from './components/EditTaskModal.vue';

class Timer {
  constructor(name, refreshTime, isPeriodical) {
    this.name = name;
    this.refreshTime = refreshTime;
    this.isPeriodical = isPeriodical;
    this.isChecked = false;
    this.id = crypto.randomUUID();
  }
  static createTask(name, refreshTime, isPeriodical) {
    return new Timer(name, refreshTime, isPeriodical);
  }
}

export default {
  setup() {
    const timerDataArray = reactive([]);

    // Load data from localStorage if it exists
    const storedData = localStorage.getItem('TimerDataArrayStorage');
    if (storedData !== null) {
      // Parse the stored data and push it to the timerDataArray
      const storedTasks = JSON.parse(storedData);
      storedTasks.forEach(task => {
        timerDataArray.push(new Timer(task.name, task.refreshTime, task.isPeriodical));
      });
    } else {
      // If localStorage is empty, add default tasks
      timerDataArray.push(Timer.createTask('Task 1', 0, false));
      timerDataArray.push(Timer.createTask('Task 2', 43200, true));

      // Save the default tasks to localStorage
      localStorage.setItem('TimerDataArrayStorage', JSON.stringify(timerDataArray));
    }

    console.log(timerDataArray)

    return { timerDataArray, Timer };
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
    openEditModal(taskData) {
      // Set the data for the EditTaskModal
      this.editTaskData = taskData;

      // Show the EditTaskModal
      this.showEditModal = true;
    },
    resetEditModal() {
      // Reset the showEditModal variable to false when the modal is hidden
      this.showEditModal = false;
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
      <TaskCard v-for="t in timerDataArray" 
        v-bind:key="t.id"
        :id="t.id"
        :taskname="t.name" 
        :isChecked="t.isChecked" 
        :refreshTime="t.refreshTime" 
        :isPeriodical="t.isPeriodical"
        @edit-task="openEditModal" />
    </div>
    <div style="height:9rem"></div>
  </div>
  <div class="floatbutton" @click="openModal">
    <a class="bi bi-plus" id="plusicon"></a>
  </div>

  <AddTaskModal />
  <EditTaskModal :show="showEditModal" @modal-hidden="resetEditModal" />
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
