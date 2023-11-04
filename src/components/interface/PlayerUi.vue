<template>
  <div v-if="event && playerId" class="flex h-screen">
    <div class="flex flex-col md:flex-row w-full">
      <div class="w-full md:basis-1/2">
        <CaptureMain :event="event" :player-id="playerId" />
      </div>
      <div class="flex w-full md:basis-1/2">
        <div class="w-full flex flex-col lg:flex-row h-screen">
          <div class="lg:basis-1/2">
            <YourLetters :event="event" :player-id="playerId" />
          </div>
          <div class="lg:basis-1/2">
            <AllLetters :event="event" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Client, Databases } from "appwrite";
import { v4 as uuidv4 } from "uuid";
import { inject, onMounted, ref } from "vue";
import CaptureMain from "../capture/CaptureMain.vue";
import AllLetters from "../lists/AllLetters.vue";
import YourLetters from "../lists/YourLetters.vue";

const mainDb = inject("mainDb");
const mainDbEventsCol = inject("mainDbEventsCol");

const event = ref(null);
const eventId = ref(null);
const playerId = ref(null);

onMounted(() => {
  loadFromUrl();
  loadFromStorage();
});

const loadFromUrl = () => {
  const location = window.location;
  const search = new URLSearchParams(location.search);

  // Update event and player from URL.
  eventId.value = search.get("eid");
  playerId.value = search.get("pid");

  if (null !== eventId.value || null !== playerId.value) {
    const storedEventId = localStorage.getItem("event-id");
    if (null !== eventId.value && storedEventId !== eventId.value) {
      localStorage.setItem("event-id", eventId.value);
      localStorage.removeItem("player-id");
    }

    if (null !== playerId.value) {
      localStorage.setItem("player-id", playerId.value);
    }

    // Clear URL.
    window.location.search = "";
  }
};

const loadFromStorage = () => {
  // If unknown, read from storage.
  if (null === eventId.value) {
    eventId.value = localStorage.getItem("event-id");
  }

  if (null === playerId.value) {
    playerId.value = localStorage.getItem("player-id");
  }

  // If event known, try loading from DB.
  if (null !== eventId.value) {
    fetchEvent(eventId.value)
      .then((found) => {
        event.value = found;

        // Initialise player ID if unknown.
        if (null === playerId.value) {
          playerId.value = uuidv4();
          localStorage.setItem("player-id", playerId.value);
        }
      })
      .catch(() => {
        localStorage.removeItem("event-id");
        localStorage.removeItem("player-id");
      });
  }
};

const fetchEvent = (eventId) => {
  const client = new Client();
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

  const databases = new Databases(client);

  console.log("fetching", eventId);

  return databases
    .getDocument(mainDb, mainDbEventsCol, eventId)
    .then(({ $id, name, target }) => {
      return { id: $id, name, target };
    });
};
</script>

<style scoped></style>
