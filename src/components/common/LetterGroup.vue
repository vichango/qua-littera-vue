<template>
  <div v-if="open">
    <SingleLetter
      v-for="({ trace, capture }, index) of props.captures"
      :key="index"
      :letter="props.letter"
      :trace="trace"
      :capture="capture"
      @click="toggle"
    />
  </div>
  <div
    v-if="!open"
    class="relative inline-flex m-2 w-16 h-16 rounded bg-rose-400 text-2xl justify-center items-center"
    @click="toggle"
  >
    {{ props.letter }}

    <div
      class="absolute inline-flex items-center justify-center w-8 h-8 text-xs text-white bg-red-500 rounded-full -top-3 -right-3"
    >
      {{ props.captures.length }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import SingleLetter from "./SingleLetter.vue";

const open = ref(false);

const props = defineProps({
  letter: { type: String, required: true },
  captures: { type: Array, default: () => [] },
});

onMounted(() => {
  console.log(props.letter, props.captures);
});

const toggle = () => {
  open.value = !open.value;
};
</script>

<style scoped></style>
