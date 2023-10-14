<template>
  <div class="flex flex-row">
    <div class="flex-1 py-6">
      <CaptureMain />
    </div>
    <div class="flex-1">
      <YourLetters></YourLetters>
    </div>
    <div class="flex-1">
      <AllLetters></AllLetters>
    </div>
  </div>
</template>

<script setup>
import AllLetters from "./components/lists/letters-all.vue";
import YourLetters from "./components/lists/letters-your.vue";
import CaptureMain from "./components/capture/capture-main.vue";
</script>

<style scoped></style>
