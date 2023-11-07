<template>
  <div class="bg-green-200 md:h-screen">
    <div class="w-full canvas-box">
      <img
        ref="photo"
        class="p-4 my-0 mx-auto bg-green-400 rounded"
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
    <div class="flex justify-center">
      <div class="w-full max-w-[480px] flex">
        <button
          class="border-2 border-green-500 text-green-500 font-bold py-2 px-4 mx-2 my-6 rounded"
          :disabled="saving ? 'disabled' : false"
          @click="goBack"
        >
          <font-awesome-icon icon="fa-solid fa-camera" />
        </button>
        <button
          class="border-2 border-green-500 text-green-500 font-bold py-2 px-4 mx-2 my-6 rounded"
          :disabled="saving ? 'disabled' : false"
          @click="erase"
        >
          <font-awesome-icon icon="fa-solid fa-trash" />
        </button>
        <div
          v-if="!saving"
          class="border-2 border-green-500 text-green-500 font-bold py-2 px-4 mx-2 my-6 rounded ms-4 me-8"
        >
          <color-picker v-model:pureColor="traceColor" class="rounded-full" />
        </div>

        <button
          v-if="saving"
          class="border-2 border-green-500 text-green-500 font-bold py-2 px-4 mx-2 my-6 rounded"
        >
          Enreg.
          <font-awesome-icon icon="fa-solid fa-floppy-disk" />
        </button>
        <button
          v-else-if="!traceReady"
          class="border-2 border-green-300 font-bold py-2 px-4 mx-2 my-6 rounded text-green-300"
          disabled
        >
          C'est prêt
        </button>
        <button
          v-else
          :class="[
            'border-2 border-green-500 font-bold py-2 px-4 mx-2 my-6 rounded',
            traceReady ? 'text-green-500' : 'bg-green-200 text-green-0',
          ]"
          :disabled="!traceReady"
          @click="recognize"
        >
          C'est prêt
        </button>
      </div>
    </div>

    <div v-if="!traceNotEmpty">
      <div class="w-full flex justify-center">
        <p class="text-green-400 my-6 px-4 text-center">
          Dessine la lettre que tu as vu!
        </p>
      </div>
    </div>
    <div v-else-if="!traceBigEnough">
      <div class="w-full flex justify-center">
        <p class="text-green-400 my-6 px-4 text-center">
          Ton dessin est encore trop petit …
        </p>
      </div>
    </div>
    <div v-else-if="letterOptions && 0 === letterOptions.length">
      <div class="w-full flex justify-center">
        <p class="text-green-400 my-6 px-4 text-center">J'ai pas compris</p>
      </div>
    </div>
    <div
      v-else-if="letterOptions"
      class="w-full h-auto flex flex-wrap justify-center my-2"
    >
      <button
        v-for="(letter, index) of letterOptions"
        :key="index"
        class="bg-green-500 text-green-100 font-bold py-2 px-4 mx-1 my-4 text-xl rounded"
        @click="traced(letter)"
      >
        {{ letter }}
      </button>

      <div class="w-full flex justify-center">
        <p class="text-green-400 my-6 px-4 text-center">
          Quelle lettre est juste?
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ID } from "appwrite";
import { computed, inject, onMounted, onUnmounted, ref } from "vue";

const saving = ref(false);

const props = defineProps({
  photo: { type: String, default: "" },
  event: { type: Object, required: true },
  deviceId: { type: String, required: true },
});

const emit = defineEmits(["reset", "refresh"]);

const canvas = ref(null);
const drawing = ref(false);
const handwritingX = ref([]);
const handwritingY = ref([]);

const trace = ref([]);
const lineWidth = ref(6);
const traceColor = ref("#000000");

const size = ref(Math.min(480, window.innerWidth));

const letterOptions = ref(null);

const tracesBucket = inject("traces-bucket");
const capturesBucket = inject("captures-bucket");

const mainDb = inject("main-db");
const mainDbCapturesCol = inject("main-db-captures-col");

const databases = inject("appwrite-databases");
const storage = inject("appwrite-storage");

const traceReady = computed(() => {
  return traceNotEmpty.value && traceBigEnough;
});

const traceNotEmpty = computed(() => {
  return 0 < trace.value.length;
});

const traceBigEnough = computed(() => {
  const traceWidth = traceBox.value.maxX - traceBox.value.minX;
  const traceHeight = traceBox.value.maxY - traceBox.value.minY;

  return traceWidth > 120 || traceHeight > 120;
});

const traceBox = computed(() => {
  const box = {
    minX: null,
    minY: null,
    maxX: null,
    maxY: null,
  };

  for (let i = 0; i < trace.value.length; i++) {
    const [xStack, yStack] = trace.value[i];

    if (xStack.length > 0 && yStack.length > 0) {
      for (let j = 1; j < xStack.length; j++) {
        const x = xStack[j];
        if (null === box.minX || x < box.minX) box.minX = x;
        if (null === box.maxX || x > box.maxX) box.maxX = x;

        const y = yStack[j];
        if (null === box.minY || y < box.minY) box.minY = y;
        if (null === box.maxY || y > box.maxY) box.maxY = y;
      }
    }
  }

  return box;
});

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

const traced = (letter) => {
  const traced64 = canvas.value.toDataURL("image/png");
  saveToBucket(letter, traced64).then(() => {
    emit("refresh");
    erase();
  });
};

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

  ctx.strokeStyle = traceColor.value;

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

  letterOptions.value = null;
};

const recognize = () => {
  const options = {
    upperCase: true,
    // removeAccents: true,
    singleLetter: true,
  };

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
          console.warn(undefined, new Error(response[0]));
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

        if (options.upperCase) {
          results = results
            .map((result) => result.toUpperCase())
            .filter(function (item, pos, arr) {
              return arr.indexOf(item) == pos;
            });
        }

        if (options.removeAccents) {
          results = results
            .map((result) =>
              result.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            )
            .filter(function (item, pos, arr) {
              return arr.indexOf(item) == pos;
            });
        }

        if (options.singleLetter) {
          results = results
            .map((result) => result.substring(0, 1))
            .filter(function (item, pos, arr) {
              return arr.indexOf(item) == pos;
            });
        }

        letterOptions.value = results;
      } else if (xhr.status === 403) {
        console.warn(undefined, new Error("access denied"));

        letterOptions.value = [];
      } else if (xhr.status === 503) {
        console.warn(
          undefined,
          new Error("can't connect to recognition server"),
        );

        letterOptions.value = [];
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

const saveToBucket = async (letter, trace64) => {
  saving.value = true;

  // Save capture file.
  const captureBase64 = await fetch(props.photo);
  const captureBlob = await captureBase64.blob();
  const captureFile = new File([captureBlob], "capture.png", {
    type: "image/png",
  });

  const captureFileId = ID.unique();

  const captureUpload = await storage.createFile(
    capturesBucket,
    captureFileId,
    captureFile,
  );

  // Save trace file.
  const traceBase64 = await fetch(trace64);
  const traceBlob = await traceBase64.blob();
  const traceFile = new File([traceBlob], "trace.png", {
    type: "image/png",
  });

  const traceFileId = ID.unique();

  const traceUpload = await storage.createFile(
    tracesBucket,
    traceFileId,
    traceFile,
  );

  // Save entry in database.
  const documentId = ID.unique();

  await databases.createDocument(mainDb, mainDbCapturesCol, documentId, {
    letter,
    trace: traceUpload.$id,
    capture: captureUpload.$id,
    event: props.event.id,
    device: props.deviceId,
  });

  saving.value = false;
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
