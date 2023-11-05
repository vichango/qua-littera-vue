<template>
  <div v-if="open" class="flex flex-wrap m-2">
    <SingleLetter
      v-for="(capture, index) of props.captures"
      :key="`sl-${index}`"
      :capture="capture"
      :player-id="props.playerId"
      @click="toggle"
      @refresh="relayRefresh"
    />
  </div>
  <div
    v-if="!open"
    class="relative inline-flex m-2 w-16 h-16 rounded bg-violet-400 text-2xl justify-center items-center"
    @click="toggle"
  >
    {{ props.letter }}

    <div
      class="absolute inline-flex items-center justify-center w-8 h-8 text-xs text-violet-600 bg-violet-300 rounded-full -top-3 -right-3"
    >
      {{ props.captures.length }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import SingleLetter from "../common/SingleLetter.vue";

const emit = defineEmits(["refresh"]);

const open = ref(false);

const props = defineProps({
  letter: { type: String, required: true },
  playerId: { type: String, required: true },
  captures: { type: Array, required: true },
});

const toggle = () => {
  open.value = !open.value;
};

const relayRefresh = () => {
  emit("refresh");
};
</script>

<style scoped></style>
