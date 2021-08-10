<template>
  <v-card
    flat
    class="mt-2"
    color="transparent"
    @click="$emit('click')"
    @mouseover="actionDel = id"
    @mouseout="actionDel = ''"
  >
    <v-row class="pa-0 ma-0">
      <v-col class="pa-0 ma-0" cols="6">
        <div class="caption pr-4">Step {{ index + 1 }}</div>
      </v-col>
      <v-col class="pa-0 ma-0" cols="4">
        <div>
          <v-icon class="pb-2" small color="appBlue"
            >mdi-arrow-right-bold-outline</v-icon
          >
        </div>
      </v-col>
    </v-row>

    <v-row class="pa-0 ma-0">
      <v-col class="pa-0 ma-0" cols="8">
        <div class="mt-2 font-weight-bold">
          <small>{{ title }}</small>
        </div>
      </v-col>
      <v-col class="pa-0 ma-0" cols="4">
        <div v-show="actionDel === id" class="pt-2">
          <v-icon color="appPink" small @click.stop="deleteAction"
            >mdi-close</v-icon
          >
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      actionDel: '',
    }
  },
  methods: {
    deleteAction() {
      this.$store.commit('action/DELETE_ACTION', this.action)
    },
  },
}
</script>
