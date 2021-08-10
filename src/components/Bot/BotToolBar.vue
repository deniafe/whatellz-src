<template>
  <div>
    <div v-if="$vuetify.breakpoint.xs" class="mb-4">
      <v-btn text color="primary" @click="createNewBot">
        <v-icon left>mdi-plus</v-icon> Create New Bot</v-btn
      >
    </div>
    <v-toolbar flat color="secondary" class="">
      <div
        v-ripple
        @click="setFilter('all')"
        :style="styling"
        :class="filter === 'all' ? 'caption' : 'caption appTextGrey--text'"
      >
        All Bots
      </div>
      <div
        v-ripple
        @click="setFilter('active')"
        :style="styling"
        :class="
          filter === 'active'
            ? 'caption ml-8'
            : 'caption ml-8 appTextGrey--text'
        "
      >
        Active Bots
      </div>
      <div
        v-ripple
        @click="setFilter('inactive')"
        :style="styling"
        :class="
          filter === 'inactive'
            ? 'caption ml-8'
            : 'caption ml-8 appTextGrey--text'
        "
      >
        Inactive Bots
      </div>
      <v-spacer></v-spacer>
      <div class="float-right">
        <v-text-field
          background-color="background"
          label="Search here..."
          flat
          solo
          append-icon="mdi-magnify"
        ></v-text-field>
      </div>
    </v-toolbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      filter: 'bot/filter',
    }),
    styling() {
      return {
        cursor: 'pointer',
      }
    },
  },
  methods: {
    setFilter(val) {
      this.$store.commit('bot/SET_FILTERED_BOTS', val)
    },
  },
}
</script>

<style scoped>
.tasks {
  color: white;
  font-weight: 300;
}
.all.tasks {
  color: #fff;
}
.today.tasks {
  color: #085598;
}
</style>
