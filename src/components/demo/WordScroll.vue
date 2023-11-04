<template>
  <div class="flex flex-row shrink-0 mx-8 my-10">
    <LetterScroll
      v-for="(letter, index) of wordLetters"
      :key="index"
      :letter="letter"
      :captures="letter in props.captures ? props.captures[letter] : []"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import LetterScroll from "./LetterScroll.vue";

const props = defineProps({
  word: { type: String, required: true },
  captures: { type: Object, default: () => {} },
});

const wordLetters = computed(() => {
  return props.word.split("");
});
</script>

<style scoped></style>
