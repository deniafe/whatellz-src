import Vue from 'vue'
import Vuex from 'vuex'
// import user from "@/store/modules/user.js";
import action from '@/store/modules/action.js'
import app from '@/store/modules/app.js'
import auth from '@/store/modules/auth.js'
import bot from '@/store/modules/bot.js'
import campaign from '@/store/modules/campaign.js'
// import lead from "@/store/modules/lead.js";
import notification from '@/store/modules/notification.js'
import skill from '@/store/modules/skill.js'
// import { getRewards } from "@/utils/menu";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  // plugins: [getRewards],
  modules: {
    // user, //Include this module
    action,
    app,
    auth,
    bot,
    campaign,
    // lead,
    notification,
    skill,
  },
})
