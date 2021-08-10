<template>
  <div class="secondary" :style="divStyle">
    <NewBotDialog />
    <v-container class="px-12">
      <v-row class="pt-4">
        <v-col sm="4">
          <v-card-title>Bots / Autoresponders</v-card-title>
        </v-col>

        <v-col sm="4">
          <div class="text-center">
            <v-btn class="px-4" color="primary" @click="createBot">
              <v-icon left>mdi-plus</v-icon>
              Create New Bot
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <BotTemplates />
    </v-container>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import NewBotDialog from '@/components/Bot/NewBotDialog'
import BotTemplates from '@/components/Bot/BotTemplates'
export default {
  name: 'Bots',
  components: {
    NewBotDialog,
    BotTemplates,
  },
  data() {
    return {
      browserHeight: '',
      completed: 0,
      delay: 0,
      chartOptions: {
        hoverBorderWidth: 20,
      },
    }
  },
  computed: {
    divStyle() {
      return {
        minHeight: this.browserHeight + 'px',
      }
    },
  },
  mounted() {
    this.browserHeight = document.body.clientHeight
    ipcRenderer.send('get-bots')
  },
  methods: {
    createBot() {
      this.$store.commit('bot/SET_BOT_DIALOG', true)
    },
  },
}
</script>

<style></style>
