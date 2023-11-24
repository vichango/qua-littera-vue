<template>
  <div
    v-if="null === showing"
    class="no-capture me-[12px] rounded border-dashed border-2 border-gray-300 text-gray-300 text-4xl inline-flex justify-center items-center"
  >
    {{ props.letter }}
  </div>
  <div
    v-else
    class="no-capture me-[12px] rounded border-dashed border-2 border-gray-300 text-gray-300 text-2xl inline-flex justify-center items-center"
  >
    <SingleLetter
      :key="showing"
      :size="256"
      :letter="props.letter"
      :show-trace="props.showTrace"
      :capture="props.captures[showing]"
      @click="toggle"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import SingleLetter from "../common/SingleLetter.vue";

const props = defineProps({
  size: { type: Number, default: 256 },
  letter: { type: String, required: true },
  showTrace: { type: Boolean, default: true },
  captures: { type: Object, default: () => {} },
  // scrollRequest: { type: Date, required: true },
});

const sizePixels = computed(() => {
  return `${props.size}px`;
});

const showing = ref(null);
// const lastScrollRequest = ref(null);

watch(
  () => Object.keys(props.captures).length,
  () => {
    if (null === showing.value) {
      toggle();
    }
  },
);

// watch(
//   () => props.scrollRequest,
//   (newValue) => {
//     if (newValue > lastScrollRequest.value) {
//       toggle();
//       lastScrollRequest.value = newValue;
//     }
//   },
// );

const toggle = () => {
  const captureIds = Object.keys(props.captures);

  if (captureIds.length > 0) {
    if (null === showing.value) {
      showing.value = captureIds[0];
      console.log("Initial capture: " + showing.value);
    } else {
      showing.value =
        captureIds[(captureIds.indexOf(showing.value) + 1) % captureIds.length];

      console.log("New capture: " + showing.value);
    }
  }
};

onMounted(() => {
  toggle();
});
</script>

<style scoped>
.no-capture {
  width: v-bind(sizePixels);
  height: v-bind(sizePixels);
}
</style>
