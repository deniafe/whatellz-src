<template>
  <div class="mx-0 pa-0 secondary" style="divStyle">
    <Toolbar />
    <div class="text-center mt-12"></div>
    <Skill />
    <RightNav />
    <!-- <EditAction /> -->
    <EditSkill />
    <NewCustomSkill />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import Toolbar from '@/components/Skill/Toolbar'
import Skill from '@/components/Skill/Skill'
import EditSkill from '@/components/Skill/EditSkill'
import NewCustomSkill from '@/components/Skill/NewCustomSkill'

export default {
  components: {
    Toolbar,
    Skill,
    EditSkill,
    NewCustomSkill,
  },
  data() {
    return {
      browserHeight: '',
    }
  },
  computed: {
    ...mapGetters({
      bots: 'bot/bots',
      user: 'auth/user',
      currentBot: 'bot/currentBot',
    }),
    id() {
      return this.$route.params.id
    },
    divStyle() {
      return {
        minHeight: this.browserHeight + 'px',
      }
    },
  },
  watch: {
    bots(newValue) {
      if (newValue.length > 0) {
        this.$store.dispatch('bot/setCurrentBot', { id: this.id })
      }
    },
  },
  created() {
    this.$store.commit('bot/SET_CURRENT_BOT_ID', this.id)
  },
  mounted() {
    if (!this.currentBot) this.$router.push({ name: 'bots' })
    this.browserHeight = document.body.clientHeight
    if (!this.user) this.$store.dispatch('auth/checkAuth')
    ipcRenderer.send('get-skills')
    ipcRenderer.send('get-actions')
  },
  head() {
    return {
      title: 'Bot #' + this.id,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Edit bot #' + this.id,
        },
      ],
    }
  },
}
</script>
