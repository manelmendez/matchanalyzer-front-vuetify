<template>
  <v-container fluid v-if="competition.teams.length != 0">
    <v-row justify="center">
      <v-col class="text-center" cols="6" sm="6" md="3" lg="3">
        <v-card flat>
          <v-card-title style="justify-content: center"> Líder </v-card-title>
          <v-img
            class="mx-auto my-1"
            :src="constants.ADDRESS + localCompetition.teams[0].avatar"
            @error="localCompetition.teams[0].avatar = constants.DEFAULT_TEAM_URL"
            aspect-ratio="1"
            :width="50">
          </v-img>
          <v-card-text class="text-center">
            {{ competition.teams[0].name }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="text-center" cols="6" sm="6" md="3" lg="3">
        <v-card flat>
          <v-card-title style="justify-content: center"> Último </v-card-title>
          <v-img
            class="mx-auto my-1"
            :src="
              constants.ADDRESS +
              localCompetition.teams[competition.teams.length - 1].avatar
            "
            @error="
              localCompetition.teams[competition.teams.length - 1].avatar =
                constants.DEFAULT_TEAM_URL
            "
            aspect-ratio="1"
            :width="50"
          ></v-img>
          <v-card-text class="text-center">
            {{ competition.teams[competition.teams.length - 1].name }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="text-center" cols="6" sm="6" md="3" lg="3">
        <v-card flat>
          <v-card-title style="justify-content: center; word-break: keep-all">
            Total de goles
          </v-card-title>
          <v-card-text>
            <p style="font-size: 20px">{{ totalGoals }}</p>
            <v-icon>mdi-soccer </v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="text-center" cols="6" sm="6" md="3" lg="3">
        <v-card flat>
          <v-card-title style="justify-content: center"> Año </v-card-title>
          <v-card-text>
            <p style="font-size: 20px">{{ competition.season }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container fluid v-else fill-height>
    <v-row class="pb-10">
      <v-col align-self="center" class="text-center">No hay datos</v-col>
    </v-row>
  </v-container>
</template>

<script>
import constants from '@/assets/constants/constants'

export default {
  props: {
    competition: Object
  },
  data() {
    return {
      localCompetition: JSON.parse(JSON.stringify(this.competition)),
      constants: constants
    }
  },
  computed: {
    totalGoals() {
      let goals = 0
      for (let i = 0; i < this.competition.teams.length; i++) {
        goals += this.competition.teams[i].stats.goals
      }
      return goals
    }
  }
}
</script>

<style scoped></style>
