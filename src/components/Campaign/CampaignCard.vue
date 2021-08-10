<template>
  <div>
    <v-card flat color="transparent" class="mb-2">
      <v-row class="my-2 mx-0">
        <!-- The main card part of the bot card -->
        <v-col class="mx-0 pl-0 pr-1 pb-1 pt-0" cols="12" sm="8" md="10">
          <v-card
            color="card"
            height="110"
            :max-height="$vuetify.breakpoint.smAndUp ? 110 : 150"
            class="mb-2"
            @click="editCampaign(campaign)"
          >
            <v-row class="ma-0">
              <!-- The image part of the card -->
              <v-col class="pl-4" cols="4" sm="4" md="2">
                <v-avatar size="80">
                  <img src="../../assets/WhatellzLogo.png" alt="John" />
                </v-avatar>
              </v-col>
              <!-- The part that contains name and date of the bot -->
              <v-col cols="8" sm="6" md="4">
                <div class="primary--text caption py-2">
                  {{ campaign.title }}
                </div>
                <div class="font-weight-medium white--tex pb-2">
                  {{ campaign.title }}
                </div>
                <!-- <div>
                  <small size="3px">{{ bot.startDate }} ▸ </small>
                  <small class="red--text caption">{{ bot.endDate }}</small>
                </div> -->
              </v-col>
              <!-- The deep part of the bot card -->
              <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" sm="6" md="6">
                <v-card
                  color="background"
                  width="300"
                  max-width="410"
                  height="80"
                  min-height="80"
                  flat
                >
                  <!-- The first colum that contains the visitors  -->
                  <v-row class="py-0 ma-0">
                    <v-col class="py-1" cols="7">
                      <div
                        style="
                          max-height: 70px;
                          border-right: 1px #bac5d69c solid;
                          max-width: 140px;
                        "
                      >
                        <div
                          style="max-width: 100px"
                          class="pt-2 text-start appTextGrey--text caption"
                        >
                          Sent Messages
                        </div>
                        <div
                          class="pt-3 text-center font-weight-medium heading-5"
                        >
                          <div
                            style="display: inline-block"
                            class="pr-3 text-center font-weight-medium heading-5"
                          >
                            {{ computedSuccessful }}
                          </div>
                          <v-chip
                            label
                            small
                            color="primary"
                            text-color="white"
                          >
                            <v-avatar left>
                              <v-icon small>mdi-google-analytics</v-icon>
                            </v-avatar>
                            {{ progress }} %
                          </v-chip>
                        </div>
                      </div>
                    </v-col>
                    <!-- Third column showing if bot is active or not -->
                    <v-col cols="5">
                      <div class="pt-4 appTextGrey--text caption">
                        Status : {{ campaign.status }}
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- The edit card part of the bot card -->
        <v-col class="mx-0 pl-0 pr-1 pb-1 pt-0" cols="6" sm="2" md="1">
          <v-card
            color="card"
            max-height="110"
            height="110"
            class="mb-2"
            @click="editCampaign(campaign)"
          >
            <div class="text-center pt-5">
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
            <div class="text-center pt-2 caption appTextGrey--text">Edit</div>
          </v-card>
        </v-col>
        <!-- The more options part of the bot -->
        <v-col class="mx-0 pl-0 pr-1 pb-1 pt-0" cols="6" sm="2" md="1">
          <v-menu :offset-x="true">
            <template v-slot:activator="{ on, attrs }">
              <v-card
                v-bind="attrs"
                color="card"
                max-height="110"
                height="110"
                class="mb-2"
                v-on="on"
              >
                <div class="text-center pt-5">
                  <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </div>
                <div class="text-center pt-2 caption appTextGrey--text">
                  Options
                </div>
              </v-card>
            </template>

            <v-list color="card">
              <v-list-item
                v-for="(item, index) in menu"
                :key="index"
                link
                nuxt
                @click="options({ action: item.title, campaign })"
              >
                <v-list-item-content>
                  <v-list-item-subtitle>
                    {{ item.title }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon>
                    <v-icon small> {{ item.icon }} </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CampaignCard',
  props: {
    campaign: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      feedback: '',
      actions: [
        {
          title: 'View Campaign',
          icon: 'mdi-eye',
          action: 'view-campaign',
        },
        {
          title: 'Edit Campaign',
          icon: 'mdi-pencil',
          action: 'create-campaign',
        },
        {
          title: 'Delete Campaign',
          icon: 'mdi-delete-outline',
          action: 'delete-campaign',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      campaigns: 'campaign/campaigns',
      user: 'auth/user',
      scheduledNumbers: 'campaign/scheduledNumbers',
      successfulNumbers: 'campaign/successfulNumbers',
    }),
    computedScheduled() {
      return this.scheduledNumbers.filter(
        (number) => number.campaignId === this.campaign.id,
      ).length
    },
    computedSuccessful() {
      return this.successfulNumbers.filter(
        (number) => number.campaignId === this.campaign.id,
      ).length
    },
    progress() {
      return (this.computedSuccessful / this.computedScheduled) * 100
    },
    menu() {
      return [
        {
          title: 'Analytics',
          icon: 'mdi-google-analytics',
        },
        {
          title: 'Delete',
          icon: 'mdi-delete',
        },
      ]
    },
  },
  methods: {
    editCampaign(campaign) {
      this.$store.commit('campaign/SET_CURRENT_CAMPAIGN', campaign)
      this.$router.push({ name: 'campaign', params: { id: campaign.id } })
    },
    options({ campaign, action }) {
      if (action === 'Analytics') {
        this.$store.commit('campaign/SET_CURRENT_CAMPAIGN', campaign)
        this.$router.push({
          name: 'campaign-data',
          params: { id: campaign.id },
        })
        return
      }
      if (action === 'Delete') {
        // Open the dialog pop up
        this.$store.commit('app/SET_DELETE_ACTION', this.deleteCampaign)
        this.$store.commit(
          'app/SET_CONFIRMATION_TEXT',
          'Are you sure you want to delete?',
        )
        this.$store.commit(
          'app/SET_CONFIRMATION_SUB_TEXT',
          'Deleting a campaign is a permanent action and cannot be reversed',
        )
        this.$store.commit('app/SET_CONFIRMATION_YES', 'Yes Delete')
        this.$store.commit('app/SET_CONFIRMATION_NO', `No Don't delete`)
        this.$store.commit('app/SET_CONFIRM_DIALOG', true)
        return
      }
    },
    deleteCampaign() {
      console.log('Campaign from vue front end', this.campaign)
      this.$store.commit('campaign/DELETE_CAMPAIGN', this.campaign)
    },
  },
}
</script>

<style></style>
