import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCamera, faFloppyDisk, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
library.add(faCamera);
library.add(faPlay);
library.add(faTrash);
library.add(faFloppyDisk);

import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(Vue3ColorPicker)
  .provide('mainDb', '652a5ee533766bbba165')
  .provide('mainDbCapturesCol', '652a5ee9ecbd3b0f908b')
  .provide('mainDbEventsCol', '6546143c1e65d496bd7a')
  .provide('tracesBuc', '652a5e1f99df9c37608c')
  .provide('capturesBuc', '652a5e155ebcbfb645f6')
  .mount("#app");
