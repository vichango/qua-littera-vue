<template>
  <div class="bg-blue-200 md:h-screen py-6">
    <canvas
      ref="canvas"
      class="p-0 my-0 mx-auto cursor-crosshair relative rounded"
      style="display: none"
      :width="sizePx"
      :height="sizePx"
    ></canvas>

    <SizedContainer :size="props.size" color="blue">
      <video v-if="capturing" ref="video" autoplay playsinline></video>
      <img ref="image" :style="{ display: capturing ? 'none' : 'block' }" />
    </SizedContainer>

    <div v-if="capturing" class="flex justify-center my-6 px-2">
      <div class="w-full max-w-[480px] flex">
        <div class="w-1/4 text-start">
          <AppButton
            back-arrow
            fa-icon="fa-solid fa-power-off"
            color="blue"
            @click="goBack"
          />
        </div>

        <div class="w-1/2 text-center">
          <AppButton
            label="Capturer"
            fa-icon="fa-solid fa-camera"
            color="blue"
            :disabled="!ready"
            @click="capture"
          />
        </div>
      </div>
    </div>

    <AppMessage
      v-if="capturing"
      color="blue"
      message="À toi! Saisis quelque chose qui a la forme d'une lettre!"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import AppButton from "../common/AppButton.vue";
import AppMessage from "../common/AppMessage.vue";
import SizedContainer from "../common/SizedContainer.vue";

const emit = defineEmits(["captured", "stop"]);

const props = defineProps({
  size: { type: Number, required: true },
});

const capturing = ref(true);

const video = ref(null);
const canvas = ref(null);
const image = ref("image");

const ready = ref(false);

const sizePx = computed(() => {
  return `${props.size}px`;
});

onMounted(() => {
  initialise();
});

const goBack = () => {
  stopStream();
  emit("stop");
};

const stopStream = () => {
  const stream = video.value.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });

  video.value.srcObject = null;

  ready.value = false;
};

const startStream = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: false, video: { facingMode: "environment" } })
    .then((stream) => {
      video.value.srcObject = stream;
      video.value.play();

      video.value.addEventListener("canplay", () => {
        canvas.value.width = props.size;
        canvas.value.height = props.size;

        ready.value = true;
      });
    });
};

const capture = () => {
  const context = canvas.value.getContext("2d");

  const scale =
    props.size / Math.min(video.value.videoHeight, video.value.videoWidth);

  const xOffset =
    video.value.videoHeight > video.value.videoWidth
      ? 0
      : (props.size - scale * video.value.videoWidth) / 2;
  const yOffset =
    video.value.videoHeight > video.value.videoWidth
      ? (props.size - scale * video.value.videoHeight) / 2
      : 0;

  context.drawImage(
    video.value,
    xOffset,
    yOffset,
    video.value.videoHeight > video.value.videoWidth
      ? props.size
      : scale * video.value.videoWidth,
    video.value.videoHeight > video.value.videoWidth
      ? scale * video.value.videoHeight
      : props.size,
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
  width: v-bind("sizePx");
  height: v-bind("sizePx");
}
</style>
