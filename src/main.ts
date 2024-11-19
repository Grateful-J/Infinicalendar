import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Card from "primevue/card";
import "primeicons/primeicons.css";

createApp(App).mount("#app");
/* App.use(PrimeVue);
App.use(Card);
 */

App.use(PrimeVue, {
  theme: "none",
});
App.use(Card);
