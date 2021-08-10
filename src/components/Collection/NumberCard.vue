<template>
  <v-card class="mb-2 pa-1" color="secondary" @click="showCollection()">
    <v-row class="pa-2">
      <v-col cols="4">
        <div class="caption d-flex justify-start pl-1 mt-2">
          {{ numberGroup.name }}
        </div>
        <!-- <div class="d-flex justify-center">Email@Account.com</div> -->
      </v-col>
      <v-col cols="3">
        <div class="d-flex justify-center caption mt-2">
          {{ numberGroup.numbers ? numberGroup.numbers.length : 0 }}
          numbers
        </div>
        <!-- <div class="d-flex justify-center">acc-password</div> -->
      </v-col>
      <v-col cols="3">
        <div class="d-flex justify-center">
          <v-chip
            @click.stop="verify()"
            outlined
            label
            :color="numberGroup.verified ? 'primary' : 'error'"
          >
            {{ numberGroup.verified ? 'verified!' : 'verify' }}
          </v-chip>
        </div>
      </v-col>
      <v-col cols="1">
        <div class="d-flex justify-center">
          <v-btn @click.stop="editNumbers()" icon color="primary">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="1">
        <div class="d-flex justify-center">
          <v-btn @click.stop="deleteNum()" icon color="error">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'numberGroup',
  props: {
    numberGroup: {
      type: Object,
      required: true,
    },
  },
  methods: {
    showCollection() {
      this.$store.commit('app/SET_CURRENT_COLLECTION', this.numberGroup)
      this.$router.push({ name: 'collection' })
    },
    verify() {
      this.$store.commit('app/SET_ACTIVE_VERIFICATION_GROUP', '')
      this.$store.commit('app/SET_VERIFICATION_DIALOG', true)
      this.$store.commit('app/SET_ACTIVE_VERIFICATION_GROUP', this.numberGroup)
    },
    deleteNum() {
      this.$store.commit('app/SET_DELETE_ACTION', this.deleteNumbers)
      this.$store.commit(
        'app/SET_CONFIRMATION_TEXT',
        'Are you sure you want to delete?',
      )
      this.$store.commit(
        'app/SET_CONFIRMATION_SUB_TEXT',
        'Deleting a collection is a permanent action and cannot be reversed',
      )
      this.$store.commit('app/SET_CONFIRMATION_YES', 'Yes Delete')
      this.$store.commit('app/SET_CONFIRMATION_NO', `No Don't delete`)
      this.$store.commit('app/SET_CONFIRM_DIALOG', true)
    },
    deleteNumbers() {
      this.$store.commit('app/DELETE_NUMBERS', this.numberGroup)
    },
    editNumbers() {
      this.$store.commit('app/SET_ACTIVE_EDIT_NUMBERS', this.numberGroup)
      this.$store.commit('app/SET_NUMBERS_DIALOG', true)
    },
  },
}
</script>

<style></style>
