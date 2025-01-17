import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";
import { createPinia } from "pinia";
import { plugin } from "@formkit/vue";
import defaultConfig from "../formkit.config";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
import { createVuetify } from "vuetify";
import "vuetify/styles";

const app = createApp(App);
const pinia = createPinia();
const vuetify = createVuetify();


app.use(router);
app.use(pinia);
app.use(plugin, defaultConfig);
app.use(vuetify);
app.use(ToastPlugin, {
  position: "top-right",
  duration: 3000,
  queue: true,
});
app.mount("#app");
