import { reactive, onMounted } from 'vue';
import { Modal, Offcanvas } from 'bootstrap';
import dayjs from 'dayjs';

import TaskCard from './components/TaskCard.vue';
import AddTaskModal from './components/AddTaskModal.vue';
import SettingModal from './components/SettingModal.vue';
import EditTaskModal from './components/EditTaskModal.vue';
import MenuOffcanvas from './components/MenuOffcanvas.vue';

const PERIOD_TYPES = {
  once: 0,
  daily: 10,
  weekly: 20,
  monthly: 30
}

class Timer {

  constructor(taskTitle, setTodoTime, isTimer, isChecked, periodType) {
    this.id = crypto.randomUUID();
    this.taskTitle = taskTitle;
    this.isChecked = isChecked;
    this.isTimer = isTimer;
    this.setTodoTime = setTodoTime;
    this.periodType = periodType;
    this.lastCheckAt = {};
  }
  static createTask(taskTitle, setTodoTime, isTimer, isChecked, periodType) {
    return new Timer(taskTitle, setTodoTime, isTimer, isChecked, periodType);
  }
}

export default {
  setup() {

    const timerDataArray = reactive([]);
    const editTaskData = reactive({});

    // Load data from localStorage if it exists
    const storedData = localStorage.getItem('TimerDataArrayStorage');

    const resetDefaultTask = function () {
      localStorage.removeItem('TimerDataArrayStorage');
      // Add default tasks
      timerDataArray.push(Timer.createTask('Task 1', dayjs('2018-04-13 19:18').second(0).millisecond(0),
        false, false, PERIOD_TYPES.once));
      timerDataArray.push(Timer.createTask('Task 2', dayjs('2018-04-13 19:18').hour(12).minute(0).second(0).millisecond(0),
        true, false, PERIOD_TYPES.daily));
      // Save the default tasks to localStorage
      localStorage.setItem('TimerDataArrayStorage', JSON.stringify(timerDataArray));
    }

    if (storedData !== null) {
      try {
        const storedTasks = JSON.parse(storedData);
        storedTasks.forEach(task => {
          // Parse the stored dㄎata and push it to the timerDataArray
          timerDataArray.push(new Timer(task.taskTitle, dayjs(task.setTodoTime), task.isTimer, task.isChecked, task.periodType));
        });
      } catch (e) {
        alert("儲存資料錯誤，將重設本程式")
        resetDefaultTask();
      }

    } else {
      resetDefaultTask();
    }

    // debugger;
    return { timerDataArray, Timer, editTaskData, PERIOD_TYPES };
  },
  mounted() {
  },
  components: {
    TaskCard, AddTaskModal, EditTaskModal, SettingModal, MenuOffcanvas
  },
  data() {
    return {
      showEditModal: false,
      showAddModal: false,
      showSettingModal: false,
    };
  },
  methods: {
    toggleDrawerOffcanvas() {
      const DrawerOffcanvas = document.getElementById('menuOffcanvas');
      const offcanvas = Offcanvas.getOrCreateInstance(DrawerOffcanvas);
      offcanvas.show();
    },
    openModal() {this.showAddModal = true;},
    resetAddModal(){this.showAddModal = false;},
    openEditModal(taskData) {
      this.editTaskData = taskData;
      this.showEditModal = true;
    },
    resetEditModal() { this.showEditModal = false; },
    openSettingModal() {
      const DrawerOffcanvas = document.getElementById('menuOffcanvas');
      const offcanvas = Offcanvas.getOrCreateInstance(DrawerOffcanvas);
      offcanvas.hide();
      const settingModal = document.getElementById('settingModal');
      const modal = Modal.getOrCreateInstance(settingModal);
      modal.show();
    },
    handleCheckboxChange({ id, isChecked }) {
      const index = this.timerDataArray.findIndex((timer) => timer.id === id);
      if (index !== -1) {
        // this.$set(this.timerDataArray, index, { ...this.timerDataArray[index], isChecked });
        this.timerDataArray[index].isChecked = isChecked;
        if (isChecked) {
          this.timerDataArray[index].lastCheckAt = new Date();
        }
        localStorage.setItem('TimerDataArrayStorage', JSON.stringify(this.timerDataArray));
      }
    },
    updateTimerById(id, newData) {
      const index = this.timerDataArray.findIndex(timer => timer.id === id);
      if (index !== -1) {
        this.timerDataArray[index] = { ...this.timerDataArray[index], ...newData };
      }
    },
    deleteTimerById(id) {
      console.log(id, 'delete');
      const taskCardComponent = this.$refs[`taskCard_${id}`][0];
      if (taskCardComponent) { taskCardComponent.stopTimer();}

      const index = this.timerDataArray.findIndex(timer => timer.id === id);
      if (index !== -1) {
        // console.log(this.timerDataArray[index])
        this.timerDataArray.splice(index, 1);
        localStorage.setItem('TimerDataArrayStorage', JSON.stringify(this.timerDataArray));
      }
    },

  }
}