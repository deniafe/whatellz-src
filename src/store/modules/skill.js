// import { skillMenu } from '@/utils/menu'
import { skill } from '@/utils/skill'
// import notific from '@/utils/notificFunc'
// import router from '@/router/index.js'
import { ipcRenderer } from 'electron'

export default {
  namespaced: true,
  state: () => {
    return {
      skillControl: false,
      editSkillControl: false,
      // skillMenu: skillMenu(),
      skills: [],
      currentSkill: null,
      currentEditSkill: '',
    }
  },
  mutations: {
    TOGGLE_SKILL_CONTROL(state, status) {
      state.skillControl = status
    },
    TOGGLE_EDIT_SKILL_CONTROL(state, status) {
      state.editSkillControl = status
    },
    SET_SKILLS(state, skills) {
      state.skills = skills
    },
    // This ha sbeen taken away from the store directly to the database
    ADD_SKILL(state, newSkill) {
      state.skills.push(newSkill)
      ipcRenderer.send('set-skills', state.skills)
    },
    EDIT_SKILL(state, skill) {
      // state.settings.showBrowser = val
      const skills = state.skills
      let ski
      for (let i = 0; i < skills.length; i++) {
        ski = skills[i]
        if (ski.id === skill.id) {
          state.skills.splice(i, 1, skill)
        }
      }
      ipcRenderer.send('set-skills', state.skills)
    },
    DELETE_SKILL(state, skill) {
      // state.settings.showBrowser = val
      const skills = state.skills
      let ski
      for (let i = 0; i < skills.length; i++) {
        ski = skills[i]
        if (ski.id === skill.id) {
          state.skills.splice(i, 1)
        }
      }
      ipcRenderer.send('set-skills', state.skills)
    },
    SET_CURRENT_SKILL(state, skill) {
      state.currentSkill = skill
    },
    SET_CURRENT_EDIT_SKILL(state, skill) {
      state.currentEditSkill = skill
    },
    // EDIT_SKILL(state, { skill, val }) {
    //   for (let i = 0; i < state.skills.length; i++) {
    //     if (skill === state.skills[i]) {
    //       state.skills[i].title = val.title
    //       state.skills[i].isMenu = val.isMenu
    //     }
    //   }
    // },
  },
  actions: {
    // eslint-disable-next-line prettier/prettier
    // createSkill({
    //   state,
    //   commit
    // }, newSkill) {
    //   const botId = state.currentBot.id
    //   db.collection('skills')
    //     .add({
    //       title: newSkill.title,
    //       botId,
    //       isMenu: false,
    //       createdAt: new Date()
    //     })
    //     .then(doc => {
    //       commit('ADD_SKILLS', {
    //         title: newSkill.title,
    //         id: doc.id,
    //         isMenu: false,
    //         createdAt: newSkill.createdAt,
    //         actions: []
    //       })
    //     })
    // },
    // getSkills({ commit, rootGetters }, data) {
    //   // this.skillLoading = true
    //   // let botId = this.currentBot.id
    //   const botId = rootGetters['bot/currentBotId']
    //   // eslint-disable-next-line no-console
    //   console.log(botId)
    //   const skillsUpdate = []
    //   const skill = {
    //     botId: data.botId,
    //     title: data.title,
    //     isMenu: data.isMenu,
    //     color: data.color,
    //     actions: data.actions,
    //   }
    //   skillsUpdate.push(skill)
    //   commit('SET_CURRENT_SKILL', skill)
    // },
    // eslint-disable-next-line no-empty-pattern
    updateEditedSkill({ commit }, { skill, edited, isMenu, editedColor }) {
      skill.color = editedColor
      skill.isMenu = isMenu
      skill.title = edited
      commit('EDIT_SKILL', skill)
    },
    addSkill({ rootGetters, commit }, { title }) {
      const newSkill = skill()
      const botId = rootGetters['bot/currentBot'].id
      const botNum = rootGetters['bot/currentBot'].number
      newSkill.title = title
      newSkill.color = 'card'
      newSkill.isMenu = false
      newSkill.botId = botId
      newSkill.botNum = botNum
      newSkill.createdAt = new Date()
      console.log(newSkill)
      commit('ADD_SKILL', newSkill)
      commit('SET_CURRENT_SKILL', newSkill)
    },
    deleteSkill({ dispatch, commit }, skill) {
      dispatch('app/setConfirmDialog', false, {
        root: true,
      })
      dispatch('app/setDeleteAction', '', {
        root: true,
      })
      dispatch('app/setDeleteItem', '', {
        root: true,
      })
      commit('DELETE_SKILL', skill)
    },
  },
  getters: {
    skillControl: (state) => state.skillControl,
    editSkillControl: (state) => state.editSkillControl,
    skillMenu: (state) => state.skillMenu,
    // skills: (state, getters, rootState, rootGetters) => {
    //   const botId = rootGetters['bot/currentBot'].id
    //   const skills = state.skills.filter((skill) => skill.botId === botId)
    //   return skills
    // },
    skills: (state) => state.skills,
    currentSkill: (state) => state.currentSkill,
    currentEditSkill: (state) => state.currentEditSkill,
  },
}
