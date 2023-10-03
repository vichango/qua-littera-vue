<template>
  <div class="block has-text-centered">
    <img ref="photo" width="480" height="480" :src="props.photo" />
    <canvas ref="canvas" width="480" height="480"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  photo: { type: String, default: "" },
});

const canvas = ref(null);
const drawing = ref(false);
const handwritingX = ref([]);
const handwritingY = ref([]);
const trace = ref([]);
const step = ref([]);
// const redoTrace = ref([]);
// const redoStep = ref([]);
const lineWidth = ref(3);

onMounted(() => {
  // const ctx = canvas.value.getContext("2d");
  // // TODO Replace with offscreen canvas.
  // const image = new Image();
  // image.onload = function() {
  //   ctx.drawImage(image, 0, 0);
  // };
  // image.src = props.background;
  initializeCanvas();
});

const initializeCanvas = () => {
  const ctx = canvas.value.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // TODO Useful?
  drawing.value = false;
  handwritingX.value = [];
  handwritingY.value = [];
  trace.value = [];
  step.value = [];
  // redoStep.value = [];
  // redoTrace.value = [];

  canvas.value.addEventListener("mousedown", mouseDown);
  canvas.value.addEventListener("mousemove", mouseMove);
  canvas.value.addEventListener("mouseup", mouseUp);
};

const mouseDown = (e) => {
  const ctx = canvas.value.getContext("2d");

  ctx.lineWidth = lineWidth.value;
  handwritingX.value = [];
  handwritingY.value = [];
  drawing.value = true;
  ctx.beginPath();
  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  ctx.moveTo(x, y);
  handwritingX.value.push(x);
  handwritingY.value.push(y);
};

const mouseMove = (e) => {
  const ctx = canvas.value.getContext("2d");

  if (drawing.value) {
    const rect = canvas.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    handwritingX.value.push(x);
    handwritingY.value.push(y);
  }
};

const mouseUp = () => {
  const w = [];
  w.push(handwritingX.value);
  w.push(handwritingY.value);
  w.push([]);
  trace.value.push(w);
  drawing.value = false;
  // if (this.allowUndo) this.step.push(canvas.value.toDataURL());
};
</script>

<style scoped>
img {
  padding: 1em;
  margin: 0 auto;
  border: 2px solid gray;
}

canvas {
  padding: 0;
  margin: 0 auto;
  border: 2px solid red;
  cursor: crosshair;
  position: relative;
  top: -488px;
}
</style>
