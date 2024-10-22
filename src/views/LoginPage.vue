<script>
import { mapWritableState, mapActions } from "pinia";
import { useUserStore } from "@/stores/user";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
export default {
  name: "LoginPage",
  data() {
    return {
      validationSchema: yup.object({
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required"),
      }),
    };
  },
  computed: {
    ...mapWritableState(useUserStore, ["isLoggedIn"]),
  },
  components: {
    Form,
    Field,
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

          this.$toast.success("Logged in successfully");
          this.$router.push("/reference-number/create");
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<template>
  <section class="bg-gray-100 w-screen">
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
            Penomoran Surat
          </h1>
          <br />

          <v-card class="mx-auto pa-12 pb-18" max-width="448" rounded="lg">
            <!-- Form with VeeValidate -->
            <Form
              :validation-schema="validationSchema"
              @submit="loginHandler"
              class="flex flex-col gap-4"
            >
              <!-- Username Field -->

              <Field name="username" v-slot="{ field, meta }">
                <v-text-field
                  v-bind="field"
                  label="Username"
                  placeholder="Enter your username"
                  variant="outlined"
                  :error-messages="meta.touched ? meta.errors : []"
                ></v-text-field>
              </Field>

              <!-- Password Field -->

              <Field name="password" v-slot="{ field, meta }">
                <v-text-field
                  v-bind="field"
                  label="Password"
                  placeholder="Enter your password"
                  variant="outlined"
                  type="password"
                  @click:append-inner="visible = !visible"
                  :error-messages="meta.touched ? meta.errors : []"
                >
                </v-text-field>
              </Field>

              <!-- Submit Button -->
              <v-btn
                type="submit"
                class="mb-4"
                color="blue"
                size="large"
                variant="tonal"
                block
              >
                Log In
              </v-btn>
            </Form>
          </v-card>
        </div>
      </main>
    </div>
  </section>
</template>
