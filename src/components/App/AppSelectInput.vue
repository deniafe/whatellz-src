<template>
  <v-select
    :items="items"
    item-text="title"
    :label="label"
    flat
    outlined
    dense
    :value="value"
    :hint="hint"
    :multiple="multiple"
    :chips="chips"
    @input="sendEvent"
  ></v-select>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    hint: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    chips: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    sendEvent(select) {
      this.$emit('input', select)
    },
  },
}
</script>

<style scoped>
.theme--dark.v-list {
  background-color: #1e3530;
  color: #ffffff;
}
</style>
