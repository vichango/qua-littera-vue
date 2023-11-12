<template>
  <button
    :class="[
      'border-2 font-bold py-2 px-3 rounded',
      `border-${props.color}-500 text-${props.color}-500`,
      `disabled:opacity-25 disabled:bg-${props.color}-200`,
      `hover:bg-${props.color}-300`,
    ]"
    :disabled="disabled"
    @click="emit('click')"
  >
    {{ props.label }}
    <font-awesome-icon
      v-if="props.faIcon"
      :icon="props.faIcon"
      :class="props.label ? 'ms-2' : ''"
    />
    <font-awesome-icon
      v-if="props.backArrow"
      icon="fa-solid fa-arrow-left"
      :class="`text-${color}-400 ms-2`"
    />
  </button>
</template>

<script setup>
const emit = defineEmits(["click"]);

const props = defineProps({
  color: { type: String, required: true },
  label: { type: String, default: null },
  faIcon: { type: String, default: null },
  backArrow: { type: Boolean, default: false },
  inProgress: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
</script>

<style scoped></style>
