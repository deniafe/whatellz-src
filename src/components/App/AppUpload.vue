<template>
  <v-file-input
    prepend-icon="mdi-file-upload"
    :accept="accept"
    :value="value"
    :label="label"
    :hint="hint"
    outlined
    dense
    @change="sendEvent"
  ></v-file-input>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Upload File ...',
    },
    accept: {
      type: String,
      required: true,
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
  methods: {
    sendEvent(value) {
      this.$emit('input', value)
    },
  },
}
</script>

<style></style>
