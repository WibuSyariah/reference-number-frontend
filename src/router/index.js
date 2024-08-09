import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import GeneratePage from "@/views/GeneratePage.vue";

const routes = [
  {
    path: "/",
    component: GeneratePage
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
