<template>
  <div class="flex h-screen">
    <div class="flex w-full">
      <div v-if="isGod" class="flex flex-col w-full">
        <div class="bg-violet-100 md:h-screen p-6">
          <h1 class="text-2xl align-center text-violet-600 p-2 pb-4">
            Toutes les captures
          </h1>

          <LetterList
            v-if="allLetters"
            :event="event"
            :player-id="props.playerId"
            :captures="Object.values(allLetters)"
            @refresh="doReset"
          />
        </div>
      </div>
    </div>
    <div class="text-end bg-violet-300">
      <button
        class="bg-violet-300 text-violet-400 py-2 px-4 mx-1 my-4 rounded"
        @click="fetchAllLetters"
      >
        <font-awesome-icon icon="fa-solid fa-rotate" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Query } from "appwrite";
import { inject, onMounted, ref } from "vue";
import LetterList from "../lists/LetterList.vue";

const props = defineProps({
  event: { type: Object, required: true },
  playerId: { type: String, required: true },
});

const allLetters = ref({});
const maxCreatedAt = ref(null);

const mainDb = inject("main-db");
const mainDbCapturesCol = inject("main-db-captures-col");

const isGod = "godmode" === inject("mode");

onMounted(() => {
  fetchAllLetters();
});

const databases = inject("appwrite-databases");

const doReset = () => {
  allLetters.value = {};
  maxCreatedAt.value = null;

  fetchAllLetters();
};

const fetchAllLetters = () => {
  const queries = [
    Query.equal("event", props.event.id),
    Query.orderAsc("$createdAt"),
  ];

  if (maxCreatedAt.value) {
    queries.push(
      Query.greaterThanEqual("$createdAt", maxCreatedAt.value.toISOString()),
    );
  }

  databases.listDocuments(mainDb, mainDbCapturesCol, queries).then(
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
        if (!(id in allLetters.value)) {
          const [minX, maxX, minY, maxY] =
            0 < traceBox.length ? traceBox : [0, 1, 0, 1];

          allLetters.value[id] = {
            id,
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
      console.error(error);
    },
  );
};
</script>

<style scoped></style>
