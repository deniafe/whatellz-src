import { ipcRenderer } from 'electron'

export default {
  namespaced: true,
  state: () => {
    return {
      activeAcc: '',
      whatsappAccounts: [],
      leftDrawer: false,
      confirmDialog: false,
      clearLeadsDialog: false,
      deleteAction: '',
      deleteItem: '',
      confirmationText: '',
      confirmationSubText: '',
      confirmationYes: '',
      confirmationNo: '',
      currentEmoji: '',
      errors: [],
      logs: [],
      currentCollection: '',
      numberGroups: [],
      verifiedNumbers: [],
      waTempGroups: [],
      waGrpDisplayDialog: false,
      interval: '',
      activeVerificationGroup: '',
      activeEditNumbers: '',
      numbersDialog: false,
      verificationDialog: false,
      addNumbersType: '',
      overlayDialog: false,
      overlayDescription: 'Loading',
    }
  },
  mutations: {
    ADD_WHATSAPP_ACCOUNT(state, account) {
      state.whatsappAccounts.push(account)
      ipcRenderer.send('set-accounts', state.whatsappAccounts)
    },
    SET_WHATSAPP_ACCOUNTS(state, accounts) {
      state.whatsappAccounts = accounts
    },
    DELETE_WHATSAPP_ACCOUNT(state, account) {
      // state.settings.showBrowser = val
      const accounts = state.whatsappAccounts
      let acc
      for (let i = 0; i < accounts.length; i++) {
        acc = accounts[i]
        if (acc.id === account.id) {
          state.whatsappAccounts.splice(i, 1)
        }
      }
      ipcRenderer.send('set-accounts', state.whatsappAccounts)
    },
    SET_ACTIVE_QR_CODE(state, acc) {
      state.activeAcc = acc
    },
    SET_LEFT_DRAWER(state, status) {
      if (status) {
        state.leftDrawer = status
        return
      }
      state.leftDrawer = !state.leftDrawer
    },
    SET_CONFIRM_DIALOG(state, status) {
      state.confirmDialog = status
    },
    SET_CLEAR_LEADS_DIALOG(state, status) {
      state.clearLeadsDialog = status
    },
    SET_CONFIRMATION_TEXT(state, text) {
      state.confirmationText = text
    },
    SET_CONFIRMATION_SUB_TEXT(state, text) {
      state.confirmationSubText = text
    },
    SET_CONFIRMATION_YES(state, text) {
      state.confirmationYes = text
    },
    SET_CONFIRMATION_NO(state, text) {
      state.confirmationNo = text
    },
    SET_CURRENT_EMOJI(state, emoji) {
      state.currentEmoji = emoji
    },
    SET_DELETE_ACTION(state, action) {
      state.deleteAction = action
    },
    SET_DELETE_ITEM(state, item) {
      state.deleteItem = item
    },
    SET_ERROR(state, errors) {
      state.errors = errors
    },
    SET_CURRENT_COLLECTION(state, collection) {
      state.currentCollection = collection
    },
    ADD_NUMBERS(state, numberGrp) {
      state.numberGroups.push(numberGrp)
      ipcRenderer.send('set-numbers', state.numberGroups)
    },
    SET_NUMBERS(state, numberGroups) {
      state.numberGroups = numberGroups
    },
    EDIT_NUMBERS(state, numberGroup) {
      // state.settings.messages.push(message)
      const numberGroups = state.numberGroups
      let numberGrp
      for (let i = 0; i < numberGroups.length; i++) {
        numberGrp = numberGroups[i]
        if (numberGroup.id === numberGrp.id) {
          numberGroups.splice(i, 1, numberGroup)
        }
      }
      ipcRenderer.send('set-numbers', state.numberGroups)
    },
    DELETE_NUMBERS(state, numberGroup) {
      // state.settings.messages.push(message)
      const numberGroups = state.numberGroups
      let numberGrp
      for (let i = 0; i < numberGroups.length; i++) {
        numberGrp = numberGroups[i]
        if (numberGroup.id === numberGrp.id) {
          numberGroups.splice(i, 1)
        }
      }
      ipcRenderer.send('set-numbers', state.numberGroups)
    },
    SET_WA_TEMP_NUMBERS(state, waNumberGroups) {
      state.waTempGroups = waNumberGroups
    },
    SET_WA_GRP_DISPLAY_DIALOG(state, status) {
      state.waGrpDisplayDialog = status
    },
    SET_ACTIVE_VERIFICATION_GROUP(state, group) {
      state.activeVerificationGroup = group
    },
    ADD_VERIFIED_NUMBERS(state, number) {
      state.verifiedNumbers.push(number)
    },
    SET_VERIFIED_NUMBERS(state, numbers) {
      state.verifiedNumbers = numbers
    },
    ADD_LOG(state, log) {
      state.logs.push(log)
    },
    SET_INTERVAL(state, interval) {
      state.interval = interval
    },
    SET_NUMBERS_DIALOG(state, status) {
      state.numbersDialog = status
    },
    SET_ACTIVE_EDIT_NUMBERS(state, numbers) {
      state.activeEditNumbers = numbers
    },
    SET_VERIFICATION_DIALOG(state, status) {
      state.verificationDialog = status
    },
    SET_ADD_NUMBERS_TYPE(state, type) {
      state.addNumbersType = type
    },
    SET_OVERLAY_DIALOG(state, status) {
      state.overlayDialog = status
    },
    SET_OVERLAY_DESCRIPTION(state, desc) {
      state.overlayDescription = desc
    },
  },
  actions: {
    setConfirmDialog({ commit }, status) {
      commit('SET_CONFIRM_DIALOG', status)
    },
    setClearLeadsDialog({ commit }, status) {
      commit('SET_CLEAR_LEADS_DIALOG', status)
    },
    setDeleteAction({ commit }, action) {
      commit('SET_DELETE_ACTION', action)
    },
    setDeleteItem({ commit }, item) {
      commit('SET_DELETE_ITEM', item)
    },
  },
  getters: {
    activeAcc: (state) => state.activeAcc,
    accounts: (state) => state.whatsappAccounts,
    leftDrawer: (state) => state.leftDrawer,
    confirmDialog: (state) => state.confirmDialog,
    clearLeadsDialog: (state) => state.clearLeadsDialog,
    confirmationText: (state) => state.confirmationText,
    confirmationSubText: (state) => state.confirmationSubText,
    confirmationYes: (state) => state.confirmationYes,
    confirmationNo: (state) => state.confirmationNo,
    currentEmoji: (state) => state.currentEmoji,
    deleteAction: (state) => state.deleteAction,
    deleteItem: (state) => state.deleteItem,
    errors: (state) => state.errors,
    logs: (state) => state.logs,
    currentCollection: (state) => state.currentCollection,
    numberGroups: (state) => state.numberGroups,
    waTempGroups: (state) => state.waTempGroups,
    waGrpDisplayDialog: (state) => state.waGrpDisplayDialog,
    verifiedNumbers: (state) => state.verifiedNumbers,
    interval: (state) => state.interval,
    activeVerificationGroup: (state) => state.activeVerificationGroup,
    numbersDialog: (state) => state.numbersDialog,
    activeEditNumbers: (state) => state.activeEditNumbers,
    verificationDialog: (state) => state.verificationDialog,
    addNumbersType: (state) => state.addNumbersType,
    overlayDialog: (state) => state.overlayDialog,
    overlayDescription: (state) => state.overlayDescription,
  },
}
