<template>
  <div class="letter-container">
    <img :src="captureUrl" :width="size" :height="size" class="rounded" />
    <img
      :src="traceUrl"
      :width="size"
      :height="size"
      class="relative rounded trace"
    />
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue";

const props = defineProps({
  letter: { type: String, required: true },
  trace: { type: String, required: true },
  capture: { type: String, required: true },
  size: { type: Number, default: 128 },
});

const traceUrl = ref(null);
const captureUrl = ref(null);

const tracesBuc = inject("traces-bucket");
const capturesBuc = inject("captures-bucket");

const storage = inject("appwrite-storage");

const sizePixels = computed(() => {
  return `${props.size}px`;
});

const sizeNegPixels = computed(() => {
  return `-${props.size}px`;
});

onMounted(() => {
  traceUrl.value = storage.getFilePreview(
    tracesBuc,
    props.trace,
    props.size,
    props.size,
  ).href;
  captureUrl.value = storage.getFilePreview(
    capturesBuc,
    props.capture,
    props.size,
    props.size,
  ).href;
});
</script>

<style scoped>
.trace {
  top: v-bind(sizeNegPixels);
}

.letter-container {
  height: v-bind(sizePixels);
}
</style>
