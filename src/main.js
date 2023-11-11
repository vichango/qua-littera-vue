import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCamera,
  faArrowLeft,
  faFloppyDisk,
  faMinimize,
  faPaintbrush,
  faPlay,
  faPowerOff,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
library.add(faCamera);
library.add(faArrowLeft);
library.add(faFloppyDisk);
library.add(faMinimize);
library.add(faPaintbrush);
library.add(faPlay);
library.add(faPowerOff);
library.add(faTrash);

import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(Vue3ColorPicker)
  .provide('main-db', import.meta.env.VITE_APPWRITE_DB_MAIN)
  .provide('main-db-captures-col', import.meta.env.VITE_APPWRITE_COL_CAPTURES)
  .provide('main-db-events-col', import.meta.env.VITE_APPWRITE_COL_EVENTS)
  .provide('traces-bucket', import.meta.env.VITE_APPWRITE_BUCKET_TRACES)
  .provide('captures-bucket', import.meta.env.VITE_APPWRITE_BUCKET_CAPTURES)
  .mount("#app");
