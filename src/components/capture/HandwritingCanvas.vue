<template>
  <div class="bg-green-200 md:h-screen">
    <div class="w-full canvas-box">
      <img
        ref="photo"
        class="p-4 my-0 mx-auto bg-green-300 rounded"
        :width="size"
        :height="size"
        :src="props.photo"
      />
      <canvas
        ref="canvas"
        class="p-0 my-0 mx-auto cursor-crosshair relative rounded"
        :width="size"
        :height="size"
      ></canvas>
    </div>
    <div class="w-full flex justify-center">
      <button
        class="border-2 border-green-500 text-green-500 font-bold py-2 px-4 m-2 rounded"
        @click="goBack"
      >
        Retour
      </button>
      <button
        class="border-2 border-green-500 text-green-500 font-bold py-2 px-4 m-2 rounded"
        @click="erase"
      >
        Effacer
      </button>
      <button
        class="border-2 border-green-500 text-green-500 font-bold py-2 px-4 m-2 rounded"
        @click="recognize"
      >
        C'est fait
      </button>
    </div>
    <div v-if="letterOptions" class="w-full flex justify-center">
      <SingleLetter
        v-for="(letter, index) of letterOptions"
        :key="index"
        :letter="letter"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import SingleLetter from "../common/SingleLetter.vue";

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

const size = ref(Math.min(480, window.innerWidth));

const letterOptions = ref([]);

onMounted(() => {
  initializeCanvas();
  window.addEventListener("resize", resizeCanvas);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
});

const resizeCanvas = () => {
  size.value = Math.min(480, window.innerWidth);
};

const sizePx = computed(() => {
  return `${size.value}px`;
});

const negativeSizePx = computed(() => {
  return `-${size.value}px`;
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

  letterOptions.value = [];
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
        letterOptions.value = results;
        console.log(results, undefined);
      } else if (xhr.status === 403) {
        letterOptions.value = [];
        console.log(undefined, new Error("access denied"));
      } else if (xhr.status === 503) {
        letterOptions.value = [];
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
.canvas-box {
  height: v-bind("sizePx");
}

canvas {
  top: v-bind("negativeSizePx");
}
</style>
