<template>
  <v-card color="secondary" flat min-height="365">
    <v-card-subtitle> {{ currentCampaign.title }} </v-card-subtitle>
    <v-card-text>
      <v-row class="pa-0 pt-4">
        <v-col class="py-0" cols="6">
          <v-card color="secondary" flat>
            <div class="caption :">Select Account :</div>
            <AppSelectInput :items="accountNames" v-model="selectAccount" />
            <div class="caption :">Collection of numbers :</div>
            <AppSelectInput
              :items="numberNames"
              :multiple="true"
              :chips="true"
              v-model="selectNumbers"
            />
            <div class="caption :">Choose a Bot :</div>
            <AppSelectInput :items="botNames" v-model="selectBot" />
            <!-- <div class="caption :">Upload a list of messages :</div>
            <AppUpload @input="addMessages" :value="message_file" /> -->
            <v-row class="pa-0">
              <v-col class="py-0" cols="6">
                <div class="caption :">Delay Min in sec:</div>
                <AppInput v-model="updateMin" :type="'number'" />
              </v-col>

              <v-col class="py-0" cols="6">
                <div class="caption :">Delay Max in sec:</div>
                <AppInput v-model="updateMax" :type="'number'" />
              </v-col>

              <v-col class="py-0" cols="6">
                <div class="caption :">Show Browser:</div>
                <v-radio-group row v-model="showBrowser">
                  <v-radio :value="true">
                    <template v-slot:label>
                      <small>Yes</small>
                    </template>
                  </v-radio>
                  <v-radio :value="false">
                    <template v-slot:label>
                      <small>No</small>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-col>
              <v-col class="py-0" cols="6">
                <div class="caption :">Schedule Campaign:</div>
                <v-radio-group row v-model="scheduleCampaign">
                  <v-radio :value="true">
                    <template v-slot:label>
                      <small>Yes</small>
                    </template>
                  </v-radio>
                  <v-radio :value="false">
                    <template v-slot:label>
                      <small>No</small>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-col>
              <v-col v-if="scheduleCampaign" class="py-0" cols="6">
                <div class="caption :">Schedule Date:</div>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <div>
                      <v-text-field
                        v-model="selectCampaignDate"
                        label="Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        flat
                        outlined
                        dense
                        v-on="on"
                      ></v-text-field>
                    </div>
                  </template>
                  <v-date-picker
                    v-model="selectCampaignDate"
                    light
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="appPink" @click="endMenu = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="appBlue"
                      @click="$refs.menu.save(selectCampaignDate)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col v-if="scheduleCampaign" class="py-0" cols="6">
                <div class="caption :">Schedule Time:</div>
                <v-menu
                  ref="timeMenu"
                  v-model="timeMenu"
                  :close-on-content-click="false"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <div>
                      <v-text-field
                        v-model="selectCampaignTime"
                        label="Time"
                        prepend-icon="mdi-clock-time-nine-outline"
                        readonly
                        flat
                        outlined
                        dense
                        v-on="on"
                      ></v-text-field>
                    </div>
                  </template>
                  <v-time-picker
                    light
                    v-model="selectCampaignTime"
                    no-title
                    scrollable
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col class="py-0" cols="6">
          <MessageList />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import MessageList from '@/components/Campaign/MessageList'
const fs = require('fs')
import { mapGetters } from 'vuex'
export default {
  components: {
    MessageList,
  },
  data() {
    return {
      picker: null,
      scheduleCampaign: false,
    }
  },
  computed: {
    ...mapGetters({
      numberGroups: 'app/numberGroups',
      accounts: 'app/accounts',
      bots: 'bot/bots',
      user: 'auth/user',
      settings: 'campaign/settings',
      currentCampaign: 'campaign/currentCampaign',
    }),
    numberNames() {
      return this.numberGroups
        .filter((numgrp) => numgrp.userId === this.user.id)
        .map((number) => number.name)
    },
    accountNames() {
      return this.accounts
        .filter((acc) => acc.userId === this.user.id)
        .map((account) => account.name)
    },
    botNames() {
      return this.bots
        .filter((bot) => bot.userId === this.user.id)
        .map((bot) => bot.title)
    },
    selectNumbers: {
      get() {
        if (!this.settings && !this.settings.numbers) {
          return ''
        }
        return this.settings.numbers.map((number) => number.name)
      },
      set(numbers) {
        this.updateNumberList(numbers)
      },
    },
    selectAccount: {
      get() {
        if (!this.settings) {
          return ''
        }
        return this.settings.account.name
      },
      set(profile) {
        this.updateWhatsAppAccount(profile)
      },
    },
    selectBot: {
      get() {
        if (!this.settings) {
          return ''
        }
        return this.settings.bot
      },
      set(bot) {
        this.updateCampaignBot(bot)
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
        this.$store.commit('campaign/SET_MIN', val)
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
        this.$store.commit('campaign/SET_MAX', val)
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
        this.$store.commit('campaign/SET_SHOW_BROWSER', val)
      },
    },
    selectCampaignDate: {
      get() {
        if (!this.settings) {
          return ''
        }
        return this.settings.scheduleCampaignDate
      },
      set(val) {
        this.$store.commit('campaign/SET_CAMPAIGN_DATE', val)
      },
    },
    selectCampaignTime: {
      get() {
        if (!this.settings) {
          return ''
        }
        return this.settings.scheduleCampaignTime
      },
      set(val) {
        this.$store.commit('campaign/SET_CAMPAIGN_TIME', val)
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
  mounted() {
    if (
      this.settings.scheduleCampaignDate ||
      this.settings.scheduleCampaignTime
    ) {
      this.scheduleCampaign = true
    }
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
    updateNumberList(numbers) {
      numbers = numbers.map((number) => {
        return this.numberGroups.filter((group) => number === group.name)[0]
      })
      this.$store.commit('campaign/SET_SETTINGS_NUMBERS', numbers)
    },
    updateWhatsAppAccount(profile) {
      let account = this.accounts.filter((acc) => profile === acc.name)[0]
      this.$store.commit('campaign/SET_WA_ACCOUNT', account)
    },
    updateCampaignBot(botTitle) {
      // let bot = this.bots.filter((bot) => botName === bot.title)[0]
      this.$store.commit('campaign/SET_CAMPAIGN_BOT', botTitle)
    },
  },
}
</script>

<style></style>
