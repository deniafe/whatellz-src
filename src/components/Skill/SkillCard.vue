<template>
  <div>
    <v-card
      height="120"
      width="120"
      :color="skill.color || 'accent'"
      class="mb-2"
      @click="$emit('click')"
      @mouseover="skillOptions = id"
      @mouseout="skillOptions = ''"
    >
      <div class="text-center px-2 pt-8">{{ title }}</div>
      <!-- Icon to edit this skill -->
      <div
        v-show="skillOptions === id"
        style="position: absolute; left: 5px; bottom: 5px"
      >
        <v-fade-transition>
          <v-icon small @click.stop="showEditSkill">mdi-pencil</v-icon>
        </v-fade-transition>
      </div>
      <!-- Icon to delete this skill -->
      <div
        v-show="skillOptions === id"
        style="position: absolute; right: 5px; bottom: 5px"
      >
        <v-fade-transition>
          <v-icon small @click.stop="confirmDelete"
            >mdi-trash-can-outline</v-icon
          >
        </v-fade-transition>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    skill: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      skillOptions: '',
    }
  },
  computed: {
    ...mapGetters({
      actions: 'action/actions',
    }),
  },
  methods: {
    confirmDelete() {
      // Open the dialog pop up
      this.$store.commit('app/SET_DELETE_ACTION', this.deleteSkill)
      this.$store.commit(
        'app/SET_CONFIRMATION_TEXT',
        'Are you sure you want to delete?',
      )
      this.$store.commit(
        'app/SET_CONFIRMATION_SUB_TEXT',
        'Deleting a skill is a permanent action and cannot be reversed',
      )
      this.$store.commit('app/SET_CONFIRMATION_YES', 'Yes Delete')
      this.$store.commit('app/SET_CONFIRMATION_NO', `No Don't delete`)
      this.$store.commit('app/SET_CONFIRM_DIALOG', true)
    },
    deleteSkill() {
      const actions = this.actions.filter(
        (action) => action.skillId === this.skill.id,
      )
      let action
      for (let x = 0; x < actions.length; x++) {
        action = actions[x]
        this.$store.commit('action/DELETE_ACTION', action)
      }
      this.$store.dispatch('skill/deleteSkill', this.skill)
      this.$store.commit('skill/SET_CURRENT_SKILL', '')
    },
    showEditSkill() {
      this.$store.commit('skill/SET_CURRENT_EDIT_SKILL', this.skill)
      this.$store.commit('skill/TOGGLE_EDIT_SKILL_CONTROL', true)
    },
  },
}
</script>

<style scoped></style>
