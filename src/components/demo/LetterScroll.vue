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
      :class="index === i ? '' : 'hidden'"
      :letter="props.letter"
      :capture="capture"
      @click="toggle"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import SingleLetter from "../common/SingleLetter.vue";

const index = ref(0);

const props = defineProps({
  letter: { type: String, required: true },
  captures: { type: Array, default: () => [] },
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
  width: 128px;
  height: 128px;
}
</style>
