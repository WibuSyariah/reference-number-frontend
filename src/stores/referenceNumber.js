import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toast-notification";

const baseUrl = "http://localhost:3000";
const apiPrefix = "/api/v1";
const toast = useToast();

export const useReferenceNumberStore = defineStore({
  id: "referenceNumberStore",
  state: () => ({
    referenceNumber: "",
    referenceNumbers: [],
    query: {
      limit: 10,
      currentPage: 1,
      totalPages: 1,
    },
  }),
  getters: {},
  actions: {
    async generate(input) {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const res = await axios({
          method: "post",
          url: `${baseUrl}${apiPrefix}/reference-number`,
          data: input,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        this.referenceNumber = res.data.data.referenceNumber;

        return res
      } catch (error) {
        // Check if the error is an axios error
        if (error.response.data.statusCode === 401) {
          console.error("Response error:", error.response.data);
          toast.error(`Please login again`, {
            position: "top-right",
            duration: 3000,
            queue: true,
          });
        } else {
          console.error(error);
          toast.error(`Something went wrong`, {
            position: "top-right",
            duration: 3000,
            queue: true,
          });
        }
      }
    },

    async fetchReferenceNumber(params) {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const res = await axios({
          method: "get",
          url: `${baseUrl}${apiPrefix}/reference-number`,
          params: params ? params : {},
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(res.data.data);
        this.query.totalPages = res.data.data.totalPages;
        this.query.currentPage = res.data.data.currentPage;
        this.referenceNumbers = res.data.data.referenceNumbers;
      } catch (error) {
        console.error(error);
        toast.error(`Something went wrong`, {
          position: "top-right",
          duration: 3000,
          queue: true,
        });
      }
    },
  },
});
