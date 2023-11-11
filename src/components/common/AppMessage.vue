<template>
  <div class="w-full flex justify-center">
    <p class="text-white text-bold px-4 text-center">
      {{ props.message }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: String, required: true },
});
</script>

<style scoped></style>
