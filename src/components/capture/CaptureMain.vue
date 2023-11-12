<template>
  <CaptureStart
    v-if="'nothing' === doing"
    :size="size"
    @proceed="startCapture"
  />
  <ImageCapture
    v-else-if="'capture' === doing"
    :size="size"
    @captured="customSave"
    @stop="customStop"
  />
  <HandWriting
    v-else-if="'drawing' === doing"
    :size="size"
    :photo="capturedSrc"
    :event="props.event"
    :device-id="props.playerId"
    @reset="resetCapture"
  />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import CaptureStart from "./CaptureStart.vue";
import HandWriting from "./HandWriting.vue";
import ImageCapture from "./ImageCapture.vue";

const props = defineProps({
  event: { type: Object, required: true },
  playerId: { type: String, required: true },
});

const doing = ref("nothing");
const capturedSrc = ref("");

const size = ref(Math.min(480, window.innerWidth));

onMounted(() => {
  window.addEventListener("resize", resizeCanvas);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
});

const resizeCanvas = () => {
  size.value = Math.min(480, window.innerWidth);
};

const startCapture = () => {
  doing.value = "capture";
};

const customStop = () => {
  doing.value = "nothing";
};

const customSave = (src) => {
  capturedSrc.value = src;
  doing.value = "drawing";
};

const resetCapture = () => {
  capturedSrc.value = "";
  doing.value = "capture";
};
</script>

<style scoped></style>
