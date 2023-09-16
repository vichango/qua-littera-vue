<template>
  <canvas ref="canvas" style="display: none" width="480" height="480"></canvas>

  <div class="block">
    <div class="video-container">
      <video v-if="capturing" ref="video" autoplay playsinline></video>
      <img ref="image" :style="{ display: capturing ? 'none' : 'block' }" />
    </div>
  </div>

  <div v-if="capturing" class="block has-text-centered">
    <button  class="button" @click="capture">Capture</button>
  </div>
  <div v-else class="block has-text-centered">
    <button class="button" @click="proceed">Proceed</button>
    <button class="button" @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const capturing = ref(true)

const video = ref(null);
const canvas = ref(null);
const image = ref("image");

// const hasGetUserMedia = () => {
//   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
// }

const emit = defineEmits(["captured"]);

onMounted(() => {
  reset();
});

const stopStream = () => {
  const stream = video.value.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });

  video.value.srcObject = null;
}

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
}

const capture = () => {
  const context = canvas.value.getContext("2d");

  const scale = 480 / Math.min(video.value.videoHeight, video.value.videoWidth);

  const xOffset = video.value.videoHeight > video.value.videoWidth ? 0 : ((480 - scale * video.value.videoWidth) / 2);
  const yOffset = video.value.videoHeight > video.value.videoWidth ? ((480 - scale * video.value.videoHeight) / 2) : 0;

  context.drawImage(
    video.value,
    xOffset, yOffset,
    video.value.videoHeight > video.value.videoWidth ? 480 : scale * video.value.videoWidth,
    video.value.videoHeight > video.value.videoWidth ? scale * video.value.videoHeight : 480
  );

  capturing.value = false;
  image.value.src = canvas.value.toDataURL("image/png");

  stopStream();
};

const reset = () => {
  capturing.value = true;

  image.value.src = "";

  startStream();
}

const proceed = () => {
  emit('captured', image.value.src);
}
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
  border: 2px solid gray;
}
</style>
