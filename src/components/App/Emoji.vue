<template>
  <div>
    <v-dialog v-model="dialog" max-width="350">
      <v-card color="white">
        <v-card-title class="sub-title grey lighten-2">
          Add Emoji
        </v-card-title>

        <picker
          set="apple"
          title="Pick your emoji…"
          emoji="point_up"
          tooltip
          @select="addEmoji"
        />

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="appPink" text @click="$emit('close')"> Close </v-btn>
          <v-btn color="primary" text @click="$emit('close')"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue'
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Picker,
  },
  data() {
    return {}
  },
  methods: {
    addEmoji(emoji) {
      this.$emit('emoji', emoji)
      this.$store.commit('app/SET_CURRENT_EMOJI', emoji)
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
.emoji-mart[data-v-7bc71df8] {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  font-size: 16px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  height: 420px;
  color: #222427;
  border: 0px solid #d9d9d9;
  border-radius: 5px;
  background: #fff;
}
</style>
