<template>
  <div class="secondary" :style="divStyle">
    <NewBotDialog />
    <v-container class="px-4">
      <v-row>
        <v-col cols="6">
          <v-card-title>Last Campaign Break Down</v-card-title>
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
          <AnalyticsCard :color="'info'" />
        </v-col>
        <v-col cols="4">
          <AnalyticsCard :color="'success'" />
        </v-col>
        <v-col cols="4">
          <AnalyticsCard :color="'primary'" />
        </v-col>
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
import AnalyticsCard from '@/components/AnalyticsCard'
import NewBotDialog from '@/components/Bot/NewBotDialog'
import ContactTable from '@/components/Bot/ContactTable'
export default {
  name: 'Dahboard',
  components: {
    AnalyticsCard,
    NewBotDialog,
    ContactTable,
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
    chartData() {
      return {
        hoverBackgroundColor: 'red',
        hoverBorderWidth: 10,
        labels: ['Successful Comments', 'Failed Comments'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: ['#00f2c3', '#f32756'],
            data: [5, 10],
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
