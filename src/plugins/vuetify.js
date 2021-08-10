import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      light: {
        background: '#ffffff',
        primary: '#da0b2c',
        accent: '#fafafa',
        secondary: '#f8f9fb',
        black: '1a1a1a',
        appBlue: '#1a09db',
        success: '#22bdb8',
        info: '#1a09db',
        warning: '#ff8d72',
        error: '#da0b2c',
      },
      dark: {
        background: '#131c21',
        secondary: '#162825',
        primary: '#00af9c',
        text: '#777c85',
        card: '#1e3530',
        headingText: '#d5d4de',
        input: '#323739',
        appBlue: '#00a2ff',
        success: '#35cd96',
        info: '#1d8cf8',
        warning: '#ff8d72',
        error: '#fd5d93',
      },
    },
  },
})
