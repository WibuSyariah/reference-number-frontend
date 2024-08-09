<script>
import { mapWritableState, mapActions } from "pinia";
import { useReferenceNumberStore } from "@/stores/referenceNumber";
import { FormKit } from "@formkit/vue";
export default {
  name: "GeneratePage",
  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useReferenceNumberStore, ["referenceNumber"]),
  },
  methods: {
    ...mapActions(useReferenceNumberStore, ["generate"]),

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
        // Prevent default form submission
        return false;
      } catch (error) {
        console.error(error)
      }
    },
  },
};
</script>

<template>
  <div class="container flex items-center justify-between mt-8">
    <div
      class="container flex flex-col items-center bg-gray-100 pt-8 pb-4 border rounded border-hidden w-96 border-transparent shadow mx-auto"
    >
      <FormKit type="form" @submit="handleSubmit">
        <FormKit
          type="select"
          label="Company"
          placeholder="Select your company"
          name="companyCode"
          :options="{
            MGM: 'MODA GLOBAL MARITIM',
            MAP: 'MAZO ARMADA PASIFIK',
            ATP: 'AURORA TRANS PASIFIK',
            GTG: 'GEO TEKNO GLOBALINDO',
            UGS: 'UNO GLOBAL SATELIT',
          }"
          validation="required"
        />
        <FormKit
          type="text"
          name="applicantName"
          id="applicantName"
          validation="required"
          label="Name"
          placeholder="John Doe"
        />
        <FormKit
          type="select"
          label="Division"
          placeholder="Select your division"
          name="division"
          :options="{
            MANAGEMENT: 'MANAGEMENT',
            OPERATIONAL: 'OPERATIONAL',
            'HUMAN CAPITAL': 'HUMAN CAPITAL',
            IT: 'IT',
            FINANCE: 'FINANCE',
            'TAX & ACCOUNTING': 'TAX & ACCOUNTING',
            PROCUREMENT: 'PROCUREMENT',
            COMMERCIAL: 'COMMERCIAL',
            LEGAL: 'LEGAL',
          }"
          validation="required"
        />
        <FormKit
          type="text"
          name="letterSubject"
          id="letterSubject"
          validation="required"
          label="Letter Subject"
          placeholder="Subject of the letter"
        />
        <FormKit
          type="text"
          name="addressedTo"
          id="addressedTo"
          validation="required"
          label="Addressed To"
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
