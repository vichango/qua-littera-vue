<template>
  <div class="bg-green-200 md:h-screen pt-6">
    <SizedContainer :size="size" color="green">
      <img ref="imageElt" :width="size" :height="size" :src="props.photo" />
      <div class="canvas-delta relative">
        <HandWritingCanvas
          v-if="traceSize"
          :trace="trace"
          :size="traceSize"
          :line-width="lineWidth"
          :trace-color="traceColor"
          @traced="updateTrace"
        />
      </div>
    </SizedContainer>

    <div class="w-full mx-auto max-w-[480px] flex justify-center">
      <div class="h-8 w-16 bg-green-400 text-center rounded-b">
        <font-awesome-icon
          icon="fa-solid fa-paintbrush"
          class="align-middle me-2 text-green-200"
        />
        <color-picker v-model:pureColor="traceColor" />
      </div>
    </div>

    <div class="flex justify-center">
      <div class="w-full max-w-[480px] flex">
        <div class="w-5/12 flex justify-start">
          <AppButton
            :back-arrow="true"
            fa-icon="fa-solid fa-camera"
            :disabled="saving ? 'disabled' : false"
            color="green"
            @click="goBack"
          />
        </div>

        <div class="w-1/6 flex justify-center">
          <font-awesome-icon
            v-if="saving"
            icon="fa-solid fa-floppy-disk"
            class="animate-spin text-white my-auto"
          />
        </div>

        <div class="w-5/12 flex space-x-2 justify-end">
          <AppButton
            fa-icon="fa-solid fa-trash"
            :disabled="!traceReady || saving"
            color="green"
            @click="erase"
          />

          <AppButton
            label="J'ai fini"
            :disabled="!traceReady"
            color="green"
            @click="recognize"
          />
        </div>
      </div>
    </div>

    <div class="w-full h-auto flex flex-wrap justify-center my-2">
      <button
        v-for="(letter, index) of letterOptions"
        :key="index"
        class="bg-green-500 text-green-100 font-bold py-2 px-4 mx-1 my-4 text-xl rounded"
        @click="saveToBucket(letter)"
      >
        {{ letter }}
      </button>
    </div>

    <AppMessage
      v-if="!traceNotEmpty"
      message="Vas-y, dessine-moi la lettre que tu as vu!"
    />
    <AppMessage
      v-else-if="!traceBigEnough"
      message="J'ai pas mes lunettes, c'est encore trop petit …"
    />
    <AppMessage
      v-else-if="letterOptions && 0 === letterOptions.length"
      message="J'ai pas compris"
    />
    <AppMessage
      v-else-if="letterOptions"
      message="Choisi une lettre pour l'enregistrer"
    />
    <AppMessage v-else-if="saving" message="Enregistrement" />
  </div>
</template>

<script setup>
import { ID } from "appwrite";
import { computed, inject, onMounted, ref, watch } from "vue";
import AppButton from "../common/AppButton.vue";
import AppMessage from "../common/AppMessage.vue";
import SizedContainer from "../common/SizedContainer.vue";
import HandWritingCanvas from "./RenameHandWritingCanvas.vue";

const saving = ref(false);

const props = defineProps({
  size: { type: Number, required: true },
  photo: { type: String, default: "" },
  event: { type: Object, required: true },
  deviceId: { type: String, required: true },
});

const emit = defineEmits(["reset", "refresh"]);

const trace = ref([]);
const traceRender = ref(null);

const imageElt = ref(null);
const traceSize = ref(null);

const lineWidth = ref(10);
const traceColor = ref("#000000");

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

const sizePx = computed(() => {
  return `${props.size}px`;
});

const topNegativeDelta = computed(() => {
  return `-${traceSize.value}px`;
});

onMounted(() => {
  traceSize.value = imageElt.value.clientWidth;
});

watch(
  () => props.size,
  () => {
    traceSize.value = imageElt.value.clientWidth;
  },
);

const goBack = () => {
  emit("reset");
};

const updateTrace = ({ trace: canvasTrace, render }) => {
  trace.value = canvasTrace;
  traceRender.value = render;
};

const erase = () => {
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

const saveToBucket = async (letter) => {
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
  const traceBase64 = await fetch(traceRender.value);
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

  await databases
    .createDocument(mainDb, mainDbCapturesCol, documentId, {
      letter,
      trace: traceUpload.$id,
      capture: captureUpload.$id,
      event: props.event.id,
      device: props.deviceId,
      traceBox: [
        traceBox.value.minX / traceSize.value,
        traceBox.value.maxX / traceSize.value,
        traceBox.value.minY / traceSize.value,
        traceBox.value.maxY / traceSize.value,
      ],
    })
    .then(() => {
      erase();
      emit("refresh");
    });

  saving.value = false;
};
</script>

<style scoped>
.canvas-box {
  height: v-bind("sizePx");
}

.canvas-delta {
  top: v-bind("topNegativeDelta");
}
</style>
