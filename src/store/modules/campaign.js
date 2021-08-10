import { ipcRenderer } from 'electron'
export default {
  namespaced: true,
  state: () => {
    return {
      campaignDialog: false,
      campaignText: 'Launch Campaign',
      campaigns: [],
      currentCampaign: '',
      messageDialog: '',
      activeEditMessage: '',
      activeEditMessageIndex: '',
      messageLists: [],
      interval: 0,
      contacts: [],
      scheduledNumbers: [],
      successfulNumbers: [],
    }
  },
  mutations: {
    ADD_CAMPAIGN(state, campaign) {
      state.campaigns.push(campaign)
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    SET_CAMPAIGN_DIALOG(state, status) {
      state.campaignDialog = status
    },
    SET_CAMPAIGNS(state, campaigns) {
      state.campaigns = campaigns
    },
    DELETE_CAMPAIGN(state, campaign) {
      console.log('Campaign from store', campaign)
      // state.settings.showBrowser = val
      const campaigns = state.campaigns
      let camp
      for (let i = 0; i < campaigns.length; i++) {
        camp = campaigns[i]
        if (camp.id === campaign.id) {
          state.campaigns.splice(i, 1)
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    SET_CURRENT_CAMPAIGN(state, campaign) {
      state.currentCampaign = campaign
    },
    SET_CAMPAIGN_TEXT(state, text) {
      state.campaignText = text
    },
    SET_MESSAGES(state, messages) {
      state.settings.messages = messages
    },
    ADD_MESSAGE(state, message) {
      // state.settings.messages.push(message)
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.settings.messages.push(message)
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    EDIT_MESSAGE(state, message) {
      // state.settings.messages.push(message)
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.settings.messages.splice(
            state.activeEditMessageIndex,
            1,
            message,
          )
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    DELETE_MESSAGE(state, index) {
      // state.settings.messages.push(message)
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.settings.messages.splice(index, 1)
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    SET_WA_ACCOUNT(state, account) {
      // state.settings.account = account
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.settings.account = account
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    SET_SETTINGS_NUMBERS(state, numbers) {
      // state.settings.numbers = numbers
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.settings.numbers = numbers
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    SET_MIN(state, min) {
      // state.settings.delay.min = min
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.settings.delay.min = min
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    SET_MAX(state, max) {
      // state.settings.delay.max = max
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.settings.delay.max = max
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    SET_SHOW_BROWSER(state, val) {
      // state.settings.showBrowser = val
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.settings.showBrowser = val
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    SET_CAMPAIGN_DATE(state, val) {
      // state.settings.showBrowser = val
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.settings.scheduleCampaignDate = val
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    SET_CAMPAIGN_TIME(state, val) {
      // state.settings.showBrowser = val
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.settings.scheduleCampaignTime = val
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    UPDATE_STATUS(state, status) {
      // state.settings.showBrowser = val
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.status = status
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    SET_CAMPAIGN_BOT(state, botTitle) {
      // state.settings.showBrowser = val
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) {
          campaign.settings.bot = botTitle
          state.currentCampaign = campaign
        }
      }
      ipcRenderer.send('set-campaigns', state.campaigns)
    },
    SET_MESSAGE_DIALOG(state, status) {
      state.messageDialog = status
    },
    SET_ACTIVE_EDIT_MESSAGE(state, message) {
      state.activeEditMessage = message
    },
    SET_ACTIVE_EDIT_MESSAGE_INDEX(state, index) {
      state.activeEditMessageIndex = index
    },
    SET_INTERVAL(state, interval) {
      state.interval = interval
    },
    ADD_SCHEDULED_NUMBERS(state, number) {
      state.scheduledNumbers.push(number)
      // TODO: COME BACK TO REMOVE DUPLICATES
      ipcRenderer.send('set-scheduled-numbers', state.scheduledNumbers)
    },
    SET_SCHEDULED_NUMBERS(state, numbers) {
      state.scheduledNumbers = numbers
      // TODO: COME BACK TO REMOVE DUPLICATES
    },
    ADD_SUCCESSFUL_NUMBERS(state, number) {
      state.successfulNumbers.push(number)
      // TODO: COME BACK TO REMOVE DUPLICATES
      ipcRenderer.send('set-successful-numbers', state.successfulNumbers)
    },
    SET_SUCCESSFUL_NUMBERS(state, numbers) {
      state.successfulNumbers = numbers
      // TODO: COME BACK TO REMOVE DUPLICATES
    },
    IMPORT_CONTACTS(state, contacts) {
      state.contacts = contacts
      ipcRenderer.send('set-contacts', state.contacts)
    },
    ADD_CONTACT(state, contact) {
      state.contacts.push(contact)
      // TODO: COME BACK TO REMOVE DUPLICATES
      ipcRenderer.send('set-contacts', state.contacts)
    },
    SET_CONTACTS(state, contacts) {
      state.contacts = contacts
      // TODO: COME BACK TO REMOVE DUPLICATES
    },
    EDIT_CONTACT(state, contact) {
      const editedIndex = state.contacts.findIndex((o) => o.id === contact.id)
      if (editedIndex !== -1) state.contacts.splice(editedIndex, 1, contact)
      ipcRenderer.send('set-contacts', state.contacts)
    },
    DELETE_CONTACT(state, contact) {
      const editedIndex = state.contacts.findIndex((o) => o.id === contact.id)
      if (editedIndex !== -1) state.contacts.splice(editedIndex, 1)
      ipcRenderer.send('set-contacts', state.contacts)
    },
    DELETE_CONTACTS(state, contacts) {
      let contact
      for (let i = 0; i < contacts.length; i++) {
        contact = contacts[i]
        const editedIndex = state.contacts.findIndex((o) => o.id === contact.id)
        if (editedIndex !== -1) state.contacts.splice(editedIndex, 1)
      }
      ipcRenderer.send('set-contacts', state.contacts)
    },
  },
  actions: {},
  getters: {
    campaignDialog: (state) => state.campaignDialog,
    campaigns: (state) => state.campaigns,
    currentCampaign: (state) => state.currentCampaign,
    campaignText: (state) => state.campaignText,
    settings: (state) => {
      const campaigns = state.campaigns
      let campaign
      for (let i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i]
        if (campaign.id === state.currentCampaign.id) return campaign.settings
      }
    },
    messageDialog: (state) => state.messageDialog,
    activeEditMessage: (state) => state.activeEditMessage,
    interval: (state) => state.interval,
    contacts: (state) => state.contacts,
    scheduledNumbers: (state) => state.scheduledNumbers,
    successfulNumbers: (state) => state.successfulNumbers,
  },
}
