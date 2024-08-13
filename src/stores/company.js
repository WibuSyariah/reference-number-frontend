import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toast-notification";

const baseUrl = "http://localhost:3000";
const apiPrefix = "/api/v1";
const toast = useToast();

export const useCompanyStore = defineStore({
  id: "companyStore",
  state: () => ({
    companies: [],
    companyDropdown: [],
  }),
  getters: {},
  actions: {
    async fetchCompany(params) {
      try {
        const res = await axios({
          method: "get",
          url: `${baseUrl}${apiPrefix}/company`,
          params: params ? params : {},
        });

        this.companies = res.data.data.companies;
        this.companyDropdown = this.companies.map((company) => ({
          label: company.name,
          value: company.id,
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
