<template>
  <div class="bg-blue-200 md:h-screen">
    <canvas
      ref="canvas"
      class="p-0 my-0 mx-auto cursor-crosshair relative rounded"
      style="display: none"
      width="480"
      height="480"
    ></canvas>

    <div class="block">
      <div
        class="p-4 my-0 mx-auto max-w-[480px] max-h-[480px] w-screen h-screen overflow-hidden bg-blue-300"
      >
        <video v-if="capturing" ref="video" autoplay playsinline></video>
        <img ref="image" :style="{ display: capturing ? 'none' : 'block' }" />
      </div>
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
import { onMounted, ref } from "vue";

const capturing = ref(true);

const video = ref(null);
const canvas = ref(null);
const image = ref("image");

// const hasGetUserMedia = () => {
//   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
// }

const emit = defineEmits(["captured"]);

onMounted(() => {
  initialise();
});

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
        canvas.value.width = 480;
        canvas.value.height = 480;
      });
    });
};

const capture = () => {
  const context = canvas.value.getContext("2d");

  const scale = 480 / Math.min(video.value.videoHeight, video.value.videoWidth);

  const xOffset =
    video.value.videoHeight > video.value.videoWidth
      ? 0
      : (480 - scale * video.value.videoWidth) / 2;
  const yOffset =
    video.value.videoHeight > video.value.videoWidth
      ? (480 - scale * video.value.videoHeight) / 2
      : 0;

  context.drawImage(
    video.value,
    xOffset,
    yOffset,
    video.value.videoHeight > video.value.videoWidth
      ? 480
      : scale * video.value.videoWidth,
    video.value.videoHeight > video.value.videoWidth
      ? scale * video.value.videoHeight
      : 480,
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
  padding: 1em;
  margin: 0 auto;
  max-width: 480px;
  max-height: 480px;
  width: 100vw;
  height: 100vw;
  overflow: hidden;
  background-color: gray;
}
</style>
