<template>
  <div>
    <Emoji :dialog="dialog" @close="dialog = false" @emoji="sendEmoji" />
    <v-text-field
      :prepend-icon="prependIcon"
      :append-icon="appendIcon"
      :label="customLabel"
      :value="value"
      :type="type"
      :rules="rules"
      :hint="hint"
      :readonly="readonly"
      @click:append="dialog = true"
      flat
      outlined
      dense
      @input="sendEvent"
    ></v-text-field>
  </div>
</template>

<script>
import Emoji from '@/components/App/Emoji'
export default {
  props: {
    label: {
      type: String,
      default: 'Edit this text ...',
    },
    hint: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    appendIcon: {
      type: String,
      default: '',
    },
    prependIcon: {
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
  components: {
    Emoji,
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    customLabel() {
      return this.type === 'number' ? '' : this.label
    },
  },
  methods: {
    sendEvent(value) {
      this.$emit('input', value)
    },
    sendEmoji(text) {
      this.$emit('emoji', text)
    },
  },
}
</script>

<style scoped></style>
