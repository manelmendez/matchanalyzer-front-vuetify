<template>
  <v-container fluid>
    <v-tabs
      align-tabs="center"
      :bg-color="dark ? '#1e1e1e' : 'primary'"
      grow
      stacked
      color="white"
      height="50px"
      slider-color="secondary"
    >
      <v-tab class="compTab" to="summary">
        Resumen
        <v-icon size="20px">mdi-chart-line</v-icon>
      </v-tab>
      <v-tab class="compTab" to="results">
        Resultados
        <v-icon size="20px">mdi-format-list-checkbox</v-icon>
      </v-tab>
      <v-tab class="compTab" to="rankings">
        Clasificación
        <v-icon size="20px">mdi-trophy-outline</v-icon>
      </v-tab>
    </v-tabs>
    <router-view></router-view>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import constants from '@/assets/constants/constants'
export default {
  name: 'CompetitionBase',
  data: () => ({
    constants: constants
  }),
  methods: {
    ...mapActions({
      getCompetition: 'competition/getCompetition',
      getCompetitionRounds: 'competition/getCompetitionRounds',
      getUserTeams: 'team/getUserTeams'
    })
  },
  computed: {
    ...mapGetters({
      competition: 'competition/competition',
      user: 'user/user',
      theme: 'root/theme'
    }),
    dark() {
      return this.$vuetify.theme.dark
    }
  },
  created: async function () {
    //do something after creating vue instance
    await this.getCompetition(this.$route.params.id)
    await this.getCompetitionRounds(this.$route.params.id)
    await this.getUserTeams(this.user.id)
  }
}
</script>
<style scoped>
.compTab {
  font-size: 75%;
}
.compTab:hover {
  color: rgb(255, 255, 255);
}
.nothing {
  color: #187388;
}
</style>
