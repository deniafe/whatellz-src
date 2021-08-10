<template>
  <!-- TODO : Remember to add persistent to the dialog -->
  <v-dialog v-model="dialog" max-width="500">
    <v-card flat class="mx-auto" color="card" max-width="500">
      <v-card-title class="mb-3">Activate Tubely</v-card-title>
      <v-card-subtitle
        >Please enter your license information in order to activate tubely
      </v-card-subtitle>
      <v-form ref="resetForm" @submit.prevent="resetPassword" class="px-6 pb-4">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          type="email"
          background-color="input"
          solo
          flat
        ></v-text-field>
        <v-text-field
          v-model="license"
          label="License Key"
          :rules="licenseRules"
          type="text"
          background-color="input"
          solo
          flat
        ></v-text-field>
        <v-card-actions>
          <v-btn color="input" @click="quit"> Quit </v-btn>
          <v-btn color="info" @click="getLicense"> Free License </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :loading="loading"
            :disabled="loading"
            color="primary"
            @click="validateLicense"
          >
            Activate
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <!-- </v-card> -->
  </v-dialog>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  props: {
    resetPw: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      email: '',
      license: '',
      timeout: 3000,
      dialog: true,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      licenseRules: [
        (v) => !!v || 'License Key is required',
        (v) => (v && v.length >= 10) || 'License Key must be valid',
      ],
    }
  },
  computed: {},
  watch: {
    dialog(newValue) {
      if (newValue) this.resetForm()
    },
  },
  methods: {
    resetForm() {
      this.$refs.resetForm.reset()
    },
    resetPassword() {
      this.$store.dispatch('auth/resetPassword', this.email)
      this.$emit('resetPw', false)
    },
    getLicense() {},
    validateLicense() {
      this.$store.dispatch('app/validateLicense', {
        email: this.email,
        license: this.license,
      })
    },
    quit() {
      ipcRenderer.send('close')
    },
  },
}
</script>
