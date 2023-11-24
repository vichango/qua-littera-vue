<template>
  <div v-if="letters">
    <LetterGroup
      v-for="[letter, letterCaptures] of Object.entries(letters)"
      :key="`lg-${letter}`"
      :letter="letter"
      :captures="letterCaptures"
      :player-id="props.playerId"
      @refresh="relayRefresh"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import LetterGroup from "./LetterGroup.vue";

const letters = computed(() => {
  return props.captures.reduce((acc, { id, letter, ...rest }) => {
    return {
      ...acc,
      [letter]: {
        ...(acc[letter] || {}),
        [id]: {
          id,
          letter,
          ...rest,
        },
      },
    };
  }, {});
});

const emit = defineEmits(["refresh"]);

const props = defineProps({
  event: { type: Object, required: true },
  playerId: { type: String, required: true },
  captures: { type: Array, required: true },
});

const relayRefresh = () => {
  emit("refresh");
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
