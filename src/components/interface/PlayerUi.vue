<template>
  <div v-if="event && playerId" class="flex md:h-screen">
    <div class="flex flex-col md:flex-row w-full">
      <div class="w-full md:basis-1/2">
        <CaptureMain
          :event="props.event"
          :player-id="props.playerId"
          @refresh="doRefresh"
        />
      </div>
      <div class="flex w-full md:basis-1/2">
        <div class="flex flex-col w-full">
          <div class="bg-violet-100 md:h-screen p-6">
            <h1 class="text-2xl align-center text-violet-600 p-2 pb-4">
              Tes captures
            </h1>

            <LetterList
              v-if="yourLetters"
              :event="props.event"
              :player-id="props.playerId"
              :captures="yourLetters"
              @refresh="doRefresh"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Query } from "appwrite";
import { inject, onMounted, ref } from "vue";
import CaptureMain from "../capture/CaptureMain.vue";
import LetterList from "../lists/LetterList.vue";

const props = defineProps({
  event: { type: Object, required: true },
  playerId: { type: String, required: true },
});

const yourLetters = ref([]);

const databases = inject("appwrite-databases");

const mainDb = inject("main-db");
const mainDbCapturesCol = inject("main-db-captures-col");

onMounted(() => {
  doRefresh();
});

const doRefresh = () => {
  fetchYourLetters();
};

const fetchYourLetters = () => {
  yourLetters.value = [];

  return databases
    .listDocuments(mainDb, mainDbCapturesCol, [
      Query.equal("event", props.event.id),
      Query.equal("device", props.playerId),
    ])
    .then(
      function (response) {
        yourLetters.value = response.documents.map(
          ({ $id: id, letter, device, trace, traceBox, capture }) => {
            const [minX, maxX, minY, maxY] =
              0 < traceBox.length ? traceBox : [0, 1, 0, 1];

            return {
              id,
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
