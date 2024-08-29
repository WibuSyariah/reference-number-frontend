<script>
import { mapWritableState, mapActions } from "pinia";
import { useUserStore } from "@/stores/user";
import { FormKit } from "@formkit/vue";
export default {
  name: "LoginPage",
  data() {
    return {
      accessToken: localStorage.getItem("accessToken"),
    };
  },
  computed: {
    ...mapWritableState(useUserStore, ["isLoggedIn"]),
  },
  methods: {
    ...mapActions(useUserStore, ["login"]),

    async loginHandler(values) {
      try {
        const res = await this.login(values);

        if (res.status === 200) {
          // Check for successful response
          localStorage.setItem("accessToken", res.data.data.accessToken);
          localStorage.setItem("role", res.data.data.role);

          this.$router.push("/");

          this.$toast.success("Logged in successfully");
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<template>
  <section class="bg-gray-100 w-screen" v-if="!accessToken">
    <div class="lg:grid lg:min-h-screen lg:grid-cols-12 flex">
      <aside
        class="relative block h-16 lg:order-first lg:col-span-5 lg:h-full xl:col-span-6"
      >
        <img
          alt=""
          src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          class="absolute inset-0 h-full w-full object-cover"
        />
      </aside>

      <main
        class="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
      >
        <div class="max-w-xl lg:max-w-3xl">
          <div class="block text-blue-600">
            <img
              src="https://www.moda-holding.com/wp-content/uploads/2020/03/cropped-MODA-Holding-300x61-1.png"
            />
          </div>

          <h1
            class="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl"
          >
            Nomor Surat
          </h1>
          <br />

          <FormKit
            type="form"
            @submit="loginHandler"
            submit-label="Masuk"
            incomplete-message="Maaf, tidak semua kolom diisi dengan benar."
          >
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
            <br />
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
            <br />
          </FormKit>
        </div>
      </main>
    </div>
  </section>
</template>
