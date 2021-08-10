<template>
  <v-dialog v-model="push" overlay-color="black" width="450">
    <v-card color="card">
      <v-card class="mx-auto" width="400" flat color="transparent">
        <v-card-title class="headline pl-0">{{ formTitle }}</v-card-title>
        <v-card-subtitle class="pt-2 primary-grey--text pl-0">
          {{ formSubTitle }}
        </v-card-subtitle>
        <v-form ref="numbersForm" v-model="valid">
          <v-row>
            <v-col
              v-if="
                addNumbersType !== 'wa-groups' && addNumbersType !== 'contacts'
              "
              cols="6"
            >
              <div class="caption :">Collection Name :</div>
              <AppInput
                v-model="form.name"
                :label="'Collection Name'"
                :type="'text'"
                :hint="'Give this collection of numbers a name. This is just for reference purpose. You can change it later.'"
              />
            </v-col>
            <v-col
              v-if="
                addNumbersType !== 'generate' &&
                addNumbersType !== 'wa-groups' &&
                addNumbersType !== 'contacts'
              "
              cols="6"
            >
              <div class="caption :">Verified? :</div>
              <v-switch
                v-model="form.verified"
                inset
                :label="`Verified?`"
              ></v-switch>
            </v-col>
            <v-col
              v-if="addNumbersType === 'generate' && !activeGroup"
              cols="6"
            >
              <div class="caption :">Country Code :</div>
              <AppInput
                v-model="form.countryCode"
                :label="'Country Code'"
                :type="'number'"
                :hint="'Your Country code is the first  1 or more numbers added to your number when clling from another country'"
              />
            </v-col>
            <v-col
              v-if="addNumbersType === 'generate' && !activeGroup"
              cols="4"
            >
              <div class="caption :">Mobile Digits :</div>
              <AppInput
                v-model="form.mobileDigits"
                :label="'Mobile Digits'"
                :type="'number'"
                :hint="'How many diigits are the mobile numbers in your country'"
              />
            </v-col>
            <v-col
              v-if="addNumbersType === 'generate' && !activeGroup"
              cols="4"
            >
              <div class="caption :">Number Amounts :</div>
              <AppInput
                v-model="form.numberAmounts"
                :label="'Amount'"
                :type="'number'"
                :hint="'How many numbers do you want generated'"
              />
            </v-col>
            <v-col
              v-if="addNumbersType === 'generate' && !activeGroup"
              cols="4"
            >
              <div class="caption :">Network Prefix :</div>
              <AppInput
                v-model="form.networkPrefix"
                :label="'Amount'"
                :type="'number'"
                :hint="'How many numbers do you want generated'"
              />
            </v-col>
            <v-col v-if="addNumbersType === 'import'" cols="12">
              <div class="caption :">Upload a file of numbers :</div>
              <AppUpload
                :label="'Upload a list of contact'"
                :hint="'Upload a list of numbers to be added to this collection'"
                @input="uploadContacts"
              />
            </v-col>
            <v-col v-if="addNumbersType === 'contacts'" cols="12">
              <div class="caption :">Select a profile :</div>
              <AppSelectInput
                :items="accountNames"
                :label="'Account'"
                v-model="selectAccount"
              />
            </v-col>
            <v-col v-if="addNumbersType === 'wa-groups'" cols="12">
              <div class="caption :">Select a profile :</div>
              <AppSelectInput
                :items="accountNames"
                :label="'Account'"
                v-model="selectAccount"
              />
            </v-col>
            <v-col
              v-if="
                addNumbersType === 'wa-groups' || addNumbersType === 'contacts'
              "
              cols="12"
              class="my-0 py-0"
            >
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
            </v-col>
            <v-col
              v-if="addNumbersType === 'generate' && !activeGroup"
              cols="12"
            >
              <div class="caption :">Number Display :</div>
              <AppTextArea
                :label="'You can add numbers manually'"
                v-model="numbers"
                :rules="messageContentRules"
                :hint="`This is where the numbers are generated. You can also add numbers manually`"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="addNumbersType !== 'import'"
            color="info"
            text
            @click="generate"
          >
            {{ generateButton }}
          </v-btn>
          <v-btn color="primary" text :disabled="!valid" @click="saveNumbers">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'
import { nanoid } from 'nanoid'
const fs = require('fs')
export default {
  data() {
    return {
      valid: false,
      numbers: '',
      imported: '',
      showBrowser: false,
      form: {
        name: '',
        verified: '',
        test: '',
        countryCode: '',
        mobileDigits: '',
        numberAmounts: '',
        networkPrefix: '',
        profile: '',
      },
      messageContentRules: [
        (v) => /[^\s]/.test(v) || 'This field is required',
        (v) => (v && v.length >= 10) || 'Content too short.',
      ],
    }
  },
  computed: {
    ...mapGetters({
      dialog: 'app/numbersDialog',
      activeGroup: 'app/activeEditNumbers',
      addNumbersType: 'app/addNumbersType',
      accounts: 'app/accounts',
      campaigns: 'campaign/campaigns',
      user: 'auth/user',
    }),
    push: {
      get() {
        return this.dialog
      },
      set(val) {
        this.$store.commit('app/SET_NUMBERS_DIALOG', val)
      },
    },
    accountNames() {
      return this.accounts.map((account) => account.name)
    },
    selectAccount: {
      get() {
        if (!this.profile) return ''
        return this.form.profile.name
      },
      set(profile) {
        this.updateWhatsAppAccount(profile)
      },
    },

    formTitle() {
      let title = 'Edit Collection'
      if (this.addNumbersType === 'generate') {
        title = 'Generate New Numbers'
      } else if (this.addNumbersType === 'import') {
        title = 'Import Numbers'
      } else if (this.addNumbersType === 'contacts') {
        title = 'Add Contacts'
      } else if (this.addNumbersType === 'wa-groups') {
        title = 'Add From WhatsApp Groups'
      }
      return title
    },
    formSubTitle() {
      let sub
      if (this.addNumbersType === 'generate') {
        sub = 'You can generate brand new numbers automatically'
      } else if (this.addNumbersType === 'import') {
        sub = 'Import a list of contacts you already have stored in a file'
      } else if (this.addNumbersType === 'contacts') {
        sub = 'Add all the contacts from your phone easily'
      } else if (this.addNumbersType === 'wa-groups') {
        sub =
          'Do you belong to whatsapp groups? Scrape all the members of each group you belong to'
      }
      return sub
    },
    generateButton() {
      let button
      if (this.addNumbersType === 'generate') {
        button = 'Generate'
      } else if (this.addNumbersType === 'import') {
        button = ''
      } else if (this.addNumbersType === 'contacts') {
        button = 'Scrape Contacts'
      } else if (this.addNumbersType === 'wa-groups') {
        button = 'Scrape Groups'
      }
      return button
    },
  },
  watch: {
    push(newValue) {
      if (newValue && this.activeGroup) {
        this.form.name = this.activeGroup.name
        this.form.verified = this.activeGroup.verified
      }
      if (!newValue) {
        this.$refs.numbersForm.reset()
        this.showBrowser = false
        this.$store.commit('app/SET_ACTIVE_EDIT_NUMBERS', '')
        this.$store.commit('app/SET_ADD_NUMBERS_TYPE', '')
      }
    },
  },
  methods: {
    saveNumbers() {
      if (!this.activeGroup && this.addNumbersType === 'generate') {
        const numbers = this.numbers.split(',').map((num) => {
          return { number: num, name: 'n/a', verified: false }
        })
        this.$store.commit('app/ADD_NUMBERS', {
          id: nanoid(),
          userId: this.user.id,
          name: this.form.name,
          numbers,
          verified: false,
        })
        this.$store.commit('app/SET_NUMBERS_DIALOG', false)
      } else if (!this.activeGroup && this.addNumbersType === 'import') {
        const numbers = this.imported
        this.$store.commit('app/ADD_NUMBERS', {
          id: nanoid(),
          userId: this.user.id,
          name: this.form.name,
          numbers,
          verified: false,
        })
        this.$store.commit('app/SET_NUMBERS_DIALOG', false)
      } else if (this.activeGroup) {
        const numbers = { ...this.activeGroup }
        numbers.name = this.form.name
        numbers.verified = this.form.verified
        numbers.userId = this.user.id
        this.updateNumbers(numbers)
      }
    },
    generate() {
      if (this.addNumbersType === 'generate') {
        let number = ''
        let amount = this.form.numberAmounts
        let code = this.form.countryCode
        let prefix = this.form.networkPrefix
        let digits = this.form.mobileDigits + 1 - (code.length + prefix.length)
        console.log('Total length of the generated numbers', digits)
        for (let i = 1; i < amount; i++) {
          number = Math.floor(100000 + Math.random() * 9000000)
          this.numbers = this.numbers + `${code}${prefix}${number},`
        }
      }
      if (this.addNumbersType === 'contacts') {
        const isActiveProfile = this.checkProfile(this.form.profile)
        if (isActiveProfile) {
          const notification = {
            message:
              'The whatsapp account you selected to scrape contacts is actively being used in another campaign or sequence. Use another account.',
            type: 'error',
          }
          this.$store.dispatch('notification/setNotification', notification)
          this.$store.dispatch('notification/showNotification', true)
          return
        }
        const args = {
          name: this.form.name,
          profile: this.form.profile,
          showBrowser: this.showBrowser,
        }
        ipcRenderer.send('scrape-contacts-numbers', args)
        this.$store.commit('app/SET_NUMBERS_DIALOG', false)
        this.$store.commit('app/SET_OVERLAY_DIALOG', true)
        this.$store.commit(
          'app/SET_OVERLAY_DESCRIPTION',
          'Wait a few seconds while we initiate contacts scraping ...',
        )
      }
      if (this.addNumbersType === 'wa-groups') {
        const isActiveProfile = this.checkProfile(this.form.profile)
        if (isActiveProfile) {
          const notification = {
            message:
              'The whatsapp account you selected to scrape group members is actively being used in another campaign or sequence. Use another account.',
            type: 'error',
          }
          this.$store.dispatch('notification/setNotification', notification)
          this.$store.dispatch('notification/showNotification', true)
          return
        }
        const args = {
          profile: this.form.profile,
          showBrowser: this.showBrowser,
        }
        ipcRenderer.send('scrape-group-numbers', args)
        this.$store.commit('app/SET_NUMBERS_DIALOG', false)
        this.$store.commit('app/SET_OVERLAY_DIALOG', true)
        this.$store.commit(
          'app/SET_OVERLAY_DESCRIPTION',
          'Wait a few seconds while we initiate contacts scraping ...',
        )
      }
      if (this.addNumbersType === 'manual') {
        console.log('manual')
      }
    },
    uploadContacts(file) {
      if (!file) return
      // var fr = new FileReader()
      // const vm = this
      const textContent = fs.readFileSync(file.path).toString()
      // fr.onload = function() {
      // Read the file and send it to the store
      let contacts = textContent.split('\n')
      if (!contacts.slice(-1)[0]) contacts.pop()
      const arrOfContacts = contacts.map((contact) => {
        const contactArr = contact.split(',')
        if (!contactArr.slice(-1)[0]) contactArr.pop()

        const id = nanoid()
        let isVerified = false
        let contactObj = {
          id,
          name: 'n/a',
          isVerified,
        }

        for (let i = 0; i < contactArr.length; i++) {
          if (contactArr[i] === 'isVerified') {
            isVerified = true
            contactObj.verified = isVerified
          } else if (contactArr[i] === 'notVerified') {
            isVerified = false
            contactObj.verified = isVerified
          } else if (!isNaN(parseInt(contactArr[i])))
            contactObj.number = contactArr[i]
          else if (isNaN(parseInt(contactArr[i])))
            contactObj.name = contactArr[i]
        }
        // if (!isNaN(parseInt(contactArr[0]))) {
        //   if (contactArr[1] === 'isVerified') isVerified = true
        //   else if (contactArr[1] === 'notVerified') isVerified = false

        //   contactObj = {
        //     id,
        //     name: 'n/a',
        //     number: contactArr[0],
        //     verified: isVerified,
        //   }
        // } else if (isNaN(parseInt(contactArr[0]))) {
        //   let isVerified
        //   if (contactArr[2] === 'isVerified') isVerified = true
        //   else if (contactArr[2] === 'notVerified') isVerified = false

        //   contactObj = {
        //     id,
        //     name: contactArr[0],
        //     number: contactArr[1],
        //     verified: isVerified,
        //   }
        // }
        return contactObj
      })

      this.imported = arrOfContacts
    },
    updateNumbers(numbers) {
      this.$store.commit('app/EDIT_NUMBERS', numbers)
      this.$store.commit('app/SET_NUMBERS_DIALOG', false)
    },
    updateWhatsAppAccount(profile) {
      let account = this.accounts.filter((acc) => profile === acc.name)[0]
      this.form.profile = account
    },
    closeDialog() {
      this.$store.commit('lead/SET_NUMBERS_DIALOG', false)
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
