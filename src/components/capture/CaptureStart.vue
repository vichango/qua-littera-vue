<template>
  <div class="bg-blue-200 md:h-screen py-6">
    <SizedContainer :size="props.size" color="blue" />

    <div class="w-full flex justify-center my-6">
      <AppButton
        label="Démarrer"
        color="blue"
        fa-icon="fa-solid fa-play"
        @click="emit('proceed')"
      />
    </div>

    <AppMessage message="Fais clic pour commencer" />
  </div>
</template>

<script setup>
import AppButton from "../common/AppButton.vue";
import AppMessage from "../common/AppMessage.vue";
import SizedContainer from "../common/SizedContainer.vue";

const emit = defineEmits(["proceed"]);

const props = defineProps({
  size: { type: Number, required: true },
});
</script>

<style scoped></style>
