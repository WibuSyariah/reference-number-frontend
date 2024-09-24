<script>
import { FormKit } from "@formkit/vue";
import { useUserStore } from "@/stores/user";
import { mapActions } from "pinia";
import { RouterLink } from "vue-router";

export default {
  name: "Sidebar",
  data() {
    return {
      showSidebar: true,
      sidebarIcon: "arrow_left",
      showMasterData: false,
      showReferenceNumber: false,
      dropdownIcon: "keyboard_arrow_down",
      showModal: false,
      role: localStorage.getItem("role"),
    };
  },
  mounted() {
    document.addEventListener("keydown", this.escKeyHandler);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.escKeyHandler);
  },
  methods: {
    ...mapActions(useUserStore, ["changePassword"]),

    masterDataToggle() {
      this.showMasterData = !this.showMasterData;
    },
    referenceNumberToggle() {
      this.showReferenceNumber = !this.showReferenceNumber;
    },
    sidebarToggle() {
      if (this.sidebarIcon === "arrow_left") {
        this.sidebarIcon = "arrow_right";
      } else {
        this.sidebarIcon = "arrow_left";
      }
      this.showSidebar = !this.showSidebar;
    },
    logoutHandler() {
      localStorage.clear();
      this.$router.push("/login");
    },
    modalToggle() {
      this.showModal = !this.showModal;
    },
    escKeyHandler(event) {
      if (event.key === "Escape") {
        this.showModal = false;
      }
    },
    async changePasswordHandler(values) {
      try {
        const res = await this.changePassword(values);

        if (res.status === 200) {
          // Check for successful response
          this.$toast.success(`Password changed successfully`);
          this.modalToggle();
        } else {
          console.error(res.data); // Handle specific error message
          toast.error(`Password change failed. Please try again.`, {
            position: "top-right",
            duration: 3000,
            queue: true,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<template>
  <div
    class="flex justify-between h-screen sticky top-0 bg-gray-200 shadow rounded-r"
  >
    <div
      v-show="showSidebar"
      class="flex flex-col w-max overflow-x-hidden overflow-y-auto"
    >
      <div class="py-6 flex-grow">
        <span class="grid px-12 place-content-center text-xs">Logo</span>

        <ul class="mt-6 space-y-1">
          <div>
            <li
              class="block rounded-lg px-4 pt-2 text-sm font-medium text-gray-500 hover:text-gray-700 text-nowrap cursor-pointer flex justify-between"
              @click="referenceNumberToggle"
            >
              <span>Penomoran Surat</span>
              <i class="material-symbols-outlined">{{ dropdownIcon }}</i>
            </li>
            <ul v-show="showReferenceNumber" class="border-t">
              <RouterLink to="/reference-number/create">
                <li>
                  <div
                    class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Create
                  </div>
                </li>
              </RouterLink>
              <RouterLink to="/reference-number/preview">
                <li>
                  <div
                    class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Preview
                  </div>
                </li>
              </RouterLink>
              <RouterLink to="/reference-number/archive" v-if="role === 'SUPERADMIN'">
                <li>
                  <div
                    class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Archive
                  </div>
                </li>
              </RouterLink>
            </ul>
          </div>
          <div v-if="role === 'SUPERADMIN' || 'ADMIN'">
            <li
              class="block rounded-lg px-4 pt-2 text-sm font-medium text-gray-500 hover:text-gray-700 text-nowrap cursor-pointer flex justify-between"
              @click="masterDataToggle"
            >
              <span>Data Master</span>
              <i class="material-symbols-outlined">{{ dropdownIcon }}</i>
            </li>
            <ul v-show="showMasterData" class="border-t">
              <RouterLink to="/master/user">
                <li>
                  <div
                    class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    User
                  </div>
                </li>
              </RouterLink>
              <RouterLink to="/master/company">
                <li>
                  <div
                    class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Perusahaan
                  </div>
                </li>
              </RouterLink>
              <RouterLink to="/master/division">
                <li>
                  <div
                    class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Departemen
                  </div>
                </li>
              </RouterLink>
            </ul>
          </div>
        </ul>
      </div>
      <ul class="mb-4">
        <li
          class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
          @click="modalToggle"
        >
          Change Password
        </li>
        <li
          class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
          @click="logoutHandler"
        >
          Log Out
        </li>
      </ul>
    </div>
    <div
      @click="sidebarToggle"
      class="cursor-pointer justify-center flex bg-gray-400 shadow rounded-r items-center text-white w-4"
    >
      <i class="material-symbols-outlined">{{ sidebarIcon }}</i>
    </div>
  </div>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
  >
    <div
      class="modal-backdrop fixed inset-0 bg-black opacity-50"
      @click="modalToggle"
    ></div>
    <div class="flex flex-col modal bg-gray-100 rounded-lg absolute p-12">
      <button class="absolute top-0 right-0 p-2" @click="modalToggle">
        <i class="material-symbols-outlined">close</i>
      </button>
      <FormKit
        type="form"
        @submit="changePasswordHandler"
        submit-label="Ganti"
        incomplete-message="Maaf, tidak semua kolom diisi dengan benar."
      >
        <FormKit
          type="password"
          name="newPassword"
          id="Password Baru"
          validation="required"
          placeholder="Password Baru"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.id} diperlukan.`;
            },
          }"
        />
        <FormKit
          type="password"
          name="confirmPassword"
          id="Konfirmasi Password"
          validation="required|confirm:newPassword"
          placeholder="Konfirmasi Password"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.id} diperlukan.`;
            },
            confirm: ({ node }) => {
              return `Password tidak sama.`;
            },
          }"
        />
      </FormKit>
    </div>
  </div>
</template>

<style></style>
