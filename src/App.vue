<template>
  <div class="flex flex-wrap">
    <div class="basis-full md:basis-1/2 py-6">
      <CaptureMain />
    </div>
    <div class="basis-full md:basis-1/2 flex flex-wrap">
      <div class="basis-full lg:basis-1/2">
        <YourLetters></YourLetters>
      </div>
      <div class="basis-full lg:basis-1/2">
        <AllLetters></AllLetters>
      </div>
    </div>
  </div>
</template>

<script setup>
import AllLetters from "./components/lists/AllLetters.vue";
import YourLetters from "./components/lists/YourLetters.vue";
import CaptureMain from "./components/capture/CaptureMain.vue";
</script>

<style scoped></style>
