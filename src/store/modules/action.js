// import firebase from 'firebase'
import { actionMenu } from '@/utils/menu'
import { action } from '@/utils/skill'
// import notific from '@/utils/notificFunc'
import { ipcRenderer } from 'electron'

export default {
  namespaced: true,
  state: () => {
    return {
      actionMenu: actionMenu(),
      rightPanel: false,
      actionControl: false,
      currentAction: null,
      currentActionMenu: null,
      currentActionImage: {},
      actions: [],
    }
  },
  mutations: {
    SET_RIGHT_PANEL(state, status) {
      state.rightPanel = status
    },
    TOGGLE_ACTION_CONTROL(state) {
      state.actionControl = !state.actionControl
    },
    ADD_ACTION(state, action) {
      state.actions.push(action)
      ipcRenderer.send('set-actions', state.actions)
    },
    SET_ACTIONS(state, actions) {
      state.actions = actions
    },
    SET_CURRENT_ACTION(state, action) {
      state.currentAction = action
    },
    SET_CURRENT_ACTION_MENU(state, actionMenu) {
      state.currentActionMenu = actionMenu
    },
    CLEAR_ACTION_MENU(state) {
      state.currentActionMenu = null
    },
    CLEAR_ACTION(state) {
      state.currentAction = null
    },
    SET_CURRENT_ACTION_IMAGE(state, file) {
      state.currentActionImage = file
    },
    //   // This has been moved to the database
    //   ADD_ACTION(state, { title, body }) {
    //     const skill = state.currentSkill
    //     const newAction = action()
    //     newAction.title = title
    //     newAction.body = body
    //     skill.actions.push(newAction)
    //     state.currentAction = newAction
    //   },
    //   // This has been moved to the database
    EDIT_ACTION(state, action) {
      const actions = state.actions
      console.log('action from the store', action)
      let act
      for (let i = 0; i < actions.length; i++) {
        act = actions[i]
        console.log('act id in store', act.id)
        console.log('action id in store', action.id)
        if (action.id === act.id) {
          console.log(
            'Got the same id for this so I will change the data for it',
          )
          state.actions.splice(i, 1, action)
        }
      }
      ipcRenderer.send('set-actions', state.actions)
    },
    DELETE_ACTION(state, action) {
      const actions = state.actions
      for (let i = 0; i < actions.length; i++) {
        if (action.id === actions[i].id) {
          state.actions.splice(i, 1)
        }
      }
      ipcRenderer.send('set-actions', state.actions)
    },
  },
  actions: {
    addAction({ commit, rootGetters }, { selectType, body }) {
      const newAction = action()
      const currentSkill = rootGetters['skill/currentSkill']
      newAction.title = selectType
      newAction.body = body
      currentSkill.actions.push(newAction)
      const skills = rootGetters['skill, skills']
      ipcRenderer.send('set-skills', skills)
      commit('SET_RIGHT_PANEL', false)
    },
    editAction({ commit, rootGetters }, data) {
      commit('EDIT_ACTION', data)
      let skills = rootGetters['skill/skills']
      // let actions = currentSkill.actions
      // let index = actions.findIndex(function (o) {
      //   return o.id === data.id
      // })
      // if (index !== -1) actions.splice(index, 1, data)

      // currentSkill = actions

      ipcRenderer.send('set-skills', skills)
      commit('SET_RIGHT_PANEL', false)
      commit('CLEAR_ACTION')
    },
    //   setCurrentActionImage({ commit }, file) {
    //     commit('SET_CURRENT_ACTION_IMAGE', file)
    //   },
    deleteAction({ rootGetters, commit }, action) {
      let currentSkill = rootGetters['skill/currentSkill']
      commit('DELETE_ACTION', { skill: currentSkill, action })
      const skills = rootGetters['skill/skills']
      // let actions = currentSkill.actions
      // let index = actions.findIndex(function (o) {
      //   return o.id === action.id
      // })
      // if (index !== -1) actions.splice(index, 1)

      // currentSkill = actions

      // commit('DELETE_ACTION', { action, actions: currentSkill.actions })
      ipcRenderer.send('set-skills', skills)
    },
  },
  getters: {
    rightPanel: (state) => state.rightPanel,
    actionControl: (state) => state.actionControl,
    actionMenu: (state) => state.actionMenu,
    actions: (state) => state.actions,
    currentAction: (state) => state.currentAction,
    currentActionMenu: (state) => state.currentActionMenu,
    currentActionImage: (state) => state.currentActionImage,
  },
}
