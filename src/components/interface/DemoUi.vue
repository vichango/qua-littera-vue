<template>
  <div class="w-screen h-screen bg-gray-100">
    <div class="w-full h-full bg-gray-100 flex flex-col justify-center">
      <div v-if="captures" class="bg-gray-100 flex flex-wrap m-auto">
        <WordScroll
          v-for="(word, index) of targetWords"
          :key="index"
          :word="word"
          :show-trace="trace"
          :captures="captures"
          :scroll-request="
            word in wordsScrollRequest ? wordsScrollRequest[word] : new Date()
          "
        />
      </div>
    </div>
    <div class="text-end bg-gray-100">
      <button
        class="bg-gray-200 text-gray-300 py-2 px-4 mx-1 my-4 rounded"
        @click="toggleTrace"
      >
        <font-awesome-icon icon="fa-solid fa-mask" />
      </button>
      <button
        class="bg-gray-200 text-gray-300 py-2 px-4 mx-1 my-4 rounded"
        @click="updateRefresh"
      >
        <font-awesome-icon icon="fa-solid fa-rotate" />
      </button>
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
const captures = ref({});

const trace = ref(true);

const wordsScrollRequest = ref({});

const targetWordsLength = computed(() => {
  return targetWords.value.reduce((acc, word) => acc + word.length, 0);
});

const targetWords = computed(() => {
  return props.event.target
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ");
});

const targetLetters = computed(() => {
  return targetWords.value.reduce((acc, word) => {
    return [...acc, ...word.split("")];
  }, []);
});

onMounted(() => {
  captures.value = targetLetters.value.reduce((acc, letter) => {
    if (!(letter in acc)) {
      acc[letter] = {};
    }

    return acc;
  }, {});

  fetchLetters();

  setInterval(() => {
    console.log("Re-fetching.");
    fetchLetters();
  }, 60000);

  setInterval(() => {
    updateRefresh();
  }, 15000);
});

watch(
  () => Object.keys(allCaptures.value).length,
  () => {
    // Update letters.
    Object.entries(allCaptures.value).forEach(([id, { letter, ...rest }]) => {
      if (letter in captures.value && !(id in captures.value[letter])) {
        captures.value[letter][id] = { letter, ...rest };
      }
    });
  },
);

const toggleTrace = () => {
  trace.value = !trace.value;
};

const updateRefresh = () => {
  targetWords.value.forEach((word) => {
    if (!(word in wordsScrollRequest.value)) {
      wordsScrollRequest.value[word] = new Date();
    }

    if (Math.random() <= word.length / targetWordsLength.value) {
      console.log('Refreshing "' + word + '"');
      wordsScrollRequest.value[word] = new Date();
    }
  });
};

const fetchLetters = () => {
  const queries = [
    Query.equal("event", props.event.id),
    Query.orderAsc("$createdAt"),
  ];

  if (maxCreatedAt.value) {
    queries.push(
      Query.greaterThanEqual("$createdAt", maxCreatedAt.value.toISOString()),
    );
  }

  return databases.listDocuments(mainDb, mainDbCapturesCol, queries).then(
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

          const upLetter = letter
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          allCaptures.value[id] = {
            id,
            letter: upLetter,
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
  );
};
</script>

<style scoped></style>
