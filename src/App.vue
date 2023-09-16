<template>
  <ImageCapture v-if="'capture' === doing" @captured="customSave" />
  <NewHandwritingCanvas v-else-if="'drawing' === doing" :background="capturedSrc" />
</template>

<script setup>
import { ref } from 'vue'
import ImageCapture from './components/ImageCapture.vue'
import NewHandwritingCanvas from "./components/NewHandwritingCanvas.vue"

const doing = ref('capture');

const capturedSrc = ref('');

const customSave = (src) => {
  capturedSrc.value = src;
  doing.value = 'drawing';
}

</script>

<style scoped></style>
