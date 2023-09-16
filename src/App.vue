<template>
  <div class="columns">
    <div class="column">
      <div v-if="'nothing' === doing" class="block has-text-centered">
        <button class="button" @click="doing = 'capture'">Start capturing</button>
      </div>
      <ImageCapture v-else-if="'capture' === doing" @captured="customSave" />
      <NewHandwritingCanvas v-else-if="'drawing' === doing" :photo="capturedSrc" />
    </div>
    <div class="column">
      Your letters
    </div>
    <div class="column">
      <AllLetters></AllLetters>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AllLetters from './components/AllLetters.vue';
import ImageCapture from './components/ImageCapture.vue';
import NewHandwritingCanvas from "./components/NewHandwritingCanvas.vue";

const doing = ref('nothing');

const capturedSrc = ref('');

const customSave = (src) => {
  capturedSrc.value = src;
  doing.value = 'drawing';
}

</script>

<style scoped></style>
