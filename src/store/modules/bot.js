// import firebase from 'firebase'
// import { db } from '@/plugins/firebase'
// import { skill } from '@/utils/skill'
import notific from '@/utils/notificFunc'
// import router from '@/router/index.js'
import { ipcRenderer } from 'electron'

export default {
  namespaced: true,
  state: () => {
    return {
      currentBot: '',
      bots: [],
      dialog: false,
      filter: 'all',
    }
  },
  mutations: {
    SET_CURRENT_BOT(state, bot) {
      state.currentBot = bot
    },
    ADD_BOT(state, bot) {
      state.bots.push(bot)
      ipcRenderer.send('set-bots', state.bots)
    },
    SET_BOTS(state, bots) {
      state.bots = bots
    },
    DELETE_BOT(state, bot) {
      // state.settings.showBrowser = val
      const bots = state.bots
      let b
      for (let i = 0; i < bots.length; i++) {
        b = bots[i]
        if (b.id === bot.id) {
          state.bots.splice(i, 1)
        }
      }
      ipcRenderer.send('set-bots', state.bots)
    },
    SET_BOT_DIALOG(state, val) {
      state.dialog = val
    },

    // SET_FILTERED_BOTS(state, status) {
    //   state.filter = status
    // },
  },
  actions: {
    deleteBot({ dispatch }, bot) {
      dispatch('app/setConfirmDialog', false, {
        root: true,
      })
      dispatch('app/setDeleteAction', '', {
        root: true,
      })
      dispatch('app/setDeleteItem', '', {
        root: true,
      })

      ipcRenderer.send('delete-bot', bot)

      notific({
        dispatch,
        message: 'Bot deleted successfully!',
        type: true,
      })
    },
  },
  getters: {
    currentBot: (state) => state.currentBot,
    bots: (state) => state.bots,
    filter: (state) => state.filter,
    dialog: (state) => state.dialog,
  },
}
