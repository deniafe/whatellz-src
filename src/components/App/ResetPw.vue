<template>
  <v-dialog v-model="dialog" max-width="320">
    <!-- <v-card
      flat
      class="mx-auto mb-12"
      color="accent"
      max-width="500"
      height="250"
    > -->
    <v-card flat class="mx-auto" color="card" max-width="320">
      <v-card-title class="mb-3">Reset Password</v-card-title>
      <v-card-subtitle
        >Enter the email address associated with your account, and we'll email
        you a link to reset your password.
      </v-card-subtitle>
      <v-form ref="resetForm" @submit.prevent="resetPassword">
        <v-row class="mt-1 mb-0 mx-2">
          <v-col class="py-0 pb-2" cols="12">
            <v-text-field
              v-model="email"
              style="height: 46px"
              :rules="emailRules"
              label="Email"
              type="email"
              flat
            ></v-text-field>
          </v-col>
          <v-col>
            <div class="text-center mb-3">
              <v-btn
                width="270"
                :loading="loading"
                :disabled="loading"
                color="primary"
                large
                @click="resetPassword"
              >
                Send Reset Link
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <!-- </v-card> -->
  </v-dialog>
</template>

<script>
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
      timeout: 3000,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    }
  },
  computed: {
    dialog: {
      get() {
        return this.resetPw
      },
      set(val) {
        this.$emit('resetPw', val)
      },
    },
  },
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
  },
}
</script>
