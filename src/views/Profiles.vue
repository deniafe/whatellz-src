<template>
  <div class="secondary pb-6" :style="divStyle">
    <v-container class="px-12">
      <v-row class="pt-4">
        <v-col sm="4">
          <v-card-title>Profiles</v-card-title>
        </v-col>
        <v-col sm="4">
          <div class="text-center">
            <v-btn class="px-4" color="primary" @click="dialog = true">
              <v-icon left>mdi-plus</v-icon>
              Add An Account
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <!-- <div class="d-flex justify-center py-6">
      <v-btn lg text outlined color="primary" @click="dialog = true"
        >Add An Account</v-btn
      >
    </div> -->

      <div class="pt-4">
        <AccCard
          v-for="(acc, i) in computedAccounts"
          :key="i"
          :accObj="acc"
          @edit="showEdit(acc, i)"
          @delete="deleteAccount(acc)"
        />
      </div>
      <div v-if="!accounts.length" class="headline text-center pt-4">
        <div>
          You have not added any profile(s). Click the button to add a profile.
        </div>
        <div class="mt-6 text-center">
          <v-avatar size="200" to="/">
            <img src="@/assets/404.svg" alt="" />
          </v-avatar>
        </div>
      </div>
      <AddAccDetails
        @edit="editAccount($event)"
        :accDialog="dialog"
        :edit="edit"
        :btx="btx"
        @close="closeDialog"
      />
    </v-container>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import AddAccDetails from '@/components/AddAccDetails'
import AccCard from '@/components/AccCard'
export default {
  components: {
    AddAccDetails,
    AccCard,
  },
  data() {
    return {
      dialog: false,
      edit: '',
      btx: 'Save',
      index: 0,
      browserHeight: '',
    }
  },
  mounted() {
    this.getAccounts()
    this.browserHeight = document.body.clientHeight
  },
  computed: {
    ...mapGetters({
      accounts: 'app/accounts',
      user: 'auth/user',
    }),
    computedAccounts() {
      return this.accounts.filter((acc) => acc.userId === this.user.id)
    },
    divStyle() {
      return {
        height: this.browserHeight + 'px',
      }
    },
  },
  methods: {
    getAccounts() {
      ipcRenderer.send('get-accounts')
    },
    closeDialog() {
      this.edit = ''
      this.index = ''
      this.dialog = false
      this.btx = 'Save'
    },
    showEdit(acc, index) {
      this.dialog = true
      this.btx = 'Edit'
      this.edit = acc
      this.index = index
    },
    editAccount(e) {
      ipcRenderer.send('edit-accounts', { index: this.index, val: e })
    },
    deleteAccount(account) {
      this.$store.commit('app/DELETE_WHATSAPP_ACCOUNT', account)
    },
  },
}
</script>

<style></style>
