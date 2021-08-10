<template>
  <div>
    <v-data-table
      class="card"
      :headers="headers"
      :items="numbers"
      items-per-page="5"
    >
      <template v-slot:top>
        <v-toolbar class="card" flat>
          <v-toolbar-title>Verification Data</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            text
            small
            color="primary"
            class="mr-2"
            @click="deleteFailed"
          >
            {{ btntext }}
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.status="{ item }">
        <v-icon :color="getColor(item.verified)">
          {{ item.verified ? 'mdi-checkbox-marked' : 'mdi-minus-box' }}
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'DashboardTable',
  data() {
    return {
      selected: [],
      headers: [
        {
          text: 'Number',
          align: 'start',
          filterable: false,
          sortable: false,
          value: 'number',
        },
        // { text: 'Keyword', value: 'keyword' },
        // { text: 'Comment', value: 'comment' },
        { text: 'Status', value: 'status', sortable: false },
      ],
      btntext: 'Delete failed numbers',
    }
  },
  computed: {
    ...mapGetters({
      numbers: 'app/verifiedNumbers',
      activeVerificationGroup: 'app/activeVerificationGroup',
    }),
  },
  methods: {
    getColor(status) {
      if (status) return 'primary'
      if (!status) return 'error'
      else return 'info'
    },
    deleteFailed() {
      if (this.btntext === 'Delete failed numbers') {
        const numbers = this.numbers

        const verified = numbers.filter((number) => {
          if (number.verified) return number
        })
        this.$store.commit('app/SET_VERIFIED_NUMBERS', verified)
        this.btntext = 'Save verified numbers'
        return
      }
      if (this.btntext === 'Save verified numbers') this.saveVerified()
    },
    saveVerified() {
      const numberGroups = Object.assign({}, this.activeVerificationGroup)
      numberGroups.numbers = this.numbers
      numberGroups.verified = true
      this.$store.commit('app/EDIT_NUMBERS', numberGroups)
      console.log(numberGroups)
      this.$store.commit('app/SET_ACTIVE_VERIFICATION_GROUP', '')
      this.$store.commit('app/SET_VERIFIED_NUMBERS', [])
      this.btntext = 'Delete failed numbers'
    },
  },
}
</script>

<style></style>
