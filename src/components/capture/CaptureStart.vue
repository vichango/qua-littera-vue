<template>
  <div class="bg-blue-200 md:h-screen py-6">
    <div class="placeholder p-4 my-0 mx-auto overflow-hidden bg-blue-400"></div>
    <div class="w-full flex justify-center">
      <button
        class="border-2 border-blue-500 text-blue-500 font-bold py-2 px-4 m-6 rounded"
        @click="emit('proceed')"
      >
        Démarrer
        <font-awesome-icon icon="fa-solid fa-play" class="ms-3" />
      </button>
    </div>

    <div class="w-full flex justify-center">
      <p class="text-blue-400 my-6 px-4 text-center">
        Fais clic pour commencer
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const emit = defineEmits(["proceed"]);

const props = defineProps({
  size: { type: Number, required: true },
});

const sizePx = computed(() => {
  return `${props.size}px`;
});
</script>

<style scoped>
.placeholder {
  width: v-bind("sizePx");
  height: v-bind("sizePx");
}
</style>
