<template>
  <v-container>
    <v-card v-if="dataLoaded && teamsLoaded">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Estadísticas del partido</v-toolbar-title>
      </v-toolbar>
      <v-row class="pt-4" v-if="match.localTeam && match.awayTeam">
        <v-col class="text-end">{{ match.localTeam.name }}</v-col>
        <v-col cols="2" class="text-center">VS</v-col>
        <v-col class="text-start">{{ match.awayTeam.name }}</v-col>
      </v-row>
      <v-row v-for="(part, index) of matchparts" :key="part.id">
        <v-col class="text-center">
          <v-row>
            <v-col class="text-center"> Parte {{ index + 1 }} </v-col>
          </v-row>
          <v-row>
            <addMatchStatsContent
              v-if="match.localTeam.managerId || match.awayTeam.managerId"
              :team="
                match.localTeam.managerId
                  ? match.localTeam
                  : match.awayTeam.managerId
                    ? match.awayTeam
                    : null
              "
              :roundId="Number(match.roundId)"
              :matchId="Number($route.params.matchId)"
              :matchpart="part"
              :prevPartMinutes="getPreviousMinutes(index)"
            ></addMatchStatsContent>
          </v-row>
          <br /><br />
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <v-btn
            v-if="
              this.matchparts.length < 4 &&
              checkManagerTeam(match.localTeam, match.awayTeam)
            "
            color="accent"
            icon="mdi-plus"
            @click.stop="addMatchpartDialog = true"
          >
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <AddMatchpart
      v-if="addMatchpartDialog"
      :show="addMatchpartDialog"
      @close="addMatchpartDialog = false"
      @confirm="createMatchpart"
    ></AddMatchpart>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import constants from '@/assets/constants/constants'
import addMatchStatsContent from '@/components/competition/match/addMatchStatsContent.vue'
import AddMatchpart from '@/components/modals/AddMatchpart.vue'
export default {
  components: {
    addMatchStatsContent,
    AddMatchpart
  },
  data() {
    return {
      constants: constants,
      addMatchpartDialog: false,
      dataLoaded: false,
      teamsLoaded: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    checkManagerTeam(team1, team2) {
      if (team1.managerId != null || team2.managerId != null) {
        return true
      } else return false
    },
    async createMatchpart(data) {
      let matchpart = {
        ...data,
        matchId: this.$route.params.matchId,
        roundId: this.match.roundId,
        team: this.match.localTeam.managerId
          ? this.match.localTeam.id
          : this.match.awayTeam.id
      }
      let response = await this.addMatchpart(matchpart)
      this.matchparts.push(response.data.savedPart)
      this.addMatchpartDialog = false
    },
    getPreviousMinutes(index) {
      let prevMinutes = 0
      for (let i = 0; i < index; i++) {
        prevMinutes += parseInt(this.matchparts[index - 1].time)
      }
      return prevMinutes
    },
    ...mapActions({
      getMatch: 'competition/getMatch',
      getTeam: 'team/getTeam',
      getPlayersByTeamId: 'team/getPlayersByTeamId',
      addMatchpart: 'competition/addMatchpart',
      getMatchpartsByMatchId: 'competition/getMatchpartsByMatchId',
      getMinutesByMatchId: 'competition/getMinutesByMatchId',
      getGoalsByMatchId: 'competition/getGoalsByMatchId',
      getAssistsByMatchId: 'competition/getAssistsByMatchId',
      getCardsByMatchId: 'competition/getCardsByMatchId',
      getSubstitutionsByMatchId: 'competition/getSubstitutionsByMatchId'
    })
  },
  async created() {
    await this.getMatch(this.$route.params.matchId)
    await this.getMatchpartsByMatchId(this.$route.params.matchId)
    await this.getMinutesByMatchId(this.$route.params.matchId)
    await this.getGoalsByMatchId(this.$route.params.matchId)
    await this.getAssistsByMatchId(this.$route.params.matchId)
    await this.getCardsByMatchId(this.$route.params.matchId)
    await this.getSubstitutionsByMatchId(this.$route.params.matchId)
    this.dataLoaded = true
  },
  computed: {
    match() {
      return this.$store.getters['competition/match']
    },
    matchparts() {
      return this.$store.getters['competition/matchpartsByMatch'](
        this.$route.params.matchId
      )
    }
  },
  watch: {
    async match() {
      await this.getTeam(this.match.localTeamId)
      this.match.localTeam = this.$store.getters['team/teamById'](
        this.match.localTeamId
      )
      if (this.match.localTeam.managerId != null) {
        await this.getPlayersByTeamId(this.match.localTeamId)
        this.match.localTeam.players = this.$store.getters[
          'team/playersByTeamId'
        ](this.match.localTeamId)
      }
      await this.getTeam(this.match.awayTeamId)
      this.match.awayTeam = this.$store.getters['team/teamById'](
        this.match.awayTeamId
      )
      if (this.match.awayTeam.managerId != null) {
        await this.getPlayersByTeamId(this.match.awayTeamId)
        this.match.awayTeam.players = this.$store.getters['team/playersByTeamId'](
          this.match.awayTeamId
        )
      }
      this.teamsLoaded = true
    }
  }
}
</script>

<style scoped></style>
