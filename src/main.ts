import { createApp } from "vue";
import "./style.css";

import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";

import App from "./App.vue";

const app = createApp(App);

app.use(PrimeVue, {
  theme: "none",
});

app.mount("#app");
