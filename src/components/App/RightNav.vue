<template>
  <v-card>
    <v-navigation-drawer
      v-model="panel"
      color="card"
      width="350"
      right
      app
      :permanent="rightPanel"
      temporary
    >
      <v-toolbar color="card" dark flat>
        <v-btn icon>
          <v-icon color="error" @click="toggleControl">mdi-window-close</v-icon>
        </v-btn>

        <v-toolbar-title v-if="currentActionMenu">{{
          currentActionMenu.title
        }}</v-toolbar-title>

        <v-toolbar-title v-if="currentAction">{{
          currentAction.title
        }}</v-toolbar-title>
      </v-toolbar>
      <v-card flat color="transparent">
        <v-form ref="editorForm" v-model="valid">
          <v-row class="mt-0 pt-1 mx-2 mb-0">
            <v-col v-if="actionMenu" class="py-0 pt-6 pb-4" cols="12">
              <AppSelectInput
                :items="currentActionMenu.items"
                @input="updateSelectType"
              />
            </v-col>

            <v-col v-if="currentActionMenu" class="py-0 pb-4" cols="12">
              <AppSelectInput
                v-if="currentActionMenu && selectType === 'Text Messages'"
                :label="'Dynamic Values'"
                :items="variables"
                :hint="'Use dynamic values to customize messages to your users'"
                @input="addVariable"
              />
              <!-- Send Message Create Actions -->
              <AppTextArea
                v-if="currentActionMenu && selectType === 'Text Messages'"
                :rules="textRules"
                :value="body.text"
                @input="updateText"
                @emoji="addEmoji"
              />

              <div
                v-else-if="currentActionMenu && selectType === 'Images'"
                style="width: 250px; height: 150px"
                class="mx-auto"
              >
                <AppUpload
                  v-model="imageFile"
                  :accept="'image/x-png,image/gif,image/jpeg'"
                  :label="'Upload Image'"
                />
              </div>
              <AppUpload
                v-if="currentActionMenu && selectType === 'Documents'"
                v-model="documentFile"
                :accept="'.txt'"
                :label="'Upload Documents'"
              />
            </v-col>

            <v-col v-if="currentAction" class="py-0 pb-4" cols="12">
              <div
                v-if="currentAction && currentAction.title === 'Images'"
                style="width: 250px; height: 150px"
                class="mx-auto"
              >
                <AppUpload
                  v-model="imageFile"
                  :accept="'image/x-png,image/gif,image/jpeg'"
                  :label="'Upload Image'"
                />
              </div>
              <AppUpload
                v-else-if="currentAction && currentAction.title === 'Documents'"
                v-model="documentFile"
                :accept="'image/x-png,image/gif,image/jpeg'"
                :label="'Upload Image'"
              />
            </v-col>

            <v-col class="py-0 pb-2" cols="12">
              <v-btn
                v-if="currentActionMenu && selectType === 'Text Messages'"
                text
                @click="inlineImage = !inlineImage"
              >
                <v-icon color="primary">mdi-plus</v-icon>
                <small>{{ imageButtonText }}</small>
              </v-btn>
            </v-col>
            <v-slide-y-transition>
              <v-col
                v-if="
                  currentActionMenu &&
                  selectType === 'Text Messages' &&
                  inlineImage
                "
                cols="12"
              >
                <AppUpload
                  v-model="textImage"
                  :accept="'image/x-png,image/gif,image/jpeg'"
                  :label="'Upload Image'"
                />
              </v-col>
            </v-slide-y-transition>

            <!-- Edit Message Actions Beginning -->
            <v-col
              v-if="currentAction && currentAction.title === 'Text Messages'"
              cols="12"
            >
              <AppSelectInput
                :label="'Dynamic Values'"
                :items="variables"
                :hint="'Use dynamic values to customize messages to your users'"
                @input="addVariable"
              />
              <AppTextArea
                :value="body.text"
                @input="updateText"
                @emoji="addEmoji"
              />
            </v-col>

            <v-col class="py-0 pb-2" cols="12">
              <v-btn
                v-if="currentAction && currentAction.title === 'Text Messages'"
                text
                @click="inlineImage = !inlineImage"
              >
                <v-icon color="primary">mdi-plus</v-icon>
                <small>{{ imageButtonText }}</small>
              </v-btn>
            </v-col>
            <v-slide-y-transition>
              <v-col
                v-if="
                  currentAction &&
                  currentAction.title === 'Text Messages' &&
                  inlineImage
                "
                cols="12"
              >
                <AppUpload
                  v-model="textImage"
                  :accept="'image/x-png,image/gif,image/jpeg'"
                  :label="'Upload Image'"
                />
              </v-col>
            </v-slide-y-transition>
            <!-- End of edit message actions -->
          </v-row>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="closeEditor"> Cancel </v-btn>
          <v-btn
            v-if="actionMenu"
            color="primary"
            :disabled="!valid"
            text
            @click="addAction"
          >
            Save
          </v-btn>
          <v-btn
            v-else-if="currentAction"
            color="primary"
            :disabled="!valid"
            text
            @click="editAction"
          >
            UPDATE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { nanoid } from 'nanoid'

export default {
  components: {},
  data() {
    return {
      body: {},
      selectType: null,
      imgUrl: '',
      img: '',
      inlineButton: false,
      inlineImage: false,
      valid: false,
      valid2: false,
      imgl: null,
      buttonMode: false,
      variables: [`ParticipantName`, `ParticipantReferralLink`],
      textRules: [
        (v) => /[^\s]/.test(v) || 'This field is required',
        (v) => (v && v.length >= 2) || 'Must be more than 2 characters',
      ],
    }
  },
  computed: {
    ...mapGetters({
      rightPanel: 'action/rightPanel',
      currentSkill: 'skill/currentSkill',
      actionMenu: 'action/currentActionMenu',
      currentAction: 'action/currentAction',
      currentActionImage: 'action/currentActionImage',
      skills: 'skill/skills',
      currentBot: 'bot/currentBot',
    }),
    panel: {
      get() {
        return this.rightPanel
      },
      set(val) {
        this.$store.commit('action/SET_RIGHT_PANEL', val)
      },
    },
    textImage: {
      get() {
        return this.body.image
      },
      set(file) {
        if (!file) return
        console.log('From textImage: ', file)
        this.body.image = {
          name: file.name,
          path: file.path.replace(/\\/g, '/'),
        }
      },
    },
    imageFile: {
      get() {
        return this.body
      },
      set(file) {
        if (!file) return
        console.log('From imageFile: ', file)
        this.body = {
          name: file.name,
          path: file.path.replace(/\\/g, '/'),
        }
      },
    },
    documentFile: {
      get() {
        return this.body
      },
      set(file) {
        if (!file) return
        console.log('From imageFile: ', file)
        this.body = {
          name: file.name,
          path: file.path.replace(/\\/g, '/'),
        }
      },
    },
    buttonModes() {
      const buttonModes = this.skills.map((skill) => skill.title)
      return buttonModes
    },
    buttonText() {
      let text
      if (this.currentAction && this.currentAction.body.button) {
        if (this.inlineButton) {
          text = 'Hide Button'
        } else {
          text = 'Show Button'
        }
      } else {
        text = 'Add Button'
      }
      return text
    },
    imageButtonText() {
      let text
      if (this.currentAction && this.currentAction.body.image) {
        if (this.inlineImage) {
          text = 'Hide Image'
        } else {
          text = 'Show Image'
        }
      } else {
        text = 'Add Image'
      }
      return text
    },
    currentReward() {
      let reward
      let title
      if (this.currentAction && this.currentAction.title.includes('Reward:')) {
        title = this.currentAction.title.replace('Reward: ', '')
        let current = this.currentBot.rewards.filter((reward) => {
          if (reward.name === title) {
            return reward
          }
        })
        reward = current[0]
      } else if (
        this.currentActionMenu &&
        this.selectType.includes('Reward: ')
      ) {
        title = this.selectType.replace('Reward: ', '')
        let current = this.currentBot.rewards.filter((reward) => {
          if (reward.name === title) {
            return reward
          }
        })
        reward = current[0]
      }
      return reward
    },
    currentActionMenu() {
      let menu = { ...this.actionMenu }

      if (menu.title === 'Show Reward') {
        let rewards = this.currentBot.rewards
        let rewardTitles
        if (rewards) {
          rewardTitles = rewards.map((reward) => `Reward: ${reward.name}`)
        } else {
          rewardTitles = ['You have no rewards yet']
        }
        menu.items = rewardTitles
      }
      return menu
    },
    validImage() {
      let result = true
      if (this.selectType === 'Images' && !this.body.url) {
        result = false
      } else {
        result = true
      }
      return result
    },
  },
  watch: {
    rightPanel(newValue) {
      if (newValue === false) {
        this.selectType = null
        this.body = {}
        this.img = ''
        this.buttonMode = false
        // this.imgUrl = ''
        this.inlineButton = false
        this.inlineImage = false
        this.$store.commit('action/SET_CURRENT_ACTION', null)
        this.$store.commit('action/SET_CURRENT_ACTION_MENU', null)
        this.$store.commit('action/SET_CURRENT_ACTION_IMAGE', {})
        // Reset inputs validation
        this.$refs.editorForm.resetValidation()
      }
    },
    currentActionImage(newValue) {
      if (newValue !== null) {
        if (this.inlineImage) {
          this.body.image = this.currentActionImage
          this.img = this.currentActionImage
        } else {
          this.body = this.currentActionImage
        }
      }
    },
    currentAction(newValue) {
      if (newValue) {
        this.body = { ...this.currentAction.body }
        // Check if the current action opened has text and image together
        // And set the image to a temporary value on this component
        if (this.currentAction.body.image) {
          this.img = this.currentAction.body.image
          this.inlineImage = true
        }
        if (this.currentAction.body.button) {
          this.inlineButton = true
          this.buttonMode = this.isUrl(this.currentAction.body.button.url)
        }
      }
    },
    selectType(newValue) {
      if (newValue && newValue === 'Text Messages') {
        this.body = { text: '' }
      }
    },
  },
  methods: {
    toggleControl() {
      this.$store.commit('action/SET_RIGHT_PANEL', false)
    },
    addAction() {
      this.$store.commit('action/ADD_ACTION', {
        id: nanoid(),
        skillId: this.currentSkill.id,
        title: this.selectType,
        body: this.body,
      })
      this.$store.commit('action/SET_RIGHT_PANEL', false)
    },
    editAction() {
      const editedAction = { ...this.currentAction }

      editedAction.body = this.body
      this.$store.commit('action/EDIT_ACTION', editedAction)
      this.$store.commit('action/SET_RIGHT_PANEL', false)
    },
    updateSelectType(select) {
      this.selectType = select
    },
    updateTextType(body) {
      this.body = body
      // this.selectType = 'Text Messages'
    },
    updateText(val) {
      this.body.text = val
    },
    addVariable(val) {
      this.body.text = this.body.text + '{' + val + '}'
    },
    addEmoji(val) {
      this.body.text = this.body.text + val.native
    },
    addButtonEmoji(val) {
      if (this.body.button) {
        console.log('There is a button')
        const newButton = { ...this.body.button }
        newButton.text = newButton.text + val.native
        this.body.button = newButton
      } else {
        console.log('There is no button')
        this.body.button = {
          text: val.native,
        }
      }
    },
    updateInlineButtonText(val) {
      if (this.body.button) {
        const newButton = { ...this.body.button }
        newButton.text = val
        this.body.button = newButton
      } else {
        this.body.button = {
          text: val,
        }
      }
    },
    updateInlineButtonUrl(val) {
      if (this.body.button) {
        const newButton = { ...this.body.button }
        newButton.url = val
        this.body.button = newButton
      } else {
        this.body.button = {
          url: val,
        }
      }
    },
    //     updateInlineImage(val) {
    //       if (this.body.image) {
    //         this.body.image.url = val.url
    //         this.body.image.name = val.name
    //       } else {
    //         this.body.image = {
    //           url: val.url,
    //           name: val.name,
    //         }
    //       }
    //       // this.selectType = 'Text Messages'
    //     },
    updateFileType(body) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imgUrl = fileReader.result
        // this.imgLabel = 'Change Image'
      })
      fileReader.readAsDataURL(body)
      this.body = body
    },
    editFileType(body) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imgUrl = fileReader.result
        // this.imgLabel = 'Change Image'
      })
      fileReader.readAsDataURL(body)
      this.body = body
    },
    editActionType(body) {
      this.body = body
    },
    closeEditor() {
      this.$store.commit('action/SET_RIGHT_PANEL', false)
    },
    isUrl(url) {
      let result = false
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i',
      ) // fragment locator
      const isUrl = url.match(pattern)
      if (isUrl === null) result = true
      return result
    },
  },
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #150e3a;
}

::-webkit-scrollbar-thumb {
  background: #191547;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #191547;
}
</style>
