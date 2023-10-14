<template>
  <h1>Vos captures</h1>

  <p v-if="error"></p>

  <div v-if="letters">
    <SingleLetter
      v-for="letter of Object.keys(letters)"
      :key="letter"
      :letter="letter"
      :count="letters[letter]"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import SingleLetter from "../common/SingleLetter.vue";
import { Client, Databases } from "appwrite";

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
  const promise = databases.listDocuments(
    "652a6efd64951d089865",
    "652a6f03d4a60d2f31bb",
  );

  return promise
    .then(
      function (response) {
        letters.value = response.documents.reduce((acc, { letter, count }) => {
          return { ...acc, [letter]: count };
        }, {});
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
