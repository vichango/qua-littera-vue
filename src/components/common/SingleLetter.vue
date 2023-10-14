<template>
  <div
    class="relative inline-flex m-2 w-16 h-16 rounded bg-rose-400 text-2xl justify-center items-center"
  >
    {{ props.letter }}
    <div
      v-if="count"
      class="absolute inline-flex items-center justify-center w-8 h-8 text-xs text-white bg-red-500 rounded-full -top-3 -right-3"
    >
      {{ props.count }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  letter: { type: String, default: null },
  count: { type: Number, default: null },
});
</script>

<style scoped></style>
