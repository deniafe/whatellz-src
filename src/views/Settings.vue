<template>
  <v-container class="px-12">
    <v-row class="pt-4">
      <v-col cols="6">
        <v-card-title>General App Settings</v-card-title>
      </v-col>
      <v-col cols="6">
        <div class="d-flex justify-end pt-4">
          <v-btn lg color="primary" @click="saveAppSettings"
            >Save Settings</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <div class="mt-8 mx-12">
      <v-row>
        <v-col class="py-0" cols="8">
          <div>
            <div class="caption :">Email :</div>
            <AppInput v-model="email" />
          </div>
        </v-col>
        <v-col class="py-0" cols="4">
          <v-btn
            @click="updateEmail"
            :loading="email_loading"
            :disabled="email_loading"
            class="mt-8"
            text
            outlined
            color="primary"
          >
            Update Email
          </v-btn>
        </v-col>
        <v-col class="py-0" cols="8">
          <div>
            <div class="caption :">Password :</div>
            <AppInput v-model="password" />
          </div>
        </v-col>
        <v-col class="py-0" cols="4">
          <v-btn
            @click="updatePassword"
            class="mt-8"
            text
            outlined
            color="primary"
            :loading="password_loading"
            :disabled="password_loading"
          >
            Update Password
          </v-btn>
        </v-col>
        <v-col class="py-0" cols="12">
          <div>
            <div class="caption :">Add Proxy :</div>
            <AppInput v-model="proxy" />
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { ipcRenderer } from 'electron'
import { auth } from '@/plugins/firebase'
import { mapGetters } from 'vuex'
export default {
  name: 'settings',
  data: () => ({
    proxy: '',
    browserHeight: 0,
    password: '',
    password_loading: false,
    email: '',
    email_loading: false,
    name: '',
    name_loading: false,
  }),
  computed: {
    ...mapGetters({
      user: 'user/user',
      appSettings: 'app/appSettings',
    }),
    divStyle() {
      return {
        minHeight: this.browserHeight + 'px',
      }
    },
  },
  mounted() {
    this.$store.dispatch('auth/checkAuth')
    this.browserHeight = document.body.clientHeight
    this.getProxies()
    this.initSettings()
  },
  methods: {
    initSettings() {
      this.proxy = this.appSettings.proxies[0]
    },
    saveAppSettings() {
      const data = [this.proxy]
      ipcRenderer.send('save-proxies', data)
      const notification = {
        message: 'Settings saved successfully',
        type: 'success',
      }
      this.$store.dispatch('notification/setNotification', notification)
      this.$store.dispatch('notification/showNotification', true)
    },
    getProxies() {
      ipcRenderer.send('get-proxies')
    },
    updatePassword() {
      this.password_loading = true
      const user = auth.currentUser
      const newPassword = this.password

      user
        .updatePassword(newPassword)
        .then(() => {
          // Update successful.
          const notification = {
            message: 'Password updated successfully',
            type: 'success',
          }
          this.$store.dispatch('notification/setNotification', notification)
          this.$store.dispatch('notification/showNotification', true)
          this.password_loading = false
        })
        .catch((error) => {
          // An error ocurred
          const notification = {
            message: `An error occurred while updating password - ${error}`,
            type: 'error',
          }
          this.$store.dispatch('notification/setNotification', notification)
          this.$store.dispatch('notification/showNotification', true)
          this.password_loading = false
        })
    },
    updateEmail() {
      this.email_loading = true
      const user = auth.currentUser
      const newEmail = this.email

      user
        .updateEmail(newEmail)
        .then(() => {
          // Update successful.
          const notification = {
            message: 'Password updated successfully',
            type: 'success',
          }
          this.$store.dispatch('notification/setNotification', notification)
          this.$store.dispatch('notification/showNotification', true)
          this.email_loading = false
        })
        .catch((error) => {
          // An error ocurred
          const notification = {
            message: `An error occurred while updating email - ${error}`,
            type: 'error',
          }
          this.$store.dispatch('notification/setNotification', notification)
          this.$store.dispatch('notification/showNotification', true)
          this.email_loading = false
        })
    },
  },
}
</script>
