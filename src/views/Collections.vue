<template>
  <div class="secondary" :style="divStyle">
    <v-container>
      <v-row class="pt-4">
        <v-col sm="4">
          <v-card-title>Numbers Collections</v-card-title>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row class="pa-0 ma-0">
        <v-col class="pa-0 ma-0" cols="12">
          <CollectionGroup />
        </v-col>
      </v-row>
      <NumberDialog />
      <VerificationDialog />
      <WaGrpDisplayDialog />
    </v-container>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import CollectionGroup from '@/components/Collection/CollectionGroup'
import NumberDialog from '@/components/Collection/NumberDialog'
import VerificationDialog from '@/components/Collection/VerificationDialog'
import WaGrpDisplayDialog from '@/components/Collection/WaGrpDisplayDialog'
export default {
  name: 'Campaign',
  components: {
    CollectionGroup,
    NumberDialog,
    VerificationDialog,
    WaGrpDisplayDialog,
  },
  data() {
    return {
      log: 'result',
      browserHeight: '',
      completed: 0,
      delay: 0,
    }
  },
  computed: {
    ...mapGetters({
      videoGroups: 'app/videoGroups',
      settings: 'app/settings',
      logs: 'app/logs',
      alert: 'notification/message',
      interval: 'app/interval',
      campaignText: 'app/campaignText',
    }),
    divStyle() {
      return {
        minHeight: this.browserHeight + 'px',
      }
    },
  },
  watch: {
    alert(newValue) {
      if (newValue) {
        this.completed = this.logs.filter((log) => {
          if (log.video && log.status === 'success') return log
        }).length
      }
    },
    interval(newValue) {
      if (newValue) {
        this.delay = this.interval.interval
        const countInterval = setInterval(() => {
          this.delay -= 1
          if (this.delay <= 0) {
            clearInterval(countInterval)
            console.log('Interval cleared finally!')
          }
        }, 1000)
      }
    },
  },
  mounted() {
    this.getNumbers()
    this.browserHeight = document.body.clientHeight
  },
  methods: {
    getNumbers() {
      ipcRenderer.send('get-numbers')
      ipcRenderer.send('get-wa-group-numbers')
    },
    startCampaign() {
      // if (this.campaignText === 'Stop Campaign') {
      //   this.$store.commit('app/SET_CAMPAIGN_TEXT', 'Stopping ...')
      //   ipcRenderer.send('stop-campaign')
      //   return
      // }
      // if (this.campaignText === 'Launch Campaign') {
      //   this.$store.commit('app/SET_CAMPAIGN_TEXT', 'Launching ...')
      //   this.$store.commit('app/SET_LOGS', [])
      //   let data = { ...this.settings }

      //   data.account = { ...this.settings.account }
      //   data.comments = [...this.settings.comments]
      //   data.videos = [...this.settings.videos]
      //   data.commentDelay = { ...this.settings.commentDelay }

      //   ipcRenderer.send('launch-campaign', data)
      //   return
      // }
      ipcRenderer.send('launch-campaign')
    },
  },
}
</script>

<style></style>
