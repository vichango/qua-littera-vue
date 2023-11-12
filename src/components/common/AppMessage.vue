<template>
  <div class="w-full flex justify-center">
    <p :class="['text-bold px-4 text-center', `text-${color}-400`]">
      {{ props.message }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  color: { type: String, required: true },
  message: { type: String, required: true },
});
</script>

<style scoped></style>
