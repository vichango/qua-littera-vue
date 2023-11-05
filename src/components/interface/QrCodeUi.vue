<template>
  <qrcode-vue :value="playerUrl" level="L" class="m-3" />
</template>

<script setup>
import QrcodeVue from "qrcode.vue";
import { computed } from "vue";

const props = defineProps({
  event: { type: Object, required: true },
  playerId: { type: String, required: true },
});

const playerUrl = computed(() => {
  return `${import.meta.env.VITE_SERVER_URL}/?eid=${props.event.id}&pid=${
    props.playerId
  }`;
});
</script>

<style scoped></style>
