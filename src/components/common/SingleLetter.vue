<template>
  <div class="letter-container">
    <ReframedImage
      v-if="captureUrl"
      :src="captureUrl"
      :size="props.size"
      :trace-box="props.capture.traceBox"
    />
    <div
      v-if="playerId"
      data-v-f9a97fe0=""
      class="minimize action relative inline-flex items-center justify-center text-gray-600 rounded-full"
    >
      <font-awesome-icon icon="fa-solid fa-minimize" />
    </div>

    <div class="trace">
      <ReframedImage
        v-if="traceUrl"
        :src="traceUrl"
        :size="props.size"
        :trace-box="props.capture.traceBox"
      />
      <button
        v-if="isGod || props.playerId === props.capture.player"
        class="remove action relative inline-flex items-center justify-center text-violet-600 bg-violet-300 rounded-full"
        @click.stop="deleteCapture"
      >
        <font-awesome-icon icon="fa-solid fa-trash" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue";
import ReframedImage from "./ReframedImage.vue";

const props = defineProps({
  size: { type: Number, default: 128 },
  previewSize: { type: Number, default: null },
  capture: { type: Object, required: true },
  playerId: { type: String, default: null },
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
  return `-${props.size + (props.playerId ? actionSize : 0)}px`;
});

const sizeNegPixels = computed(() => {
  return `-${props.size}px`;
});

const removeActionTop = computed(() => {
  return `-${actionSize}px`;
});

const removeActionLeft = computed(() => {
  return `${props.size - actionSize}px`;
});

onMounted(() => {
  traceUrl.value =
    null !== props.previewSize
      ? storage.getFilePreview(
          tracesBucket,
          props.capture.trace,
          props.previewSize,
          props.previewSize,
        ).href
      : storage.getFileView(tracesBucket, props.capture.trace).href;

  captureUrl.value =
    null !== props.previewSize
      ? storage.getFilePreview(
          capturesBucket,
          props.capture.capture,
          props.size,
          props.size,
        ).href
      : storage.getFileView(capturesBucket, props.capture.capture).href;
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
  position: relative;
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
