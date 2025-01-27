<template>
  <v-row justify="center" align="center">
    <v-col class="pt-1 pb-1" cols="12" sm="5" md="4">
      <v-card
        :color="resultClass(match.localTeamGoals, match.awayTeamGoals)"
        border
      >
        <v-list class="bg-transparent">
          <v-list-item class="grow">
            <v-img
              class="mx-auto"
              :src="constants.ADDRESS + localMatch.localTeam.avatar"
              @error="localMatch.localTeam.avatar = constants.DEFAULT_TEAM_URL"
              aspect-ratio="1"
              :width="30"
            ></v-img>
          <v-list-item-title >
              {{ match.localTeam.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col class="pt-1 pb-1" cols="6" sm="2" md="2">
      <v-card color="rgba(199, 199, 199, 0.55)" border>
        <v-card-text class="result">
          {{ match.localTeamGoals }} - {{ match.awayTeamGoals }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-col class="pt-1 pb-1" cols="12" sm="5" md="4">
      <v-card
        :color="resultClass(match.awayTeamGoals, match.localTeamGoals)"
        border
      >
        <v-list class="bg-transparent">
          <v-list-item>
            <v-img
              class="mx-auto"
              :src="constants.ADDRESS + localMatch.awayTeam.avatar"
              @error="localMatch.awayTeam.avatar = constants.DEFAULT_TEAM_URL"
              aspect-ratio="1"
              :width="30"
            ></v-img>
            <v-list-item-title >
              {{ match.awayTeam.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col class="pt-1 pb-1" cols="6" sm="6" md="2">
      <v-card border>
        <v-card-text class="text-center pt-0 pb-0">
          <v-tooltip
            location="top"
            v-if="
              match.awayTeam.managerId != null ||
              match.localTeam.managerId != null
            "
          >
            <template v-slot:activator="{ props }">
              <v-btn
                size="x-small"
                variant="text"
                icon="mdi-file-document-edit-outline"
                color="green-lighten-2"
                :to="{ name: 'match-id', params: { matchId: match.id } }"
                v-bind="props"
              >
              </v-btn>
            </template>
            <span>Añadir/editar stats</span>
          </v-tooltip>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                size="x-small"
                variant="text"
                icon="mdi-pencil"
                color="info"
                @click.stop="roundDialog = true"
                v-bind="props"
              >
              </v-btn>
            </template>
            <span>Editar partido</span>
          </v-tooltip>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                size="x-small"
                variant="text"
                icon="mdi-delete"
                color="error"
                @click.stop="deleteDialog = true"
                v-bind="props"
              >
              </v-btn>
            </template>
            <span>Eliminar partido</span>
          </v-tooltip>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="10">
      <v-divider></v-divider>
    </v-col>
    <CreateMatch
      v-if="roundDialog"
      :show="roundDialog"
      type="edit"
      :roundTeams="newRoundTeams"
      :match="match"
      @close="roundDialog = !roundDialog"
      @edit="updateMatchFunction"
    ></CreateMatch>
    <DeleteDialog
      v-if="deleteDialog"
      :show="deleteDialog"
      type="match"
      @close="deleteDialog = !deleteDialog"
      @delete="deleteMatchFunction"
    ></DeleteDialog>
  </v-row>
</template>
<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import CreateMatch from '@/components/modals/CreateMatch.vue'
import DeleteDialog from '@/components/modals/DeleteDialog.vue'
import constants from '@/assets/constants/constants'
export default {
  name: 'RoundMatch',
  components: {
    CreateMatch,
    DeleteDialog
  },
  props: {
    match: Object
  },
  data() {
    return {
      localMatch: JSON.parse(JSON.stringify(this.match)),
      constants: constants,
      roundDialog: false,
      deleteDialog: false,
      addStatsDialog: false
    }
  },
  methods: {
    resultClass(goals1, goals2) {
      if (goals1 == goals2) return 'rgba(255, 212, 71, 0.55)'
      else if (goals1 > goals2) return 'rgba(117, 255, 131, 0.55)'
      else return 'rgba(255, 117, 117, 0.55)'
    },
    async deleteMatchFunction() {
      this.$emit('loading')
      await this.deleteMatch(this.match.id)
      await this.getCompetition(this.$route.params.id)
      this.deleteDialog = false
      this.$emit('loading')
    },
    async updateMatchFunction(match) {
      if (match.localTeam == match.awayTeam) {
        alert('No puedes seleccionar el mismo equipo en ambos lados')
      } else {
        let data = {
          id: this.match.id,
          body: match
        }
        this.$emit('loading')
        await this.updateMatch(data)
        await this.getCompetition(this.$route.params.id)
        this.roundDialog = false
        this.$emit('loading')
      }
    },
    ...mapActions('competition', [
      'updateMatch',
      'deleteMatch',
      'getCompetition'
    ])
  },
  computed: {
    ...mapGetters('competition', [
      'selectedRound',
      'roundTeams',
      'competition'
    ]),
    newRoundTeams() {
      return [...this.roundTeams, this.match.localTeam, this.match.awayTeam]
    }
  }
}
</script>
<style scoped>
.match-actions {
  text-align: center;
  height: 100%;
}
.result {
  font-size: 20px;
}
</style>
