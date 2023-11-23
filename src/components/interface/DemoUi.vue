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
import { computed, inject, onMounted, ref, watch } from "vue";

import WordScroll from "../demo/WordScroll.vue";

const props = defineProps({
  event: { type: Object, required: true },
});

const mainDb = inject("main-db");
const mainDbCapturesCol = inject("main-db-captures-col");

const databases = inject("appwrite-databases");

const maxCreatedAt = ref(null);
const allCaptures = ref({});
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
  // setInterval(() => {
  //   console.log("Re-fetching.");
  //   fetchLetters();
  // }, 30000);
});

watch(
  () => Object.keys(allCaptures.value).length,
  () => {
    captures.value = Object.values(allCaptures).reduce(
      (acc, { letter, ...rest }) => {
        return {
          ...acc,
          [letter]: [
            ...(acc[letter] || []),
            {
              letter,
              ...rest,
            },
          ],
        };
      },
      {},
    );
  },
);

const toggleTrace = () => {
  trace.value = !trace.value;
};

const fetchLetters = () => {
  loading.value = true;

  const queries = [
    Query.equal("event", props.event.id),
    Query.orderAsc("$createdAt"),
  ];

  if (maxCreatedAt.value) {
    queries.push(
      Query.greaterThanEqual("$createdAt", maxCreatedAt.value.toISOString()),
    );
  }

  return databases
    .listDocuments(mainDb, mainDbCapturesCol, queries)
    .then(
      function (response) {
        response.documents.forEach((entry) => {
          const {
            $id: id,
            letter,
            device,
            trace,
            traceBox,
            capture,
            $createdAt: createdAt,
          } = entry;

          // Update captures.
          if (!(id in allCaptures.value)) {
            const [minX, maxX, minY, maxY] =
              0 < traceBox.length ? traceBox : [0, 1, 0, 1];

            allCaptures.value[id] = {
              letter,
              player: device,
              trace,
              traceBox: { minX, maxX, minY, maxY },
              capture,
            };
          }

          // Update max created at date.
          const createdAtDate = new Date(createdAt);
          if (!maxCreatedAt.value || maxCreatedAt.value <= createdAtDate) {
            maxCreatedAt.value = createdAtDate;
          }
        });
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
