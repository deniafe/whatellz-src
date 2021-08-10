<template>
  <div class="secondary" :style="divStyle">
    <v-container class="px-12 pt-4">
      <v-card color="secondary" flat class="pt-4" min-height="365">
        <v-row>
          <v-col class="mt-4" cols="1">
            <v-btn @click="$router.push({ name: 'collections' })" icon>
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-card-title>{{ currentCollection.name }} Collection</v-card-title>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <div class="mt-4">
          <CollectionTable
            @change="changeData"
            :collection="currentCollection"
          />
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CollectionTable from '@/components/Collection/CollectionTable'
export default {
  name: 'Collection',
  components: {
    CollectionTable,
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
      currentCollection: 'app/currentCollection',
    }),
    divStyle() {
      return {
        minHeight: this.browserHeight + 'px',
      }
    },
  },
  mounted() {
    if (!this.currentCollection) this.$router.push({ name: 'collections' })
    this.browserHeight = document.body.clientHeight
    if (!this.user) this.$store.dispatch('auth/checkAuth')
  },
  methods: {
    changeData(collection) {
      this.$store.commit('app/EDIT_NUMBERS', collection)
    },
    newCamp() {
      this.$router.push({ name: 'collections' })
    },
  },
}
</script>

<style></style>
