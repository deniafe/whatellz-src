<template>
  <div class="secondary" :style="divStyle">
    <NewBotDialog />
    <v-container class="px-12">
      <v-row class="pt-4">
        <v-col cols="6">
          <v-card-title>All Campaigns Break Down</v-card-title>
        </v-col>
        <v-col cols="6">
          <div class="d-flex justify-end pt-4">
            <v-btn @click="newCamp" class="px-4" color="primary">
              <v-icon left>mdi-plus</v-icon>
              New Campaign
            </v-btn>
          </div>
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
        <v-col cols="8">
          <Logs />
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
import PieChart from '@/components/PieChart'
import Logs from '@/components/App/Logs'
export default {
  name: 'Dahboard',
  components: {
    AnalyticsCard,
    NewBotDialog,
    PieChart,
    Logs,
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
    }),
    divStyle() {
      return {
        minHeight: this.browserHeight + 'px',
      }
    },
    successful() {
      return this.successfulNumbers.filter((num) => num.userId === this.user.id)
    },
    scheduled() {
      return this.scheduledNumbers.filter((num) => num.userId === this.user.id)
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
        labels: ['Successful Comments', 'Failed Comments'],
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
