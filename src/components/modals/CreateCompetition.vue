<template>
  <v-dialog :model-value="show" width="70%" persistent>
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>Crear competición</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-md>
          <v-form v-model="valid" ref="form" @submit.prevent="competition ? editCompetition() : createCompetition()">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Nombre de la competición"
                  :model-value="name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  :items="seasons"
                  label="Temporada"
                  :model-value="season"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  :items="disciplines"
                  label="Disciplina"
                  :model-value="discipline"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  :disabled="discipline == ''"
                  :items="discipline == 'F7' ? categoriesF7 : categoriesF11"
                  label="Categoria"
                  :model-value="category"
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
          @click="competition ? editCompetition() : createCompetition()"
          >Continue</v-btn
        >
        <v-btn variant="text" @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import constants from '../../assets/constants/constants'

export default {
  props: {
    show: Boolean,
    competition: Object
  },
  data() {
    return {
      name: this.competition ? this.competition.name : null,
      season: this.competition ? this.competition.season : null,
      seasons: constants.seasons,
      disciplines: constants.disciplines,
      categoriesF7: constants.categoriesF7,
      categoriesF11: constants.categoriesF11,
      discipline: this.competition ? this.competition.discipline : null,
      category: this.competition ? this.competition.category : null
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
  methods: {
    createCompetition() {
      let competition = {
        name: this.name,
        season: this.season,
        manager: this.user.id,
        discipline: this.discipline,
        category: this.category
      }
      this.addCompetition(competition).then(() => {
        this.$emit('confirm')
      })
    },
    editCompetition() {
      let competition = {
        id: this.competition.id,
        name: this.name,
        season: this.season,
        manager: this.user.id,
        discipline: this.discipline,
        category: this.category
      }
      this.updateCompetition(competition).then(() => {
        this.$emit('confirm')
      })
    },
    close() {
      this.$emit('close')
    },
    ...mapActions('competition', ['addCompetition', 'updateCompetition'])
  }
}
</script>
<style scoped></style>
