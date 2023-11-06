<template>
  <div v-if="'nothing' === doing" class="bg-blue-200 md:h-screen">
    <div class="placeholder p-4 my-0 mx-auto overflow-hidden bg-blue-400"></div>
    <div class="w-full flex justify-center">
      <button
        class="border-2 border-blue-500 text-blue-500 font-bold py-2 px-4 m-6 rounded"
        @click="doing = 'capture'"
      >
        Démarrer
        <font-awesome-icon icon="fa-solid fa-play" class="ms-3" />
      </button>
    </div>

    <div class="w-full flex justify-center">
      <p class="text-blue-400">Fais clic pour commencer</p>
    </div>
  </div>
  <ImageCapture v-else-if="'capture' === doing" @captured="customSave" />
  <HandwritingCanvas
    v-else-if="'drawing' === doing"
    :photo="capturedSrc"
    :event="props.event"
    :device-id="props.playerId"
    @reset="resetCapture"
  />
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import HandwritingCanvas from "./HandwritingCanvas.vue";
import ImageCapture from "./ImageCapture.vue";

const props = defineProps({
  event: { type: Object, required: true },
  playerId: { type: String, required: true },
});

const doing = ref("nothing");
const capturedSrc = ref("");

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
