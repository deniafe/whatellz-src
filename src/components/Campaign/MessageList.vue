<template>
  <div>
    <v-card color="background" height="450">
      <v-row class="pa-0 ma-0">
        <v-col class="pa-0" cols="9">
          <v-card-title>Add Messages</v-card-title>
        </v-col>
        <v-col cols="3" small class="mt-4">
          <v-btn outlined small color="primary" @click="openNewMessage">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <div class="pa-4" style="overflow: scroll; height: 370px">
        <v-card
          v-for="(message, index) in messageLists"
          :key="index"
          class="mb-2 pa-1"
          color="secondary"
        >
          <v-row class="pa-2">
            <v-col cols="5">
              <div class="caption d-flex justify-start pl-2">
                {{ message_title(message) }}
              </div>
              <!-- <div class="d-flex justify-center">Email@Account.com</div> -->
            </v-col>
            <v-col cols="4">
              <div class="d-flex justify-center caption">
                {{ message.image ? message_image_title(message) : 'No Image' }}
              </div>
              <!-- <div class="d-flex justify-center">acc-password</div> -->
            </v-col>
            <v-col cols="3">
              <div class="d-flex justify-center">
                <v-btn @click="edit(message, index)" icon color="primary">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn @click="deleteMessage(index)" icon color="error">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script>
// import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
export default {
  name: 'MessageList',
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      settings: 'campaign/settings',
    }),
    messageLists() {
      if (!this.settings) {
        return ''
      }
      return this.settings.messages
    },
  },
  methods: {
    message_title(message) {
      return this.truncate(message.content, 20, '...')
    },
    message_image_title(message) {
      return this.truncate(message.image.name, 20, '...')
    },
    truncate(str, max, suffix) {
      return str.length < max
        ? str
        : `${str.substr(
            0,
            str.substr(0, max - suffix.length).lastIndexOf(' '),
          )}${suffix}`
    },
    openNewMessage() {
      this.$store.commit('campaign/SET_ACTIVE_EDIT_MESSAGE', '')
      this.$store.commit('campaign/SET_MESSAGE_DIALOG', true)
    },
    edit(message, index) {
      this.$store.commit('campaign/SET_MESSAGE_DIALOG', true)
      this.$store.commit('campaign/SET_ACTIVE_EDIT_MESSAGE', message)
      this.$store.commit('campaign/SET_ACTIVE_EDIT_MESSAGE_INDEX', index)
    },
    deleteMessage(index) {
      this.$store.commit('campaign/DELETE_MESSAGE', index)
    },
  },
}
</script>

<style></style>
