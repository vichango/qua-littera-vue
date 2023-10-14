<template>
  <div class="flex flex-wrap">
    <div class="w-full md:flex-1">
      <CaptureMain />
    </div>
    <div class="w-full md:flex-1 flex flex-wrap">
      <div class="w-full lg:flex-1">
        <YourLetters></YourLetters>
      </div>
      <div class="w-full lg:flex-1">
        <AllLetters></AllLetters>
      </div>
    </div>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import CaptureMain from "./components/capture/CaptureMain.vue";
import AllLetters from "./components/lists/AllLetters.vue";
import YourLetters from "./components/lists/YourLetters.vue";

const deviceId = ref(null);

deviceId.value = localStorage.getItem("qua-littera-device-id");

if (null === deviceId.value) {
  deviceId.value = uuidv4();
  localStorage.setItem("qua-littera-device-id", deviceId.value);
}
</script>

<style scoped></style>
