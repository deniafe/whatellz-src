<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <Logs />
        <!-- <LineChart :chart-data="datacollection" /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Logs from '@/components/Logs/Logs'
export default {
  components: {
    Logs,
  },
}
</script>

<style></style>
