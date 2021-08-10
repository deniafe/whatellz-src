<template>
  <v-card flat color="card" tile>
    <v-card height="5px" tile text color="success"> </v-card>
    <div class="text-center pt-6">
      <v-icon size="70">mdi-{{ icon }}</v-icon>
    </div>
    <div class="text-center pt-6 text-h6 font-weight-bold">{{ name }}</div>
    <div class="text-center pt-6 text-h4 font-weight-bold primary--text">
      {{ amount }}<span class="text-subtitle-1 white--text">/month</span>
    </div>
    <v-divider class="mx-4 my-8"></v-divider>
    <v-list dense color="card" flat>
      <v-list-item-group color="card">
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-icon>
            <v-icon color="success">mdi-checkbox-marked</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-card-actions v-if="!currentPlan" class="py-4 px-8">
      <paystack
        :amount="amount * 100"
        :email="email"
        :plan="plan"
        :paystackkey="PUBLIC_KEY"
        :reference="reference"
        :callback="processPayment"
        :close="close"
        :embed="false"
      >
        <!-- <i class="fas fa-money-bill-alt"></i>
          Make Payment -->
        <v-btn text outlined color="success">Pay in NGN</v-btn>
      </paystack>
      <v-spacer></v-spacer>
      <v-btn text outlined color="warning" @click="makePayment"
        >Pay in USD</v-btn
      >
    </v-card-actions>
    <v-card-actions v-if="currentPlan" class="py-4">
      <v-btn text x-large outlined class="px-8 mx-auto"
        >Your Current Plan</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import paystack from 'vue-paystack'
import { mapGetters } from 'vuex'
export default {
  components: {
    paystack,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
  },
  data: () => {
    return {
      PUBLIC_KEY: 'pk_test_bc5ffbdc5454e250e8fcdd05fe9ec158fcc01fbe',
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
    email() {
      return this.user.email
    },
    currentPlan() {
      return this.user.membership.plan === this.name
    },
    firestoreId() {
      return { firestore_uid: this.user.id }
    },
    reference() {
      let text = ''
      const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      return text
    },
  },
  methods: {
    processPayment: (response) => {
      window.alert(
        'Payment recieved ' + response.reference + ' ' + response.data.status,
      )
    },
    close: () => {
      // eslint-disable-next-line no-console
      console.log('You closed checkout page')
    },
    makePayment() {
      this.$launchFlutterwave({
        tx_ref: Date.now(),
        amount: this.amount,
        currency: 'USD',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: this.email,
          phonenumber: '0835725391',
          name: this.user.email,
        },
        callback(data) {
          // specified callback function
          // eslint-disable-next-line no-console
          console.log(data)
        },
        customizations: {
          title: 'Telephy',
          description: 'Telephy subscription plan',
          logo:
            'https://firebasestorage.googleapis.com/v0/b/telephy-147d6.appspot.com/o/PzJDgebXYOZNbdWE20sOOHhXyYF2%2Feebb7295479d4-TELELPHY%20TRANS-01.png?alt=media&token=95525453-ba59-4255-940c-12c3e1e0bf12',
        },
      })
    },
  },
}
</script>

<style></style>
