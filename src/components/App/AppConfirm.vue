<template>
  <v-dialog v-model="dialog" overlay-color="black" class="ma-0" max-width="400">
    <v-card flat class="pa-4" color="card">
      <v-card-title>
        <span class="text-h6 text-center"> {{ confirmationText }}</span>
      </v-card-title>
      <v-card-subtitle
        v-if="confirmationYes === 'Yes Upgrade'"
        class="pt-1 text-center"
      >
        Changing your plans will cancel the current plan. Are you sure this is
        what you want?
      </v-card-subtitle>
      <v-card-subtitle
        v-if="confirmationYes !== 'Yes Upgrade'"
        class="pt-1 text-center"
      >
        {{ confirmationSubText }}
      </v-card-subtitle>
      <v-card-text>
        <v-container>
          <div class="d-flex justify-center">
            <v-icon color="error" x-large>mdi-help-circle-outline</v-icon>
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :color="confirmationYes !== 'Yes Upgrade' ? 'primary' : 'error'"
          class="ml-4"
          text
          @click="closeDialog"
        >
          {{ confirmationNo }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :color="confirmationYes !== 'Yes Upgrade' ? 'error' : 'primary'"
          class="mr-4"
          text
          @click="deleteAction"
        >
          {{ confirmationYes }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      confirmDialog: 'app/confirmDialog',
      confirmationText: 'app/confirmationText',
      confirmationSubText: 'app/confirmationSubText',
      confirmationYes: 'app/confirmationYes',
      confirmationNo: 'app/confirmationNo',
      action: 'app/deleteAction',
      item: 'app/deleteItem',
    }),
    dialog: {
      get() {
        return this.confirmDialog
      },
      set(val) {
        this.$store.commit('app/SET_CONFIRM_DIALOG', val)
      },
    },
  },
  methods: {
    closeDialog() {
      this.$store.commit('app/SET_CONFIRM_DIALOG', false)
    },
    deleteAction() {
      this.action()
      // close the dialog pop up
      this.$store.commit('app/SET_CONFIRM_DIALOG', false)
    },
  },
}
</script>
