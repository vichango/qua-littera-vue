<template>
  <component
    :is="currentView"
    v-if="event && playerId"
    :event="event"
    :player-id="playerId"
  />
  <MissingEvent v-else-if="null === eventId" />
</template>

<script setup>
import { Client, Databases, Storage } from "appwrite";
import { v4 as uuidv4 } from "uuid";
import { computed, inject, onMounted, provide, ref } from "vue";
import DemoUi from "./components/interface/DemoUi.vue";
import MissingEvent from "./components/interface/MissingEvent.vue";
import ModerateUi from "./components/interface/ModerateUi.vue";
import NotFound from "./components/interface/NotFound.vue";
import PlayerUi from "./components/interface/PlayerUi.vue";
import QrCodeUi from "./components/interface/QrCodeUi.vue";

const mainDb = inject("main-db");
const mainDbEventsCol = inject("main-db-events-col");

const databases = ref(null);

const event = ref(null);
const eventId = ref(null);
const playerId = ref(null);

const routes = {
  "/": PlayerUi,
  "/demo": DemoUi,
  "/moderate": ModerateUi,
  "/qr": QrCodeUi,
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
  provideAppWrite();
  loadFromStorage();

  provideMode();
});

const loadFromUrl = () => {
  const location = window.location;
  const search = new URLSearchParams(location.search);

  // Turn admin on/off.
  const mode = search.get("mode");
  if ("god" === mode) {
    localStorage.setItem("godmode", 1);
  } else if (null !== mode) {
    localStorage.removeItem("godmode");
  }

  // Update event and player from URL.
  eventId.value = search.get("eid");
  playerId.value = search.get("pid");

  if (null !== eventId.value || null !== playerId.value || null !== mode) {
    const storedEventId = localStorage.getItem("event-id");
    if (null !== eventId.value && storedEventId !== eventId.value) {
      localStorage.setItem("event-id", eventId.value);
      localStorage.removeItem("player-id");
    }

    if (null !== playerId.value) {
      localStorage.setItem("player-id", playerId.value);
    }

    // Clear URL.
    window.history.replaceState(null, "", import.meta.env.VITE_SERVER_URL);
  }
};

const provideAppWrite = () => {
  const client = new Client();
  client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

  databases.value = new Databases(client);

  provide("appwrite-databases", databases.value);
  provide("appwrite-storage", new Storage(client));
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

const provideMode = () => {
  const mode = localStorage.getItem("godmode") ? "godmode" : "normal";
  provide("mode", mode);
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
