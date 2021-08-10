<template>
  <div>
    <v-avatar
      v-if="type === 'image'"
      v-ripple
      :rounded="round"
      :color="image ? 'transparent' : 'transparent'"
      :size="size"
      style="cursor: pointer; position: relative"
    >
      <!-- <input
        type="file"
        style="
          opacity: 0;
          position: absolute;
          z-index: 15;
          cursor: pointer;
          top: 0px;
          left: 0px;
          width: 100%;
          height: 100%;
        "
        tabindex="2"
        @change="uploadFile"
      /> -->

      <img src="C:/Users/DEBBY/Documents/BidhaarSmartMockups/hoodieblack.png" />
    </v-avatar>
  </div>
</template>

<script>
// const fs = require('fs')
export default {
  props: {
    label: {
      type: String,
      default: 'Click to upload an image',
    },
    value: {
      type: [Object, String],
      default: '',
    },
    type: {
      type: String,
      default: 'image',
    },
    component: {
      type: String,
      default: '',
    },
    round: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [Number, String],
      default: 150,
    },
  },
  data() {
    return {
      imported: '',
    }
  },
  computed: {
    image() {
      return this.type === 'document' ? '' : this.value.url
    },
    fileName() {
      return this.value.name
    },
  },
  methods: {
    showAssetManager() {
      this.$store.commit('assetManager/SET_COMPONENT', this.component)
      this.$store.commit('assetManager/SHOW_ASSET_MANAGER', true)
    },
    uploadFile($event) {
      const val = $event.target.files[0]
      // If the user actually picks a file
      if (val.size > 1048576) {
        const notification = {
          message:
            'File too large to be uploaded. Make sure file size is not more than 1mb',
          type: 'info',
        }
        this.$store.dispatch('notification/setNotification', notification)
        this.$store.dispatch('notification/showNotification', true)
      }
      if (val && val.size <= 1048576) {
        this.imported = val.path
        console.log(val)
      }
    },
  },
}
</script>
