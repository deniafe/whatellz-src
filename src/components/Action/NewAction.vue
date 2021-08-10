<template>
  <div>
    <!-- <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="20"
      offset-y
    > -->
    <!-- <template v-slot:activator="{ on }"> -->
    <v-card
      class="mt-2"
      color="transparent"
      flat
      width="120"
      @click="openRightPanel"
      v-on="on"
    >
      <div id="add-action" class="mt-2 text-center">
        <small>Click here to add an action</small>
      </div>
    </v-card>
    <!-- </template> -->

    <!-- <v-divider></v-divider> -->

    <!-- <v-card flat color="background">
        <v-card
          v-for="(action, index) in actionMenu"
          :key="index"
          color="card"
          flat
          ripple
          @click="openRightPanel(action)"
        >
          <div style="cursor: pointer" class="caption pa-4">
            {{ action.title }}
          </div>
        </v-card>
      </v-card>
    </v-menu> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data: () => ({
    menu: false,
    x: 0,
    y: 0,
  }),
  computed: {
    ...mapGetters({
      actionMenu: 'action/actionMenu',
      actionControl: 'action/actionControl',
    }),
  },
  methods: {
    addAction(actionMenu) {
      if (!this.actionControl) {
        this.$store.commit('action/TOGGLE_ACTION_CONTROL')
        this.$store.commit('action/SET_CURRENT_ACTION_MENU', actionMenu)
      } else if (this.actionControl) {
        this.$store.commit('action/SET_CURRENT_ACTION_MENU', actionMenu)
      }
      this.menu = false
    },
    openRightPanel() {
      this.$store.commit('action/SET_RIGHT_PANEL', true)
      this.$store.commit('action/SET_CURRENT_ACTION_MENU', this.actionMenu[0])
    },
    clearActions() {
      this.$store.commit('action/CLEAR_ACTION_MENU')
      this.$store.commit('action/CLEAR_ACTION')
      if (this.actionControl) {
        this.$store.commit('action/TOGGLE_ACTION_CONTROL', true)
      }
    },
  },
}
</script>

<style scoped>
#add-action {
  height: 50px;
  width: 120px;
  background-color: transparent;
  border: dashed 1px #bac5d4;
}
/* .skill-active {
  color: red;
}
.v-list-item--active > div > div {
  color: red !important;
}
.v-list-item--active > div > i {
  color: red !important;
} */
</style>
