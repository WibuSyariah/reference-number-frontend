<script>
export default {
  name: "Sidebar",
  data() {
    return {
      showSidebar: true,
      sidebarIcon: `<`,
    };
  },

  methods: {
    sidebarToggle() {
      this.showSidebar = !this.showSidebar;
      if (this.sidebarIcon === `>`) {
        this.sidebarIcon = `<`;
      } else {
        this.sidebarIcon = `>`;
      }
    },
  },
};
</script>

<template>
  <div
    class="flex justify-between border-e h-screen sticky top-0 bg-gray-200 shadow rounded-r"
  >
    <div v-show="showSidebar" class="flex flex-col">
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

          <li>
            <a
              href="#"
              class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Register User
            </a>
          </li>
        </ul>
      </div>
      <ul class="mb-4">
        <li>
          <button
            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Log Out
          </button>
        </li>
      </ul>
    </div>
    <div
      @click="sidebarToggle"
      class="cursor-pointer justify-center flex bg-gray-400 p-1 shadow rounded-r"
    >
      <button>{{ sidebarIcon }}</button>
    </div>
  </div>
</template>

<style scoped></style>
