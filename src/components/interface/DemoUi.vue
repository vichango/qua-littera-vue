<template>
  <div class="w-screen h-screen bg-gray-100 flex justify-center">
    <div v-if="!loading && captures" class="bg-gray-200 flex flex-wrap m-auto">
      <WordScroll
        v-for="(word, index) of targetWords"
        :key="index"
        :word="word"
        :captures="captures"
      />
    </div>
  </div>
</template>

<script setup>
import { Query } from "appwrite";
import { computed, inject, onMounted, ref } from "vue";

import WordScroll from "../demo/WordScroll.vue";

const props = defineProps({
  event: { type: Object, required: true },
});

const mainDb = inject("main-db");
const mainDbCapturesCol = inject("main-db-captures-col");

const captures = ref();

const loading = ref(false);

const targetWords = computed(() => {
  return (
    props.event.target
      .toUpperCase()
      // .normalize("NFD")
      // .replace(/[\u0300-\u036f]/g, "")
      .split(" ")
  );
});

onMounted(() => {
  fetchLetters();
});

const fetchLetters = () => {
  loading.value = true;

  const databases = inject("appwrite-databases");

  return databases
    .listDocuments(mainDb, mainDbCapturesCol, [
      Query.equal("event", props.event.id),
    ])
    .then(
      function (response) {
        captures.value = response.documents.reduce(
          (acc, { letter, device, trace, capture }) => {
            return {
              ...acc,
              [letter]: [
                ...(acc[letter] || []),
                {
                  letter,
                  player: device,
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

<style scoped></style>
