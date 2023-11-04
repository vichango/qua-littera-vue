<template>
  <div v-if="event && playerId" class="flex h-screen">
    <div class="flex flex-col md:flex-row w-full">
      <div class="w-full md:basis-1/2">
        <CaptureMain :event="props.event" :player-id="props.playerId" />
      </div>
      <div class="flex w-full md:basis-1/2">
        <div class="w-full flex flex-col lg:flex-row h-screen">
          <div class="lg:basis-1/2">
            <YourLetters :event="props.event" :player-id="props.playerId" />
          </div>
          <div class="lg:basis-1/2">
            <AllLetters :event="event" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CaptureMain from "../capture/CaptureMain.vue";
import AllLetters from "../lists/AllLetters.vue";
import YourLetters from "../lists/YourLetters.vue";

const props = defineProps({
  event: { type: Object, required: true },
  playerId: { type: String, required: true },
});
</script>

<style scoped></style>
