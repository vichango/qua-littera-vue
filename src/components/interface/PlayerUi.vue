<template>
  <div v-if="playerId" class="flex h-screen">
    <div class="flex flex-col md:flex-row w-full">
      <div class="w-full md:basis-1/2">
        <CaptureMain :player-id="playerId" />
      </div>
      <div class="flex w-full md:basis-1/2">
        <div class="w-full flex flex-col lg:flex-row h-screen">
          <div class="lg:basis-1/2">
            <YourLetters :player-id="playerId" />
          </div>
          <div class="lg:basis-1/2">
            <AllLetters />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { onMounted, ref } from "vue";
import CaptureMain from "../capture/CaptureMain.vue";
import AllLetters from "../lists/AllLetters.vue";
import YourLetters from "../lists/YourLetters.vue";

const playerId = ref(null);

// bd4c4acd-9e87-456c-a37c-c62ecf4acade

onMounted(() => {
  const location = window.location;
  const search = new URLSearchParams(location.search);

  console.log(search);

  // Read player from local storage or update it from URL.
  playerId.value = search.get("id");
  if (null !== playerId.value) {
    localStorage.setItem("player-id", playerId.value);
    window.location.search = "";
  } else {
    playerId.value = localStorage.getItem("player-id");
  }

  // Initialise if new player.
  if (null === playerId.value) {
    playerId.value = uuidv4();
    localStorage.setItem("player-id", playerId.value);
  }
});
</script>

<style scoped></style>
