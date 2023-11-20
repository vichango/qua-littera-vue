<template>
  <div class="w-full flex justify-center px-4">
    <p
      :class="[
        'light-background text-bold px-2 text-center rounded',
        `text-${color}-400`,
      ]"
    >
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

<style scoped>
.light-background {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
