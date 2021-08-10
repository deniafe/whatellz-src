<template>
  <div :style="toolbarStyle">
    <v-toolbar color="background" flat>
      <!-- The menu for the amount of bots and skills present in the application -->
      <v-menu v-model="menu" :close-on-content-click="true" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn tile text color="deepestBlue" @click="menu = !menu">
            <small class="primary--text">{{
              $vuetify.breakpoint.mdAndUp ? 'BOTS' : 'SKILLS'
            }}</small>
            <v-icon color="appWhite" right small v-on="on">{{
              menu ? 'mdi-menu-down' : 'mdi-menu-right'
            }}</v-icon>
          </v-btn>
        </template>
        <v-card flat color="accent">
          <v-card
            v-for="(item, index) in menus"
            :key="index"
            color="card"
            flat
            ripple
          >
            <div
              style="cursor: pointer"
              class="caption pa-4"
              @click="setCurrentItem(item)"
            >
              {{ item.title }}
            </div>
          </v-card>
        </v-card>
      </v-menu>
      <!-- The bot name that can be edited -->
      <div class="ml-4" style="width: 250px">
        <v-text-field
          style="height: 42px"
          :value="currentBot.title"
          flat
          dense
          @input="updateBotTitle"
          @blur="editBotTitle"
        ></v-text-field>
      </div>

      <v-spacer></v-spacer>

      <!-- <div>
        <v-btn small tile text color="primary">
          <v-icon color="appWhite" left small>mdi-play</v-icon>
          PREVIEW
        </v-btn>

        <v-btn small tile text color="primary" @click="botSettings">
          <v-icon color="appWhite" left small>mdi-cog</v-icon>
          BOT SETTINGS
        </v-btn>

        <v-btn small tile text color="primary" @click="startBot">
          <v-icon color="appWhite" left small>mdi-content-save</v-icon>
          LAUNCH BOT
        </v-btn>
      </div> -->
    </v-toolbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'
export default {
  data() {
    return {
      botTitle: '',
      menu: false,
      mobileMenu: false,
      menuActions: [
        { title: 'Preview Bot', method: this.botPreview, icon: 'mdi-play' },
        { title: 'Bot Settings', method: this.botSettings, icon: 'mdi-cog' },
        {
          title: 'Launch Bot',
          method: this.launchBot,
          icon: 'mdi-content-save',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      bots: 'bot/bots',
      skills: 'skill/skills',
      currentBot: 'bot/currentBot',
      loading: 'bot/loading',
      errors: 'app/errors',
    }),
    toolbarStyle() {
      const style = {
        position: 'fixed',
        width: '85%',
        zIndex: '2',
        height: '90px',
        top: '45px',
      }
      return style
    },
    botSkills() {
      const skills = this.skills.filter((skill) => {
        if (skill.botId === this.currentBot.id) {
          return skill
        }
      })
      return skills
    },
    menus() {
      return this.$vuetify.breakpoint.mdAndUp ? this.bots : this.botSkills
    },
  },
  methods: {
    botSettings() {
      this.$store.commit('botSetting/OPEN_BOT_SETTINGS', true)
    },
    setCurrentItem(item) {
      if (this.menus === this.bots) {
        this.$store.commit('bot/SET_CURRENT_BOT', item)
      } else {
        this.$store.commit('skill/SET_CURRENT_SKILL', item)
      }
    },
    updateBotTitle(title) {
      this.botTitle = title
    },
    editBotTitle() {
      this.$store.dispatch('bot/updateBotTitle', this.botTitle)
    },
    botPreview() {},
    startBot() {
      ipcRenderer.send('launch-bot', this.currentBot)
    },
    launchBot() {
      if (this.errors.length >= 1) {
        // Show error notification
        const notification = {
          message: `You bot has some errors. 
           Make sure all your skills have at least one action
           and make sure your bot settings is properly set up before you launch your bot`,
          type: 'error',
        }
        this.$store.dispatch('notification/setNotification', notification)
        this.$store.dispatch('notification/showNotification', true)
      } else {
        // this.$store.dispatch('bot/pauseBot', {
        //   bot: this.currentBot,
        //   status: true
        // })
        // Do not even try to set webhook if user is on a free plan
        // Check if the user's webhook has already been set before setting the webhook
        this.loading = true
        this.$store.dispatch('bot/setWebHook', {
          bot: this.currentBot,
          action: 'set',
        })

        this.loading = false
      }
    },
  },
}
</script>

<style></style>
