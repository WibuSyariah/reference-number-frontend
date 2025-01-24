<script>
import { mapWritableState, mapActions } from "pinia";
import { FormKit } from "@formkit/vue";
import { useReferenceNumberStore } from "@/stores/referenceNumber";
import { useCompanyStore } from "@/stores/company";
import { useDivisionStore } from "@/stores/division";
import dayjs from "dayjs";
export default {
  name: "ListPage",
  data() {
    return {
      today: this.generateToday(),
      formData: {},
    };
  },
  mounted() {
    this.fetchReferenceNumber(this.query);
    this.fetchCompany();
    this.fetchDivision();
  },
  computed: {
    ...mapWritableState(useReferenceNumberStore, ["referenceNumbers", "query"]),
    ...mapWritableState(useCompanyStore, ["companyDropdown"]),
    ...mapWritableState(useDivisionStore, ["divisionDropdown"]),
  },

  methods: {
    ...mapActions(useReferenceNumberStore, ["fetchReferenceNumber"]),
    ...mapActions(useCompanyStore, ["fetchCompany"]),
    ...mapActions(useDivisionStore, ["fetchDivision"]),

    generateToday() {
      const today = dayjs();
      const formattedToday = today.format("YYYY-MM-DD");
      return formattedToday;
    },

    formatDate(dateString) {
      return dayjs(dateString).format("DD/MM/YYYY");
    },

    async filterHandler(values) {
      this.query = {
        ...this.query,
        ...values,
      };

      this.query.currentPage = 1;
      await this.fetchReferenceNumber(this.query);
    },

    async clearFilterHandler() {
      this.query = {
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      };

      this.formData = {
        startDate: this.today,
        endDate: this.today,
      };

      await this.fetchReferenceNumber(this.query);
    },

    async nextPage() {
      this.query.currentPage++;

      await this.fetchReferenceNumber(this.query);
    },

    async backPage() {
      this.query.currentPage--;

      await this.fetchReferenceNumber(this.query);
    },
  },
};
</script>

<template>
  <div
    class="mx-auto w-5/6 my-8 p-8 bg-gray-200 container flex flex-col items-center rounded border shadow"
  >
    <FormKit
      type="form"
      @submit="filterHandler"
      :actions="false"
      :classes="{
        form: 'flex flex-col m-4 gap-4 items-center justify-items-center justify-center',
      }"
      v-model="formData"
    >
      <div
        class="flex flex-col items-center justify-items-center content-center justify-center gap-4"
      >
        <div class="flex gap-4">
          <FormKit
            type="select"
            label="Perusahaan"
            name="companyId"
            :options="companyDropdown"
            :classes="{
              input: 'w-56', // Adjust height as needed
            }"
            placeholder="Pilih Perusahaan"
          />
          <FormKit
            type="select"
            label="Departemen"
            name="divisionId"
            :options="divisionDropdown"
            :classes="{
              input: 'w-56', // Adjust height as needed
            }"
            placeholder="Pilih Departemen"
          />
        </div>
        <div class="flex text-center items-center gap-4">
          <FormKit
            type="submit"
            label="Filter"
            :classes="{
              outer: '',
              input:
                'w-32 flex items-center text-center justify-center justify-items-center',
              label:
                'flex items-center text-center justify-center justify-items-center',
            }"
          />
          <FormKit
            type="button"
            label="Reset Filter"
            :classes="{
              outer: '',
              input: '',
            }"
            @click="clearFilterHandler"
          />
        </div>
      </div>
    </FormKit>
    <div class="container border border-black border-solid rounded w-fit">
      <table class="min-w-full divide-y-2 divide-black bg-gray-300 text-sm">
        <thead class="ltr:text-left rtl:text-right">
          <tr>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Nomor Surat
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Tanggal
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Dari
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Departemen
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Perihal Surat
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Untuk
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-black">
          <tr
            v-for="referenceNumber in referenceNumbers"
            :key="referenceNumber.id"
          >
            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              {{ referenceNumber.referenceNumber }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              {{ formatDate(referenceNumber.createdAt) }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              {{ referenceNumber.applicantName }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              {{ referenceNumber.Division.name }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              {{ referenceNumber.letterSubject }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              {{ referenceNumber.addressedTo }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-8">
      <div class="flex items-center justify-center">
        <div class="inline-flex items-center justify-center gap-3 py-2 rounded">
          <!-- Previous Page Button -->
          <a
            href="#"
            class="inline-flex size-8 items-center justify-center rounded border border-black border-solid bg-gray-300 text-gray-900 rtl:rotate-180"
            v-show="query.currentPage > 1"
            @click="backPage"
          >
            <span class="sr-only">Previous Page</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>

          <!-- Current Page Indicator -->
          <p class="text-xs text-gray-900" v-show="query.totalPages > 0">
            {{ query.currentPage }}
            <span class="mx-0.25">/</span>
            {{ query.totalPages }}
          </p>

          <!-- Next Page Button -->
          <a
            href="#"
            class="inline-flex size-8 items-center justify-center rounded border border-black border-solid bg-gray-300 text-gray-900 rtl:rotate-180"
            v-show="query.currentPage < query.totalPages"
            @click="nextPage"
          >
            <span class="sr-only">Next Page</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div v-if="this.referenceNumbers.length === 0">
      <p class="font-bold text-xl">No Data Found</p>
    </div>
  </div>
</template>
