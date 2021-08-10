<template>
  <v-dialog persistent v-model="dialog" max-width="320">
    <v-card flat class="mx-auto" color="card" max-width="320">
      <v-card-title class="mb-2">Add A WhatsApp Profile</v-card-title>
      <v-card-subtitle
        >Hint: A browser will pop up with the whatsapp's qr code. Learn more.
      </v-card-subtitle>
      <!-- <v-form ref="resetForm" @submit.prevent="resetPassword"> -->
      <div class="d-flex justify-center py-6">
        <v-btn
          lg
          text
          outlined
          :loading="overlayDialog"
          color="primary"
          @click="scanCode"
          >{{ acc ? 'QR Code Seccessful!' : 'Scan QR Code' }}</v-btn
        >
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="$emit('close')"> Close </v-btn>
        <v-btn @click="saveAcc" color="primary" :disabled="!acc" text>
          {{ btx }}
        </v-btn>
      </v-card-actions>
      <!-- </v-form> -->
    </v-card>
    <!-- </v-card> -->
  </v-dialog>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
export default {
  props: {
    accDialog: {
      type: Boolean,
      default: false,
    },
    btx: {
      type: String,
      default: 'Save',
    },
  },
  data() {
    return {
      name: '',
      number: '',
      buttonText: 'Save',
      showBrowser: false,
      textRules: [
        (v) => /[^\s]/.test(v) || 'This field is required',
        (v) => (v && v.length >= 2) || 'Must be more than 2 characters',
      ],
    }
  },
  computed: {
    ...mapGetters({
      acc: 'app/activeAcc',
      overlayDialog: 'app/overlayDialog',
    }),
    dialog: {
      get() {
        return this.accDialog
      },
      set() {
        this.$emit('close')
      },
    },
  },
  methods: {
    saveAcc() {
      if (this.btx === 'Save') {
        this.$store.commit('app/ADD_WHATSAPP_ACCOUNT', this.acc)
        this.$store.commit('app/SET_ACTIVE_QR_CODE', '')
      }
      this.$emit('close')
    },
    scanCode() {
      this.$store.commit('app/SET_OVERLAY_DIALOG', true)
      this.$store.commit(
        'app/SET_OVERLAY_DESCRIPTION',
        'Initiating Authentication...',
      )
      if (!this.acc) ipcRenderer.send('scan-qr-code')
    },
  },
}
</script>
