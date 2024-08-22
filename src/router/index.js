import { createRouter, createWebHistory } from "vue-router";
import GeneratePage from "@/views/GeneratePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import ListPage from "@/views/ListPage.vue";
import UserPage from "@/views/UserPage.vue";
import CompanyPage from "@/views/CompanyPage.vue";
import DivisionPage from "@/views/DivisionPage.vue";

const routes = [
  {
    path: "/",
    component: GeneratePage,
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/list",
    component: ListPage,
  },
  {
    path: "/user",
    component: UserPage,
  },
  {
    path: "/company",
    component: CompanyPage,
  },
  {
    path: "/division",
    component: DivisionPage,
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
  } else if (accessToken && to.path === "/login") {
    next("/");
  } else {
    next();
  }
});

export default router;
