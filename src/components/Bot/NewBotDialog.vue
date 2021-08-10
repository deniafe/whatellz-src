<template>
  <v-dialog
    v-model="botDialog"
    overlay-color="black"
    class="ma-0"
    max-width="400"
  >
    <v-card flat class="pa-4" color="card">
      <v-card-title>
        <span class="headline">Create New Bot</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="botForm" v-model="valid">
            <AppInput
              v-model="botTitle"
              :rules="botRules"
              :hint="'Give this bot a name. This is just for referrence purposes'"
              label="Bot Username"
            />
            <AppInput
              v-model="botDesc"
              :rules="botRules"
              :hint="'Give this bot a desc. This is just so you have a better understanding of what the bot is used for'"
              label="Bot Description"
            />
            <!-- <AppSelectInput
              @input="updateWhatsAppAccount"
              :items="accountNames"
              :hint="'Which whatsapp profile do you want to associate this bot with'"
              label="Account Profile"
            /> -->
            <v-row class="pa-0">
              <v-col class="pa-2" cols="6">
                <v-menu
                  ref="startMenu"
                  v-model="startMenu"
                  :close-on-content-click="false"
                  :return-value.sync="startDate"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <div>
                      <v-text-field
                        v-model="startDate"
                        label="Start Date"
                        prepend-icon="mdi-calendar"
                        :rules="botRules"
                        :hint="'When do you want your bot to start running'"
                        readonly
                        flat
                        outlined
                        dense
                        v-on="on"
                      ></v-text-field>
                    </div>
                  </template>
                  <v-date-picker v-model="startDate" light no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="appPink" @click="startMenu = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="appBlue"
                      @click="$refs.startMenu.save(startDate)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="pa-2" cols="6">
                <v-menu
                  ref="endMenu"
                  v-model="endMenu"
                  :close-on-content-click="false"
                  :return-value.sync="endDate"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <div>
                      <v-text-field
                        v-model="endDate"
                        label="End Date"
                        prepend-icon="mdi-calendar"
                        :rules="botRules"
                        :hint="'When do you want your bot to stop running'"
                        readonly
                        flat
                        outlined
                        dense
                        v-on="on"
                      ></v-text-field>
                    </div>
                  </template>
                  <v-date-picker v-model="endDate" light no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="appPink" @click="endMenu = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="appBlue"
                      @click="$refs.endMenu.save(endDate)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="!creating" color="appPink" text @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="creating"
          :disabled="!valid"
          text
          @click="createBot"
        >
          Create
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
      botTitle: '',
      botDesc: '',
      account: '',
      startDate: '',
      endDate: '',
      startMenu: false,
      endMenu: false,
      modal: false,
      menu2: false,
      valid: false,
      botRules: [
        (v) => /[^\s]/.test(v) || 'This field is required',
        (v) => (v && v.length >= 2) || 'Must be more than 2 characters',
      ],
    }
  },
  computed: {
    ...mapGetters({
      dialog: 'bot/dialog',
      user: 'auth/user',
      creating: 'bot/creating',
      accounts: 'app/accounts',
    }),
    botDialog: {
      get() {
        return this.dialog
      },
      set(val) {
        this.$store.commit('bot/SET_BOT_DIALOG', val)
      },
    },
    accountNames() {
      return this.accounts.map((account) => account.name)
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
    createBot() {
      const newBot = {
        id: nanoid(),
        userId: this.user.id,
        title: this.botTitle,
        desc: this.botDesc,
        number: this.botNum,
        status: false,
        startDate: this.startDate,
        endDate: this.endDate,
      }
      this.$store.commit('bot/ADD_BOT', newBot)
      this.closeDialog()
    },
    resetForm() {
      this.$refs.botForm.reset()
    },
    closeDialog() {
      this.$store.commit('bot/SET_BOT_DIALOG', false)
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
