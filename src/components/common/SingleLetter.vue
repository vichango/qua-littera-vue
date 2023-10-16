<template>
  <div class="letter-container">
    <img :src="captureUrl" width="128" height="128" />
    <img :src="traceUrl" width="128" height="128" class="relative traced" />
  </div>
</template>

<script setup>
import { Client, Storage } from "appwrite";
import { inject, onMounted, ref } from "vue";

const props = defineProps({
  letter: { type: String, required: true },
  trace: { type: String, required: true },
  capture: { type: String, required: true },
});

const traceUrl = ref(null);
const captureUrl = ref(null);

const client = new Client();
const storage = new Storage(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

const tracesBuc = inject("tracesBuc");
const capturesBuc = inject("capturesBuc");

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
