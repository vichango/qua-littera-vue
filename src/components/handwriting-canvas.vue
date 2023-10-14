<template>
  <div class="block has-text-centered" style="height: 480px">
    <img ref="photo" width="480" height="480" :src="props.photo" />
    <canvas ref="canvas" width="480" height="480"></canvas>
  </div>
  <div class="block has-text-centered">
    <button class="button" @click="goBack">Retour</button>
    <button class="button" @click="erase">Effacer</button>
    <button class="button" @click="recognize">C'est fait</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  photo: { type: String, default: "" },
});

const emit = defineEmits(["reset"]);

const canvas = ref(null);
const drawing = ref(false);
const handwritingX = ref([]);
const handwritingY = ref([]);
const trace = ref([]);
const lineWidth = ref(3);

onMounted(() => {
  initializeCanvas();
});

const goBack = () => {
  emit("reset");
};

const initializeCanvas = () => {
  const ctx = canvas.value.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  drawing.value = false;
  handwritingX.value = [];
  handwritingY.value = [];
  trace.value = [];

  canvas.value.addEventListener("mousedown", mouseDown);
  canvas.value.addEventListener("mousemove", mouseMove);
  canvas.value.addEventListener("mouseup", mouseUp);
  canvas.value.addEventListener("touchstart", touchStart);
  canvas.value.addEventListener("touchmove", touchMove);
  canvas.value.addEventListener("touchend", touchEnd);
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
};

const touchStart = (e) => {
  e.preventDefault();

  const ctx = canvas.value.getContext("2d");

  ctx.lineWidth = lineWidth.value;
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
  trace.value.push(w);
  drawing.value = false;
};

const erase = () => {
  const ctx = canvas.value.getContext("2d");

  ctx.clearRect(0, 0, 480, 480);
  trace.value = [];
};

const recognize = () => {
  if (trace.value.length === 0) {
    return; // Handle case when there's no trace
  }

  const options = {};

  const data = JSON.stringify({
    options: "enable_pre_space",
    requests: [
      {
        writing_guide: {
          writing_area_width: 480,
          writing_area_height: 480,
        },
        ink: trace.value,
        language: options.language || "fr_FR",
      },
    ],
  });

  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        let results;
        if (response.length === 1) {
          console.log(undefined, new Error(response[0]));
        } else {
          results = response[1][0][1];
        }
        if (options.numOfWords) {
          results = results.filter(
            (result) => result.length === options.numOfWords,
          );
        }
        if (options.numOfReturn) {
          results = results.slice(0, options.numOfReturn);
        }
        console.log(results, undefined);
      } else if (xhr.status === 403) {
        console.log(undefined, new Error("access denied"));
      } else if (xhr.status === 503) {
        console.log(
          undefined,
          new Error("can't connect to recognition server"),
        );
      }
    }
  });

  xhr.open(
    "POST",
    "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8",
  );
  xhr.setRequestHeader("content-type", "application/json");
  xhr.send(data);
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
