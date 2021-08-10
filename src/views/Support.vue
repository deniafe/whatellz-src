<template>
  <v-container class="px-12 pt-4">
    <v-card-title>Contact Support Or Request For A Feature</v-card-title>
    <v-divider></v-divider>
    <div class="mt-8 mx-12">
      <v-card-subtitle>
        Visit socio toolz telegram channel and send a message to us. It's faster
        and convenient. Click the button below.</v-card-subtitle
      >
      <div class="d-flex justify-center mt-4">
        <v-btn lg color="primary" @click="sendMessage">Send Message</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
// import { ipcRenderer } from 'electron'
const { shell } = require('electron')
import { mapGetters } from 'vuex'
export default {
  name: 'support',
  data: () => ({
    message: {
      email: '',
      title: '',
      content: '',
    },
    browserHeight: 0,
    messageRules: [
      (v) => /[^\s]/.test(v) || 'This field is required',
      (v) => (v && v.length >= 2) || 'Must be more than 2 characters',
    ],
  }),
  computed: {
    ...mapGetters({
      user: 'user/user',
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
  },
  methods: {
    sendMessage() {
      shell.openExternal('https://t.me/sociotoolz')
      const notification = {
        message: 'Opening telegram on the web...',
        type: 'info',
      }
      this.$store.dispatch('notification/setNotification', notification)
      this.$store.dispatch('notification/showNotification', true)
    },
  },
}
</script>
