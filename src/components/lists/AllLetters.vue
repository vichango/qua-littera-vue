<template>
  <h1 class="text-2xl align-center text-violet-600 my-4">
    Toutes les captures
  </h1>

  <div v-if="letters">
    <LetterGroup
      v-for="([letter, captures], index) of Object.entries(letters)"
      :key="index"
      :letter="letter"
      :captures="captures"
      :player-id="props.playerId"
    />
  </div>
</template>

<script setup>
import { Query } from "appwrite";
import { inject, onMounted, ref } from "vue";
import LetterGroup from "../common/LetterGroup.vue";

const props = defineProps({
  event: { type: Object, required: true },
  playerId: { type: String, required: true },
});

const mainDb = inject("main-db");
const mainDbCapturesCol = inject("main-db-captures-col");

const letters = ref();

const loading = ref(false);

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
        letters.value = response.documents.reduce(
          (acc, { $id, letter, device, trace, capture }) => {
            return {
              ...acc,
              [letter]: [
                ...(acc[letter] || []),
                {
                  id: $id,
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
