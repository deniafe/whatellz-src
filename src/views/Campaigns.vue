<template>
  <v-container class="px-12">
    <!-- The top button to start the campaign -->
    <v-row class="pt-4">
      <v-col sm="4">
        <v-card-title>Campaigns</v-card-title>
      </v-col>

      <v-col sm="4">
        <div class="text-center">
          <v-btn class="px-4" color="primary" @click="createCampaign">
            <v-icon left>mdi-plus</v-icon>
            New Campaign
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <!-- <v-row>
      <v-col cols="12" md="8">
        <v-row class="mt-0 mx-4">
          <v-col cols="12" sm="5">
            <v-select
              background-color="background"
              label="Select Campaigns"
              flat
              solo
            ></v-select>
          </v-col>
          <v-col cols="12" sm="7">
            <v-text-field
              background-color="background"
              label="Search here..."
              flat
              solo
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->
    <v-row class="ma-0 pa-0 mt-4">
      <v-col class="px-0" cols="12">
        <CampaignCard
          v-for="campaign in computedCampaigns"
          :key="campaign.id"
          :campaign="campaign"
        />
      </v-col>
    </v-row>

    <div v-if="!campaigns.length" class="headline text-center pt-4">
      <div>
        You have no campaign(s) yet. Click the button to create a campaign
      </div>
      <div class="pt-2 text-center caption primary-grey--text">
        It could also be a bad internet connection. Ensure you have a good
        connection to load your campaigns
      </div>
      <div class="mt-6 text-center">
        <v-avatar size="200" to="/">
          <img src="@/assets/404.svg" alt="" />
        </v-avatar>
      </div>
    </div>

    <NewCampaignDialog />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import NewCampaignDialog from '@/components/Campaign/NewCampaignDialog'
import CampaignCard from '@/components/Campaign/CampaignCard'
export default {
  name: 'campaigns',
  components: {
    NewCampaignDialog,
    CampaignCard,
  },
  computed: {
    ...mapGetters({
      campaigns: 'campaign/campaigns',
      user: 'auth/user',
      scheduledNumbers: 'campaign/scheduledNumbers',
      successfulNumbers: 'campaign/successfulNumbers',
    }),
    computedCampaigns() {
      return this.campaigns.filter(
        (campaign) => campaign.userId === this.user.id,
      )
    },
  },
  methods: {
    createCampaign() {
      this.$store.commit('campaign/SET_CAMPAIGN_DIALOG', true)
    },
  },
}
</script>
