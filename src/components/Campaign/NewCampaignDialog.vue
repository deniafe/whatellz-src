<template>
  <v-dialog v-model="dialog" overlay-color="black" class="ma-0" max-width="400">
    <v-card flat class="pa-4" color="card">
      <v-card-title> Create New Campaign </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="campaignForm" v-model="valid">
            <AppInput
              v-model="campaignTitle"
              :rules="campaignRules"
              :hint="'Give this campaign a name. This is just for referrence purpose'"
              label="Campaign Name"
            />
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="!creating" color="error" text @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn color="primary" :disabled="!valid" text @click="createCampaign">
          Create Campaign
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { nanoid } from 'nanoid'
export default {
  data() {
    return {
      filled: false,
      campaignTitle: '',
      valid: false,
      campaignRules: [
        (v) => /[^\s]/.test(v) || 'This field is required',
        (v) => (v && v.length >= 2) || 'Must be more than 2 characters',
      ],
    }
  },
  computed: {
    ...mapGetters({
      campaignDialog: 'campaign/campaignDialog',
      user: 'auth/user',
    }),
    dialog: {
      get() {
        return this.campaignDialog
      },
      set(val) {
        this.$store.commit('campaign/SET_CAMPAIGN_DIALOG', val)
      },
    },
  },
  watch: {
    dialog(newValue) {
      if (!newValue) {
        this.resetForm()
      }
    },
  },
  methods: {
    createCampaign() {
      const newCampaign = {
        id: nanoid(),
        userId: this.user.id,
        title: this.campaignTitle,
        status: 'Inactive',
        scheduled: 0,
        sent: 0,
        progress: 0,
        settings: {
          account: {
            name: '',
            number: '',
          },
          messages: [],
          message_file: '',
          numbers: [],
          delay: {
            min: 0,
            max: 0,
          },
          showBrowser: false,
        },
      }
      this.$store.commit('campaign/ADD_CAMPAIGN', newCampaign)
      this.closeDialog()
    },
    resetForm() {
      this.$refs.campaignForm.reset()
    },
    closeDialog() {
      this.$store.commit('campaign/SET_CAMPAIGN_DIALOG', false)
    },
  },
}
</script>

<style scoped>
#new-bot {
  font-family: 'Raleway', sans-serif;
  font-size: 24px;
  color: #fff;
  text-align: center;
}
#close-group {
  background-color: transparent;
  padding-left: 520px;
}
</style>
