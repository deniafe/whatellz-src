<template>
  <div>
    <v-card id="new-skill" class="mb-2" @click="addSkill()">
      <div class="text-center pt-8">
        <small>Click here to add a new skill</small>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data: () => ({
    showMenu: false,
    menu: false,
    x: 0,
    y: 0,
  }),
  computed: {
    ...mapGetters({
      skillMenu: 'skill/skillMenu',
      currentBot: 'bot/currentBot',
      currentBotId: 'bot/currentBotId',
    }),
    name() {
      return this.data
    },
  },
  methods: {
    addSkill() {
      // if (skillTitle === 'Custom Skill') {
      this.$emit('click')
      this.$store.commit('skill/TOGGLE_SKILL_CONTROL', true)
      // } else {
      //   this.$store.dispatch('skill/addSkill', {
      //     title: skillTitle,
      //     original: skillTitle
      //   })
      //   this.menu = false
      // }
    },
  },
}
</script>

<style scoped>
#new-skill {
  height: 120px;
  width: 120px;
  background-color: transparent;
  border: dashed 1px #bac5d4;
}
</style>
