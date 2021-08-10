<template>
  <v-dialog v-model="push" overlay-color="black" width="700">
    <v-card color="card">
      <v-card class="mx-auto" width="600" flat color="transparent">
        <v-card-title class="headline pl-0">Edit message Message</v-card-title>
        <v-card-subtitle class="pt-2 primary-grey--text pl-0">
          Send Message to lead
        </v-card-subtitle>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col class="pa-0 pt-2 pb-3" cols="3">
              <small class="mt-4">Dynamic Values</small>
            </v-col>
            <v-col class="pa-0 pb-3" cols="7">
              <AppInput
                :label="'Message Title'"
                :hint="'The title of your message'"
                v-model="message.title"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col class="pa-0 pt-2 pb-3" cols="3">
              <small class="mt-4">Content</small>
            </v-col>
            <v-col class="pa-0 pb-3" cols="7">
              <AppTextArea
                v-model="message.content"
                @emoji="addEmoji"
                :rules="messageContentRules"
                :hint="`Create custom messages that can be sent to users of your bot and participants of your contest`"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="appPink" text @click="closeDialog"> Close </v-btn>
          <v-btn color="primary" text :disabled="!valid" @click="saveMessage">
            Save Message
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      valid: false,
      message: {
        title: '',
        content: '',
        image: '',
      },
      messageContentRules: [
        (v) => /[^\s]/.test(v) || 'This field is required',
        (v) => (v && v.length >= 10) || 'Content too short.',
      ],
    }
  },
  computed: {
    ...mapGetters({
      dialog: 'app/messageDialog',
      activeMessage: 'app/activeEditMessage',
    }),
    push: {
      get() {
        return this.dialog
      },
      set(val) {
        this.$store.commit('app/SET_MESSAGE_DIALOG', val)
      },
    },
  },
  watch: {
    push(newValue) {
      if (newValue && this.activeMessage) {
        this.message.content = this.activeMessage.content
        this.message.title = this.activeMessage.title
      }
      if (!newValue) {
        this.$nextTick(() => {
          if (this.$refs['form']) {
            this.$refs.form.reset()
          }
        })
      }
    },
  },
  methods: {
    addVariable(val) {
      // eslint-disable-next-line no-console
      console.log(val)
      this.message.content = this.message.content + '{' + val + '}'
    },
    addEmoji(val) {
      this.message.content = this.message.content + val.native
      console.log(val)
    },
    parser(lead) {
      const pattern = /\{[a-zA-Z]+\}/g
      const retrieved = this.message.content.match(pattern)

      // Remove the @ symbol fom the bot title
      const botTitle = this.currentBot.title.replace('@', '')

      let correctMessage = this.message.content
      let val

      // let totalPoints
      if (retrieved) {
        for (let i = 0; i < retrieved.length; i++) {
          val = retrieved[i]
          // eslint-disable-next-line no-console
          if (val === '{ParticipantName}') {
            correctMessage = correctMessage.replace(
              '{ParticipantName}',
              lead.firstName + ' ' + lead.lastName,
            )
          } else if (val === '{ParticipantTotalPoints}') {
            let totalPoints = 0
            for (const key in lead.socialPoints) {
              // eslint-disable-next-line no-prototype-builtins
              if (lead.socialPoints.hasOwnProperty(key)) {
                totalPoints += Number(lead.socialPoints[key])
              }
            }
            totalPoints += Number(lead.refPoints)
            correctMessage = correctMessage.replace(
              '{ParticipantTotalPoints}',
              totalPoints,
            )
          } else if (val === '{ParticipantReferralPoints}') {
            correctMessage = correctMessage.replace(
              '{ParticipantReferralPoints}',
              lead.refPoints,
            )
          } else if (val === '{ParticipantEmail}') {
            correctMessage = correctMessage.replace(
              '{ParticipantEmail}',
              lead.email,
            )
          } else if (val === '{ParticipantReferralLink}') {
            correctMessage = correctMessage.replace(
              '{ParticipantReferralLink}',
              `https://t.me/${botTitle}?start=${lead.telegramUserId}`,
            )
          }
        }
      }

      return {
        message: `${correctMessage} <a href="${this.message.image.url}">&#8205;</a>`,
        image: '',
        botKey: lead.botKey,
        telegramUserId: lead.telegramUserId,
        userName: lead.firstName,
      }
    },
    saveMessage() {
      const message = { ...this.message }
      this.$store.commit('app/ADD_MESSAGE', message)
      this.$store.commit('app/SET_MESSAGE_DIALOG', false)
    },
    closeDialog() {
      this.$store.commit('app/SET_MESSAGE_DIALOG', false)
    },
  },
}
</script>
