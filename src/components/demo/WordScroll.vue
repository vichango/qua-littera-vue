<template>
  <div class="flex flex-row shrink-0 mx-8 my-10">
    <LetterScroll
      v-for="(letter, index) of wordLetters"
      :key="index"
      :letter="letter"
      :show-trace="props.showTrace"
      :captures="letter in props.captures ? props.captures[letter] : []"
      :scroll-request="
        0 < letterLastScroll.length ? letterLastScroll[index] : new Date()
      "
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import LetterScroll from "./LetterScroll.vue";

const props = defineProps({
  word: { type: String, required: true },
  showTrace: { type: Boolean, default: true },
  captures: { type: Object, default: () => {} },
  scrollRequest: { type: Date, required: true },
});

const letterLastScroll = ref([]);
const lastScrollRequest = ref(null);

const wordLetters = computed(() => {
  return props.word.split("");
});

watch(
  () => props.scrollRequest,
  (newValue) => {
    if (newValue > lastScrollRequest.value) {
      lastScrollRequest.value = newValue;
      updateRefresh();
    }
  },
);

const updateRefresh = () => {
  if (0 === letterLastScroll.value.length) {
    letterLastScroll.value = wordLetters.value.map(() => new Date());
  }

  const index = Math.floor(Math.random() * wordLetters.value.length);
  letterLastScroll.value[index] = new Date();
};
</script>

<style scoped></style>
