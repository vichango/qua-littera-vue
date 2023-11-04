<template>
  <div v-if="event && playerId" class="flex h-screen">
    <qrcode-vue
      :value="playerUrl"
      level="L"
      :style="{ position: 'absolute', bottom: '12px', right: '12px' }"
    />
    <div class="flex flex-col md:flex-row w-full">
      <div class="w-full md:basis-1/2">
        <CaptureMain :event="props.event" :player-id="props.playerId" />
      </div>
      <div class="flex w-full md:basis-1/2">
        <div class="w-full flex flex-col lg:flex-row h-screen">
          <div class="lg:basis-1/2">
            <h1 class="text-2xl align-center text-violet-600 p-2 pb-4">
              Tes captures
            </h1>

            <LetterList
              v-if="yourLetters"
              :event="props.event"
              :player-id="props.playerId"
              :captures="yourLetters"
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
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Query } from "appwrite";
import QrcodeVue from "qrcode.vue";
import { computed, inject, onMounted, ref } from "vue";
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

const playerUrl = computed(() => {
  return `${import.meta.env.VITE_SERVER_URL}/?eid=${props.event.id}&pid=${
    props.playerId
  }`;
});

onMounted(() => {
  fetchYourLetters();
  fetchAllLetters();
});

const databases = inject("appwrite-databases");

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
          ({ $id, letter, device, trace, capture }) => ({
            id: $id,
            letter,
            player: device,
            trace,
            capture,
          }),
        );
      },
      function (error) {
        console.log(error);
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
          ({ $id, letter, device, trace, capture }) => ({
            id: $id,
            letter,
            player: device,
            trace,
            capture,
          }),
        );
      },
      function (error) {
        console.log(error);
      },
    );
};
</script>

<style scoped></style>
