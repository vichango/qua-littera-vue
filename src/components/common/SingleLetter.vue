<template>
  <div class="letter-container">
    <img :src="captureUrl" :width="size" :height="size" class="rounded" />
    <img
      :src="traceUrl"
      :width="size"
      :height="size"
      class="relative rounded trace"
    />
    <button
      v-if="props.playerId === props.capture.player"
      class="relative inline-flex items-center justify-center w-8 h-8 text-xs text-violet-600 bg-violet-300 rounded-full -top-[166px] start-[90px]"
      @click="deleteCapture"
    >
      <font-awesome-icon icon="fa-solid fa-trash" />
    </button>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue";

const props = defineProps({
  size: { type: Number, default: 128 },
  capture: { type: Object, required: true },
  playerId: { type: String, required: true },
});

const traceUrl = ref(null);
const captureUrl = ref(null);

const tracesBucket = inject("traces-bucket");
const capturesBucket = inject("captures-bucket");

const mainDb = inject("main-db");
const mainDbCapturesCol = inject("main-db-captures-col");

const storage = inject("appwrite-storage");
const databases = inject("appwrite-databases");

const sizePixels = computed(() => {
  return `${props.size}px`;
});

const sizeNegPixels = computed(() => {
  return `-${props.size}px`;
});

onMounted(() => {
  traceUrl.value = storage.getFilePreview(
    tracesBucket,
    props.capture.trace,
    props.size,
    props.size,
  ).href;
  captureUrl.value = storage.getFilePreview(
    capturesBucket,
    props.capture.capture,
    props.size,
    props.size,
  ).href;
});

const deleteCapture = () => {
  // Delete bucket files.
  storage.deleteFile(capturesBucket, props.capture.capture);
  storage.deleteFile(tracesBucket, props.capture.trace);

  // Delete document.
  databases.deleteDocument(mainDb, mainDbCapturesCol, props.capture.id);
};
</script>

<style scoped>
.trace {
  top: v-bind(sizeNegPixels);
}

.letter-container {
  height: v-bind(sizePixels);
}
</style>
