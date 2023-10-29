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
import { Client, Databases } from "appwrite";
import { computed, inject, onMounted, ref } from "vue";
import LetterScroll from "../demo/LetterScroll.vue";

const mainDb = inject("mainDb");
const mainDbCapturesCol = inject("mainDbCapturesCol");

const letters = ref();

const loading = ref(false);

const phrase = "Les lettres ont du charactère";

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

  const client = new Client();
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

  const databases = new Databases(client);
  const promise = databases.listDocuments(mainDb, mainDbCapturesCol);

  return promise
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
