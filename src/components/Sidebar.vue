<script>
export default {
  name: "Sidebar",
  data() {
    return {
      showSidebar: true,
      showMasterData: false,
    };
  },

  methods: {
    masterDataToggle() {
      this.showMasterData = !this.showMasterData;
    },
    sidebarToggle() {
      this.showSidebar = !this.showSidebar;
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
          <li>
            <a
              href="#"
              class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Generate
            </a>
          </li>
          <li>
            <a
              href="#"
              class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              List
            </a>
          </li>
          <li
            class="block rounded-lg px-4 pt-2 text-sm font-medium text-gray-500 hover:text-gray-700 text-nowrap cursor-pointer flex justify-between"
            @click="masterDataToggle"
          >
            <span>Master Data</span>
            <i class="material-symbols-outlined">menu</i>
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
        <li>
          <button
            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Change Password
          </button>
        </li>
        <li>
          <button
            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Log Out
          </button>
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
      class="cursor-pointer justify-center flex bg-gray-400 shadow rounded-r items-center text-white"
    >
      <i class="material-symbols-outlined rotate-90">menu</i>
    </div>
  </div>
</template>

<style></style>
