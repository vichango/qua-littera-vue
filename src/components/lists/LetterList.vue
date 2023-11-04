<template>
  <div v-if="letters">
    <LetterGroup
      v-for="([letter, letterCaptures], index) of Object.entries(letters)"
      :key="index"
      :letter="letter"
      :captures="letterCaptures"
      :player-id="props.playerId"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import LetterGroup from "./LetterGroup.vue";

const letters = computed(() => {
  return props.captures.reduce((acc, { letter, ...rest }) => {
    return {
      ...acc,
      [letter]: [
        ...(acc[letter] || []),
        {
          letter,
          ...rest,
        },
      ],
    };
  }, {});
});

const props = defineProps({
  event: { type: Object, required: true },
  playerId: { type: String, required: true },
  captures: { type: Array, required: true },
});
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
