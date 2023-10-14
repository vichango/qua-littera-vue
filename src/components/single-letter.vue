<template>
  <div v-if="props.letter" class="letter-box">
    <span class="letter">{{ props.letter }} ({{ props.count }})</span>
  </div>
</template>

<script setup>
const props = defineProps({
  letter: { type: String, default: null },
  count: { type: Number, default: 0 },
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
