<template>
  <div v-if="'nothing' === doing" class="flex justify-center">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="doing = 'capture'"
    >
      Démarrer la capture
    </button>
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
import ImageCapture from "./image-capture.vue";
import HandwritingCanvas from "./handwriting-canvas.vue";

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
