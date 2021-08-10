<template>
  <v-card color="card" class="secondary">
    <v-tabs v-model="tab" background-color="primary" dark>
      <v-tab v-for="item in items" :key="item.tab">
        {{ item.tab }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item.tab">
        <v-card color="card" flat>
          <v-card-text>
            <InfoLog v-if="item.content === 'Tab 1'" />
            <ErrorLog v-else-if="item.content === 'Tab 2'" />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import InfoLog from '@/components/Logs/InfoLog'
import ErrorLog from '@/components/Logs/ErrorLog'
export default {
  components: {
    InfoLog,
    ErrorLog,
  },
  data() {
    return {
      tab: null,
      items: [
        { tab: 'Info', content: 'Tab 1' },
        { tab: 'Errors', content: 'Tab 2' },
      ],
    }
  },
}
</script>
