import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toast-notification";

const baseUrl = "http://localhost:3000";
const apiPrefix = "/api/v1";
const toast = useToast();

export const useDivisionStore = defineStore({
  id: "divisionStore",
  state: () => ({
    divisions: [],
    divisionDropdown: [],
  }),
  getters: {},
  actions: {
    async fetchDivision(params) {
      try {
        const res = await axios({
          method: "get",
          url: `${baseUrl}${apiPrefix}/division`,
          params: params ? params : {},
        });

        this.divisions = res.data.data.divisions;
        this.divisionDropdown = this.divisions.map((division) => ({
          label: division.name,
          value: division.id,
        }));        
      } catch (error) {
        toast.error(`Something went wrong`, {
          position: "top-right",
          duration: 3000,
          queue: true,
        });
      }
    },
  },
});
