<template>
  <div
    v-if="' ' === props.letter"
    class="no-capture inline-flex m-2 rounded"
  ></div>
  <div
    v-else-if="props.captures.length < 1"
    class="no-capture inline-flex m-2 rounded bg-violet-400 text-2xl justify-center items-center"
  >
    {{ props.letter }}
  </div>
  <div v-else class="m-2 inline-flex flex flex-wrap">
    <SingleLetter
      v-for="({ trace, capture }, i) of props.captures"
      :key="i"
      :class="index === i ? '' : 'hidden'"
      :letter="props.letter"
      :trace="trace"
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
