<template>
  <canvas ref="canvas" style="display: none" width="480" height="480"></canvas>
  
  <div v-if="capturing">
    <div class="video-container">
      <video ref="video" autoplay></video>
    </div>
    <button @click="capture">Capture</button>
    <img ref="image" />
  </div>
  <div v-else>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

let capturing = true;

const props = defineProps({
  width: {
    type: Number,
    default: 320,
  },
});

const video = ref(null);
const canvas = ref(null);
const image = ref("image");

// const hasGetUserMedia = () => {
//   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
// }

// const emit = defineEmits(["capture"]);

onMounted(() => {
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
});

const capture = () => {
  const context = canvas.value.getContext("2d");

  console.log(video.value.videoHeight, video.value.videoWidth);

  const scale = 480 / video.value.videoHeight;

  const xOffset = (480 - scale * video.value.videoWidth) / 2;

  context.drawImage(video.value, xOffset, 0, scale * video.value.videoWidth, 480);

  // Emit event passing the image data to the parent component.
  // emit("capture", canvas.value.toDataURL("image/png"));
  
  image.value.src = canvas.value.toDataURL("image/png");

  capturing = false;
};

const reset = () => {
  capturing = true;
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
