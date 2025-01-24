<template>
  <v-container fluid>
    <v-layout v-if="this.competitions.length == 0">
      No tienes competiciones
    </v-layout>
    <v-list v-else density="compact">
      <v-list-item
        v-for="competition in this.competitions"
        :key="competition.id"
        @click="goTo(competition.id)"
        :title="competition.name +
            ' - ' +
            competition.discipline +
            ' - ' +
            competition.category +
            ' - ' +
            competition.season"
      >
      <template v-slot:append>
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              variant="text"
              size="small"
              icon
              color="info"
              @click.stop="
                ;(updatingCompetition = competition), (dialog = true)
              "
              v-bind="props"
            >
              <v-icon size="18">mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Editar Competición</span>
        </v-tooltip>
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              variant="text"
              size="small"
              icon
              color="error"
              v-bind="props"
              @click.stop="
                ;(deletingCompetition = competition.id), (deleteDialog = true)
              "
            >
              <v-icon size="18">mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Borrar equipo</span>
        </v-tooltip>
      </template>
      </v-list-item>
    </v-list>
    <div class="d-flex justify-center">
        <v-tooltip
          location="top"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="accent"
              class="mt-10"
              icon="mdi-plus"
              location="end"
              @click="dialog = true"
              v-bind="props"
            >
              <v-icon color="grey-lighten-1">
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <span>Añadir competición</span>
        </v-tooltip>
      </div>
    <CreateCompetition
      v-if="dialog"
      :show="dialog"
      :competition="updatingCompetition ? updatingCompetition : null"
      @confirm="confirmCreate"
      @close="(dialog = false), (updatingCompetition = null)"
    ></CreateCompetition>
    <DeleteDialog
      v-if="deleteDialog"
      :show="deleteDialog"
      type="competition"
      @close=";(deleteDialog = !deleteDialog), (deletingCompetition = null)"
      @delete="deleteCompetitionFunction"
    ></DeleteDialog>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import CreateCompetition from '@/components/modals/CreateCompetition.vue'
import DeleteDialog from '@/components/modals/DeleteDialog.vue'
export default {
  name: 'competitions-view',
  components: {
    CreateCompetition,
    DeleteDialog
  },
  data: () => ({
    dialog: false,
    deleteDialog: false,
    deletingCompetition: null,
    updatingCompetition: null
  }),
  methods: {
    goTo(id) {
      this.$router.push({
        name: 'summary',
        params: {
          id: id,
          roundId: 'latest'
        }
      })
    },
    async confirmCreate() {
      await this.getUserCompetitions(this.user.id)
      this.dialog = false
    },
    async deleteCompetitionFunction() {
      await this.deleteCompetition(this.deletingCompetition)
      this.deleteDialog = false
    },
    ...mapActions({
      getUserCompetitions: 'competition/getUserCompetitions',
      getUserTeams: 'team/getUserTeams',
      deleteCompetition: 'competition/deleteCompetition'
    })
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      myTeams: 'team/myTeams',
      competitions: 'competition/competitions'
    })
  },
  async created() {
    //do something after creating vue instance
    await this.getUserCompetitions(this.user.id)
    await this.getUserTeams(this.user.id)
  }
}
</script>
