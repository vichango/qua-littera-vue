<template>
  <div class="flex md:h-screen">
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
            :captures="allLetters"
            @refresh="doRefresh"
          />
        </div>
      </div>
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

const allLetters = ref([]);

const mainDb = inject("main-db");
const mainDbCapturesCol = inject("main-db-captures-col");

const isGod = "godmode" === inject("mode");

onMounted(() => {
  doRefresh();
});

const databases = inject("appwrite-databases");

const doRefresh = () => {
  fetchAllLetters();
};

const fetchAllLetters = () => {
  return databases
    .listDocuments(mainDb, mainDbCapturesCol, [
      Query.equal("event", props.event.id),
    ])
    .then(
      function (response) {
        allLetters.value = response.documents.map(
          ({ $id, letter, device, trace, traceBox, capture }) => {
            const [minX, maxX, minY, maxY] =
              0 < traceBox.length ? traceBox : [0, 1, 0, 1];

            return {
              id: $id,
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
            };
          },
        );
      },
      function (error) {
        console.error(error);
      },
    );
};
</script>

<style scoped></style>
