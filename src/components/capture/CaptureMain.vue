<template>
  <div v-if="'nothing' === doing" class="bg-blue-200 md:h-screen">
    <div class="placeholder p-4 my-0 mx-auto overflow-hidden bg-blue-400"></div>
    <div class="w-full flex justify-center">
      <button
        class="border-2 border-blue-500 text-blue-500 font-bold py-2 px-4 m-2 rounded"
        @click="doing = 'capture'"
      >
        Démarrer
        <font-awesome-icon icon="fa-solid fa-play" class="ms-3" />
      </button>
    </div>
  </div>
  <ImageCapture v-else-if="'capture' === doing" @captured="customSave" />
  <HandwritingCanvas
    v-else-if="'drawing' === doing"
    :photo="capturedSrc"
    :device-id="props.deviceId"
    @reset="resetCapture"
  />
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref } from "vue";
import HandwritingCanvas from "./HandwritingCanvas.vue";
import ImageCapture from "./ImageCapture.vue";

const props = defineProps({
  deviceId: { type: String, required: true },
});

const doing = ref("nothing");
const capturedSrc = ref("");

const tracesBuc = inject("tracesBuc");
const capturesBuc = inject("capturesBuc");
const mainDb = inject("mainDb");
const mainDbCapturesCol = inject("mainDbCapturesCol");

const size = ref(Math.min(480, window.innerWidth));
const sizePx = computed(() => {
  return `${size.value}px`;
});

onMounted(() => {
  window.addEventListener("resize", resizeCanvas);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
});

const resizeCanvas = () => {
  size.value = Math.min(480, window.innerWidth);
};

const customSave = (src) => {
  capturedSrc.value = src;
  doing.value = "drawing";
};

// const saveToBucket = async (letter, trace64) => {
//   const client = new Client();
//   const storage = new Storage(client);
//   const databases = new Databases(client);

//   // Save capture file.
//   client
//     .setEndpoint("https://cloud.appwrite.io/v1")
//     .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

//   const captureBase64 = await fetch(capturedSrc.value);
//   const captureBlob = await captureBase64.blob();
//   const captureFile = new File([captureBlob], "capture.png", {
//     type: "image/png",
//   });

//   const captureFileId = ID.unique();

//   const captureUpload = await storage.createFile(
//     capturesBuc,
//     captureFileId,
//     captureFile,
//   );

//   // Save trace file.
//   client
//     .setEndpoint("https://cloud.appwrite.io/v1")
//     .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

//   const traceBase64 = await fetch(trace64);
//   const traceBlob = await traceBase64.blob();
//   const traceFile = new File([traceBlob], "trace.png", {
//     type: "image/png",
//   });

//   const traceFileId = ID.unique();

//   const traceUpload = await storage.createFile(
//     tracesBuc,
//     traceFileId,
//     traceFile,
//   );

//   // Save in database.
//   const documentId = ID.unique();

//   const promise = databases.createDocument(
//     mainDb,
//     mainDbCapturesCol,
//     documentId,
//     {
//       letter,
//       trace: traceUpload.$id,
//       capture: captureUpload.$id,
//       device: props.deviceId,
//     },
//   );

//   promise.then(
//     function (response) {
//       console.log(response);
//     },
//     function (error) {
//       console.log(error);
//     },
//   );
// };

const resetCapture = () => {
  capturedSrc.value = "";
  doing.value = "capture";
};
</script>

<style scoped>
.placeholder {
  width: v-bind("sizePx");
  height: v-bind("sizePx");
}
</style>
