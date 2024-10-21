<script>
import { mapWritableState, mapActions } from "pinia";
import { FormKit } from "@formkit/vue";
import { useReferenceNumberStore } from "@/stores/referenceNumber";
import { useCompanyStore } from "@/stores/company";
import { useDivisionStore } from "@/stores/division";
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

    modalClose() {
      this.formData = {};
      this.showModal = false;
    },

    copyToClipboard() {
      navigator.clipboard
        .writeText(`${this.referenceNumber}`)
        .then(() => {
          this.formData = {};
          this.$toast.success("Berhasil di salin");
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
};
</script>

<template>
  <div class="container flex items-center">
    <div
      class="container flex flex-col items-center bg-gray-100 pt-8 pb-4 border rounded border-hidden w-2/4 border-transparent shadow mx-auto my-8"
    >
      <FormKit
        type="form"
        @submit="handleSubmit"
        submit-label="Buat"
        v-model="formData"
        incomplete-message="Maaf, tidak semua kolom diisi dengan benar."
        :classes="{
          form: 'flex flex-col w-72 justify-center',
        }"
      >
        <FormKit
          type="select"
          label="Perusahaan"
          name="companyId"
          validation="required"
          placeholder="Pilih Perusahaan"
          persistent="true"
          validation-visibility="live"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.label} diperlukan.`;
            },
          }"
          :classes="{
            input: 'text-black font-bold',
          }"
        >
          <option
            v-for="company in companyDropdown"
            :key="company.value"
            class="text-xl text-black"
            :value="company.value"
          >
            {{ company.label }}
          </option>
        </FormKit>
        <FormKit
          type="text"
          name="applicantName"
          id="applicantName"
          validation="required"
          label="Nama Pemohon"
          validation-visibility="live"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.label} diperlukan.`;
            },
          }"
        />
        <FormKit
          type="select"
          label="Departemen"
          name="divisionId"
          validation="required"
          placeholder="Pilih Departemen"
          persistent="true"
          validation-visibility="live"
          :validation-messages="{
            required: ({ node }) => {
              return `${node.props.label} diperlukan.`;
            },
          }"
          :classes="{
            input: 'text-black font-bold',
          }"
        >
          <option
            v-for="division in divisionDropdown"
            :key="division.value"
            class="text-xl text-black"
            :value="division.value"
          >
            {{ division.label }}
          </option>
        </FormKit>
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
          label="Ditujukan Kepada"
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
      <div class="modal-backdrop fixed inset-0 bg-black opacity-50"></div>
      <div
        class="flex flex-col items-center modal bg-gray-100 rounded-lg absolute p-16"
      >
        <button class="absolute top-0 right-0 p-2" @click="modalClose">
          <i class="material-symbols-outlined">close</i>
        </button>
        <p>Nomor Surat</p>
        <br />
        <p>{{ referenceNumber || "---/---/---/---" }}</p>
        <br />
        <FormKit type="button" label="Salin" @click="copyToClipboard" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
