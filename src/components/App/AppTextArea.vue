<template>
  <div>
    <Emoji :dialog="dialog" @close="dialog = false" @emoji="sendEmoji" />
    <v-textarea
      :label="label"
      :value="value"
      :rules="rules"
      :hint="hint"
      append-icon="mdi-emoticon-cool-outline"
      @click:append="dialog = true"
      flat
      no-resize
      outlined
      @input="sendEvent"
    ></v-textarea>
  </div>
</template>

<script>
import Emoji from '@/components/App/Emoji'
export default {
  components: {
    Emoji,
  },
  props: {
    label: {
      type: String,
      default: 'Edit this text ...',
    },
    hint: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default() {
        return [(v) => !!v || 'Input cannot be empty']
      },
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  mounted() {},
  methods: {
    sendEvent(text) {
      this.$emit('input', text)
    },
    sendEmoji(text) {
      this.$emit('emoji', text)
    },
  },
}
</script>

<style scoped>
/* Giving preferred color to the text input */
.theme--dark.v-text-field--solo > .v-input__control > .v-input__slot {
  background: #150e38 !important;
}
</style>
