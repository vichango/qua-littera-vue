<template>
  <canvas ref="canvas" style="display: none" width="480" height="480"></canvas>
  
  <div class="box">
    <div class="block">
      <img ref="image" :style="{ display: capturing ? 'none' : 'block' }" />
      <div v-if="capturing" class="video-container">
        <video ref="video" autoplay></video>
      </div>
    </div>
    <div class="block">
      <button v-if="capturing" class="button" @click="capture">Capture</button>
      <button v-else class="button" @click="reset">Reset</button>
    </div>
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

// const emit = defineEmits(["capture"]);

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
    .getUserMedia({ audio: false, video: true })
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

  const scale = 480 / video.value.videoHeight;
  const xOffset = (480 - scale * video.value.videoWidth) / 2;

  context.drawImage(video.value, xOffset, 0, scale * video.value.videoWidth, 480);

  capturing.value = false;  
  image.value.src = canvas.value.toDataURL("image/png");

  stopStream();
};

const reset = () => {
  capturing.value = true;

  image.value.src = "";

  startStream();
}
</script>

<style scoped>
.video-container {
  width: 480px;
  height: 480px;
  overflow: hidden;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
