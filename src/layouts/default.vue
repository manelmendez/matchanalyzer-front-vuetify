<template>
  <v-app theme="actualTheme">
    <v-app-bar
      flat
      permanent
      scroll-behavior="collapse"
      :color="dark ? '#1e1e1e' : 'primary darken-1'"
    >
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="text-white"
      ></v-app-bar-nav-icon>
      <v-toolbar-title :to="'/'" class="text-white" style="cursor: pointer">
        <router-link to="/" class="toolbar-title"
          >MatchAnalyzer</router-link
        ></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-menu
        :close-on-content-click="false"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-icon>mdi-palette</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item class="text-center justify-center">
              <v-switch
                density="compact"
                v-model="dark"
                inset
                color="white"
                label="Dark"
                @update:model-value="switchChange"
              ></v-switch>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-subheader class="justify-center">Elegir tema</v-list-subheader>
            <v-list-item
              v-for="(item, index) in themes"
              :key="index"
              @click="selectTheme(item)"
            >
              <v-row justify="center">
                <v-avatar :color="item.value.colors.primary" size="36"> </v-avatar>
              </v-row>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-menu id="user" :persistent="true">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon class="mr-5">
            <v-avatar v-if="user.avatar != null" size="36">
              <img :src="user.avatar" alt="Profile" />
            </v-avatar>
            <user-avatar
              v-else
              :firstname="user.firstname"
              :lastname="user.lastname"
            ></user-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/profile/general">

              <v-list-item-title> Ver mi perfil </v-list-item-title>

          </v-list-item>
          <v-list-item>

              <v-list-item-title @click="logOut()" class="logout">
                Sign Out
              </v-list-item-title>

          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      permanent
      :expand-on-hover="!checkMobile"
      :rail="drawer"
      width="200"
      :location="checkMobile ? 'bottom' : undefined"
    >
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home-outline" title="Inicio" value="home" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-soccer" title="Mis equipos" value="teams" to="/teams"></v-list-item>
        <v-list-item prepend-icon="mdi-trophy-outline" title="Mis competiciones" value="competitions" to="/competitions"></v-list-item>
        <v-list-item prepend-icon="mdi-calendar-outline" title="Planificación" value="planification" to="/planification"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view :class="dark ? 'darkContent' : 'content'"></router-view>
    </v-main>
  </v-app>
</template>
<script>
import { mapActions } from 'vuex'
import { useTheme } from 'vuetify'
import red from '@/assets/themes/red'
import green from '@/assets/themes/green'
import deepPurple from '@/assets/themes/deep-purple'
import lightBlue from '@/assets/themes/light-blue'
import indigo from '@/assets/themes/indigo'
import teal from '@/assets/themes/teal'
import black from '@/assets/themes/black'
import constants from '@/assets/constants/constants'
import store from '@/store/store'
import UserAvatar from '@/components/team/userAvatar.vue'

export default {
  name: 'Layout-app',
  components: {
    UserAvatar
  },
  data: () => ({
    constants: constants,
    themes: [
      { name: 'green', value: green },
      { name: 'red', value: red },
      { name: 'lightBlue', value: lightBlue },
      { name: 'teal', value: teal },
      { name: 'deepPurple', value: deepPurple },
      { name: 'indigo', value: indigo },
      { name: 'black', value: black }
    ],
    actualTheme: window.localStorage.getItem('theme') || 'green',
    themeApp: useTheme(),
    drawer: true,
    dark: false
  }),
  methods: {
    logOut() {
      window.localStorage.removeItem('authUser')
      this.signOut()
      let snackbar = { show: true, color: 'success', text: 'Sesión cerrada' }
      this.$store.commit('root/SNACKBAR', snackbar)
      this.$router.push('/login')
    },
    ...mapActions('user', ['signOut']),
    randomTheme() {
      let randomTheme =
        this.themes[Math.floor(Math.random() * this.themes.length)]
      window.localStorage.setItem('theme', randomTheme.name)
      this.actualTheme = randomTheme.name
      store.commit('root/SET_THEME', randomTheme.name)
      if (this.$vuetify.theme.dark) {
        this.$vuetify.theme.themes.dark = randomTheme.value
      } else {
        this.$vuetify.theme.themes.light = randomTheme.value
      }
    },
    selectTheme(theme) {
      if (this.dark) {
        window.localStorage.setItem('theme', theme.name + 'Dark')
        this.actualTheme = theme.name + 'Dark'
        store.commit('root/SET_THEME', theme.name + 'Dark')
        this.themeApp.global.name = theme.name + 'Dark'
      }
      else {
        window.localStorage.setItem('theme', theme.name)
        this.actualTheme = theme.name
        store.commit('root/SET_THEME', theme.name)
        this.themeApp.global.name = theme.name
      }
    },
    switchChange() {
      if (this.dark) {
        window.localStorage.setItem('dark', true)
        this.dark = true
        this.themeApp.global.current.dark = true
        this.themeApp.global.name = this.themeApp.global.name + 'Dark'
      }
      else {
        window.localStorage.setItem('dark', false)
        this.dark = false
        this.themeApp.global.current.dark = false
        this.themeApp.global.name = this.themeApp.global.name.replace('Dark', '')
      }
    }
  },
  created() {
    this.dark = this.themeApp.global.current.dark
  },
  computed: {
    user() {
      return this.$store.getters['user/user']
    },

    checkMobile() {
      // console.log(this.$vuetify.breakpoint.name)
      switch (this.$vuetify.display.name) {
        case 'xs':
          return true
        case 'sm':
          return true
        case 'md':
          return false
        case 'lg':
          return false
        case 'xl':
          return false
        default:
          return false
      }
    }
  }
}
</script>
<style scoped>
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
  font-family: 'Montserrat';
}
.content {
  background-color: var(--v-item-lighten3);
  height: 100%;
}
.darkContent {
  background-color: var(--v-background-base);
  height: 100%;
}
.logout {
  cursor: pointer;
}
img {
  border: 2px solid rgb(221, 221, 221);
}
</style>
