<template>
  <v-container fluid v-if="team">
    <div>{{ team.name }}</div>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="4" style="margin-top: 2em;">
        <positionstats
          :chart-data="positiondatacollection"
          :height="100"
          :team="team"
        />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="4" style="margin-top: 2em;">
        <matchstats
          :chart-data="matchesdatacollection"
          :height="100"
          :team="team"
        />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="4" style="margin-top: 2em;">
        <goalstats
          :chart-data="goalsdatacollection"
          :height="100"
          :team="team"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="4">
        <v-card>
          <v-card-title class="justify-center"> Total </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="7">- Goles a favor por partido: </v-col>
              <v-col
                ><b style="fontsize: 18px">{{
                  totalStats.goalAverage
                }}</b></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="7">- Goles recibidos por partido: </v-col>
              <v-col
                ><b style="fontsize: 18px">{{
                  totalStats.againstGoalAverage
                }}</b></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="7">- Partidos con la porteria a 0: </v-col>
              <v-col
                ><b style="fontsize: 18px">{{ totalStats.zeroGoals }}</b></v-col
              >
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="4">
        <v-card>
          <v-card-title class="justify-center"> Local </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="7">- Goles a favor por partido: </v-col>
              <v-col
                ><b style="fontsize: 18px">{{
                  totalStats.localGoalAverage
                }}</b></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="7">- Goles recibidos por partido: </v-col>
              <v-col
                ><b style="fontsize: 18px">{{
                  totalStats.localAgainstGoalAverage
                }}</b></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="7">- Partidos con la porteria a 0: </v-col>
              <v-col
                ><b style="fontsize: 18px">{{
                  totalStats.localZeroGoals
                }}</b></v-col
              >
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="4">
        <v-card>
          <v-card-title class="justify-center"> Visitante </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="7">- Goles a favor por partido: </v-col>
              <v-col
                ><b style="fontsize: 18px">{{
                  totalStats.awayGoalAverage
                }}</b></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="7">- Goles recibidos por partido: </v-col>
              <v-col
                ><b style="fontsize: 18px">{{
                  totalStats.awayAgainstGoalAverage
                }}</b></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="7">- Partidos con la porteria a 0: </v-col>
              <v-col
                ><b style="fontsize: 18px">{{
                  totalStats.awayZeroGoals
                }}</b></v-col
              >
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <teamMatchList :team="team" :rounds="rounds"></teamMatchList>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import constants from '@/assets/constants/constants'
import positionstats from '@/components/competition/team/positionstats.vue'
import matchstats from '@/components/competition/team/matchstats.vue'
import goalstats from '@/components/competition/team/goalstats.vue'
import teamMatchList from '@/components/competition/team/teamMatchList.vue'
export default {
  components: {
    positionstats,
    matchstats,
    goalstats,
    teamMatchList
  },
  data: () => ({
    constants: constants
  }),
  async created() {
    await this.getTeam(this.$route.params.teamId)
    await this.getCompetition(this.$route.params.id)
    await this.getCompetitionRounds(this.$route.params.id)
  },
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (16 - 1)) + 1
    },
    getTeamGoals() {
      let goalsperround = []
      let againstgoalsperround = []
      for (let i = 0; i < this.rounds.length; i++) {
        for (let j = 0; j < this.rounds[i].matches.length; j++) {
          if (this.rounds[i].matches[j].localTeam.id == this.team.id) {
            goalsperround.push(this.rounds[i].matches[j].localTeamGoals)
            againstgoalsperround.push(this.rounds[i].matches[j].awayTeamGoals)
          }
          if (this.rounds[i].matches[j].awayTeam.id == this.team.id) {
            goalsperround.push(this.rounds[i].matches[j].awayTeamGoals)
            againstgoalsperround.push(this.rounds[i].matches[j].localTeamGoals)
          }
        }
      }
      let goals = {
        goalsperround,
        againstgoalsperround
      }
      return goals
    },
    ...mapActions({
      getTeam: 'team/getTeam',
      getCompetition: 'competition/getCompetition',
      getCompetitionRounds: 'competition/getCompetitionRounds'
    })
  },
  watch: {
    async id() {
      await this.getTeam(this.$route.params.teamId)
      await this.getCompetition(this.$route.params.id)
      await this.getCompetitionRounds(this.$route.params.id)
    }
  },
  computed: {
    ...mapGetters({
      rounds: 'competition/rounds',
      statsPerRound: 'competition/statsPerRound'
    }),
    rankedTeams() {
      return this.$store.getters['competition/rankedTeams']('latest')
    },
    team() {
      return this.$store.getters['team/teamById'](this.$route.params.teamId)
    },
    teamMatchesPerRound() {
      return this.$store.getters['competition/teamMatchesPerRound'](
        this.$route.params.teamId
      )
    },
    id() {
      return this.$route.params.teamId
    },
    positiondatacollection: function () {
      let labels = []
      let positions = []
      for (let i = 0; i < this.statsPerRound.length; i++) {
        // labels.push(this.statsPerRound[i].name)
        labels.push('J' + (i + 1))
        for (let j = 0; j < this.statsPerRound[i].ranking.length; j++) {
          if (this.statsPerRound[i].ranking[j].id == this.team.id) {
            positions.push(j + 1)
          }
        }
      }
      return {
        labels: labels,
        datasets: [
          {
            label: 'Posición',
            data: positions,
            backgroundColor: 'rgb(0,0,0,0.1)',
            borderColor: 'rgb(76,180,179)',
            fill: 'start' //esto provoca que se pinte la parte de abajo de la linia (por hacer el reverse)
          }
        ]
      }
    },
    matchesdatacollection() {
      let victorias = 0
      let empates = 0
      let derrotas = 0
      for (let i = 0; i < this.rankedTeams.length; i++) {
        if (this.rankedTeams[i].id == this.team.id) {
          victorias = this.rankedTeams[i].stats.wins
          empates = this.rankedTeams[i].stats.draws
          derrotas = this.rankedTeams[i].stats.loses
        }
      }
      return {
        labels: ['Victorias', 'Empates', 'Derrotas'],
        datasets: [
          {
            data: [victorias, empates, derrotas],
            backgroundColor: [
              'rgb(115, 199, 132)',
              'rgb(255, 212, 71)',
              'rgb(255, 117, 117)'
            ],
            borderColor: [
              'rgba(115, 199, 132,0)',
              'rgba(255, 212, 71,0)',
              'rgba(255, 117, 117,0)'
            ]
          }
        ]
      }
    },
    goalsdatacollection() {
      let goals = this.getTeamGoals()
      let labels = []
      for (let i = 0; i < goals.goalsperround.length; i++) {
        labels.push('J' + (i + 1))
      }
      return {
        labels: labels,
        datasets: [
          {
            label: 'Goles a favor',
            data: goals.goalsperround,
            backgroundColor: 'rgba(220,0,0,0.2)',
            borderWidth: 1,
            borderColor: 'rgb(220,0,0)'
          },
          {
            label: 'Goles en contra',
            data: goals.againstgoalsperround,
            backgroundColor: 'rgba(0,0,220,0.2)',
            borderWidth: 1,
            borderColor: 'rgb(0,0,220)'
          }
        ]
      }
    },
    totalStats() {
      let localGoals = 0
      let awayGoals = 0
      let localAgainstGoals = 0
      let awayAgainstGoals = 0
      let localZeroGoals = 0
      let awayZeroGoals = 0
      let localMatches = 0
      let awayMatches = 0
      for (let i = 0; i < this.teamMatchesPerRound.length; i++) {
        let match = this.teamMatchesPerRound[i]
        if (match.localTeam.id == this.$route.params.teamId) {
          localMatches++
          localGoals += Number(match.localTeamGoals)
          localAgainstGoals += Number(match.awayTeamGoals)
          if (Number(match.awayTeamGoals) == 0) {
            localZeroGoals++
          }
        } else {
          awayMatches++
          awayGoals += Number(match.awayTeamGoals)
          awayAgainstGoals += Number(match.localTeamGoals)
          if (Number(match.localTeamGoals) == 0) {
            awayZeroGoals++
          }
        }
      }
      return {
        goalAverage: (
          (localGoals + awayGoals) /
          (localMatches + awayMatches)
        ).toFixed(2),
        againstGoalAverage: (
          (localAgainstGoals + awayAgainstGoals) /
          (localMatches + awayMatches)
        ).toFixed(2),
        zeroGoals:
          localZeroGoals +
          awayZeroGoals +
          ' de ' +
          (localMatches + awayMatches),
        localGoalAverage: (localGoals / localMatches).toFixed(2),
        localAgainstGoalAverage: (localAgainstGoals / localMatches).toFixed(2),
        localZeroGoals: localZeroGoals + ' de ' + localMatches,
        awayGoalAverage: (awayGoals / awayMatches).toFixed(2),
        awayAgainstGoalAverage: (awayAgainstGoals / awayMatches).toFixed(2),
        awayZeroGoals: awayZeroGoals + ' de ' + awayMatches
      }
    }
  }
}
</script>
<style scoped></style>
