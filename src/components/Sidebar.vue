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
    };
  },
  mounted() {
    document.addEventListener("keydown", this.handleEscKey);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleEscKey);
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
    handleEscKey(event) {
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
    <div v-show="showSidebar" class="flex flex-col w-40">
      <div class="py-6 flex-grow">
        <span class="grid px-12 place-content-center text-xs">Logo</span>

        <ul class="mt-6 space-y-1">
          <RouterLink to="/">
            <li>
              <a
                href="#"
                class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Generate
              </a>
            </li>
          </RouterLink>
          <RouterLink to="/list">
            <li>
              <a
                href="#"
                class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                List
              </a>
            </li>
          </RouterLink>
          <li
            class="block rounded-lg px-4 pt-2 text-sm font-medium text-gray-500 hover:text-gray-700 text-nowrap cursor-pointer flex justify-between"
            @click="masterDataToggle"
          >
            <span>Master Data</span>
            <i class="material-symbols-outlined">{{ masterDataIcon }}</i>
          </li>
          <ul v-show="showMasterData" class="border-t">
            <li>
              <a
                href="#"
                class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                User
              </a>
            </li>
            <li>
              <a
                href="#"
                class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Company
              </a>
            </li>
            <li>
              <a
                href="#"
                class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Division
              </a>
            </li>
          </ul>
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
    <div class="flex flex-col modal bg-gray-100 rounded-lg absolute p-8">
      <FormKit
        type="form"
        @submit="changePasswordHandler"
        submit-label="Submit"
      >
        <FormKit
          type="password"
          name="newPassword"
          id="newPassword"
          validation="required"
          label="New Password"
          placeholder="Password"
        />
        <FormKit
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          validation="required|confirm:newPassword"
          label="Confirm Password"
          placeholder="Password"
        />
      </FormKit>
    </div>
  </div>
</template>

<style></style>
