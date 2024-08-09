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
  }),
  getters: {},
  actions: {
    async generate(input) {
      try {
        const res = await axios({
          method: "post",
          url: `${baseUrl}${apiPrefix}/reference-number/generate`,
          data: input,
        });

        this.referenceNumber = res.data.data.referenceNumber;
      } catch (error) {
        // Check if the error is an axios error
        if (error.response.data.statusCode === 401) {
          console.error("Response error:", error.response.data);
          toast.error(
            `Please login again`,
            {
              position: "top-right",
              duration: 3000,
              queue: true,
            },
          );
        } else {
          toast.error(
            `Something went wrong`,
            {
              position: "top-right",
              duration: 3000,
              queue: true,
            },
          );
        }
      }
    },
  },
});
