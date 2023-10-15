<template>
  <div class="flex h-screen">
    <div class="flex flex-col md:flex-row w-full">
      <div class="w-full md:basis-1/2">
        <CaptureMain />
      </div>
      <div class="flex w-full md:basis-1/2">
        <div class="w-full flex flex-col lg:flex-row h-screen">
          <div class="lg:basis-1/2">
            <YourLetters />
          </div>
          <div class="lg:basis-1/2">
            <AllLetters />
          </div>
        </div>
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
