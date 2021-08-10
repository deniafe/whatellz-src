<template>
  <v-app-bar dense color="background" flat fixed app>
    <!-- <v-toolbar-title class="ml-md-10">Dashboard</v-toolbar-title> -->
    <v-spacer />

    <v-btn @click="clickMenu('min')" icon color="text">
      <v-icon small>mdi-minus</v-icon>
    </v-btn>
    <v-btn @click="clickMenu('max')" icon color="text">
      <v-icon small>mdi-checkbox-blank-outline</v-icon>
    </v-btn>
    <v-btn @click="clickMenu('close')" icon color="text">
      <v-icon small>mdi-close</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      menu: false,
    }
  },
  computed: {
    ...mapGetters({
      img: 'user/img',
      user: 'auth/user',
      notifications: 'user/notifications',
    }),
    showBar() {
      const currentRoute = this.$route.name
      return (
        !(currentRoute === 'auth' || currentRoute === '404') &&
        this.$vuetify.breakpoint.smAndDown
      )
    },
  },
  methods: {
    clickMenu(type) {
      ipcRenderer.send(type)
    },
    showNav() {
      this.$store.commit('app/SHOW_NAV')
    },
    signOut() {
      this.$store.dispatch('auth/signOut')
    },
    showUserDialog() {
      this.$store.commit('user/SET_DIALOG', true)
    },
  },
}
</script>

<style></style>
