<template>
  <component
    :is="currentView"
    v-if="event && playerId"
    :event="event"
    :player-id="playerId"
  />
</template>

<script setup>
import { Client, Databases, Storage } from "appwrite";
import { v4 as uuidv4 } from "uuid";
import { computed, inject, onMounted, provide, ref } from "vue";
import DemoUi from "./components/interface/DemoUi.vue";
import NotFound from "./components/interface/NotFound.vue";
import PlayerUi from "./components/interface/PlayerUi.vue";

const mainDb = inject("main-db");
const mainDbEventsCol = inject("main-db-events-col");

const databases = ref(null);

const event = ref(null);
const eventId = ref(null);
const playerId = ref(null);

const routes = {
  "/": PlayerUi,
  "/demo": DemoUi,
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || NotFound;
});

onMounted(() => {
  loadFromUrl();
  provideAppWrtie();
  loadFromStorage();
});

const loadFromUrl = () => {
  const location = window.location;
  const search = new URLSearchParams(location.search);

  // Update event and player from URL.
  eventId.value = search.get("eid");
  playerId.value = search.get("pid");

  console.log("URL event: ", eventId.value);
  console.log("URL player:", playerId.value);

  if (null !== eventId.value || null !== playerId.value) {
    const storedEventId = localStorage.getItem("event-id");
    if (null !== eventId.value && storedEventId !== eventId.value) {
      localStorage.setItem("event-id", eventId.value);
      localStorage.removeItem("player-id");

      console.log("Stored event: ", eventId.value);
      console.log("Removed player");
    }

    if (null !== playerId.value) {
      localStorage.setItem("player-id", playerId.value);

      console.log("Stored player: ", playerId.value);
    }

    // Clear URL.
    window.history.replaceState(null, "", import.meta.env.VITE_SERVER_URL);
  }
};

const provideAppWrtie = () => {
  const client = new Client();
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

  databases.value = new Databases(client);

  provide("appwrite-databases", databases.value);
  provide("appwrite-storage", new Storage(client));
};

const loadFromStorage = () => {
  // If unknown, read from storage.
  if (null === eventId.value) {
    eventId.value = localStorage.getItem("event-id");
    console.log("Loaded event: ", eventId.value);
  }

  if (null === playerId.value) {
    playerId.value = localStorage.getItem("player-id");
    console.log("Loaded player: ", playerId.value);
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
          console.log("Stored new player: ", playerId.value);
        }
      })
      .catch(() => {
        localStorage.removeItem("event-id");
        localStorage.removeItem("player-id");
      });
  }
};

const fetchEvent = (eventId) => {
  return databases.value
    .getDocument(mainDb, mainDbEventsCol, eventId)
    .then(({ $id, name, target }) => {
      return { id: $id, name, target };
    });
};
</script>

<style scoped></style>
