<script>
import { mapWritableState, mapActions } from "pinia";
import { FormKit } from "@formkit/vue";
import Sidebar from "@/components/Sidebar.vue";
import { useDivisionStore } from "@/stores/division";
export default {
  name: "DivisionPage",
  data() {
    return {
      deleteId: null,
      showDeleteModal: false,
    };
  },
  mounted() {
    this.fetchDivision(this.query);
    document.addEventListener("keydown", this.escKeyHandler);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.escKeyHandler);
  },
  computed: {
    ...mapWritableState(useDivisionStore, [
      "query",
      "divisions",
      "defaultQuery",
    ]),
  },
  components: {
    Sidebar,
  },
  methods: {
    ...mapActions(useDivisionStore, [
      "fetchDivision",
      "createDivision",
      "deleteDivision",
    ]),

    async nextPage() {
      this.query.currentPage++;

      await this.fetchDivision(this.query);
    },

    async backPage() {
      this.query.currentPage--;

      await this.fetchDivision(this.query);
    },

    async addDivisionHandler(values) {
      try {
        const res = await this.createDivision(values);

        if (res.status === 201) {
          // Check for successful response
          this.fetchDivision(this.defaultQuery);
          this.$toast.success(res.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    deleteModalToggle(divisionId) {
      this.deleteId = divisionId;
      this.showDeleteModal = true;
    },

    cancelButtonHandler() {
      this.showDeleteModal = false;
      this.deleteId = null;
    },

    escKeyHandler(event) {
      if (event.key === "Escape") {
        this.showDeleteModal = false;
        this.deleteId = null;
      }
    },

    async deleteDivisionHandler() {
      try {
        const res = await this.deleteDivision(this.deleteId);

        if (res.status === 200) {
          // Check for successful response
          this.fetchDivision(this.defaultQuery);
          this.showDeleteModal = false;
          this.deleteId = null;
          this.$toast.success(res.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<template>
  <div class="flex">
    <Sidebar></Sidebar>
    <div
      class="mx-auto w-3/4 my-8 p-8 bg-gray-200 container flex flex-col items-center rounded border shadow"
    >
      <div
        class="flex flex-col items-center gap-4 bg-gray-300 border border-solid border-black rounded p-4"
      >
        <h1 class="font-bold">Tambah Departemen</h1>
        <FormKit
          type="form"
          :actions="false"
          :classes="{
            form: 'flex flex-col items-center justify-items-center justify-center',
          }"
          @submit="addDivisionHandler"
          incomplete-message="Maaf, tidak semua kolom diisi dengan benar."
        >
          <div class="flex gap-4">
            <FormKit
              type="text"
              name="name"
              id="Nama Departemen"
              validation="required"
              placeholder="Nama Departemen"
              :validation-messages="{
                required: ({ node }) => {
                  return `${node.props.id} diperlukan.`;
                },
              }"
            />
            <FormKit
              type="text"
              name="code"
              id="Kode Departemen"
              validation="required"
              placeholder="Kode Departemen"
              :validation-messages="{
                required: ({ node }) => {
                  return `${node.props.id} diperlukan.`;
                },
              }"
            />
          </div>
          <div>
            <FormKit type="submit" label="Tambah" />
          </div>
        </FormKit>
      </div>
      <span class="flex mt-8 h-px bg-gray-500 w-5/6"> </span>
      <div
        class="container mx-auto border border-black border-solid rounded w-max mt-8"
      >
        <table class="min-w-full divide-y-2 divide-black bg-gray-300 text-sm">
          <thead class="ltr:text-left rtl:text-right">
            <tr>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Id
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Nama
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Kode
              </th>
              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-black">
            <tr v-for="division in divisions" :key="division.id">
              <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                {{ division.id }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                {{ division.name }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                {{ division.code }}
              </td>
              <td class="flex gap-2 whitespace-nowrap px-4 py-2 text-gray-700">
                <button
                  class="inline-block rounded border border-red-600 bg-red-600 text-sm font-medium text-white hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500 w-16 h-8"
                  @click="deleteModalToggle(division.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-8">
        <div class="flex items-center justify-center">
          <div
            class="inline-flex items-center justify-center gap-3 py-2 rounded"
          >
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
      <div v-if="this.divisions.length === 0">
        <p class="font-bold text-xl">No Data Found</p>
      </div>
      <div
        v-show="this.showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      >
        <div
          class="modal-backdrop fixed inset-0 bg-black opacity-50"
          @click="cancelButtonHandler"
        ></div>
        <div
          class="flex flex-col items-center justify-center justify-items-center modal bg-gray-100 rounded-lg absolute w-72 h-48 p-8"
        >
          <h1 class="my-4 font-bold text-xl">Apakah kamu yakin?</h1>
          <div class="flex gap-8">
            <FormKit type="button" label="Tidak" @click="cancelButtonHandler" />
            <FormKit
              type="submit"
              label="Hapus"
              @click="deleteCompanyHandler"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
