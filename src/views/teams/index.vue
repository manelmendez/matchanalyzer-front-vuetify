<template>
  <v-container fluid>
    <p v-if="myTeams.length == 0">
      Aún no tienes equipos. Dale al botón para crear uno
    </p>
    <v-list v-else>
      <v-list-item
        v-for="team in myTeams"
        :key="team.id"
        :title="team.name"
        @click.stop="goTo(team.id)"
      >
        <template v-slot:prepend>
          <v-avatar>
            <v-img
              :src="constants.ADDRESS + team.avatar"
              @error="team.avatar = constants.DEFAULT_TEAM_URL"
              :cover="false"
            />
          </v-avatar>
        </template>
        <template v-slot:append>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="text"
                size="small"
                icon
                color="info"
                @click.stop=";(updatingTeam = team), (dialog = true)"
                v-bind="props"
              >
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Editar equipo</span>
          </v-tooltip>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="text"
                size="small"
                icon
                color="error"
                v-bind="props"
                @click.stop=";(deletingTeam = team.id), (deleteDialog = true)"
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
          <span>Añadir equipo</span>
        </v-tooltip>
      </div>

    <CreateTeam
      v-if="dialog"
      :myTeam="true"
      :team="updatingTeam ? updatingTeam : null"
      :show="dialog"
      @confirm="confirmCreate"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import constants from '@/assets/constants/constants'
import CreateTeam from '@/components/modals/CreateTeam.vue'
import DeleteDialog from '@/components/modals/DeleteDialog.vue'

export default {
  name: 'TeamsIndex',
  components: {
    CreateTeam,
    DeleteDialog
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const dialog = ref(false)
    const deleteDialog = ref(false)
    const updatingTeam = ref(null)
    const deletingTeam = ref(null)

    const myTeams = computed(() => store.getters['team/myTeams'])
    const user = computed(() => store.getters['user/user'])

    const goTo = (id) => {
      router.push({
        name: 'teams-id',
        params: {
          id: id
        }
      })
    }
    const getMyTeams = async () => {
      await store.dispatch('team/getUserTeams', user.value.id)
    }
    const confirmCreate = () => {
      dialog.value = false
      if (updatingTeam.value) {
        getMyTeams()
      }
    }

    const deleteTeamFunction = () => {
      store.dispatch('team/deleteTeam', deletingTeam.value)
        .then(() => {
          deleteDialog.value = false
        })
        .catch(() => {
          deleteDialog.value = false
        })
    }

    onMounted(() => {
      getMyTeams()
    })

    return {
      constants,
      dialog,
      deleteDialog,
      updatingTeam,
      deletingTeam,
      myTeams,
      user,
      goTo,
      confirmCreate,
      deleteTeamFunction
    }
  }
}
</script>

<style scoped>
.uploadPhoto {
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 209, 89, 0.44);
  cursor: pointer;
}
</style>
