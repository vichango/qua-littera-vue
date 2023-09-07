<template>
  <ImageCapture @capture="updateImage" :width="320" />


  <HandwritingCanvas />
</template>

<script setup>
import { ref } from "vue";
import ImageCapture from './components/ImageCapture.vue'
import HandwritingCanvas from "./components/HandwritingCanvas.vue"

// Function updating the <img ref="image"> with the data emited by ImageCapture
const updateImage = (data) => {
  image.value.src = data;
};
</script>

<style scoped>
img {
  border: 1px solid red;
  padding: 6px;
  margin: 6px;
}
</style>
