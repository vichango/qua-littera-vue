<template>
  <div v-if="'nothing' === doing" class="bg-blue-200 md:h-screen">
    <div class="w-full flex justify-center">
      <button
        class="border-2 border-blue-500 text-blue-500 font-bold py-2 px-4 m-2 rounded"
        @click="doing = 'capture'"
      >
        Démarrer la capture
      </button>
    </div>
  </div>
  <ImageCapture v-else-if="'capture' === doing" @captured="customSave" />
  <HandwritingCanvas
    v-else-if="'drawing' === doing"
    :photo="capturedSrc"
    @reset="resetCapture"
  />
</template>

<script setup>
import { ref } from "vue";
import HandwritingCanvas from "./HandwritingCanvas.vue";
import ImageCapture from "./ImageCapture.vue";

const doing = ref("nothing");

const capturedSrc = ref("");

const customSave = (src) => {
  capturedSrc.value = src;
  doing.value = "drawing";
};

const resetCapture = () => {
  capturedSrc.value = "";
  doing.value = "capture";
};
</script>

<style scoped></style>
