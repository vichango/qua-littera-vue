<template>
  <div class="letter-container">
    <img :src="captureUrl" width="128" height="128" />
    <img :src="traceUrl" width="128" height="128" class="relative traced" />
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";

const props = defineProps({
  letter: { type: String, required: true },
  trace: { type: String, required: true },
  capture: { type: String, required: true },
});

const traceUrl = ref(null);
const captureUrl = ref(null);

const tracesBuc = inject("traces-bucket");
const capturesBuc = inject("captures-bucket");

const storage = inject("appwrite-storage");

onMounted(() => {
  traceUrl.value = storage.getFilePreview(
    tracesBuc,
    props.trace,
    128,
    128,
  ).href;
  captureUrl.value = storage.getFilePreview(
    capturesBuc,
    props.capture,
    128,
    128,
  ).href;
});
</script>

<style scoped>
.traced {
  top: -128px;
}

.letter-container {
  height: 128px;
}
</style>
