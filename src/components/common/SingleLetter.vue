<template>
  <div class="letter-container">
    <img :src="captureUrl" :width="size" :height="size" class="rounded" />
    <div
      data-v-f9a97fe0=""
      class="minimize action relative inline-flex items-center justify-center text-gray-600 rounded-full"
    >
      <font-awesome-icon icon="fa-solid fa-minimize" />
    </div>
    <img
      :src="traceUrl"
      :width="size"
      :height="size"
      class="relative rounded trace"
    />
    <button
      v-if="isGod || props.playerId === props.capture.player"
      class="remove action relative inline-flex items-center justify-center text-violet-600 bg-violet-300 rounded-full"
      @click.stop="deleteCapture"
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

const emit = defineEmits(["refresh"]);

const traceUrl = ref(null);
const captureUrl = ref(null);

const tracesBucket = inject("traces-bucket");
const capturesBucket = inject("captures-bucket");

const mainDb = inject("main-db");
const mainDbCapturesCol = inject("main-db-captures-col");

const storage = inject("appwrite-storage");
const databases = inject("appwrite-databases");

const actionSize = 32;

const isGod = "godmode" === inject("mode");

const sizePixels = computed(() => {
  return `${props.size}px`;
});

const traceTop = computed(() => {
  return `-${props.size + actionSize}px`;
});

const sizeNegPixels = computed(() => {
  return `-${props.size}px`;
});

const removeActionTop = computed(() => {
  return `-${props.size + 2 * actionSize}px`;
});

const removeActionLeft = computed(() => {
  return `${props.size - actionSize}px`;
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

const deleteCapture = async () => {
  // Delete bucket files.
  await storage.deleteFile(capturesBucket, props.capture.capture);
  await storage.deleteFile(tracesBucket, props.capture.trace);
  // Delete document.
  await databases.deleteDocument(mainDb, mainDbCapturesCol, props.capture.id);

  emit("refresh");
};
</script>

<style scoped>
.trace {
  top: v-bind(traceTop);
}

.minimize {
  top: v-bind(sizeNegPixels);
  mix-blend-mode: difference;
}

.action {
  height: 32px;
  width: 32px;
}

.remove {
  top: v-bind(removeActionTop);
  left: v-bind(removeActionLeft);
  margin: -2px;
}

.letter-container {
  height: v-bind(sizePixels);
}
</style>
