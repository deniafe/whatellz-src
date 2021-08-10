<template>
  <v-app>
    <!-- <Licensing /> -->
    <Navbar />
    <LeftNav v-if="showNav" />
    <v-main class="secondary">
      <router-view />
    </v-main>
    <!-- <BottomNav /> -->
    <v-snackbar
      v-model="snackBar"
      :timeout="timeout"
      :color="notificationColor"
      elevation="24"
      top
      right
    >
      {{ notificationMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="verified"
      :timeout="-1"
      color="appPink"
      elevation="24"
      app
      center
    >
      Your email is not verified. A verification email has been sent to you.
      Follow the instructions to verify your email address.
      <v-btn small color="purple" text @click="verifyEmail">Resend Email</v-btn>
    </v-snackbar>
    <RightNav />
    <AppAssetManager />
    <AppConfirm />
    <Overlay />
  </v-app>
</template>

<script>
import { ipcRenderer } from 'electron'
// import { nanoid } from 'nanoid'
import { mapGetters } from 'vuex'
import LeftNav from '@/components/App/LeftNav'
import Navbar from '@/components/App/Navbar'
// import Licensing from '@/components/Licensing'
import RightNav from '@/components/App/RightNav'
import Overlay from '@/components/App/Overlay'
export default {
  name: 'App',
  components: {
    LeftNav,
    Navbar,
    // Licensing,
    RightNav,
    Overlay,
    // BottomNav,
  },
  data: () => ({
    timeout: 3000,
  }),
  computed: {
    ...mapGetters({
      user: 'auth/user',
      showNotification: 'notification/status',
      notificationMessage: 'notification/message',
      notificationColor: 'notification/color',
      overlayDialog: 'app/overlayDialog',
    }),
    verified() {
      let verified
      if (this.user) {
        // verified = !this.user.verified
        verified = false
      }
      return verified
    },
    snackBar: {
      get() {
        return this.showNotification
      },
      set(status) {
        this.$store.commit('notification/SET_STATUS', status)
      },
    },
    showNav() {
      const currentRoute = this.$route.name
      return !(currentRoute === 'auth' || currentRoute === '404')
    },
    divStyle() {
      return {
        height: this.browserHeight + 'px',
      }
    },
  },
  mounted() {
    this.$store.dispatch('auth/checkAuth')
    this.browserHeight = document.body.clientHeight
    this.$store.dispatch('app/setVideos')
    ipcRenderer.on('alert', (event, arg) => {
      console.log('From the front end app: ', arg) // prints "pong"
      const notification = {
        message: arg.message,
        type: arg.status,
      }
      this.$store.dispatch('notification/setNotification', notification)
      this.$store.dispatch('notification/showNotification', true)
      this.$store.commit('app/ADD_LOG', arg)
    })
    ipcRenderer.send('get-contacts')
    ipcRenderer.send('get-scheduled-numbers')
    ipcRenderer.send('get-successful-numbers')
    ipcRenderer.send('get-campaigns')
    ipcRenderer.send('get-numbers')
    ipcRenderer.on('interval', (event, arg) => {
      this.$store.commit('campaign/SET_INTERVAL', arg)
    })
    ipcRenderer.on('set-accounts', (event, arg) => {
      if (!arg) arg = []
      this.$store.commit('app/SET_WHATSAPP_ACCOUNTS', arg)
    })
    ipcRenderer.on('set-campaigns', (event, arg) => {
      if (!arg) arg = []
      this.$store.commit('campaign/SET_CAMPAIGNS', arg)
    })
    ipcRenderer.on('set-bots', (event, arg) => {
      if (!arg) arg = []
      this.$store.commit('bot/SET_BOTS', arg)
    })
    ipcRenderer.on('set-skills', (event, arg) => {
      if (!arg) arg = []
      this.$store.commit('skill/SET_SKILLS', arg)
    })
    ipcRenderer.on('set-actions', (event, arg) => {
      if (!arg) arg = []
      this.$store.commit('action/SET_ACTIONS', arg)
    })
    ipcRenderer.on('set-numbers', (event, arg) => {
      if (!arg) arg = []
      this.$store.commit('app/SET_NUMBERS', arg)
    })
    ipcRenderer.on('set-contacts', (event, arg) => {
      if (!arg) arg = []
      this.$store.commit('campaign/SET_CONTACTS', arg)
    })
    ipcRenderer.on('set-scheduled-numbers', (event, arg) => {
      if (!arg) arg = []
      this.$store.commit('campaign/SET_SCHEDULED_NUMBERS', arg)
    })
    ipcRenderer.on('set-successful-numbers', (event, arg) => {
      if (!arg) arg = []
      this.$store.commit('campaign/SET_SUCCESSFUL_NUMBERS', arg)
    })
    ipcRenderer.on('wa-contacts-collection', (event, args) => {
      const contacts = args.body
      if (this.overlayDialog) {
        this.$store.commit('app/SET_OVERLAY_DIALOG', false)
        this.$store.commit('app/SET_OVERLAY_DESCRIPTION', 'Loading')
      }
      console.log(contacts)
      this.$store.commit('app/ADD_NUMBERS', contacts)
    })
    ipcRenderer.on('wa-group-collection', (event, args) => {
      const groups = args.body
      if (this.overlayDialog) {
        this.$store.commit('app/SET_OVERLAY_DIALOG', false)
        this.$store.commit('app/SET_OVERLAY_DESCRIPTION', 'Loading')
      }
      this.$store.commit('app/SET_WA_TEMP_NUMBERS', groups)
      this.$store.commit('app/SET_WA_GRP_DISPLAY_DIALOG', true)
    })
    ipcRenderer.on('display-verified-numbers', (event, arg) => {
      this.$store.commit('app/ADD_VERIFIED_NUMBERS', arg)
      if (this.overlayDialog) {
        this.$store.commit('app/SET_OVERLAY_DIALOG', false)
        this.$store.commit('app/SET_OVERLAY_DESCRIPTION', 'Loading')
      }
    })
    ipcRenderer.on('qr-code', (event, args) => {
      if (this.overlayDialog) {
        this.$store.commit('app/SET_OVERLAY_DIALOG', false)
        this.$store.commit('app/SET_OVERLAY_DESCRIPTION', 'Loading')
      }
      // Add the user id to the whatsapp account object
      args.userId = this.user.id
      this.$store.commit('app/SET_ACTIVE_QR_CODE', args)
    })
    ipcRenderer.on('update_available', () => {
      const notification = {
        message: 'A new update is available. Downloading now...',
        type: 'info',
      }
      this.$store.dispatch('notification/setNotification', notification)
      this.$store.dispatch('notification/showNotification', true)
    })
    ipcRenderer.on('update_downloaded', () => {
      const notification = {
        message:
          'Update Downloaded. It will be installed on restart. Restart now?',
        type: 'info',
      }
      this.$store.dispatch('notification/setNotification', notification)
      this.$store.dispatch('notification/showNotification', true)
    })
    ipcRenderer.on('campaign-terminated', (events, arg) => {
      if (this.overlayDialog) {
        this.$store.commit('app/SET_OVERLAY_DIALOG', false)
        this.$store.commit('app/SET_OVERLAY_DESCRIPTION', 'Loading')
      }
      this.$store.commit('campaign/SET_CAMPAIGN_TEXT', 'Launch Campaign')
      this.$store.commit('campaign/UPDATE_STATUS', 'Inactive')
      const notification = {
        message: 'Campaign Terminated',
        type: 'info',
      }
      this.$store.dispatch('notification/setNotification', notification)
      this.$store.dispatch('notification/showNotification', true)
      this.$store.commit('app/ADD_LOG', arg)
    })
    ipcRenderer.on('campaign-launched', (events, arg) => {
      if (this.overlayDialog) {
        this.$store.commit('app/SET_OVERLAY_DIALOG', false)
        this.$store.commit('app/SET_OVERLAY_DESCRIPTION', 'Loading')
      }
      this.$store.commit('campaign/SET_CAMPAIGN_TEXT', 'Stop Campaign')
      const notification = {
        message: 'Campaign Launched Successfully',
        type: 'info',
      }
      this.$store.dispatch('notification/setNotification', notification)
      this.$store.dispatch('notification/showNotification', true)
      this.$store.commit('app/ADD_LOG', arg)
    })
    ipcRenderer.on('contact', (event, args) => {
      this.$store.commit('campaign/ADD_CONTACT', args)
    })
    ipcRenderer.on('successful-numbers', (event, arg) => {
      if (!arg) arg = []
      this.$store.commit('campaign/ADD_SUCCESSFUL_NUMBERS', arg)
    })
    ipcRenderer.on('scraper-terminated', (event, arg) => {
      this.$store.commit('app/SET_SCRAPER_TEXT', 'Scrape Videos')
      const notification = {
        message: 'Scraper Terminated',
        type: 'info',
      }
      this.$store.dispatch('notification/setNotification', notification)
      this.$store.dispatch('notification/showNotification', true)
      this.$store.commit('app/ADD_LOG', arg)
    })
    this.getAccounts()
  },
  watch: {
    user() {
      if (this.user) {
        this.$store.dispatch('auth/checkMembership', this.user.id)
        console.log('CheckMembership is called in watch app.vue')
      }
    },
  },
  methods: {
    verifyEmail() {
      this.$store.dispatch('auth/sendVerificationEmail')
    },
    getAccounts() {
      ipcRenderer.send('get-accounts')
    },
  },
}
</script>

<style type="text/css">
::-webkit-scrollbar {
  width: 1px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 1px;
}

::-webkit-scrollbar-thumb:hover {
  background: transparent;
}
#mainBody {
  background-color: rgba(255, 255, 255, 0);
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 0px;
  background-image: url(https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fs3.amazonaws.com%2Fappforest_uf%2Ff1605671281644x216180420725037060%2FloginPage%2520background.jpg?w=1536&h=920&auto=compress&fit=crop&dpr=1.5);
}
.theme--dark.v-list {
  background-color: #181625;
  color: #ffffff;
}
</style>
