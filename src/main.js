import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import router from './router'
import App from './App.vue'
import store from './store/store'
import axiosInstance from './assets/axios'

import './assets/index.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import green from './assets/themes/green'
import greenDark from './assets/themes/green-dark'
import red from './assets/themes/red'
import redDark from './assets/themes/red-dark'
import black from './assets/themes/black'
import blackDark from './assets/themes/black-dark'
import teal from './assets/themes/teal'
import tealDark from './assets/themes/teal-dark'
import indigo from './assets/themes/indigo'
import indigoDark from './assets/themes/indigo-dark'
import lightBlue from './assets/themes/light-blue'
import lightBlueDark from './assets/themes/light-blue-dark'
import deepPurple from './assets/themes/deep-purple'
import deepPurpleDark from './assets/themes/deep-purple-dark'

const theme = window.localStorage.getItem('theme') || 'green'
const dark = window.localStorage.getItem('dark') || false

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    dark: dark,
    defaultTheme: theme,
    themes: {
      teal,
      tealDark,
      green,
      greenDark,
      lightBlue,
      lightBlueDark,
      indigo,
      indigoDark,
      red,
      redDark,
      deepPurple,
      deepPurpleDark,
      black,
      blackDark
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.use(store)
store.dispatch('user/initializeStore')
// app.use(VueMoment, { moment })
app.config.globalProperties.$axios = axiosInstance

app.mount('#app')
