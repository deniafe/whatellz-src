<template>
  <!-- <v-container> -->
  <v-card flat tile class="px-8 py-10" color="secondary">
    <v-row v-if="!skillLoading" wrap>
      <v-col v-for="skill in botSkills" :key="skill.id" cols="6" sm="3" md="2">
        <div class="skill-card" @click="toggleTab(skill.id)">
          <v-fade-transition>
            <SkillCard
              :id="skill.id"
              :title="skill.title"
              :skill="skill"
              @click="setCurrentSkill(skill)"
            />
          </v-fade-transition>
          <div id="workflow-arrow">
            <v-icon
              v-if="show === skill.id"
              small
              :color="skill.color === 'card' ? 'primary' : skill.color"
              >mdi-menu-up</v-icon
            >
          </div>
        </div>
        <v-slide-y-transition>
          <div
            v-if="show === skill.id"
            ref="actionTab"
            :style="actionTabStyle"
            class="pl-1"
          >
            <v-row class="mx-2">
              <v-col
                v-for="(action, index) in skillActions"
                :key="action.id"
                cols="6"
                sm="3"
                md="2"
              >
                <TextAction
                  :id="action.id"
                  :index="index"
                  :title="action.title"
                  :action="action"
                  @click="editAction(action)"
                />
              </v-col>
              <v-col cols="6" sm="3" md="2">
                <NewAction />
              </v-col>
            </v-row>
          </div>
        </v-slide-y-transition>

        <v-slide-y-transition>
          <div
            v-if="show === skill.id"
            id="placeholder"
            style="min-height: 100px; width: 100%"
          >
            <v-row class="mx-0 px-0">
              <v-col
                v-for="action in skill.actions"
                :key="action.id"
                class="mx-0 px-0"
                cols="6"
                sm="3"
                md="2"
              >
                <div style="height: 60px"></div>
              </v-col>
              <v-col cols="6" sm="3" md="2">
                <div style="height: 60px"></div>
              </v-col>
            </v-row>
          </div>
        </v-slide-y-transition>
      </v-col>

      <v-col cols="6" sm="3" md="2">
        <div ref="action">
          <NewSkill @click="show = null" />
        </div>
      </v-col>
    </v-row>
    <div class="text-center">
      <v-progress-circular
        v-if="skillLoading"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
  </v-card>
  <!-- </v-container> -->
</template>

<script>
import { mapGetters } from 'vuex'
import SkillCard from '@/components/Skill/SkillCard'
import NewSkill from '@/components/Skill/NewSkill'
import NewAction from '@/components/Action/NewAction'
import TextAction from '@/components/Action/TextAction'
export default {
  components: {
    SkillCard,
    NewAction,
    TextAction,
    NewSkill,
  },
  data() {
    return {
      show: null,
      skillLoading: false,
    }
  },
  computed: {
    ...mapGetters({
      skills: 'skill/skills',
      actions: 'action/actions',
      currentAction: 'action/currentAction',
      currentBot: 'bot/currentBot',
      currentSkill: 'skill/currentSkill',
      currentBotId: 'bot/currentBotId',
    }),
    actionTabStyle() {
      // const color = skillColor === 'accent' ? 'appBlue' : skillColor
      const style = {
        minHeight: '100px',
        width: '77vw',
        left: '3%',
        position: 'absolute',
        backgroundColor: '#1e3530',
        borderTop: `3px #00af9c solid`,
        zIndex: 1,
      }
      return style
    },
    botSkills() {
      const skills = this.skills.filter((skill) => {
        if (skill.botId === this.currentBot.id) {
          return skill
        }
      })
      return skills
    },
    skillActions() {
      const actions = this.actions.filter((action) => {
        if (action.skillId === this.currentSkill.id) {
          return action
        }
      })
      return actions
    },
    calculateHeight() {
      return this.$refs.action.clientHeight
    },
  },
  methods: {
    setCurrentSkill(skill) {
      this.$store.commit('skill/SET_CURRENT_SKILL', skill)
    },
    toggleTab(id) {
      if (this.show === id) {
        this.show = null
      } else {
        this.show = id
      }
    },
    editAction(action) {
      if (!this.currentAction) {
        this.$store.commit('action/CLEAR_ACTION_MENU')
        this.$store.commit('action/CLEAR_ACTION')
        this.$store.commit('action/SET_CURRENT_ACTION', action)
      } else if (this.currentAction && action.id !== this.currentAction.id) {
        this.$store.commit('action/CLEAR_ACTION_MENU')
        this.$store.commit('action/SET_CURRENT_ACTION', action)
      } else if (this.currentAction && action.id === this.currentAction.id) {
        this.$store.commit('action/CLEAR_ACTION_MENU')
      }
      this.$store.commit('action/SET_RIGHT_PANEL', true)
    },
  },
}
</script>

<style scoped>
#body {
  padding-left: 40px;
  padding-top: 30px;
  background: #150e3a;
}
#actions-tab {
  min-height: 100px;
  width: 80vw;
  left: -5%;
  position: absolute;
  background-color: #191547;
  border-top: 3px #00a2ff solid;
  z-index: 5;
}
#placeholder {
  width: 80vw;
  left: -5%;
  background-color: transparent;
}
#add-action {
  border: dashed 1px #bac5d4;
}
#workflow-arrow {
  position: absolute;
  bottom: -16px;
  left: 30%;
}
.skill-card {
  position: relative;
}
</style>
