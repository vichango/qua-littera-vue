<template>
  <div
    :class="[
      'sized',
      'p-4 my-0 mx-auto overflow-hidden rounded',
      `bg-${color}-400`,
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: { type: Number, required: true },
  color: { type: String, required: true },
});

const sizePx = computed(() => {
  return `${props.size}px`;
});
</script>

<style scoped>
.sized {
  width: v-bind("sizePx");
  height: v-bind("sizePx");
}
</style>
