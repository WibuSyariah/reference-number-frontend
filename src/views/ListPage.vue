<script>
import { mapWritableState, mapActions } from "pinia";
import { FormKit } from "@formkit/vue";
import { useReferenceNumberStore } from "@/stores/referenceNumber";
import { useCompanyStore } from "@/stores/company";
import { useDivisionStore } from "@/stores/division";
import Sidebar from "@/components/Sidebar.vue";
import dayjs from "dayjs";
export default {
  name: "ListPage",
  data() {
    return {};
  },
  mounted() {
    this.fetchReferenceNumber({
      limit: this.limit,
      currentPage: this.currentPage,
    });
    this.fetchCompany();
    this.fetchDivision();
  },
  computed: {
    ...mapWritableState(useReferenceNumberStore, [
      "referenceNumbers",
      "limit",
      "currentPage",
      "totalPages",
      "query",
    ]),
    ...mapWritableState(useCompanyStore, ["companyDropdown"]),
    ...mapWritableState(useDivisionStore, ["divisionDropdown"]),

    today() {
      const today = dayjs();
      const formattedToday = today.format("YYYY-MM-DD");
      return formattedToday;
    },

    firstDay() {
      return "1970-01-01";
    },
  },
  components: {
    Sidebar,
  },
  methods: {
    ...mapActions(useReferenceNumberStore, ["fetchReferenceNumber"]),
    ...mapActions(useCompanyStore, ["fetchCompany"]),
    ...mapActions(useDivisionStore, ["fetchDivision"]),

    formatDate(dateString) {
      return dayjs(dateString).format("DD/MM/YYYY");
    },

    async filterHandler(values) {
      this.query = values;
      await this.fetchReferenceNumber({
        ...values,
        limit: this.limit,
        currentPage: this.currentPage,
      });
    },

    async clearFilterHandler() {
      this.query = {};
      this.currentPage = 1;

      await this.fetchReferenceNumber({
        limit: this.limit,
        currentPage: this.currentPage,
      });
    },

    async nextPage() {
      this.currentPage++;

      await this.fetchReferenceNumber({
        ...this.query,
        limit: this.limit,
        currentPage: this.currentPage,
      });
    },

    async backPage() {
      this.currentPage--;

      await this.fetchReferenceNumber({
        ...this.query,
        limit: this.limit,
        currentPage: this.currentPage,
      });
    },
  },
};
</script>

<template>
  <Sidebar></Sidebar>
  <div
    class="mx-auto w-3/4 my-8 p-8 bg-gray-200 container flex flex-col items-center rounded border shadow"
  >
    <FormKit
      type="form"
      @submit="filterHandler"
      :actions="false"
      :classes="{
        form: 'flex flex-col m-4 gap-4 items-center justify-items-center justify-center',
      }"
    >
      <div
        class="flex items-center justify-items-center content-center justify-center gap-4"
      >
        <div>
          <FormKit
            type="date"
            name="startDate"
            id="startDate"
            label="Start Date"
            :value="firstDay"
            :classes="{
              input: 'h-4 w-48', // Adjust height as needed
            }"
          />
          <FormKit
            type="date"
            name="endDate"
            id="endDate"
            label="End Date"
            :value="today"
            :classes="{
              input: 'h-4 w-48', // Adjust height as needed
            }"
          />
        </div>
        <div>
          <FormKit
            type="select"
            label="Company"
            name="companyId"
            :options="[{ label: '' }, ...companyDropdown]"
            :classes="{
              input: 'w-56', // Adjust height as needed
            }"
          />
          <FormKit
            type="select"
            label="Division"
            name="divisionId"
            :options="[{ label: '' }, ...divisionDropdown]"
            :classes="{
              input: 'w-56', // Adjust height as needed
            }"
          />
        </div>
        <div class="flex flex-col text-center items-center">
          <FormKit
            type="submit"
            label="Filter"
            :classes="{
              outer: 'mt-7',
              input:
                'w-32 flex items-center text-center justify-center justify-items-center',
              label:
                'flex items-center text-center justify-center justify-items-center',
            }"
          />
          <FormKit
            type="button"
            label="Clear Filter"
            :classes="{
              outer: 'mt-3',
              input: '',
            }"
            @click="clearFilterHandler"
          />
        </div>
      </div>
    </FormKit>

    <div
      class="container overflow-x-auto mx-auto  border border-black border-solid rounded w-max"
    >
      <table class="min-w-full divide-y-2 divide-black bg-gray-300 text-sm">
        <thead class="ltr:text-left rtl:text-right">
          <tr>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Reference Number
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Date
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              From
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Division
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Subject
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              For
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
      <div class="inline-flex items-center justify-center gap-3">
        <a
          href="#"
          class="inline-flex size-8 items-center justify-center rounded border border-black border-solid bg-gray-300 text-gray-900 rtl:rotate-180"
          v-if="currentPage !== 1"
          @click="backPage"
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
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </a>

        <p class="text-xs text-gray-900">
          {{ this.currentPage }}
          <span class="mx-0.25">/</span>
          {{ this.totalPages }}
        </p>

        <a
          href="#"
          class="inline-flex size-8 items-center justify-center rounded border border-black border-solid bg-gray-300 text-gray-900 rtl:rotate-180"
          v-if="totalPages !== currentPage"
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
</template>
