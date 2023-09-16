<template>
  <img ref="photo" width="480" height="480" :src="props.photo" />
  <canvas ref="canvas" width="480" height="480"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  photo: { type: String, default: "" },
});

const canvas = ref(null);

onMounted(() => {
  const ctx = canvas.value.getContext("2d");
  // // TODO Replace with offscreen canvas.
  // const image = new Image();
  // image.onload = function() {
  //   ctx.drawImage(image, 0, 0);
  // };
  // image.src = props.background;
});
</script>

<style scoped>
canvas {
  border: 2px white solid;
  cursor: crosshair;
}
</style>
