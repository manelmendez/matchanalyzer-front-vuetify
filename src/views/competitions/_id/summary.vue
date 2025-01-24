<template>
  <v-container fluid grid-list-md>
    <v-row v-if="competitionTeams.length == 0">
      <v-card class="no-teams">
        <v-card-text class="text-center"
          >No hay equipos en la competición.</v-card-text
        >
      </v-card>
    </v-row>
    <v-card v-if="rounds && rounds.length != 0">
      <v-card-title>
        <v-row justify="space-between" align="center">
          <v-col cols="6" md="3">
            <v-select
              density="compact"
              :items="rounds"
              item-title="name"
              required
              :model-value="round"
              return-object
              @update:model-value="changeResultRound"
            ></v-select>
          </v-col>
          <v-col cols="6" md="3">
            <v-row>
              <v-col class="text-center">
                <v-btn
                  variant="text"
                  size="small"
                  :disabled="round.id == rounds[0].id"
                  @click="this.previousRound"
                  prepend-icon="mdi-chevron-double-left"
                >
                Anterior
                </v-btn>
              </v-col>
              <v-col class="text-center">
                <v-btn
                  variant="text"
                  size="small"
                  :disabled="round.id == rounds[rounds.length - 1].id"
                  @click="this.nextRound"
                  append-icon="mdi-chevron-double-right"
                >
                  Siguiente
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
    </v-card>
    <v-row class="mt-5 mb-1">
      <v-col cols="12" sm="12" md="6" lg="4">
        <TopScorers
          v-if="topScorers.length != 0"
          :topScorers="topScorers"
        ></TopScorers>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <MostTrashed
          v-if="mostTrashed.length != 0"
          :mostTrashed="mostTrashed"
        ></MostTrashed>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <TopDifference
          v-if="topDifference.length != 0"
          :topDifference="topDifference"
        ></TopDifference>
      </v-col>
    </v-row>
    <v-row dense v-if="competitionTeams">
      <v-col
        cols="6"
        sm="4"
        md="3"
        lg="2"
        xl="1"
        v-for="team in competitionTeams"
        :key="team.id"
      >
        <v-card
          class="teamCard d-flex flex-column"
          min-height="100%"
          @click.stop="
            $router.push({
              name: 'competitionStats',
              params: { teamId: team.id }
            })
          "
        >
          <v-icon
            v-if="team.managerId"
            style="position: absolute; right: 3px; top: 3px"
            color="yellow"
            >mdi-star</v-icon
          >
          <v-img
            :src="constants.ADDRESS + team.avatar"
            @error="team.avatar = constants.DEFAULT_TEAM_URL"
            aspect-ratio="1"
            width="100"
            class="mx-auto my-3"
          ></v-img>
          <v-card-title class="title-card text-center">
            <b>{{ team.name }}</b>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="text"
                  icon="mdi-pencil"
                  color="info"
                  @click.stop=";(updatingTeam = team), (dialog = true)"
                  v-bind="props"
                >
                </v-btn>
              </template>
              <span>Editar equipo</span>
            </v-tooltip>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="text"
                  icon="mdi-delete"
                  color="error"
                  v-bind="props"
                  @click.stop=";(deletingTeam = team.id), (deleteDialog = true)"
                >
                </v-btn>
              </template>
              <span>Borrar equipo</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-speed-dial
      location="top center"
      transition="slide-y-reverse-transition"
    >
    <template v-slot:activator="{ props: activatorProps }">
      <v-fab
        v-bind="activatorProps"
        size="large"
        :model-value="fab"
        color="accent"
        :icon="fab ? mdi-close : mdi-plus">
      </v-fab>
    </template>
      <v-tooltip location="left">
        <template v-slot:activator="{ props }">
          <v-btn
            key="1"
            v-bind="props"
            icon="mdi-plus_one"
            size="small"
            color="green"
            @click.stop="dialog = !dialog"
          >
          </v-btn>
        </template>
        <span>Añadir equipo a competición</span>
      </v-tooltip>
      <v-tooltip location="left">
        <template v-slot:activator="{ props }">
          <v-btn
            key="2"
            v-bind="props"
            icon="mdi-plus"
            size="small"
            color="indigo"
            @click.stop="addOwnTeam = !addOwnTeam"
          >
          </v-btn>
        </template>
        <span>Añadir equipo propio</span>
      </v-tooltip>
    </v-speed-dial>
    <v-dialog v-model="addOwnTeam" persistent max-width="50%">
      <v-card>
        <v-card-title class="text-h5"
          >Selecciona el equipo que quieres añadir</v-card-title
        >
        <v-card-text>
          <v-select
            :items="myTeamsWithoutCompetition"
            item-title="name"
            return-object
            v-model="team"
            label="Seleccionar Equipo"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="addOwnTeam = false">Cancelar</v-btn>
          <v-btn color="primary" @click="addMyTeam()">Añadir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <CreateTeam
      v-if="dialog"
      :team="updatingTeam ? updatingTeam : null"
      :show="dialog"
      @confirm="confirm"
      @close=";(dialog = !dialog), (updatingTeam = null)"
    ></CreateTeam>
    <DeleteDialog
      v-if="deleteDialog"
      :show="deleteDialog"
      type="team"
      @close=";(deleteDialog = !deleteDialog), (deletingTeam = null)"
      @delete="deleteTeamFunction"
    ></DeleteDialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import constants from '@/assets/constants/constants'
import CreateTeam from '@/components/modals/CreateTeam.vue'
import DeleteDialog from '@/components/modals/DeleteDialog.vue'
import TopScorers from '@/components/competition/summary/topScorers.vue'
import MostTrashed from '@/components/competition/summary/mostTrashed.vue'
import TopDifference from '@/components/competition/summary/topDifference.vue'
export default {
  name: 'Summary-Competition',
  components: {
    CreateTeam,
    DeleteDialog,
    TopScorers,
    MostTrashed,
    TopDifference
  },
  data() {
    return {
      fab: false,
      constants: constants,
      dialog: false,
      deleteDialog: false,
      updatingTeam: null,
      deletingTeam: null,
      addOwnTeam: false,
      team: ''
    }
  },
  methods: {
    async confirm() {
      this.dialog = false
      if (this.updatingTeam) {
        await this.getCompetition(this.competition.id)
      }
    },
    async deleteTeamFunction() {
      await this.deleteTeam(this.deletingTeam)
      await this.getCompetition(this.competition.id)
      this.deleteDialog = false
    },
    async addMyTeam() {
      this.team.competition = Number(this.$route.params.id)
      let body = {
        team: this.team
      }
      let data = {
        body: body,
        id: this.team.id
      }
      await this.updateTeam(data)
      this.addOwnTeam = false
    },
    changeResultRound(item) {
      //coger el numero de round y ponerlo en selectedRound
      let str = item.name
      let res = str.split(' ')
      // this.changeRound(res[1])
      this.$router.push({
        name: 'summary',
        params: {
          id: this.$route.params.id,
          roundId: res[1]
        }
      })
    },
    previousRound() {
      const actualRound =
        this.$route.params.roundId == 'latest'
          ? this.rounds.length
          : this.$route.params.roundId
      this.$router.push({
        name: 'summary',
        params: {
          id: this.$route.params.id,
          roundId: Number(actualRound) - 1
        }
      })
    },
    nextRound() {
      const actualRound =
        this.$route.params.roundId == 'latest'
          ? this.rounds.length
          : this.$route.params.roundId
      this.$router.push({
        name: 'summary',
        params: {
          id: this.$route.params.id,
          roundId: Number(actualRound) + 1
        }
      })
    },
    ...mapActions({
      getCompetition: 'competition/getCompetition',
      deleteTeam: 'team/deleteTeam',
      updateTeam: 'team/updateTeam'
    })
  },
  async created() {
    // await this.changeRound(this.rounds.length -1)
  },
  computed: {
    round() {
      return this.$store.getters['competition/round'](
        this.$route.params.roundId
      )
    },
    topScorers() {
      return this.$store.getters['competition/topScorers'](
        this.$route.params.roundId
      )
    },
    mostTrashed() {
      return this.$store.getters['competition/mostTrashed'](
        this.$route.params.roundId
      )
    },
    topDifference() {
      return this.$store.getters['competition/topDifference'](
        this.$route.params.roundId
      )
    },
    ...mapGetters({
      competition: 'competition/competition',
      competitionTeams: 'competition/competitionTeams',
      myTeams: 'team/myTeams',
      rounds: 'competition/rounds'
    }),
    myTeamsWithoutCompetition() {
      let teams = []
      for (let i = 0; i < this.myTeams.length; i++) {
        if (
          this.myTeams[i].competition == null ||
          !this.myTeams[i].competition
        ) {
          teams.push(this.myTeams[i])
        }
      }
      return teams
    }
  }
}
</script>
<style scoped>
.no-teams {
  width: 100%;
}
.teamCard {
  cursor: pointer;
}
.title-card {
  font-size: 12px;
}
</style>
