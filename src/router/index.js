import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import GeneratePage from "@/views/GeneratePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import ListPage from "@/views/ListPage.vue";
import UserPage from "@/views/UserPage.vue";
import CompanyPage from "@/views/CompanyPage.vue";
import DivisionPage from "@/views/DivisionPage.vue";
import ArchivePage from "@/views/ArchivePage.vue";

const routes = [
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/reference-number",
    children: [
      {
        path: "create",
        component: GeneratePage,
      },
      {
        path: "preview",
        component: ListPage,
      },
      {
        path: "archive",
        component: ArchivePage,
      },
    ],
  },
  {
    path: "/master",
    children: [
      {
        path: "user",
        component: UserPage,
      },
      {
        path: "company",
        component: CompanyPage,
      },
      {
        path: "division",
        component: DivisionPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const roleRoutes = {
    USER: ["/create", "/", "/login", "/preview"],
    ADMIN: [
      "/",
      "/login",
      "/reference-number/create",
      "/reference-number/preview",
      "/reference-number/archive",
      "/master/user",
      "/master/company",
      "/master/division",
    ],
    SUPERADMIN: [
      "/",
      "/login",
      "/reference-number/create",
      "/reference-number/preview",
      "/reference-number/archive",
      "/master/user",
      "/master/company",
      "/master/division",
    ],
  };

  if (!accessToken && to.path !== "/login") {
    next("/login");
  } else if (accessToken && to.path === "/login") {
    next("/create");
  } else if (role && !roleRoutes[role].includes(to.path)) {
    next("/create"); // Redirect to home page if trying to access restricted routes
  } else {
    next();
  }
});

export default router;
