<script>
import { mapWritableState, mapActions } from "pinia";
import { useReferenceNumberStore } from "@/stores/referenceNumber";
import { FormKit } from "@formkit/vue";
import { useCompanyStore } from "@/stores/company";
import { useDivisionStore } from "@/stores/division";
import Sidebar from "@/components/Sidebar.vue";
export default {
  name: "GeneratePage",
  data() {
    return {};
  },
  mounted() {
    this.fetchCompany();
    this.fetchDivision();
  },
  computed: {
    ...mapWritableState(useReferenceNumberStore, ["referenceNumber"]),
    ...mapWritableState(useCompanyStore, ["companyDropdown"]),
    ...mapWritableState(useDivisionStore, ["divisionDropdown"]),
  },
  methods: {
    ...mapActions(useReferenceNumberStore, ["generate"]),
    ...mapActions(useCompanyStore, ["fetchCompany"]),
    ...mapActions(useDivisionStore, ["fetchDivision"]),

    copyToClipboard() {
      navigator.clipboard
        .writeText(`${this.referenceNumber}`)
        .then(() => {
          this.$toast.success("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    },

    async handleSubmit(values) {
      try {
        await this.generate(values);
      } catch (error) {
        console.error(error);
      }
    },
  },
  components: {
    Sidebar
  }
};
</script>

<template>
  <Sidebar></Sidebar>
  <div class="container flex items-center justify-between mt-8">
    <div
      class="container flex flex-col items-center bg-gray-100 pt-8 pb-4 border rounded border-hidden w-96 border-transparent shadow mx-auto"
    >
      <FormKit type="form" @submit="handleSubmit" submit-label="Generate">
        <FormKit
          type="select"
          label="Company"
          placeholder="Select your company"
          name="companyId"
          :options="companyDropdown"
          validation="required"
        />
        <FormKit
          type="text"
          name="applicantName"
          id="applicantName"
          validation="required"
          label="From"
          placeholder="John Doe"
        />
        <FormKit
          type="select"
          label="Division"
          placeholder="Select your division"
          name="divisionId"
          :options="divisionDropdown"
          validation="required"
        />
        <FormKit
          type="text"
          name="letterSubject"
          id="letterSubject"
          validation="required"
          label="Subject"
          placeholder="Subject of the letter"
        />
        <FormKit
          type="text"
          name="addressedTo"
          id="addressedTo"
          validation="required"
          label="To"
          placeholder="John Doe"
        />
        <br />
      </FormKit>
    </div>
    <div
      class="mr-auto w-64 bg-gray-100 border-transparent shadow container flex flex-col items-center text-nowrap bg-gray-100 p-8 border rounded border-hidden"
    >
      <p>Your Reference Number</p>
      <br />
      <p>{{ referenceNumber || "XXX/XXX/XXX/XXX" }}</p>
      <br />
      <FormKit
        type="submit"
        label="Copy to clipboard"
        @click="copyToClipboard"
      />
    </div>
  </div>
</template>

<style scoped></style>
