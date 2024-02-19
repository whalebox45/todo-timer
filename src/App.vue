<script src="./app.js"></script>

<template>
  <div>
    <div style="height:2.5rem"></div>
    <div class="mx-4 maincontrol d-flex justify-content-between">
      <div class="control-left">
        <a class="bi bi-sort-down" id="sortbtn"></a>
      </div>
      <div class="ms-auto"></div>
    </div>

    <div class="row gy-3 gx-4 mx-4">
      <TaskCard v-bind:ref="'taskCard_' + t.id" v-for="t in timerDataArray" v-bind:key="t.id" :id="t.id" :taskTitle="t.taskTitle" :isChecked="t.isChecked"
        :setTodoTime="t.setTodoTime" :isTimer="t.isTimer" @edit-task="openEditModal"
        @checkbox-change="handleCheckboxChange" @delete-task="deleteTimerById"/>
    </div>


    <div style="height:12rem; width:100%"></div>
  </div>

  <div class="floatbutton d-flex align-items-center justify-content-center" @click="openModal">
    <a class="bi bi-plus" id="plusicon"></a>
  </div>

  <nav class="navbar navbar-expand-lg fixed-bottom">
    <div class="me-auto"></div>

    <a class="navbar-brand d-flex" @click="toggleDrawerOffcanvas" href="#">
      <span>目錄</span>
      <div class="bi bi-list"></div>
    </a>

  </nav>

  <MenuOffcanvas />

  <AddTaskModal :show="showAddModal" @modal-hidden="resetAddModal"/>
  <EditTaskModal :show="showEditModal" @modal-hidden="resetEditModal"
    @delete-task="deleteTimerById" :editTaskData="editTaskData" />
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

.floatbutton:hover{
  background-color: #888888;
}

// .drawermenu {
//   z-index: 5;
//   height: 100vh;
//   width: 30vw;
//   background-color: $navfg;
//   position: fixed;
//   top: 0;
//   right: 0;

//   /* Slide-in animation */
//   transition: transform 0.3s ease-in-out;
//   transform: translateX(30vw);
// }

// .drawermenu.show {
//   transform: translateX(0);
// }

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
