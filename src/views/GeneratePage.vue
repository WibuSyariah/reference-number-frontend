<script>
import { mapWritableState, mapActions } from "pinia";
import { FormKit } from "@formkit/vue";
import { useReferenceNumberStore } from "@/stores/referenceNumber";
import { useCompanyStore } from "@/stores/company";
import { useDivisionStore } from "@/stores/division";
import Sidebar from "@/components/Sidebar.vue";
export default {
  name: "GeneratePage",
  data() {
    return {
      showModal: false,
      formData: {},
    };
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
          this.showModal = false;
          this.formData = {};
          this.$toast.success("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    },

    async handleSubmit() {
      try {
        const res = await this.generate(this.formData);

        if (res.status === 201) {
          // Check for successful response
          this.showModal = true;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  components: {
    Sidebar,
  },
};
</script>

<template>
  <Sidebar></Sidebar>
  <div class="container flex items-center">
    <div
      class="container flex flex-col items-center bg-gray-100 pt-8 pb-4 border rounded border-hidden w-96 border-transparent shadow mx-auto my-8"
    >
      <FormKit
        type="form"
        @submit="handleSubmit"
        submit-label="Buat"
        v-model="formData"
        incomplete-message="Maaf, tidak semua kolom diisi dengan benar."
      >
        <FormKit
          type="select"
          label="Perusahaan"
          name="companyId"
          :options="companyDropdown"
          validation="required"
          placeholder="Pilih Perusahaan"
          persistent="true"
          validation-visibility="live"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.label} diperlukan.`;
            },
          }"
        />
        <FormKit
          type="text"
          name="applicantName"
          id="applicantName"
          validation="required"
          label="Dari"
          validation-visibility="live"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.label} diperlukan.`;
            },
          }"
        />
        <FormKit
          type="select"
          label="Divisi"
          name="divisionId"
          :options="divisionDropdown"
          validation="required"
          placeholder="Pilih Divisi"
          validation-visibility="live"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.label} diperlukan.`;
            },
          }"
        />
        <FormKit
          type="text"
          name="letterSubject"
          id="letterSubject"
          validation="required"
          label="Perihal Surat"
          validation-visibility="live"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.label} diperlukan.`;
            },
          }"
        />
        <FormKit
          type="text"
          name="addressedTo"
          id="addressedTo"
          validation="required"
          label="Untuk"
          validation-visibility="live"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.label} diperlukan.`;
            },
          }"
        />
        <br />
      </FormKit>
    </div>
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
    >
      <div
        class="modal-backdrop fixed inset-0 bg-black opacity-50"
      ></div>
      <div
        class="flex flex-col items-center modal bg-gray-100 rounded-lg absolute p-12"
      >
        <p>Nomor Surat</p>
        <br />
        <p>{{ referenceNumber || "---/---/---/---" }}</p>
        <br />
        <FormKit
          type="button"
          label="Salin ke papan klip"
          @click="copyToClipboard"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
