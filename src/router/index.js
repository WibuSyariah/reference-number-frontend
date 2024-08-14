import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import GeneratePage from "@/views/GeneratePage.vue";
import LoginPage from "@/views/LoginPage.vue";

const routes = [
  {
    path: "/",
    component: GeneratePage,
  },
  {
    path: "/generate",
    component: GeneratePage,
  },
  {
    path: "/login",
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken && to.path !== "/login") {
    next("/login");
  } else {
    next();
  }
});

export default router;
