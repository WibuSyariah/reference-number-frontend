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
      masterDataIcon: "keyboard_arrow_down",
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
      if (this.masterDataIcon === "keyboard_arrow_down") {
        this.masterDataIcon = "keyboard_arrow_up";
      } else {
        this.masterDataIcon = "keyboard_arrow_down";
      }
      this.showMasterData = !this.showMasterData;
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
          <RouterLink to="/">
            <li>
              <div
                class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Buat
              </div>
            </li>
          </RouterLink>
          <RouterLink to="/list">
            <li>
              <div
                class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Daftar
              </div>
            </li>
          </RouterLink>
          <RouterLink to="/archive" v-if="role === 'SUPERADMIN'">
            <li>
              <div
                class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Arsip
              </div>
            </li>
          </RouterLink>
          <div v-if="role === 'SUPERADMIN'">
            <li
              class="block rounded-lg px-4 pt-2 text-sm font-medium text-gray-500 hover:text-gray-700 text-nowrap cursor-pointer flex justify-between"
              @click="masterDataToggle"
            >
              <span>Data Master</span>
              <i class="material-symbols-outlined">{{ masterDataIcon }}</i>
            </li>
            <ul v-show="showMasterData" class="border-t">
              <RouterLink to="/user">
                <li>
                  <div
                    class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Pengguna
                  </div>
                </li>
              </RouterLink>
              <RouterLink to="/company">
                <li>
                  <div
                    class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Perusahaan
                  </div>
                </li>
              </RouterLink>
              <RouterLink to="/division">
                <li>
                  <div
                    class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Divisi
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
          Ganti Password
        </li>
        <li
          class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
          @click="logoutHandler"
        >
          Keluar
        </li>
        <a href="https://github.com/WibuSyariah" target="_blank">
          <li
            class="block rounded-lg px-4 py-2 mt-4 text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
          >
            <i class="material-symbols-outlined mr-2">copyright</i>
            <p>Aca</p>
          </li>
        </a>
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
    <div
      class="flex flex-col modal bg-gray-100 rounded-lg absolute pt-8 pb-4 px-12"
    >
      <FormKit
        type="form"
        @submit="changePasswordHandler"
        submit-label="Ganti"
        incomplete-message="Maaf, tidak semua kolom diisi dengan benar."
      >
        <FormKit
          type="password"
          name="newPassword"
          id="Kata Sandi Baru"
          validation="required"
          placeholder="Kata Sandi Baru"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.id} diperlukan.`;
            },
          }"
        />
        <FormKit
          type="password"
          name="confirmPassword"
          id="Konfirmasi Kata Sandi"
          validation="required|confirm:newPassword"
          placeholder="Konfirmasi Kata Sandi"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.id} diperlukan.`;
            },
            confirm: ({ node }) => {
              return `Kata sandi tidak sama.`;
            },
          }"
        />
      </FormKit>
    </div>
  </div>
</template>

<style></style>
