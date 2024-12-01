import { createApp } from "vue";
import "./style.css";

import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import Dialog from "primevue/dialog";

import App from "./App.vue";

const app = createApp(App);

app.use(PrimeVue, {
  theme: "none",
});

app.component("Dialog", Dialog);

app.mount("#app");
