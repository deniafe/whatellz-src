<template>
  <div id="authBody" class="secondary">
    <v-container>
      <v-card
        flat
        class="mx-auto"
        color="transparent"
        max-width="360"
        min-height="530"
      >
        <v-card height="80" color="transparent" flat>
          <div
            class="text-center pt-2 font-weight-bold"
            style="font-size: 18px"
          >
            <v-avatar color="transparent" size="50" rounded>
              <img src="../assets/WhatellzLogo.png" alt="" />
            </v-avatar>
            <div class="pt-4 pl-2">Whatellz</div>
          </div>
        </v-card>
        <!-- <div class="text-center font-weight-bold">{{ formState }}</div> -->
        <v-card
          flat
          class="mx-auto pt-2 mt-8"
          color="transparent"
          max-width="300"
        >
          <v-form ref="authForm" @submit.prevent="userAuth">
            <v-row class="mt-6 mb-0">
              <v-col class="py-0" cols="12">
                <v-text-field
                  v-model="form.email"
                  :rules="emailRules"
                  label="Email"
                  type="email"
                  prepend-inner-icon="mdi-email-outline"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="py-0" cols="12">
                <v-text-field
                  v-model="form.password"
                  :rules="passwordRules"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-fingerprint"
                  :append-icon="
                    showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                  "
                  outlined
                  dense
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
                <v-btn
                  v-if="formState === 'Log In'"
                  class="primary--text float-right mt-2"
                  x-small
                  text
                  @click="setPw(true)"
                >
                  Forgot Password?
                </v-btn>
              </v-col>
              <v-col class="pb-6">
                <v-checkbox
                  v-model="ex4"
                  class="float-left"
                  :label="
                    formState === 'Log In'
                      ? 'Remember me'
                      : 'By signing up, I agree to the Privacy Policy and the Terms of Services.'
                  "
                  color="info"
                  value="info"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <div class="text-center">
                  <v-btn
                    class="ma-2"
                    width="280"
                    :loading="loading"
                    :disabled="loading"
                    :color="formState === 'Log In' ? 'background' : 'primary'"
                    large
                    v-ripple
                    @click="userAuth"
                  >
                    <span class="white--text">{{
                      formState === 'Log In' ? 'LOGIN' : 'SIGN UP'
                    }}</span>
                  </v-btn>
                  <v-btn
                    class="ma-2"
                    width="280"
                    :color="formState === 'Log In' ? 'primary' : 'white'"
                    large
                    outlined
                    @click="changeFormState"
                  >
                    {{ formState === 'Log In' ? 'SIGN UP' : 'OR LOGIN' }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-card>
    </v-container>
    <ResetPw :resetPw="resetPw" @resetPw="setPw" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ResetPw from '@/components/App/ResetPw'
export default {
  components: {
    ResetPw,
  },
  data() {
    return {
      formState: 'Log In',
      showPassword: false,
      browserHeight: 0,
      resetPw: false,
      ex4: false,
      form: {
        email: '',
        password: '',
      },
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        (v) => /[^\s]/.test(v) || 'Password is required',
        (v) => (v && v.length >= 6) || 'Must be 6 characters or more',
      ],
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      loading: 'auth/loading',
    }),
    divStyle() {
      return {
        height: this.browserHeight + 'px',
      }
    },
  },
  mounted() {
    // this.$store.dispatch('auth/checkAuth', 'auth')
    this.browserHeight = document.body.clientHeight
  },
  methods: {
    setPw(val) {
      this.resetPw = val
    },
    userAuth() {
      if (this.$refs.authForm.validate()) {
        this.form.state = this.formState
        this.$store.dispatch('auth/userAuth', this.form)
      } else {
        const notification = {
          message: `Please complete the form to ${this.formState}`,
          type: 'error',
        }
        this.$store.dispatch('notification/setNotification', notification)
        this.$store.dispatch('notification/showNotification', true)
      }
    },
    resetForm() {
      this.$refs.authForm.reset()
    },
    changeFormState() {
      this.formState === 'Sign Up'
        ? (this.formState = 'Log In')
        : (this.formState = 'Sign Up')
      this.resetForm()
    },
  },
}
</script>

<style scoped>
#signup-title {
  font-size: 24px;
  text-align: center;
  padding-top: 40px;
  padding-bottom: 30px;
}
</style>
