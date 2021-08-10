<template>
  <v-dialog
    v-model="control"
    overlay-color="black"
    class="ma-0"
    max-width="400"
    :retain-focus="false"
  >
    <v-card flat class="pa-4" color="card">
      <v-card-title class="pb-6">
        <span class="headline">Edit {{ skill.title }} </span>
      </v-card-title>

      <v-card-text>
        <v-form ref="skillForm" v-model="valid">
          <AppInput
            v-model="edited"
            :rules="skillRules"
            :hint="
              readonly
                ? 'Default Skill. Cannot be edited or deleted'
                : 'New title or name of this skill'
            "
            label="Bot Username"
            :readonly="readonly"
            :appendIcon="emojiIcon"
            @emoji="addEmoji"
          />
          <v-checkbox
            v-if="!readonly"
            class="ma-0"
            v-model="isMenu"
            color="primary"
            :label="`Make this skill a default menu`"
          ></v-checkbox>
        </v-form>
        <v-card color="card" outlined>
          <v-row>
            <v-col
              v-for="(color, index) in skillColors"
              :key="index"
              cols="4"
              sm="2"
            >
              <v-card
                v-ripple
                style="cursor: pointer"
                width="34"
                height="34"
                class="d-flex justify-center rounded-circle px-auto"
                :class="color.class"
                @click="pickColor(color.color)"
              >
                <v-icon v-if="editedColor === color.color" small
                  >mdi-check-bold</v-icon
                >
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="appPink" text @click="closeDialog"> Cancel </v-btn>
        <v-btn color="primary" :disabled="!valid" text @click="saveEdited">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      edited: '',
      editedColor: 'accent',
      valid: false,
      isMenu: false,
      skillColors: [
        {
          class: 'primary',
          color: 'primary',
        },
        {
          class: 'error',
          color: 'error',
        },
        {
          class: 'info',
          color: 'info',
        },
        {
          class: 'success',
          color: 'success',
        },
        {
          class: 'warning',
          color: 'warning',
        },
        {
          class: 'secondary ',
          color: 'card',
        },
      ],
      skillRules: [
        (v) => /[^\s]/.test(v) || 'This field is required',
        (v) => (v && v.length >= 2) || 'Must be more than 2 characters',
      ],
    }
  },
  computed: {
    ...mapGetters({
      editSkillControl: 'skill/editSkillControl',
      skill: 'skill/currentEditSkill',
    }),
    control: {
      get() {
        return this.editSkillControl
      },
      set(val) {
        this.$store.dispatch('skill/toggleEditSkillControl', val)
      },
    },
    readonly() {
      let readonly = false
      if (this.skill.title === 'start') {
        readonly = true
      }
      return readonly
    },
    emojiIcon() {
      return this.skill.title === 'start' ? '' : 'mdi-emoticon-cool-outline'
    },
  },

  watch: {
    editSkillControl(newValue) {
      if (!newValue) {
        this.resetForm()
        this.editedColor = ''
        this.isMenu = false
        this.$store.commit('skill/SET_CURRENT_EDIT_SKILL', '')
      } else if (newValue) {
        this.editedColor = this.skill.color
        this.edited = this.skill.title
        this.isMenu = this.skill.isMenu
      }
    },
  },
  methods: {
    addEmoji(val) {
      this.edited = this.edited + val.native
    },
    resetForm() {
      this.$refs.skillForm.reset()
    },
    pickColor(color) {
      this.editedColor = color
    },
    saveEdited() {
      this.$store.dispatch('skill/updateEditedSkill', {
        skill: this.skill,
        edited: this.edited,
        isMenu: this.isMenu,
        editedColor: this.editedColor,
      })
      this.$store.commit('skill/TOGGLE_EDIT_SKILL_CONTROL', false)
    },
    closeDialog() {
      this.$store.commit('skill/TOGGLE_EDIT_SKILL_CONTROL', false)
    },
  },
}
</script>

<style scoped>
.v-input__slot {
  align-items: center;
  color: inherit;
  display: flex;
  margin-bottom: 0px;
  min-height: inherit;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  width: 100%;
}
</style>
