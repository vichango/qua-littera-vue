<template>
  <h1 class="text-2xl align-center text-violet-600 my-4">
    Toutes les captures
  </h1>

  <p v-if="error"></p>

  <div v-if="letters">
    <LetterGroup
      v-for="([letter, captures], index) of Object.entries(letters)"
      :key="index"
      :letter="letter"
      :captures="captures"
    />
  </div>
</template>

<script setup>
import { Client, Databases } from "appwrite";
import { inject, onMounted, ref } from "vue";
import LetterGroup from "../common/LetterGroup.vue";

const mainDb = inject("mainDb");
const mainDbCapturesCol = inject("mainDbCapturesCol");

const letters = ref();

const loading = ref(false);
const error = ref(null);

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

<style scoped>
.letter-box {
  width: 3em;
  height: 3em;
  background-color: brown;
  text-align: center;
  margin: 0.25em;
  display: inline-block;
}

.letter {
  vertical-align: middle;
  color: gold;
}
</style>
