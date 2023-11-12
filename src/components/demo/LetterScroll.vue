<template>
  <div
    v-if="props.captures.length < 1"
    class="no-capture me-[12px] rounded border-dashed border-2 border-gray-300 text-gray-300 text-2xl inline-flex justify-center items-center"
  >
    {{ props.letter }}
  </div>
  <div v-else class="me-[12px]">
    <SingleLetter
      v-for="(capture, i) of props.captures"
      :key="i"
      :size="256"
      :class="index === i ? '' : 'hidden'"
      :letter="props.letter"
      :show-trace="props.showTrace"
      :capture="capture"
      @click="toggle"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import SingleLetter from "../common/SingleLetter.vue";

const index = ref(0);

const props = defineProps({
  size: { type: Number, default: 256 },
  letter: { type: String, required: true },
  showTrace: { type: Boolean, default: true },
  captures: { type: Array, default: () => [] },
});

const sizePixels = computed(() => {
  return `${props.size}px`;
});

const toggle = () => {
  index.value = (index.value + 1) % props.captures.length;
};

onMounted(() => {
  setInterval(toggle, 1000);
});
</script>

<style scoped>
.no-capture {
  width: v-bind(sizePixels);
  height: v-bind(sizePixels);
}
</style>
