import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toast-notification";

const baseUrl = "http://localhost:3000";
const apiPrefix = "/api/v1";
const toast = useToast();

export const useUserStore = defineStore({
  id: "userStore",
  state: () => ({
    isLoggedIn: false,
  }),
  getters: {},
  actions: {},
});
