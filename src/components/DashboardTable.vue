<template>
  <div>
    <v-data-table
      class="card"
      :items="numbers"
      :headers="headers"
      items-per-page="5"
    >
      <template v-slot:top>
        <v-toolbar class="card" flat>
          <v-toolbar-title>Data Table</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            text
            small
            color="primary"
            class="mr-2"
            @click="repost"
          >
            Resend to failed Numbers
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.status="{ item }">
        <v-icon :color="getColor(item.status)">
          {{
            item.status === 'Successful'
              ? 'mdi-checkbox-marked'
              : 'mdi-minus-box'
          }}
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { nanoid } from 'nanoid'
import { mapGetters } from 'vuex'
export default {
  name: 'DashboardTable',
  props: {
    scheduled: {
      type: Array,
      required: true,
    },
    successful: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selected: [],
      headers: [
        {
          text: 'Customer Number',
          align: 'start',
          filterable: false,
          sortable: false,
          value: 'number',
        },
        // { text: 'Keyword', value: 'keyword' },
        // { text: 'Comment', value: 'comment' },
        { text: 'Status', value: 'status', sortable: true },
      ],
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      scheduledNumbers: 'campaign/scheduledNumbers',
      successfulNumbers: 'campaign/successfulNumbers',
      currentCampaign: 'campaign/currentCampaign',
    }),
    // successful() {
    //   return this.successfulNumbers.filter(
    //     (num) => num.campaignId === this.currentCampaign.id,
    //   )
    // },
    // scheduled() {
    //   return this.scheduledNumbers.filter(
    //     (num) => num.campaignId === this.currentCampaign.id,
    //   )
    // },
    positive() {
      let numbers = this.successful.map((num) => {
        return {
          number: num.number,
          status: 'Successful',
        }
      })
      return numbers
    },
    negative() {
      let numbers = this.scheduled.filter(
        (video) => !this.successful.map((b) => b.url).includes(video.url),
      )

      numbers = numbers.map((num) => {
        return {
          number: num.number,
          status: 'fail',
        }
      })

      return numbers
    },
    numbers() {
      return this.positive.concat(this.negative)
    },
    failedNumbers() {
      let numbers = this.scheduled.filter(
        (number) =>
          !this.successful.map((b) => b.number).includes(number.number),
      )
      return numbers
    },
  },
  methods: {
    getColor(status) {
      if (status === 'Successful') return 'success'
      if (status === 'fail') return 'error'
      else return 'info'
    },
    repost() {
      const vm = this
      const category = {
        content: 'Failed Groups',
        id: nanoid(),
        userId: this.user.id,
        value: 'Failed Groups',
      }
      this.$store.commit('app/ADD_FB_CATEGORIES', category)
      const groups = this.failedGroups.map((group) => {
        group.category = 'Failed Groups'
        group.userId = vm.user.id
        return group
      })
      // const videoGroup = {
      //   id: nanoid(),
      //   userId: this.user.id,
      //   title: 'Failed Videos',
      //   type: 'video',
      //   videos: Object.assign([], vm.failedVideos),
      // }
      // this.$store.commit('app/ADD_VIDEO_GROUP', videoGroup)
      this.$store.commit('app/RESET_SETTINGS')
      this.$store.commit('app/SET_SETTINGS_CATEGORIES_GROUPS', groups)
      this.$router.push({ name: 'campaign' })
    },
  },
}
</script>

<style></style>
