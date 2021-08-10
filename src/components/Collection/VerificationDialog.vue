<template>
  <v-dialog persistent v-model="dialog" max-width="320">
    <v-card flat class="mx-auto" color="card" max-width="320">
      <v-card-title class="mb-2">Choose A WhatsApp Profile</v-card-title>
      <v-card-subtitle
        >Select a whatsApp profile that can be used for verification.
      </v-card-subtitle>
      <!-- <v-form ref="resetForm" @submit.prevent="resetPassword"> -->
      <div class="d-flex justify-center pt-2 px-4">
        <AppSelectInput
          :items="accountNames"
          :label="'Account'"
          v-model="selectAccount"
        />
      </div>
      <div class="pt-2 px-4">
        <small class="caption :">Show Browser:</small>
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
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="verify" color="primary" text :disabled="!profile">
          Start Verification
        </v-btn>
        <v-btn color="error" text @click="closeDialog"> Close </v-btn>
      </v-card-actions>
      <!-- </v-form> -->
    </v-card>
    <!-- </v-card> -->
  </v-dialog>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
export default {
  name: 'verificationDialog',
  data() {
    return {
      profile: '',
      showBrowser: false,
    }
  },
  computed: {
    ...mapGetters({
      verificationDialog: 'app/verificationDialog',
      activeVerificationGroup: 'app/activeVerificationGroup',
      accounts: 'app/accounts',
      campaigns: 'campaign/campaigns',
    }),
    dialog: {
      get() {
        return this.verificationDialog
      },
      set(val) {
        this.$store.commit('app/SET_VERIFICATION_DIALOG', val)
      },
    },
    accountNames() {
      return this.accounts.map((account) => account.name)
    },
    selectAccount: {
      get() {
        if (!this.profile) return ''
        return this.profile.name
      },
      set(profile) {
        this.updateWhatsAppAccount(profile)
      },
    },
  },
  methods: {
    verify() {
      const isActiveProfile = this.checkProfile(this.profile)
      if (isActiveProfile) {
        const notification = {
          message:
            'The whatsapp account you selected for verification is actively being used in another campaign or sequence. Use another account.',
          type: 'error',
        }
        this.$store.dispatch('notification/setNotification', notification)
        this.$store.dispatch('notification/showNotification', true)
        return
      }
      const numbers = this.activeVerificationGroup
      const args = {
        account: this.profile,
        showBrowser: this.showBrowser,
        numbers: numbers.numbers,
      }
      this.$store.commit('app/SET_ACTIVE_VERIFICATION_GROUP', numbers)
      ipcRenderer.send('verify-numbers', args)
      this.$store.commit('app/SET_VERIFICATION_DIALOG', true)
      this.closeDialog()
      this.$store.commit('app/SET_OVERLAY_DIALOG', true)
      this.$store.commit(
        'app/SET_OVERLAY_DESCRIPTION',
        'Getting ready to start verification ...',
      )
    },
    updateWhatsAppAccount(profile) {
      let account = this.accounts.filter((acc) => profile === acc.name)[0]
      this.profile = account
    },
    closeDialog() {
      this.$store.commit('app/SET_VERIFICATION_DIALOG', false)
    },
    checkProfile(account) {
      let activeProfile = false
      const activeCampaigns = this.campaigns.filter(
        (camp) => camp.status === 'Active',
      )
      if (activeCampaigns.length !== 0) {
        const activeProfiles = activeCampaigns.filter(
          (camp) => camp.settings.account.number === account.number,
        )
        activeProfile = !!activeProfiles[0]
      }
      return activeProfile
    },
  },
}
</script>
