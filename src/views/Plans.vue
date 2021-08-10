<template>
  <v-container class="px-sm-12 px-6">
    <div class="text-h4 font-weight-bold my-2">Pro</div>
    <v-divider></v-divider>
    <v-row class="mt-8">
      <v-col
        v-for="(membership, i) in memberships"
        :key="i"
        cols="12"
        sm="6"
        md="4"
      >
        <CheckOut
          :name="membership.name"
          :plan="membership.plan"
          :amount="membership.amount"
          :icon="membership.icon"
          :items="membership.benefits"
        />
      </v-col>
    </v-row>
  </v-container>
  <!-- <img style="max-width: 200px" alt="Vue logo" src="/logo1.png" /> -->
</template>

<script>
import CheckOut from '@/components/App/CheckOut'
export default {
  name: 'Checkout',
  components: {
    CheckOut,
  },
  data() {
    return {
      memberships: [
        {
          name: 'Starter Plan',
          amount: '₦10,000',
          plan: 'PLN_e21tzemxls9ewe5',
          icon: 'heart',
          benefits: [
            { text: 'Run unlimited Campaigns' },
            { text: 'Unlimited Bots' },
            { text: 'Schedule messages' },
            { text: '5000 Subscribers' },
          ],
        },
        {
          name: 'Business Plan',
          amount: '₦25,000',
          plan: 'PLN_qclfzxkj7vpjv9z',
          icon: 'rocket',
          benefits: [
            { text: 'Run unlimited Campaigns' },
            { text: 'Unlimited Bots' },
            { text: 'Schedule and send promotional messages' },
            { text: '10000 Subscribers' },
          ],
        },
        {
          name: 'Deluxe Plan',
          amount: '₦50,000',
          plan: 'PLN_58uvae7v7agnmo2',
          icon: 'unicorn',
          benefits: [
            { text: 'Run unlimited Campaigns' },
            { text: 'Unlimited Bots' },
            { text: 'Schedule and send promotional messages' },
            { text: '25000 Subscribers' },
          ],
        },
      ],
    }
  },
}
</script>
