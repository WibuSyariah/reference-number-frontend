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
    meta: { title: "Penomoran Surat" },
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
  {
    path: "/:pathMatch(.*)*", // Vue Router 4 syntax (use '*' for Vue Router 3)
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Penomoran Surat"; // Fallback title

  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const roleRoutes = {
    USER: [
      "/login",
      "/",
      "/reference-number/create",
      "/reference-number/preview",
    ],
    ADMIN: ["/login", "/", "/reference-number", "/master"],
  };

  if (!accessToken && to.path !== "/login") {
    next("/login");
  } else if (accessToken && to.path === "/login") {
    next("/create");
  } else if (role) {
    // Check if the current route is allowed for the role
    const isAdmin = ["ADMIN"].includes(role);

    if (isAdmin) {
      // Allow access to any child routes under /reference-number and /master
      const allowedPaths = roleRoutes[role];
      const isAllowedPath = allowedPaths.some((route) => {
        return to.path.startsWith(route);
      });

      if (!isAllowedPath) {
        next("/create"); // Redirect if not allowed
      } else {
        next(); // Allow access
      }
    } else if (!roleRoutes[role].includes(to.path)) {
      next("/"); // Redirect to home page if trying to access restricted routes
    } else {
      next(); // Allow access
    }
  } else {
    next(); // No role, proceed
  }
});

export default router;
