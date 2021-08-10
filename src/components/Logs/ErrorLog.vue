<template>
  <v-card color="card" class="px-2 pb-1" height="400" flat>
    <v-card-subtitle>Error Log</v-card-subtitle>
    <div
      class="pa-2"
      style="overflow: scroll; height: 350px; background-color: #131c21"
    >
      <v-row>
        <v-col v-for="(error, i) in errorLogs" :key="i" cols="12">
          <v-card color="secondary" class="mx-auto">
            <v-card-title class="red--text">{{ error.title }}: </v-card-title>

            <v-card-subtitle class="pb-0 error--text">
              {{ error.message }}
            </v-card-subtitle>

            <v-card-text>
              <div class="caption">
                {{ error.error }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      logs: 'app/logs',
      currentCampaign: 'campaign/currentCampaign',
    }),
    errorLogs() {
      const errors = this.logs
        .filter((log) => {
          if (log.status === 'error') return log
        })
        .filter((log) => log.campaignId === this.currentCampaign.id)
      return errors
    },
  },
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 2px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #221f2e;
}

::-webkit-scrollbar-thumb {
  background: #0c0715;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: transparent;
}
</style>
