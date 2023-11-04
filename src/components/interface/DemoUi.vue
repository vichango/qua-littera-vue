<template>
  <div v-if="letters">
    <LetterScroll
      v-for="(letter, index) of phraseLetters"
      :key="index"
      :letter="letter"
      :captures="letter in letters ? letters[letter] : []"
    />
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue";
import LetterScroll from "../demo/LetterScroll.vue";

const props = defineProps({
  event: { type: Object, required: true },
});

const mainDb = inject("main-db");
const mainDbCapturesCol = inject("main-db-captures-col");

const letters = ref();

const loading = ref(false);

const phrase = props.event.target;

const phraseLetters = computed(() => {
  const words = phrase.split(" ");
  console.log(words);

  return words.reduce((acc, curr, index) => {
    if (index + 1 < words.length) {
      return [
        ...acc,
        ...curr.split("").map((letter) => letter.toUpperCase()),
        " ",
      ];
    } else {
      return [...acc, ...curr.split("").map((letter) => letter.toUpperCase())];
    }
  }, []);
});

onMounted(() => {
  fetchLetters();
});

const fetchLetters = () => {
  loading.value = true;

  const databases = inject("appwrite-databases");

  return databases
    .listDocuments(mainDb, mainDbCapturesCol)
    .then(
      function (response) {
        letters.value = response.documents.reduce(
          (acc, { letter, deviceId, trace, capture }) => {
            return {
              ...acc,
              [letter]: [
                ...(acc[letter] || []),
                {
                  letter,
                  deviceId,
                  trace,
                  capture,
                },
              ],
            };
          },
          {},
        );

        console.log(letters.value);
      },
      function (error) {
        console.log(error);
      },
    )
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped></style>
