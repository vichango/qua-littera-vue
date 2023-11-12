<template>
  <div class="size-container rounded">
    <img
      :src="props.src"
      :width="reframedSize"
      :height="reframedSize"
      style="max-width: initial; max-height: initial"
      class="reframed relative"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  src: { type: String, required: true },
  size: { type: Number, required: true },
  traceBox: { type: Object, required: true },
  padding: { type: Number, default: 0.05 },
});

const paddedTraceBox = computed(() => {
  return {
    minX: Math.max(0, props.traceBox.minX - props.padding),
    maxX: Math.min(1, props.traceBox.maxX + props.padding),
    minY: Math.max(0, props.traceBox.minY - props.padding),
    maxY: Math.min(1, props.traceBox.maxY + props.padding),
  };
});

const traceWidth = computed(() => {
  return paddedTraceBox.value.maxX - paddedTraceBox.value.minX;
});

const traceHeight = computed(() => {
  return paddedTraceBox.value.maxY - paddedTraceBox.value.minY;
});

const traceSize = computed(() => {
  return Math.max(traceWidth.value, traceHeight.value);
});

const reframedSize = computed(() => {
  return Math.ceil(props.size / traceSize.value);
});

const deltaLeftPx = computed(() => {
  const centerX = (paddedTraceBox.value.maxX + paddedTraceBox.value.minX) / 2;
  const reframedLeft = centerX - traceSize.value / 2;

  return `-${reframedSize.value * reframedLeft}px`;
});

const deltaTopPx = computed(() => {
  const centerY = (paddedTraceBox.value.maxY + paddedTraceBox.value.minY) / 2;
  const reframedTop = centerY - traceSize.value / 2;

  return `-${reframedSize.value * reframedTop}px`;
});

const sizePixels = computed(() => {
  return `${props.size}px`;
});
</script>

<style scoped>
.patate {
  width: v-bind(reframedSize);
}
.size-container {
  width: v-bind(sizePixels);
  height: v-bind(sizePixels);
  overflow: hidden;
}

.reframed {
  left: v-bind(deltaLeftPx);
  top: v-bind(deltaTopPx);
}
</style>
