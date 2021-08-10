<template>
  <div class="secondary" :style="divStyle">
    <NewBotDialog />
    <v-container class="px-4">
      <v-row>
        <v-col class="mt-4" cols="1">
          <v-btn @click="$router.push({ name: 'campaigns' })" icon>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-card-title>Campaign Break Down</v-card-title>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row class="py-8">
        <v-col cols="4">
          <AnalyticsCard :comments="allComments" :color="'info'" />
        </v-col>
        <v-col cols="4">
          <AnalyticsCard :comments="successComments" :color="'success'" />
        </v-col>
        <v-col cols="4">
          <AnalyticsCard :comments="failedComments" :color="'primary'" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <pie-chart :data="chartData" :options="chartOptions"></pie-chart>
        </v-col>
        <v-col cols="8"
          ><DashboardTable :successful="successful" :scheduled="scheduled"
        /></v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <ContactTable />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import AnalyticsCard from '@/components/AnalyticsCard'
import NewBotDialog from '@/components/Bot/NewBotDialog'
import ContactTable from '@/components/Bot/ContactTable'
import DashboardTable from '@/components/DashboardTable'
import PieChart from '@/components/PieChart'
export default {
  name: 'Dahboard',
  components: {
    AnalyticsCard,
    NewBotDialog,
    ContactTable,
    DashboardTable,
    PieChart,
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
    ...mapGetters({
      user: 'auth/user',
      scheduledNumbers: 'campaign/scheduledNumbers',
      successfulNumbers: 'campaign/successfulNumbers',
      currentCampaign: 'campaign/currentCampaign',
    }),
    divStyle() {
      return {
        minHeight: this.browserHeight + 'px',
      }
    },
    successful() {
      return this.successfulNumbers.filter(
        (num) => num.campaignId === this.currentCampaign.id,
      )
    },
    scheduled() {
      return this.scheduledNumbers.filter(
        (num) => num.campaignId === this.currentCampaign.id,
      )
    },
    allComments() {
      return this.scheduled.length
    },
    successComments() {
      return this.successful.length
    },
    failedComments() {
      return this.scheduled.length - this.successful.length
    },
    chartData() {
      return {
        hoverBackgroundColor: 'red',
        hoverBorderWidth: 10,
        labels: ['Successful Messages', 'Failed Messages'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: ['#00f2c3', '#f32756'],
            data: [
              this.successful.length,
              this.scheduled.length - this.successful.length,
            ],
          },
        ],
      }
    },
  },
  mounted() {
    this.browserHeight = document.body.clientHeight
    ipcRenderer.send('get-bots')
  },
  methods: {
    newCamp() {
      this.$router.push({ name: 'campaigns' })
    },
  },
}
</script>

<style></style>
