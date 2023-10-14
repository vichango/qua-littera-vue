<template>
  <div class="bg-blue-200 md:h-screen">
    <canvas
      ref="canvas"
      class="p-0 my-0 mx-auto cursor-crosshair relative rounded"
      style="display: none"
      :width="size"
      :height="size"
    ></canvas>

    <div class="video-container p-4 my-0 mx-auto overflow-hidden bg-blue-300">
      <video v-if="capturing" ref="video" autoplay playsinline></video>
      <img ref="image" :style="{ display: capturing ? 'none' : 'block' }" />
    </div>

    <div v-if="capturing" class="w-full flex justify-center">
      <button
        class="border-2 border-blue-500 text-blue-500 font-bold py-2 px-4 m-2 rounded"
        @click="capture"
      >
        Capture
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const capturing = ref(true);

const video = ref(null);
const canvas = ref(null);
const image = ref("image");

const size = ref(Math.min(480, window.innerWidth));

const emit = defineEmits(["captured"]);

const sizePx = computed(() => {
  return `${size.value}px`;
});

onMounted(() => {
  initialise();
  window.addEventListener("resize", resizeCanvas);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
});

const resizeCanvas = () => {
  size.value = Math.min(480, window.innerWidth);
};

const stopStream = () => {
  const stream = video.value.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });

  video.value.srcObject = null;
};

const startStream = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: false, video: { facingMode: "environment" } })
    .then((stream) => {
      video.value.srcObject = stream;
      video.value.play();

      video.value.addEventListener("canplay", () => {
        canvas.value.width = size.value;
        canvas.value.height = size.value;
      });
    });
};

const capture = () => {
  const context = canvas.value.getContext("2d");

  const scale =
    size.value / Math.min(video.value.videoHeight, video.value.videoWidth);

  const xOffset =
    video.value.videoHeight > video.value.videoWidth
      ? 0
      : (size.value - scale * video.value.videoWidth) / 2;
  const yOffset =
    video.value.videoHeight > video.value.videoWidth
      ? (size.value - scale * video.value.videoHeight) / 2
      : 0;

  context.drawImage(
    video.value,
    xOffset,
    yOffset,
    video.value.videoHeight > video.value.videoWidth
      ? size.value
      : scale * video.value.videoWidth,
    video.value.videoHeight > video.value.videoWidth
      ? scale * video.value.videoHeight
      : size.value,
  );

  capturing.value = false;
  image.value.src = canvas.value.toDataURL("image/png");

  emit("captured", image.value.src);

  stopStream();
};

const initialise = () => {
  capturing.value = true;
  image.value.src = "";
  startStream();
};
</script>

<style scoped>
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-container {
  height: v-bind("sizePx");
}
</style>