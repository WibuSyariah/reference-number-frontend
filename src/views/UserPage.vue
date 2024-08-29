<script>
import { mapWritableState, mapActions } from "pinia";
import { FormKit } from "@formkit/vue";
import Sidebar from "@/components/Sidebar.vue";
import { useUserStore } from "@/stores/user";
export default {
  name: "UserPage",
  data() {
    return {
      editId: null,
      deleteId: null,
      showEditModal: false,
      showDeleteModal: false,
    };
  },
  mounted() {
    this.fetchUser(this.query);
    document.addEventListener("keydown", this.escKeyHandler);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.escKeyHandler);
  },
  computed: {
    ...mapWritableState(useUserStore, ["query", "users", "defaultQuery"]),
  },
  components: {
    Sidebar,
  },
  methods: {
    ...mapActions(useUserStore, [
      "fetchUser",
      "createUser",
      "deleteUser",
      "editUser",
    ]),

    async filterHandler(values) {
      this.query = {
        ...this.query,
        ...values,
      };

      this.query.currentPage = 1;
      await this.fetchUser(this.query);
    },

    async clearFilterHandler() {
      this.query = {
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      };

      await this.fetchUser(this.query);
    },

    async nextPage() {
      this.query.currentPage++;

      await this.fetchUser(this.query);
    },

    async backPage() {
      this.query.currentPage--;

      await this.fetchUser(this.query);
    },

    async addUserHandler(values) {
      try {
        const res = await this.createUser(values);

        if (res.status === 201) {
          // Check for successful response
          this.fetchUser(this.defaultQuery);
          this.$toast.success(res.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    deleteModalToggle(userId) {
      this.deleteId = userId;
      this.showDeleteModal = true;
    },

    editModalToggle(userId) {
      this.editId = userId;
      this.showEditModal = true;
    },

    cancelButtonHandler() {
      this.showDeleteModal = false;
      this.showEditModal = false;
      this.deleteId = null;
      this.editId = null;
    },

    escKeyHandler(event) {
      if (event.key === "Escape") {
        this.showDeleteModal = false;
        this.showEditModal = false;
        this.deleteId = null;
        this.editId = null;
      }
    },

    async deleteUserHandler() {
      try {
        const res = await this.deleteUser(this.deleteId);

        if (res.status === 200) {
          // Check for successful response
          this.fetchUser(this.defaultQuery);
          this.showDeleteModal = false;
          this.deleteId = null;
          this.$toast.success(res.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },

    async editUserHandler(values) {
      try {
        const res = await this.editUser(this.editId, values);

        if (res.status === 200) {
          // Check for successful response
          this.fetchUser(this.defaultQuery);
          this.showEditModal = false;
          this.editId = null;
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
  <Sidebar></Sidebar>
  <div
    class="mx-auto w-3/4 my-8 p-8 bg-gray-200 container flex flex-col items-center rounded border shadow"
  >
    <div
      class="flex flex-col items-center gap-4 bg-gray-300 border border-solid border-black rounded p-4"
    >
      <h1 class="font-bold">Tambah Pengguna</h1>
      <FormKit
        type="form"
        :actions="false"
        :classes="{
          form: 'flex flex-col items-center justify-items-center justify-center',
        }"
        @submit="addUserHandler"
        incomplete-message="Maaf, tidak semua kolom diisi dengan benar."
      >
        <div class="flex gap-4">
          <FormKit
            type="text"
            name="fullName"
            id="Nama Lengkap"
            validation="required"
            placeholder="Nama Lengkap"
            :validation-messages="{
              required: ({ node }) => {
                return `${node.props.id} diperlukan.`;
              },
            }"
          />
          <FormKit
            type="text"
            name="username"
            id="Nama Pengguna"
            validation="required"
            placeholder="Nama Pengguna"
            :validation-messages="{
              required: ({ node }) => {
                return `${node.props.id} diperlukan.`;
              },
            }"
          />
          <FormKit
            type="password"
            name="password"
            id="Kata Sandi"
            validation="required"
            placeholder="Kata Sandi"
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
    <div class="flex flex-row mt-8">
      <div class="flex">
        <FormKit
          type="form"
          @submit="filterHandler"
          :actions="false"
          :classes="{
            form: 'flex flex-col items-center justify-items-center justify-center',
          }"
        >
          <FormKit
            type="text"
            name="search"
            id="search"
            placeholder="Nama"
            :classes="{
              input: 'w-[250px]',
            }"
          />
          <div class="flex gap-4">
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
              @click="clearFilterHandler"
            />
          </div>
        </FormKit>
      </div>
    </div>
    <div
      class="container overflow-x-auto mx-auto border border-black border-solid rounded w-max"
    >
      <table class="min-w-full divide-y-2 divide-black bg-gray-300 text-sm">
        <thead class="ltr:text-left rtl:text-right">
          <tr>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Id
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Nama Pengguna
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Nama Lengkap
            </th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-black">
          <tr v-for="user in users" :key="user.id">
            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              {{ user.id }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              {{ user.username }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              {{ user.fullName }}
            </td>
            <td class="flex gap-2 whitespace-nowrap px-4 py-2 text-gray-700">
              <button
                class="inline-block rounded border border-green-600 bg-green-600 text-sm font-medium text-white hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring active:text-green-500 w-16 h-8"
                @click="editModalToggle(user.id)"
              >
                Edit
              </button>
              <button
                class="inline-block rounded border border-red-600 bg-red-600 text-sm font-medium text-white hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500 w-16 h-8"
                @click="deleteModalToggle(user.id)"
              >
                Hapus
              </button>
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
          v-if="this.query.currentPage > 1"
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

        <p class="text-xs text-gray-900" v-if="this.query.totalPages > 0">
          {{ this.query.currentPage }}
          <span class="mx-0.25">/</span>
          {{ this.query.totalPages }}
        </p>

        <a
          href="#"
          class="inline-flex size-8 items-center justify-center rounded border border-black border-solid bg-gray-300 text-gray-900 rtl:rotate-180"
          v-if="
            this.query.totalPages !== this.query.currentPage &&
            this.query.totalPages !== 0
          "
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
    <div v-if="this.users.length === 0">
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
          <FormKit type="submit" label="Hapus" @click="deleteCompanyHandler" />
        </div>
      </div>
    </div>
    <div
      v-if="this.showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
    >
      <div
        class="modal-backdrop fixed inset-0 bg-black opacity-50"
        @click="cancelButtonHandler"
      ></div>
      <div
        class="flex flex-col items-center justify-center justify-items-center modal bg-gray-100 rounded-lg absolute w-96 h-fit p-8"
      >
        <FormKit type="form" @submit="editUserHandler" :actions="false">
          <FormKit
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Nama Lengkap"
          />
          <FormKit
            type="password"
            name="newPassword"
            id="newPassword"
            placeholder="Kata Sandi Baru"
          />
          <FormKit
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            validation="confirm:newPassword"
            placeholder="Konfrimasi Kata Sandi"
          />
          <div class="flex gap-8">
            <FormKit
              type="button"
              label="Kembali"
              @click="cancelButtonHandler"
            />
            <FormKit
              type="submit"
              label="Edit"
              :classes="{
                outer: '',
                input:
                  'w-[110px] flex items-center text-center justify-center justify-items-center',
                label:
                  'flex items-center text-center justify-center justify-items-center',
              }"
            />
          </div>
        </FormKit>
      </div>
    </div>
  </div>
</template>
