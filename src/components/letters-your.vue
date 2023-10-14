<template>
  <h1>Your letters</h1>

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
import SingleLetter from "./single-letter.vue";

const letters = ref();

const loading = ref(false);
const error = ref(null);

onMounted(() => {
  fetchLetters();
});

const fetchLetters = () => {
  loading.value = true;

  return fetch(`${import.meta.env.VITE_API_URL}/letter`, {
    method: "get",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        const error = new Error(res.statusText);
        error.json = res.json();
        throw error;
      }

      return res.json();
    })
    .then((json) => {
      letters.value = json.data;
    })
    .catch((err) => {
      error.value = err;
      if (err.json) {
        return err.json.then((json) => {
          error.value.message = json.message;
        });
      }
    })
    .then(() => {
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
