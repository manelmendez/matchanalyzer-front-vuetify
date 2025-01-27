<template>
  <v-dialog v-if="show" :model-value="show" width="70%" persistent>
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>{{ headline }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-md>
          <v-form v-model="valid" ref="form" @submit.prevent="type == 'new' ? confirm() : edit()">
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  :items="teamsNotPlayedThisRound"
                  item-title="name"
                  return-object
                  label="Local"
                  v-model="team"
                  :rules="[v => !!v || 'Hay que elegir un equipo local']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="4" class="text-center">
                Resultado
                <v-row wrap>
                  <v-col cols="12" md="4" class="text-center">
                    <v-text-field
                      class="centered-input"
                      type="number"
                      min="0"
                      v-model="localTeamGoals"
                      :rules="numberRule"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" class="text-center align-self-center"
                    >-</v-col
                  >
                  <v-col cols="12" md="4" class="text-center">
                    <v-text-field
                      class="centered-input"
                      type="number"
                      min="0"
                      v-model="awayTeamGoals"
                      :rules="numberRule"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  :items="teamsNotPlayedThisRound"
                  item-title="name"
                  return-object
                  label="Visitante"
                  v-model="team2"
                  :rules="[v => !!v || 'Hay que elegir un equipo visitante']"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="type == 'new' ? confirm() : edit()"
          :disabled="!valid"
          >Continue</v-btn
        >
        <v-btn variant="text" @click="close()">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CreateMatch',
  props: {
    show: Boolean,
    type: String,
    roundTeams: Array,
    match: Object,
    round: Number
  },
  data() {
    return {
      localTeamGoals:
        this.type == 'new' ? 0 : Number(this.match.localTeamGoals),
      awayTeamGoals: this.type == 'new' ? 0 : Number(this.match.awayTeamGoals),
      team: this.type == 'new' ? null : this.match.localTeam,
      team2: this.type == 'new' ? null : this.match.awayTeam,
      headline: this.type == 'new' ? 'Añadir Partido' : 'Editar Partido',
      valid: false,
      numberRule: [
        (v) => !isNaN(parseFloat(v)) && v >= 0 && v <= 999 || 'El numero tiene que estar entre 0 y 999',
      ]
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirm() {
      let match = {
        localTeam: this.team.id,
        awayTeam: this.team2.id,
        localTeamGoals: Number(this.localTeamGoals),
        awayTeamGoals: Number(this.awayTeamGoals),
        competition: this.competition.id,
        round: this.round
      }
      this.$emit('confirm', match)
    },
    edit() {
      let match = {
        localTeam: this.team.id,
        awayTeam: this.team2.id,
        localTeamGoals: Number(this.localTeamGoals),
        awayTeamGoals: Number(this.awayTeamGoals),
        competition: this.competition.id,
        round: this.match.round
      }
      this.$emit('edit', match)
    }
  },
  computed: {
    ...mapGetters('competition', ['competition']),
    teamsNotPlayedThisRound() {
      return this.$store.getters['competition/teamsNotPlayedThisRound'](
        this.$route.params.roundId
      )
    }
  }
}
</script>
<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>
