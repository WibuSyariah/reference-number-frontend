import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toast-notification";
import { mode, baseUrl, apiPrefix } from "../../config/url";

const toast = useToast();

export const useDivisionStore = defineStore({
  id: "divisionStore",
  state: () => ({
    divisions: [],
    divisionDropdown: [],
    query: {
      limit: 10,
      currentPage: 1,
      totalPages: 1,
    },
    defaultQuery: {
      limit: 10,
      currentPage: 1,
      totalPages: 1,
    },
  }),
  getters: {},
  actions: {
    async fetchDivision(params) {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const res = await axios({
          method: "get",
          url: `${baseUrl[mode]}${apiPrefix}/division`,
          params: params ? params : {},
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        this.query.totalPages = res.data.data.totalPages;
        this.query.currentPage = res.data.data.currentPage;
        this.divisions = res.data.data.divisions;
        this.divisionDropdown = this.divisions.map((division) => ({
          label: division.name,
          value: division.id,
        }));
      } catch (error) {
        console.error(error);
        toast.error(`Something went wrong`, {
          position: "top-right",
          duration: 3000,
          queue: true,
        });
      }
    },
    async createDivision(input) {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const res = await axios({
          method: "post",
          url: `${baseUrl[mode]}${apiPrefix}/division/`,
          data: input,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return res;
      } catch (error) {
        // Check if the error is an axios error
        if (error.response) {
          console.error(error.response.data);
          toast.error(`${error.response.data.message}`, {
            position: "top-right",
            duration: 3000,
            queue: true,
          });
        } else {
          console.log(error);
          toast.error(`Something went wrong`, {
            position: "top-right",
            duration: 3000,
            queue: true,
          });
        }
      }
    },
    async deleteDivision(userId) {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const res = await axios({
          method: "delete",
          url: `${baseUrl[mode]}${apiPrefix}/division/${userId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return res;
      } catch (error) {
        // Check if the error is an axios error
        if (error.response) {
          console.error(error.response.data);
          toast.error(`${error.response.data.message}`, {
            position: "top-right",
            duration: 3000,
            queue: true,
          });
        } else {
          console.log(error);
          toast.error(`Something went wrong`, {
            position: "top-right",
            duration: 3000,
            queue: true,
          });
        }
      }
    },
  },
});
