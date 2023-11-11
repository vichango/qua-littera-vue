<template>
  <button
    :class="[
      'border-2 font-bold py-2 px-4 rounded',
      `border-${props.color}-500 text-${props.color}-500`,
      `hover:bg-${props.color}-300`,
    ]"
    @click="emit('click')"
  >
    {{ label }}
    <font-awesome-icon v-if="faIcon" :icon="faIcon" class="ms-3" />
  </button>
</template>

<script setup>
const emit = defineEmits(["click"]);

const props = defineProps({
  color: { type: String, required: true },
  label: { type: String, required: true },
  faIcon: { type: String, default: null },
});
</script>

<style scoped></style>
