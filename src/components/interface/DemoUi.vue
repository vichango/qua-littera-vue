<template>
  <div class="w-screen h-screen bg-gray-100">
    <div class="text-end">
      <button
        class="bg-gray-200 text-gray-300 py-2 px-4 mx-1 my-4 rounded"
        @click="toggleTrace"
      >
        <font-awesome-icon icon="fa-solid fa-mask" />
      </button>
    </div>
    <div class="w-full h-full bg-gray-100 flex flex-col justify-center">
      <div
        v-if="!loading && captures"
        class="bg-gray-200 flex flex-wrap m-auto"
      >
        <WordScroll
          v-for="(word, index) of targetWords"
          :key="index"
          :word="word"
          :show-trace="trace"
          :captures="captures"
        />
      </div>
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
const trace = ref(true);

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

const toggleTrace = () => {
  trace.value = !trace.value;
};

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
          (acc, { letter, device, trace, traceBox, capture }) => {
            const [minX, maxX, minY, maxY] =
              0 < traceBox.length ? traceBox : [0, 1, 0, 1];

            return {
              ...acc,
              [letter]: [
                ...(acc[letter] || []),
                {
                  letter,
                  player: device,
                  trace,
                  traceBox: {
                    minX,
                    maxX,
                    minY,
                    maxY,
                  },
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
