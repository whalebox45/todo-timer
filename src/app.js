import { reactive, onMounted } from 'vue';
import { Modal, Offcanvas } from 'bootstrap';

import TaskCard from './components/TaskCard.vue';
import AddTaskModal from './components/AddTaskModal.vue';
import SettingModal from './components/SettingModal.vue';
import EditTaskModal from './components/EditTaskModal.vue';
import MenuOffcanvas from './components/MenuOffcanvas.vue';

class Timer {
  constructor(taskTitle, refreshTime, isPeriodical, isChecked) {
    this.taskTitle = taskTitle;
    this.refreshTime = refreshTime;
    this.isPeriodical = isPeriodical;
    this.isChecked = isChecked;
    this.id = crypto.randomUUID();
    this.lastCheckAt = {};
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

    const resetDefaultTask = function () {
      localStorage.removeItem('TimerDataArrayStorage');
      // Add default tasks
      timerDataArray.push(Timer.createTask('Task 1', 0, false, true));
      timerDataArray.push(Timer.createTask('Task 2', 43200, true, false));
      // Save the default tasks to localStorage
      localStorage.setItem('TimerDataArrayStorage', JSON.stringify(timerDataArray));
    }

    if (storedData !== null) {
      try {
        const storedTasks = JSON.parse(storedData);
        storedTasks.forEach(task => {
          // Parse the stored dㄎata and push it to the timerDataArray
          timerDataArray.push(new Timer(task.taskTitle, task.refreshTime, task.isPeriodical, task.isChecked));
        });
      } catch (e) {
        alert("儲存資料錯誤，將重設本程式")
        resetDefaultTask();
      }

    } else {
      resetDefaultTask();
    }

    // debugger;
    return { timerDataArray, Timer, editTaskData };
  },
  mounted() {
  },
  components: {
    TaskCard, AddTaskModal, EditTaskModal, SettingModal, MenuOffcanvas
  },
  data() {
    return {
      showDrawerMenu: false,
      showEditModal: false,
    };
  },
  methods: {
    toggleDrawerOffcanvas() {
      const DrawerOffcanvas = document.getElementById('menuOffcanvas');
      const offcanvas = Offcanvas.getOrCreateInstance(DrawerOffcanvas);
      offcanvas.show();
    },
    toggleDrawerMenu() {
      this.showDrawerMenu = !this.showDrawerMenu;
    },
    openModal() {
      const AddTaskModal = document.getElementById('AddTaskModal');
      const modal = Modal.getOrCreateInstance(AddTaskModal);
      modal.show()
    },
    openSettingModal() {
      const DrawerOffcanvas = document.getElementById('menuOffcanvas');
      const offcanvas = Offcanvas.getOrCreateInstance(DrawerOffcanvas);
      offcanvas.hide();
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
        if(isChecked){
          this.timerDataArray[index].lastCheckAt = new Date();
        }
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