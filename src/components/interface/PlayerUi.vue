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
        <div class="w-full flex flex-col lg:flex-row">
          <div class="lg:basis-1/2">
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
          <div class="lg:basis-1/2">
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

const yourLetters = ref();
const allLetters = ref();

const mainDb = inject("main-db");
const mainDbCapturesCol = inject("main-db-captures-col");

onMounted(() => {
  doRefresh();
});

const databases = inject("appwrite-databases");

const doRefresh = () => {
  fetchYourLetters();
  fetchAllLetters();
};

const fetchYourLetters = () => {
  return databases
    .listDocuments(mainDb, mainDbCapturesCol, [
      Query.equal("event", props.event.id),
      Query.equal("device", props.playerId),
      Query.limit(25),
      Query.offset(0),
    ])
    .then(
      function (response) {
        yourLetters.value = response.documents.map(
          ({ $id, letter, device, trace, traceBox, capture }) => {
            const [minX, maxX, minY, maxY] =
              0 === traceBox.length ? [0, 0, 1, 1] : traceBox;

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

const fetchAllLetters = () => {
  return databases
    .listDocuments(mainDb, mainDbCapturesCol, [
      Query.equal("event", props.event.id),
      Query.limit(25),
      Query.offset(0),
    ])
    .then(
      function (response) {
        allLetters.value = response.documents.map(
          ({ $id, letter, device, trace, traceBox, capture }) => {
            const [minX, maxX, minY, maxY] =
              0 === traceBox.length ? [0, 0, 1, 1] : traceBox;

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
