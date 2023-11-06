<template>
  <div class="w-screen h-screen bg-gray-100 flex justify-center">
    <div class="flex m-auto">
      <div v-if="player" class="flex flex-col items-center">
        <qrcode-vue
          :size="200"
          :value="playerUrl"
          level="L"
          class="m-3"
          @click="player = !player"
        />
        <p class="text-center text-xl mt-4">
          Partager l'événement avec le joueur
        </p>
      </div>
      <div v-else class="flex flex-col items-center">
        <qrcode-vue
          :value="eventUrl"
          :size="200"
          level="L"
          class="m-3"
          @click="player = !player"
        />
        <p class="text-center text-xl mt-4">Partager l'événement</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import QrcodeVue from "qrcode.vue";
import { computed, ref } from "vue";

const player = ref(false);

const props = defineProps({
  event: { type: Object, required: true },
  playerId: { type: String, required: true },
});

const playerUrl = computed(() => {
  return `${import.meta.env.VITE_SERVER_URL}/?eid=${props.event.id}&pid=${
    props.playerId
  }`;
});

const eventUrl = computed(() => {
  return `${import.meta.env.VITE_SERVER_URL}/?eid=${props.event.id}}`;
});
</script>

<style scoped></style>
