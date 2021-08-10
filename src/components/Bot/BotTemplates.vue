<template>
  <v-card flat tile class="pt-4" color="transparent">
    <v-row class="ma-0 pa-0">
      <v-col class="ma-0 pa-0" cols="12">
        <BotCard v-for="(bot, i) in bots" :key="i" :bot="bot" />
        <div
          v-if="bots.length == 0 && !loading"
          class="headline text-center pt-4"
        >
          <div>You have no bot(s) yet. Click the button to create a bot</div>
          <div class="pt-2 text-center caption primary-grey--text">
            It could also be a bad internet connection. Ensure you have a good
            connection to load your bots
          </div>
          <div class="mt-6 text-center">
            <v-avatar size="200" to="/">
              <img src="@/assets/404.svg" alt="" />
            </v-avatar>
          </div>
        </div>
        <div class="text-center">
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import BotCard from '@/components/Bot/BotCard'
export default {
  components: {
    BotCard,
  },
  computed: {
    ...mapGetters({
      allBots: 'bot/bots',
      loading: 'bot/loading',
      filter: 'bot/filter',
      user: 'auth/user',
    }),
    bots() {
      let bots
      if (this.filter === 'active') {
        bots = this.allBots.filter((bot) => {
          if (bot.status) return bot
        })
      } else if (this.filter === 'inactive') {
        bots = this.allBots.filter((bot) => {
          if (!bot.status) return bot
        })
      } else {
        bots = this.allBots
      }
      return bots.filter((bot) => bot.userId === this.user.id)
    },
  },
}
</script>
