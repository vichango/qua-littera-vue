<template>
  <!-- <ImageCapture @capture="updateImage" :width="320" />

  <p v-if="hasImage()">Has image</p>
  <p v-if="!hasImage()">Not has image</p> -->

  <!-- <img ref="image" /> -->

  <HandwritingCanvas />
</template>

<script setup>
import { ref } from "vue";
// import ImageCapture from './components/ImageCapture.vue'
import HandwritingCanvas from "./components/HandwritingCanvas.vue";

const image = ref("");

// Function updating the <img ref="image"> with the data emited by ImageCapture
const updateImage = (data) => {
  image.value.src = data;
};

// Function returning true if the img element is showing an image
const hasImage = () => {
  return image.value.src !== "";
};
</script>

<style scoped>
img {
  border: 1px solid red;
  padding: 6px;
  margin: 6px;
}
</style>
