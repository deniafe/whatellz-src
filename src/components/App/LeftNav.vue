<template>
  <div>
    <nav>
      <v-navigation-drawer
        v-model="nav"
        width="200"
        permanent
        app
        floating
        col
        class="background"
      >
        <v-card
          color="background"
          width="170"
          height="50"
          class="mt-5 mx-auto"
          flat
        >
          <v-row>
            <v-col class="pa-0 pt-1 pl-4" cols="3">
              <v-avatar color="transparent" size="30" rounded>
                <img src="../../assets/WhatellzLogo.png" alt="" />
              </v-avatar>
            </v-col>

            <v-col cols="9" class="pl-1 pt-2">
              <div class="subtitle-1 font-weight-bold">Whatellz</div>
              <div class="caption text--text">version 1.0 {{ version }}</div>
            </v-col>
          </v-row>
        </v-card>

        <!-- <div class="pt-4 text-center">
          <v-btn
            v-if="!isPro"
            tile
            small
            color="primary"
            class="pulsingButton px-4"
            @click="$router.push({ name: 'plans' })"
          >
            $PRO MEMBERSHIP
          </v-btn>

          <v-chip color="primary" class="px-4" small label outlined>
            {{ pro }} MEMBER
          </v-chip>
        </div> -->

        <v-container width="170" class="px-0">
          <v-list dense>
            <v-list-item-group active-class="primary--text">
              <v-list-item
                v-for="link in links"
                :key="link.text"
                height="40"
                two-line
                :to="link.route"
              >
                <v-list-item-action>
                  <v-icon right size="20" color="primary-grey">
                    {{ link.icon }}
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title class="primary-grey--text">
                    {{ link.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-container>
        <div style="position: absolute; bottom: 2px">
          <v-btn
            class="ma-2 mt-12"
            width="170"
            color="card"
            @click="logout"
            large
          >
            <v-icon left color="white"> mdi-power </v-icon>
            <span style="font-size: 12px; color: white">Log Out</span>
          </v-btn>
        </div>
      </v-navigation-drawer>
    </nav>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
export default {
  name: 'LeftNav',
  components: {},

  data() {
    return {
      isPro: false,
      pro: 'ENTERPRISE',
      links: [
        {
          icon: 'mdi-view-dashboard',
          text: 'Dashboard',
          route: '/',
          id: 'Dashboard',
        },
        {
          icon: 'mdi-account-group-outline',
          text: 'Profiles',
          route: '/profiles',
          id: 'Profiles',
        },
        {
          icon: 'mdi-arrange-bring-forward',
          text: 'Campaigns',
          route: '/campaigns',
          id: 'Campaigns',
        },
        {
          icon: 'mdi-robot-outline',
          text: 'Bots',
          route: '/bots',
          id: 'Bots',
        },
        // {
        //   icon: 'mdi-calendar-multiselect',
        //   text: 'Sequence',
        //   route: '/sequence',
        //   id: 'Sequence',
        // },
        {
          icon: 'mdi-counter',
          text: 'Collections',
          route: '/collections',
          id: 'Collectionss',
        },
        // {
        //   icon: 'mdi-post-outline',
        //   text: 'Logs',
        //   route: '/logs',
        //   id: 'Logs',
        // },
        {
          icon: 'mdi-cog',
          text: 'Settings',
          route: '/settings',
          id: 'Settings',
        },
        {
          icon: 'mdi-message-text',
          text: 'Support',
          route: '/support',
          id: 'Support',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      navigation: 'app/nav',
      version: 'app/version',
    }),
    nav: {
      get() {
        return this.navigation
      },
      set(val) {
        this.$store.commit('app/SHOW_NAV', val)
      },
    },
  },
  mounted() {
    ipcRenderer.send('app_version')
    ipcRenderer.on('app_version', (event, arg) => {
      this.$store.commit('app/SET_APP_VERSION', arg.version)
    })
  },
  methods: {
    log: function (evt) {
      window.console.log(evt)
    },
    logout() {
      this.$store.dispatch('auth/signOut')
    },
  },
}
</script>

<style scoped>
.v-list-item--active::before {
  background-color: #f9f7ff !important;
}
.v-list-item--active > div > i {
  color: #00af9c !important;
}
.v-list-item--active > div > div {
  color: #00af9c !important;
}
.join-affiliate-group {
  width: 180px;
  height: 200px;
  margin: 20px;
  padding: 0 auto;
  position: relative;
}
.inner-affiliate-group {
  width: 150px;
  height: 170px;
  background-color: white;
  position: absolute;
  top: 50px;
}
.heading3 {
  font-size: 17px;
  font-weight: bold;
  font-family: 'Telex', sans-serif;
  margin-top: 2px;
}
.heading5 {
  font-size: 13px;
  font-weight: bold;
  font-family: 'Telex', sans-serif;
  margin-top: 4px;
}
.aff-text {
  font-size: 13px;
  font-weight: bold;
  font-family: 'Telex', sans-serif;
  width: 120px;
  position: absolute;
  left: 10px;
  color: #00af9c;
}
.general {
  text-align: center;
  font-size: 14px;
  color: #aab5d5;
  display: block;
}
.image-group {
  position: absolute;
  top: 70px;
}
.image {
  display: block;
  margin: 0px;
  width: 90px;
  height: 100px;
  border-radius: 0px;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 20px;
}
.share-group {
  position: absolute;
  bottom: 0;
  width: 150px;
  height: 40px;
  border-top: solid 1px #f0dcfa;
}
.pulsingButton {
  box-shadow: 0 0 0 0 rgba(0, 162, 225, 0.7);
  -webkit-animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  -moz-animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  -ms-animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  transition: all 300ms ease-in-out;
}

/* Comment-out to have the button continue to pulse on mouseover */

.pulsingButton:hover {
  -webkit-animation: none;
  -moz-animation: none;
  -ms-animation: none;
  animation: none;
  color: #ffffff;
}

/* Animation */

@-webkit-keyframes pulsing {
  to {
    box-shadow: 0 0 0 30px rgba(232, 76, 61, 0);
  }
}

@-moz-keyframes pulsing {
  to {
    box-shadow: 0 0 0 30px rgba(232, 76, 61, 0);
  }
}

@-ms-keyframes pulsing {
  to {
    box-shadow: 0 0 0 30px rgba(232, 76, 61, 0);
  }
}

@keyframes pulsing {
  to {
    box-shadow: 0 0 0 30px rgba(232, 76, 61, 0);
  }
}
</style>
