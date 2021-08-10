<template>
  <v-card color="secondary" flat class="px-0" min-height="365">
    <v-card-text>
      <v-row class="pt-4 px-0">
        <v-col class="py-0 px-2" cols="6">
          <div class="caption mb-4">Generate or add numbers manually :</div>
          <NumberList />
        </v-col>
        <v-col class="py-0 px-2" cols="6">
          <div class="caption mb-4">Numbers verification table :</div>
          <NumberTable />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import NumberList from '@/components/Collection/NumberList'
import NumberTable from '@/components/Collection/NumberTable'
const fs = require('fs')
import { mapGetters } from 'vuex'
export default {
  components: {
    NumberList,
    NumberTable,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      accounts: 'app/accounts',
      settings: 'app/settings',
    }),
    videoTitles() {
      return this.videoGroups.map((video) => video.title)
    },
    accountNames() {
      return this.accounts.map((account) => account.name)
    },
    selectNumbers: {
      get() {
        if (!this.settings) {
          return ''
        }
        return this.settings.numbers.map((video) => video.title)
      },
      set(videos) {
        this.updateVideoList(videos)
      },
    },
    selectAccount: {
      get() {
        if (!this.settings) {
          return ''
        }
        return this.settings.account.name
      },
      set(videos) {
        this.updateYoutubeAccount(videos)
      },
    },
    updateMin: {
      get() {
        if (!this.settings) {
          return ''
        }
        return this.settings.delay.min
      },
      set(val) {
        this.$store.commit('app/SET_MIN', val)
      },
    },
    updateMax: {
      get() {
        if (!this.settings) {
          return ''
        }
        return this.settings.delay.max
      },
      set(val) {
        this.$store.commit('app/SET_MAX', val)
      },
    },
    showBrowser: {
      get() {
        if (!this.settings) {
          return ''
        }
        return this.settings.showBrowser
      },
      set(val) {
        this.$store.commit('app/SET_SHOW_BROWSER', val)
      },
    },
    messages_file() {
      if (!this.settings) {
        return ''
      }
      return this.settings.message_file
    },
    messages() {
      if (!this.settings) {
        return [
          {
            text: 'Wow',
            color: 'red',
          },
        ]
      }
      let color
      // Create an object out of each of the messages giving them random colors
      let messages = this.settings.messages.map((message) => {
        color = this.colors[Math.floor(Math.random() * this.colors.length)]
        return {
          color,
          text: message,
        }
      })
      return messages
    },
  },
  methods: {
    updateMessages(messages) {
      messages = messages.map((message) => message.text)
      this.$store.commit('app/SET_MESSAGES', messages)
    },
    addMessages(file) {
      // var fr = new FileReader()
      const vm = this
      const textContent = fs.readFileSync(file.path).toString()
      // fr.onload = function() {
      // Read the file and send it to the store
      let messages = textContent.split('\n')
      vm.$store.commit('app/SET_MESSAGES', messages)
      vm.$store.commit('app/SET_MESSAGES_FILE', file)
      let color
      // Create an object out of each of the messages giving them random colors
      messages = messages.map((message) => {
        color = vm.colors[Math.floor(Math.random() * vm.colors.length)]
        return {
          color,
          text: message,
        }
      })
      vm.keyword = messages
      // }

      console.log(messages)

      // fr.readAsText(file)
      console.log('This is the messages file', file.path)
    },
    updateVideoList(videos) {
      videos = videos.map((video) => {
        return this.videoGroups.filter((group) => video === group.title)[0]
      })
      this.$store.commit('app/SET_VIDEOS', videos)
    },
    updateYoutubeAccount(email) {
      let account = this.youtubeAccounts.filter((acc) => email === acc.email)[0]
      this.$store.commit('app/SET_YTACCOUNT', account)
    },
  },
}
</script>

<style></style>
