<template>
  <v-card
    v-show="showControl"
    id="textControls"
    color="appAccentBlue"
    max-width="350"
    max-height="400"
    class="floating"
    raised
  >
    <v-toolbar id="text-controls-header" color="appAccentBlue" dark flat>
      <!-- This is where the toolbar starts from -->
      <v-toolbar-title v-if="currentActionMenu">{{
        currentActionMenu.title
      }}</v-toolbar-title>

      <v-toolbar-title v-if="currentAction">{{
        currentAction.title
      }}</v-toolbar-title>

      <v-spacer />

      <v-btn icon>
        <v-icon color="appPink" @click="toggleControl">mdi-window-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-row class="ma-0 mt-6 mx-2 mb-0">
      <v-col class="py-0 pb-6" cols="12">
        <AppSelectInput
          v-if="currentActionMenu"
          :items="currentActionMenu.items"
          @select="updateSelectType"
        />
      </v-col>
      <v-col class="py-0 pb-6" cols="12">
        <!-- Send Message Create Actions -->
        <AppTextArea
          v-if="currentActionMenu && selectType === 'Text Messages'"
          @input="updateText"
          @emoji="addEmoji"
        />
        <!-- <AppFileInput
          v-if="currentActionMenu && selectType === 'Images and Gifs'"
          @input="updateTextType"
        /> -->

        <div
          v-else-if="currentActionMenu && selectType === 'Images'"
          style="width: 250px; height: 150px"
          class="mx-auto"
        >
          <AppImageUpload @input="updateTextType" />
        </div>

        <AppFileUpload
          v-else-if="currentActionMenu && selectType === 'Animations'"
          :label="'Click to upload an animation'"
          @input="updateTextType"
        />
        <AppFileUpload
          v-else-if="currentActionMenu && selectType === 'Videos'"
          :label="'Click to upload a video'"
          @input="updateTextType"
        />
        <AppFileUpload
          v-else-if="currentActionMenu && selectType === 'Sounds'"
          :label="'Click to upload a sound'"
          @input="updateTextType"
        />
        <AppFileUpload
          v-else-if="currentActionMenu && selectType === 'Stickers'"
          :label="'Click to upload a sticker'"
          @input="updateTextType"
        />
        <AppFileUpload
          v-else-if="currentActionMenu && selectType === 'Documents'"
          :label="'Click to upload a Document'"
          @input="updateTextType"
        />
        <!-- Buttons Create Actions  -->
        <AppInput
          v-else-if="currentActionMenu && selectType === 'Event Buttons'"
          :label="'Enter Event Url'"
        />
        <AppInput
          v-else-if="currentActionMenu && selectType === 'URL Buttons'"
          :label="'Enter Button Url'"
        />
        <AppInput
          v-if="currentActionMenu && selectType === 'Channel/Group Buttons'"
          :label="'Enter Channel or Group Url'"
        />
        <!-- Send Message Edit actions -->
        <AppTextArea
          v-if="currentAction && currentAction.title === 'Text Messages'"
          :value="currentAction.body.text"
          @input="updateText"
          @emoji="addEmoji"
        />
        <!-- For Update Inline Buttons -->
        <AppInput
          v-if="
            currentAction &&
            currentAction.title === 'Text Messages' &&
            currentAction.body.button
          "
          :value="currentAction.body.button.text"
          @input="updateInlineButtonText"
        />
        <AppInput
          v-if="
            currentAction &&
            currentAction.title === 'Text Messages' &&
            currentAction.body.button
          "
          :value="currentAction.body.button.url"
          :label="'Enter Button Text'"
          @input="updateInlineButtonUrl"
        />
        <div
          v-if="
            currentAction &&
            currentAction.title === 'Text Messages' &&
            currentAction.body.image
          "
          style="width: 250px; height: 150px"
          class="mx-auto"
        >
          <AppImageUpload
            :val="currentAction.body.image.url"
            :name="currentAction.body.image.name"
            @input="updateInlineImage"
          />
        </div>

        <div
          v-else-if="currentAction && currentAction.title === 'Images'"
          style="width: 250px; height: 150px"
          class="mx-auto"
        >
          <AppImageUpload
            :val="currentAction.body.url"
            :name="currentAction.body.name"
            @input="editActionType"
          />
        </div>
        <AppFileUpload
          v-else-if="currentAction && currentAction.title === 'Animations'"
          :val="currentAction.body.url"
          :name="currentAction.body.name"
          @input="editActionType"
        />
        <AppFileUpload
          v-else-if="currentAction && currentAction.title === 'Videos'"
          :label="'Upload Sound or Video'"
          :val="currentAction.body.url"
          :name="currentAction.body.name"
          @input="editActionType"
        />
        <AppFileUpload
          v-else-if="currentAction && currentAction.title === 'Sounds'"
          :label="'Upload Sound or Video'"
          :val="currentAction.body.url"
          :name="currentAction.body.name"
          @input="editActionType"
        />
        <AppFileUpload
          v-else-if="currentAction && currentAction.title === 'Stickers'"
          :label="'Upload Smiley or Sticker'"
          :val="currentAction.body.url"
          :name="currentAction.body.name"
          @input="editActionType"
        />
        <AppFileUpload
          v-else-if="currentAction && currentAction.title === 'Documents'"
          :label="'Upload Document'"
          :val="currentAction.body.url"
          :name="currentAction.body.name"
          @input="editActionType"
        />
      </v-col>

      <!-- Small buttons to add buttons and images to text -->
      <v-col class="py-0 pb-2" cols="12">
        <v-btn
          v-if="currentActionMenu && selectType === 'Text Messages'"
          text
          @click="inlineButton = true"
        >
          <v-icon color="appBlue">mdi-plus</v-icon>
          <small>Add Button</small>
        </v-btn>
      </v-col>
      <!-- For Update Inline Buttons -->
      <v-col
        v-if="
          currentActionMenu && selectType === 'Text Messages' && inlineButton
        "
        cols="12"
      >
        <AppInput
          :label="'Enter Button Text'"
          @input="updateInlineButtonText"
        />
      </v-col>
      <v-col
        v-if="
          currentActionMenu && selectType === 'Text Messages' && inlineButton
        "
        cols="12"
      >
        <AppInput :label="'Enter Button Url'" @input="updateInlineButtonUrl" />
      </v-col>
      <v-col class="py-0 pb-2" cols="12">
        <v-btn
          v-if="currentActionMenu && selectType === 'Text Messages'"
          text
          @click="inlineImage = true"
        >
          <v-icon color="appBlue">mdi-plus</v-icon>
          <small>Add Image</small>
        </v-btn>
      </v-col>
      <v-col
        v-if="
          currentActionMenu && selectType === 'Text Messages' && inlineImage
        "
        cols="12"
      >
        <AppImageUpload @input="updateInlineImage" />
      </v-col>

      <!-- The save and edit buttons -->
      <v-col cols="12">
        <div class="text-center pb-2">
          <AppButton
            v-if="currentActionMenu"
            :text="'Create'"
            :width="300"
            @click="addAction"
          />
          <AppButton
            v-else-if="currentAction"
            :text="'Edit'"
            :width="300"
            @click="editAction"
          />
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { action } from '@/utils/skill'
import firebase from 'firebase'

const db = firebase.firestore()

export default {
  components: {},
  data() {
    return {
      body: {},
      selectType: null,
      imgUrl: '',
      inlineButton: false,
      inlineImage: false,
    }
  },
  computed: {
    ...mapGetters({
      showControl: 'action/actionControl',
      currentSkill: 'skill/currentSkill',
      currentActionMenu: 'action/currentActionMenu',
      currentAction: 'action/currentAction',
      currentEmoji: 'app/currentEmoji',
    }),
  },
  mounted() {
    // Make the DIV element draggagle:
    this.dragElement(document.querySelector('#textControls'))
    // var e = document.querySelector('.theme--dark.v-list')
  },
  methods: {
    dragElement(elmnt) {
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      // if (document.getElementById(elmnt.id + '-header')) {
      //   /* if present, the header is where you move the DIV from:*/
      //   document.getElementById(
      //     elmnt.id + '-header',
      //   ).onmousedown = dragMouseDown
      // } else {
      /* otherwise, move the DIV from anywhere inside the DIV: */
      elmnt.onmousedown = dragMouseDown
      // }

      function dragMouseDown(e) {
        e = e || window.event
        e.preventDefault()
        // get the mouse cursor position at startup:
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
      }

      function elementDrag(e) {
        e = e || window.event
        e.preventDefault()
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + 'px'
        elmnt.style.left = elmnt.offsetLeft - pos1 + 'px'
      }

      function closeDragElement() {
        /* stop moving when mouse button is released: */
        document.onmouseup = null
        document.onmousemove = null
      }
    },
    toggleControl() {
      this.selectType = null
      this.$store.commit('action/TOGGLE_ACTION_CONTROL')
      this.$store.commit('assetManager/SET_SELECTED_FILE', '')
    },
    addAction() {
      const newAction = action()
      newAction.title = this.selectType
      newAction.body = this.body
      const skillRef = db.collection('skills').doc(this.currentSkill.id)
      skillRef.update({
        actions: firebase.firestore.FieldValue.arrayUnion(newAction),
      })
      this.toggleControl()
    },
    editAction() {
      const editedAction = { ...this.currentAction }

      editedAction.body = { ...this.body }
      this.$store.commit('action/EDIT_ACTION', {
        skill: this.currentSkill,
        action: editedAction,
      })
      console.log(this.currentSkill.actions)
      console.log(editedAction)

      const skillRef = db.collection('skills').doc(this.currentSkill.id)
      // skillRef.update({
      //   actions: firebase.firestore.FieldValue.arrayRemove(this.currentAction),
      // })
      // let editedAction = { ...this.currentAction }

      // editedAction.body = { ...this.body }

      skillRef.update({
        // actions: firebase.firestore.FieldValue.arrayUnion(editedAction),
        actions: this.currentSkill.actions,
      })

      this.toggleControl()
      this.$store.commit('action/CLEAR_ACTION')
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
    addEmoji(val) {
      this.body = this.body + val
    },
    updateInlineButtonText(val) {
      if (this.body.button) {
        this.body.button.text = val
      } else {
        this.body.button = {
          text: val,
        }
      }
    },
    updateInlineButtonUrl(val) {
      if (this.body.button) {
        this.body.button.url = val
      } else {
        this.body.button = {
          url: val,
        }
      }
      // this.selectType = 'Text Messages'
    },
    updateInlineImage(val) {
      if (this.body.image) {
        this.body.image.url = val.url
        this.body.image.name = val.name
      } else {
        this.body.image = {
          url: val.url,
          name: val.name,
        }
      }
      // this.selectType = 'Text Messages'
    },
    updateFileType(body) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imgUrl = fileReader.result
        // this.imgLabel = 'Change Image'
        console.log(this.imgUrl)
      })
      fileReader.readAsDataURL(body)
      this.body = body
    },
    editFileType(body) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imgUrl = fileReader.result
        // this.imgLabel = 'Change Image'
        console.log(this.imgUrl)
      })
      fileReader.readAsDataURL(body)
      this.body = body
    },
    editActionType(body) {
      this.body = body
    },
  },
}
</script>

<style scoped>
#textControls {
  position: absolute;
  z-index: 10;
  top: 80px;
  right: 20px;
  overflow-y: scroll;
}

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
