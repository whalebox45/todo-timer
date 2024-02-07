<script>
import { reactive, onMounted } from 'vue';
import { Modal, Offcanvas } from 'bootstrap';

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
      showDrawerMenu: false,
      showDrawerOC: false,
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
    <div style="height:2.5rem"></div>
    <div class="mx-4 maincontrol d-flex justify-content-between">
      <div class="control-left">
        <a class="bi bi-sort-down" id="sortbtn"></a>
      </div>
      <div class="ms-auto"></div>
      <!-- <div class="control-right">
        <a class="bi bi-gear-fill" @click="openSettingModal"></a>
      </div> -->
    </div>

    <div class="row gy-3 gx-4 mx-4">
      <TaskCard v-for="t in timerDataArray" v-bind:key="t.id" :id="t.id" :taskTitle="t.taskTitle" :isChecked="t.isChecked"
        :refreshTime="t.refreshTime" :isPeriodical="t.isPeriodical" @edit-task="openEditModal"
        @checkbox-change="handleCheckboxChange" />
    </div>


    <div style="height:12rem; width:100%"></div>
  </div>

  <div class="floatbutton d-flex align-items-center justify-content-center" @click="openModal">
    <a class="bi bi-plus" id="plusicon"></a>
  </div>

  <nav class="navbar navbar-expand-lg fixed-bottom">
    <div class="me-auto"></div>
    <!-- <div class="navbar-brand d-flex" @click="toggleDrawerMenu">
      <div class="bi bi-list"></div>
      <span>Menu</span>
    </div> -->

    <a class="navbar-brand d-flex" @click="toggleDrawerOffcanvas" href="#">
      <span>Menu2</span>
      <div class="bi bi-list"></div>
    </a>

  </nav>

  <!-- <div v-if="showDrawerMenu" class="drawermenu">
    <div class="container-fluid">
      <h1>Ike give me $100</h1>
    </div>
  </div> -->

  <!-- Drawermenu -->
  <!-- <div :class="{ 'drawermenu': true, 'show': showDrawerMenu }">
    <div class="container-fluid">
      <h1>Ike give me $100</h1>
    </div>
  </div> -->


  <div class="offcanvas offcanvas-end" data-bs-backdrop="true" id="menuOffcanvas">

    <div class="offcanvas-body">
      <div class="d-flex flex-align-start flex-column h-100 w-100">

        <div class="h-100 w-100 d-flex align-items-end">
          <div class="menulist list-group list-group-flush w-100">
            <a href="#" class="list-group-item w-100" @click="openSettingModal">
              <h2>設定</h2>
            </a >
            <a href="#" class="list-group-item w-100" @click="openSettingModal">
              <h2>設定</h2>
            </a >
            <a href="#" class="list-group-item w-100" @click="openSettingModal">
              <h2>設定</h2>
            </a >
          </div>
        </div>

        <div class="offcanvas-header w-100 m-0 p-0">
          <h2 class="offcanvas-title">Offcanvas</h2>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        
      </div>

    </div>
  </div>

  <AddTaskModal />
  <EditTaskModal :show="showEditModal" @modal-hidden="resetEditModal" :editTaskData="editTaskData" />
  <SettingModal />
</template>






<style scoped lang="scss">
$navcolor: #111111;
$navcolor2: #1a1a1a;

$navfg: orange;

.maincontrol {
  * {
    font-size: 36px;
  }

  a {
    color: #888888;
  }
}

.floatbutton {
  z-index: 20;
  height: 96px;
  width: 96px;

  background-color: $navcolor2;
  border-color: transparent;
  border-radius: 100%;

  position: fixed;
  bottom: 24px;
  right: calc(50% - 48px);

  #plusicon {
    font-size: 60px;
    text-align: center;
    vertical-align: middle;
    color: $navfg;
  }

}

#menuOffcanvas {
  background-color: $navfg;
  color: $navcolor;

}

.drawermenu {
  z-index: 5;
  height: 100vh;
  width: 30vw;
  background-color: $navfg;
  position: fixed;
  top: 0;
  right: 0;

  /* Slide-in animation */
  transition: transform 0.3s ease-in-out;
  transform: translateX(30vw);
}

.drawermenu.show {
  transform: translateX(0);
}

.menulist {
  .list-group-item {
    color: $navcolor2;
    background-color: transparent;
    border-color: lightcoral;
  }
  .list-group-item:hover{
    color: $navcolor;
  }
}
.navbar {
  z-index: 10;
  height: 72px;
  background-color: $navcolor;

  .navbar-brand * {
    font-size: 32px;
    color: $navfg;
  }

  .navbar-brand:hover {
    background-color: white;
  }
}
</style>
