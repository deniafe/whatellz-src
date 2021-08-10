<template>
  <v-dialog
    v-model="control"
    overlay-color="black"
    class="ma-0"
    max-width="400"
    :retain-focus="false"
  >
    <v-card flat class="pa-4" color="card">
      <v-card-title>
        <span class="headline">New Skill</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="customSkillForm" v-model="valid">
          <AppInput
            v-model="newCustomSkill"
            :rules="skillRules"
            :hint="'This is the title or name of this skill'"
            label="Skill Title"
            :appendIcon="'mdi-emoticon-cool-outline'"
            @emoji="addEmoji"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="closeDialog"> Cancel </v-btn>
        <v-btn color="primary" :disabled="!valid" text @click="addCustomSkill">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      newCustomSkill: '',
      valid: '',
      skillRules: [
        (v) => /[^\s]/.test(v) || 'This field is required',
        (v) => (v && v.length >= 2) || 'Must be more than 2 characters',
      ],
    }
  },
  computed: {
    ...mapGetters({
      skillControl: 'skill/skillControl',
    }),
    control: {
      get() {
        return this.skillControl
      },
      set(val) {
        this.$store.commit('skill/TOGGLE_SKILL_CONTROL', val)
      },
    },
  },
  methods: {
    addEmoji(val) {
      this.newCustomSkill = this.newCustomSkill + val.native
    },
    resetForm() {
      this.$refs.customSkillForm.reset()
    },
    closeDialog() {
      this.$store.commit('skill/TOGGLE_SKILL_CONTROL', false)
      this.resetForm()
    },
    addCustomSkill() {
      this.$store.dispatch('skill/addSkill', {
        title: this.newCustomSkill,
      })
      this.closeDialog()
      this.resetForm()
    },
  },
}
</script>
