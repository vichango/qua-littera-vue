<template>
  <canvas
    ref="canvas"
    class="p-0 my-0 mx-auto cursor-crosshair relative rounded"
    :width="size"
    :height="size"
  ></canvas>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  size: { type: Number, required: true },
  trace: { type: Object, required: true },
  lineWidth: { type: Number, default: 6 },
  traceColor: { type: String, default: '"#000000"' },
});

const emit = defineEmits(["traced"]);

const canvas = ref(null);
const drawing = ref(false);
const handwritingX = ref([]);
const handwritingY = ref([]);

const innerTrace = ref([]);

watch(
  () => props.trace,
  (newTrace) => {
    innerTrace.value = newTrace;
    redraw();
  },
);

watch(
  () => props.traceColor,
  () => {
    redraw();
  },
);

onMounted(() => {
  initializeCanvas();
});

const initializeCanvas = () => {
  const ctx = canvas.value.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  drawing.value = false;
  handwritingX.value = [];
  handwritingY.value = [];
  innerTrace.value = [];

  ctx.strokeStyle = props.traceColor;

  canvas.value.addEventListener("mousedown", mouseDown);
  canvas.value.addEventListener("mousemove", mouseMove);
  canvas.value.addEventListener("mouseup", mouseUp);
  canvas.value.addEventListener("touchstart", touchStart);
  canvas.value.addEventListener("touchmove", touchMove);
  canvas.value.addEventListener("touchend", touchEnd);
};

const redraw = () => {
  const ctx = canvas.value.getContext("2d");
  ctx.clearRect(0, 0, 480, 480);
  ctx.strokeStyle = props.traceColor;

  for (let i = 0; i < innerTrace.value.length; i++) {
    const [xStack, yStack] = innerTrace.value[i];

    if (xStack.length > 0 && yStack.length > 0) {
      const x = xStack[0];
      const y = yStack[0];

      ctx.moveTo(x, y);

      for (let j = 1; j < xStack.length; j++) {
        const x = xStack[j];
        const y = yStack[j];

        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  }

  updateParent();
};

const updateParent = () => {
  const render = canvas.value.toDataURL("image/png");
  emit("traced", { trace: innerTrace.value, render });
};

const mouseDown = (e) => {
  const ctx = canvas.value.getContext("2d");

  ctx.lineWidth = props.lineWidth;
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

  innerTrace.value.push(w);
  drawing.value = false;

  updateParent();
};

const touchStart = (e) => {
  e.preventDefault();

  const ctx = canvas.value.getContext("2d");

  ctx.lineWidth = props.lineWidth;
  handwritingX.value = [];
  handwritingY.value = [];
  drawing.value = true;
  ctx.beginPath();
  const rect = canvas.value.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left;
  const y = e.touches[0].clientY - rect.top;
  ctx.moveTo(x, y);
  handwritingX.value.push(x);
  handwritingY.value.push(y);
};

const touchMove = (e) => {
  e.preventDefault();

  const ctx = canvas.value.getContext("2d");

  if (drawing.value) {
    const rect = canvas.value.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    handwritingX.value.push(x);
    handwritingY.value.push(y);
  }
};

const touchEnd = (e) => {
  e.preventDefault();

  const w = [];
  w.push(handwritingX.value);
  w.push(handwritingY.value);
  w.push([]);

  innerTrace.value.push(w);
  drawing.value = false;

  updateParent();
};
</script>

<style scoped></style>
