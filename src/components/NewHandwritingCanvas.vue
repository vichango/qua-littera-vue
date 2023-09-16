<template>
  <canvas ref="canvas" width="480" height="480"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps(['background']);

const canvas = ref(null);

onMounted(() => {
  const ctx = canvas.value.getContext("2d");

  // TODO Replace with offscreen canvas.
  const image = new Image();
  image.onload = function() {
    ctx.drawImage(image, 0, 0);
  };
  image.src = props.background;
})
</script>

<style scoped>
canvas {
  border: 2px white solid;
  cursor: crosshair;
}
</style>
