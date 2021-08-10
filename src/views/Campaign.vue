<template>
  <div class="secondary" :style="divStyle">
    <v-container class="px-12">
      <!-- The top button to start the campaign -->
      <v-row class="pt-4">
        <v-col sm="4">
          <v-card-title>Set Up Your Campaign</v-card-title>
        </v-col>

        <v-col sm="4">
          <div class="text-center">
            <v-btn class="px-4" color="primary" @click="startCampaign">
              <v-icon v-if="campaignText !== 'Launching ...'" left>{{
                currentCampaign.status === 'Inactive'
                  ? 'mdi-rocket'
                  : 'mdi-close-octagon-outline'
              }}</v-icon>
              {{
                currentCampaign.status === 'Active'
                  ? 'Stop Campaign'
                  : 'Launch Campaign'
              }}
            </v-btn>
          </div>
        </v-col>
        <v-col cols="2">
          <div class="d-flex justify-end">
            <v-progress-circular
              :rotate="180"
              :size="40"
              :width="3"
              :value="delay"
              color="pink"
            >
              {{ delay }}
            </v-progress-circular>
          </div>
        </v-col>
        <v-col cols="2">
          <div class="d-flex justify-start">
            <v-progress-circular
              :rotate="180"
              :size="40"
              :width="3"
              :value="100"
              color="info"
            >
              {{ completed }}
            </v-progress-circular>
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row class="pa-2">
        <v-col cols="12">
          <CampaignGroup />
        </v-col>
      </v-row>
      <v-row class="pa-2">
        <v-col cols="12">
          <Logs />
        </v-col>
      </v-row>
    </v-container>
    <MessageDialog />
  </div>
</template>

<script>
const schedule = require('node-schedule')
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import CampaignGroup from '@/components/Campaign/CampaignGroup'
import MessageDialog from '@/components/Campaign/MessageDialog'
import Logs from '@/components/Logs/Logs'
export default {
  name: 'campaign',
  components: {
    CampaignGroup,
    MessageDialog,
    Logs,
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
      settings: 'campaign/settings',
      logs: 'app/logs',
      alert: 'notification/message',
      interval: 'campaign/interval',
      campaignText: 'campaign/campaignText',
      campaigns: 'campaign/campaigns',
      currentCampaign: 'campaign/currentCampaign',
    }),
    id() {
      return this.$route.params.id
    },
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
          if (
            log.title === 'Message Sent Successfully' &&
            log.status === 'success'
          )
            return log
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
    if (!this.currentCampaign) this.$router.push({ name: 'campaigns' })
    this.browserHeight = document.body.clientHeight
    this.initAlert()
    this.initInterval()
  },
  methods: {
    startCampaign() {
      function launch({ vm, campaign }) {
        vm.$store.commit('campaign/SET_CAMPAIGN_TEXT', 'Launching ...')
        vm.$store.commit('campaign/UPDATE_STATUS', 'Active')
        vm.$store.commit('app/SET_OVERLAY_DIALOG', true)
        vm.$store.commit(
          'app/SET_OVERLAY_DESCRIPTION',
          'Wait a few seconds while we launch your campiagn...',
        )
        ipcRenderer.send('launch-campaign', campaign)
      }
      if (this.currentCampaign.status === 'Active') {
        this.$store.commit('campaign/SET_CAMPAIGN_TEXT', 'Stopping ...')
        ipcRenderer.send('stop-campaign', this.currentCampaign)
        this.delay = 0
        return
      }
      if (this.currentCampaign.status === 'Inactive') {
        const isActiveProfile = this.checkProfile(
          this.currentCampaign.settings.account,
        )
        if (isActiveProfile) {
          const notification = {
            message:
              'The whatsapp account you selected for this campaign is actively being used in another campaign or sequence. Use another account.',
            type: 'error',
          }
          this.$store.dispatch('notification/setNotification', notification)
          this.$store.dispatch('notification/showNotification', true)
          return
        }
        if (!isActiveProfile) {
          if (
            this.currentCampaign.settings.scheduleCampaignDate ||
            this.currentCampaign.settings.scheduleCampaignTime
          ) {
            const date = new Date(
              this.currentCampaign.settings.scheduleCampaignDate +
                'T' +
                this.currentCampaign.settings.scheduleCampaignTime,
            )
            // eslint-disable-next-line no-unused-vars
            const job = schedule.scheduleJob(
              date,
              launch.bind(null, { campaign: this.currentCampaign, vm: this }),
            )
          } else {
            launch({ campaign: this.currentCampaign, vm: this })
          }
          return
        }
      }
    },
    checkProfile(account) {
      let activeProfile = false
      const activeCampaigns = this.campaigns.filter(
        (camp) => camp.status === 'Active',
      )
      if (activeCampaigns.length !== 0) {
        const activeProfiles = activeCampaigns.filter(
          (camp) => camp.settings.account.number === account.number,
        )
        activeProfile = !!activeProfiles[0]
      }
      return activeProfile
    },
    initAlert() {
      this.completed = this.logs.filter((log) => {
        if (
          log.title === 'Message Sent Successfully' &&
          log.status === 'success'
        )
          return log
      }).length
    },
    initInterval() {
      this.delay = 0
      if (this.interval) {
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
}
</script>

<style></style>
