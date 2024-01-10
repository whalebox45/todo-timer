<script setup>
import TaskCard from './components/TaskCard.vue'
</script>

<template>
  <div style="height:4.5rem"></div>
  <h1 class="mx-3">Tasks</h1>
  
  <div class="row gy-1 gx-1 mx-3">
    <TaskCard v-for="_ in Array(15)"  />
  </div>
  <div style="height:72px"></div>
</template>

<style scoped>

</style>
