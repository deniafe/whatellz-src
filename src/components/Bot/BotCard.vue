<template>
  <div>
    <v-card flat color="transparent" class="mb-0">
      <v-row class="my-1 mx-0">
        <!-- The main card part of the bot card -->
        <v-col class="mx-0 pl-0 pr-1 pb-1 pt-0" cols="12">
          <v-card
            color="card"
            height="85"
            :max-height="$vuetify.breakpoint.smAndUp ? 110 : 150"
            class="mb-2"
            @click="editBot(bot)"
          >
            <v-row class="ma-0 px-4 py-1">
              <!-- The image part of the card -->
              <v-col cols="4" sm="4" md="2">
                <v-avatar size="50">
                  <v-icon x-large>mdi-robot-outline</v-icon>
                </v-avatar>
              </v-col>
              <!-- The part that contains name and date of the bot -->
              <v-col cols="8" sm="6" md="4">
                <div class="primary--text caption pb-1 pt-0">Bot Title</div>
                <div class="font-weight-medium white--tex pb-2">
                  {{ bot.title }}
                </div>
              </v-col>
              <!-- The part that contains name and date of the bot -->
              <v-col cols="8" sm="6" md="4">
                <div class="primary--text caption pb-1 pt-0">
                  Bot Description
                </div>
                <div class="font-weight-medium white--tex pb-2">
                  The bot description
                </div>
              </v-col>
              <v-col cols="1">
                <div
                  class="primary--text d-flex justify-center caption pb-1 pt-0"
                >
                  Edit
                </div>
                <div class="d-flex justify-center">
                  <v-btn @click.stop="editBot(bot)" icon color="primary">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="1">
                <div class="error--text d-flex justify-start caption pb-1 pt-0">
                  Delete
                </div>
                <div class="d-flex justify-start">
                  <v-btn
                    @click.stop="options({ bot, action: 'Delete' })"
                    icon
                    color="error"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    bot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      skills: 'skill/skills',
      actions: 'action/actions',
    }),
    menu() {
      return [
        // {
        //   title: this.bot.status ? 'Pause' : 'Activate',
        //   icon: this.bot.status ? 'mdi-pause' : 'mdi-play',
        // },
        {
          title: 'Analytics',
          icon: 'mdi-google-analytics',
        },
        {
          title: 'Delete',
          icon: 'mdi-delete',
        },
      ]
    },
    referrals() {
      return this.bot.referralsCount || 0
    },
    refPercentage() {
      return this.bot.leadCount && this.bot.referralsCount
        ? Math.floor((this.bot.referralsCount / this.bot.leadCount) * 100)
        : 0
    },
    allLeads() {
      return this.bot.leadCount || 0
    },
  },
  methods: {
    editBot(bot) {
      this.$store.commit('bot/SET_CURRENT_BOT', bot)
      if (bot.status) {
        this.$store.dispatch('bot/pauseBot', { bot, status: false })
      }
      this.$router.push({ name: 'bot', param: { id: bot.id } })
    },
    options({ bot, action }) {
      if (action === 'Analytics') {
        this.$store.commit('bot/SET_CURRENT_BOT', bot)
        this.$router.push({ name: 'bot-data', params: { id: bot.id } })
      } else if (action === 'Pause' || action === 'Activate') {
        if (!bot.status) {
          this.$store.dispatch('bot/pauseBot', { bot, status: true })
        } else {
          this.$store.dispatch('bot/pauseBot', { bot, status: false })
        }
      } else if (action === 'Delete') {
        // Open the dialog pop up
        this.$store.commit('app/SET_DELETE_ACTION', this.deleteBot)
        this.$store.commit(
          'app/SET_CONFIRMATION_TEXT',
          'Are you sure you want to delete?',
        )
        this.$store.commit(
          'app/SET_CONFIRMATION_SUB_TEXT',
          'Deleting a bot is a permanent action and cannot be reversed',
        )
        this.$store.commit('app/SET_CONFIRMATION_YES', 'Yes Delete')
        this.$store.commit('app/SET_CONFIRMATION_NO', `No Don't delete`)
        this.$store.commit('app/SET_CONFIRM_DIALOG', true)
      }
    },
    deleteBot() {
      this.$store.commit('bot/DELETE_BOT', this.bot)
      const skills = this.skills.filter((skill) => skill.botId === this.bot.id)
      let skill
      for (let i = 0; i < skills.length; i++) {
        skill = skills[i]
        const actions = this.actions.filter(
          (action) => action.skillId === skill.id,
        )
        this.$store.dispatch('skill/deleteSkill', skill)
        let action
        for (let x = 0; x < actions.length; x++) {
          action = actions[x]
          this.$store.commit('action/DELETE_ACTION', action)
        }
      }
    },
  },
}
</script>

<style scoped>
.template-title {
  font-family: 'Amiko', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: rgb(186, 197, 212);
}
.template-link {
  font-family: 'Raleway', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #00a2ff;
  text-decoration: underline;
}
</style>
