<template>
  <component :is="currentView" />
</template>

<script setup>
import { computed, ref } from "vue";
import DemoUi from "./components/interface/DemoUi.vue";
import NotFound from "./components/interface/NotFound.vue";
import PlayerUi from "./components/interface/PlayerUi.vue";

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
</script>

<style scoped></style>
