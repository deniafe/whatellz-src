<template>
  <v-dialog v-model="push" overlay-color="black" width="450">
    <v-card color="card">
      <v-card class="mx-auto" width="400" flat color="transparent">
        <v-card-title class="headline pl-0">Add A Message</v-card-title>
        <v-form ref="messageForm" v-model="valid">
          <!-- <div class="caption pt-8">Message Image :</div> -->
          <div class="d-flex justify-center pb-4">
            <AppUpload
              v-model="messageImage"
              :accept="'image/x-png,image/gif,image/jpeg'"
              :label="'Message Image'"
            />
          </div>
          <!-- <div class="caption :">Message Content :</div> -->
          <AppTextArea
            v-model="message.content"
            @emoji="addEmoji"
            :label="'Message Content'"
            :rules="messageContentRules"
            :hint="`Create custom messages that can be sent to users of your bot and participants of your contest`"
          />
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
      dialog: 'campaign/messageDialog',
      activeMessage: 'campaign/activeEditMessage',
    }),
    push: {
      get() {
        return this.dialog
      },
      set(val) {
        this.$store.commit('campaign/SET_MESSAGE_DIALOG', val)
      },
    },
    messageImage: {
      get() {
        return this.message.image
      },
      set(file) {
        if (!file) return
        console.log(file)
        this.message.image = {
          name: file.name,
          path: file.path.replace(/\\/g, '/'),
        }
      },
    },
  },
  watch: {
    push(newValue) {
      if (newValue && this.activeMessage) {
        this.message = Object.assign({}, this.activeMessage)
      }
      if (!newValue) {
        this.$store.commit('campaign/SET_ACTIVE_EDIT_MESSAGE', '')
        this.$store.commit('campaign/SET_ACTIVE_EDIT_MESSAGE_INDEX', '')
        this.$refs.messageForm.reset()
      }
    },
  },
  methods: {
    addEmoji(val) {
      this.message.content = this.message.content + val.native
      console.log(val)
    },
    saveMessage() {
      const message = Object.assign({}, this.message)

      if (!this.activeMessage) {
        this.$store.commit('campaign/ADD_MESSAGE', message)
      }
      if (this.activeMessage) {
        this.$store.commit('campaign/EDIT_MESSAGE', message)
      }

      this.$store.commit('campaign/SET_MESSAGE_DIALOG', false)
    },
    closeDialog() {
      this.$store.commit('campaign/SET_MESSAGE_DIALOG', false)
    },
  },
}
</script>
