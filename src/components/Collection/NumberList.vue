<template>
  <div>
    <v-card color="background">
      <v-row class="pa-0 ma-0">
        <v-col cols="7">
          <v-card-title>Number Collections</v-card-title>
          <div class="text-start">
            <v-chip
              small
              class="ma-0 mx-2"
              :color="status === 'collection' ? 'primary' : 'card'"
              @click="status = 'collection'"
            >
              Collections
            </v-chip>

            <v-chip
              small
              class="ma-0 mr-1"
              :color="status === 'waGroup' ? 'primary' : 'card'"
              @click="status = 'waGroup'"
            >
              Groups
            </v-chip>
          </div>
        </v-col>
        <v-col cols="5" small class="mt-4">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="primary" dark v-bind="attrs" v-on="on">
                Add Numbers
              </v-btn>
            </template>
            <v-list color="secondary">
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                @click="newGenerate(item.title)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>

      <div
        class="pa-4"
        style="overflow: scroll; height: 360px; background-color: #1e3530'"
      >
        <NumberCard
          v-for="(numberGroup, index) in numberCollections"
          :key="index"
          :numberGroup="numberGroup"
        />
      </div>
    </v-card>
  </div>
</template>

<script>
import NumberCard from '@/components/Collection/NumberCard'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'numberList',
  components: {
    NumberCard,
  },
  data() {
    return {
      status: 'collection',
      activeGroup: '',
      items: [
        { title: 'Generate', action: this.newGenerate },
        { title: 'Contacts' },
        { title: 'WA-Groups' },
        { title: 'Import' },
      ],
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      numberGroups: 'app/numberGroups',
      numbers: 'app/verifiedNumbers',
      activeVerificationGroup: 'app/activeVerificationGroup',
    }),
    numberCollections() {
      let numbers

      if (this.status === 'collection') {
        numbers = _.reject(this.numberGroups, (numberGrp) =>
          Object.prototype.hasOwnProperty.call(numberGrp, 'members'),
        )
      }

      if (this.status === 'waGroup') {
        numbers = this.numberGroups.filter((numberGrp) =>
          Object.prototype.hasOwnProperty.call(numberGrp, 'members'),
        )
      }

      return numbers.filter((number) => number.userId === this.user.id)
    },
    name() {
      return this.data
    },
  },
  methods: {
    newGenerate(val) {
      this.$store.commit('app/SET_ADD_NUMBERS_TYPE', val.toLowerCase())
      this.$store.commit('app/SET_NUMBERS_DIALOG', true)
      this.$store.commit('app/SET_ACTIVE_EDIT_NUMBERS', '')
    },
  },
}
</script>

<style></style>
