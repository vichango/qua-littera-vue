<template>
  <div>
    <video ref="video" autoplay></video>
    <canvas ref="canvas" style="display: none"></canvas>
    <button @click="capture">Capture</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 320,
  },
});

const video = ref(null);
const canvas = ref(null);

// const hasGetUserMedia = () => {
//   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
// }

let height = null;

const emit = defineEmits(["capture"]);

onMounted(() => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.value.srcObject = stream;
      video.value.play();

      video.value.addEventListener("canplay", () => {
        const ratio = video.value.videoWidth / props.width;

        // height = video.value.videoHeight / ratio

        // // Firefox currently has a bug where the height can't be read from
        // // the video, so we will make assumptions if this happens.
        // if (isNaN(height)) {
        //   height = width / (4 / 3);
        // }

        canvas.value.width = video.value.videoWidth;
        canvas.value.height = video.value.videoHeight;
      });
    });
});

const capture = () => {
  const context = canvas.value.getContext("2d");

  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;

  context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);

  // Emit event passing the image data to the parent component.
  emit("capture", canvas.value.toDataURL("image/png"));
};
</script>

<style scoped></style>
