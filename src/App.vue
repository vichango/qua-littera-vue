<template>
  <div class="columns">
    <div class="column">
      <div v-if="'nothing' === doing" class="block has-text-centered">
        <button class="button" @click="doing = 'capture'">
          Démarrer la capture
        </button>
      </div>
      <ImageCapture v-else-if="'capture' === doing" @captured="customSave" />
      <HandwritingCanvas
        v-else-if="'drawing' === doing"
        :photo="capturedSrc"
        @reset="resetCapture"
      />
    </div>
    <div class="column">
      <YourLetters></YourLetters>
    </div>
    <div class="column">
      <AllLetters></AllLetters>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AllLetters from "./components/letters-all.vue";
import YourLetters from "./components/letters-your.vue";
import ImageCapture from "./components/image-capture.vue";
import HandwritingCanvas from "./components/handwriting-canvas.vue";

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
