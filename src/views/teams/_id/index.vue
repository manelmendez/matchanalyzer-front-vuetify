<template>
  <v-container fluid>
    <v-card v-if="team">
      <v-card-title>
        <v-row align="center">
          <v-col justify="center" cols="12" sm="6">
            <v-chip label>
              <v-avatar start>
                <v-img
                  v-if="team.avatar"
                  :src="constants.ADDRESS + team.avatar"
                  @error="team.avatar = constants.DEFAULT_TEAM_URL"
                  alt="avatar"
                  cover
                  height="40"
                  width="40"
                />
              </v-avatar>
              {{ team.name }}
            </v-chip>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-card
              v-if="team.competitionId != null"
              outline
              class="rounded-xl"
              color="primary-darken-1"
              :to="{
                name: 'summary',
                params: { id: team.competitionId, roundId: 'latest' }
              }"
            >
              <v-list-item>

                  <v-list-item-subtitle class="text-white">
                    Ir a la competición
                  </v-list-item-subtitle>

                <v-list-item-action>
                  <v-icon size="large" class="text-white">mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-card-title>
      <v-container fluid>
        <v-row>
          <v-col v-if="team.competitionId != null && pichichiList && cardList">
            <LineChart
              class="mt-2"
              :chartData="pichichiList"
              :chartOptions="pichichiOptions"
              :height="breakpoint == 'xs' ? 250 : 150"
            ></LineChart>
            <LineChart
              class="mt-2"
              :chart-data="cardList"
              :chartOptions="cardOptions"
              :height="breakpoint == 'xs' ? 250 : 150"
            ></LineChart>
          </v-col>
          <v-col>
            <v-data-table
              v-if="players"
              :headers="headers"
              :items="players"
              class="elevation-1 text-center"
              hide-default-footer
              :items-per-page="-1"
            >
              <template v-slot:[`item.avatar`]="{ item }">
                <v-row class="text-center">
                  <user-avatar
                    v-if="item.avatar != null"
                    :firstname="item.firstname"
                    :lastname="item.lastname"
                  ></user-avatar>
                  <v-img
                    v-else
                    :src="constants.ADDRESS + item.avatar"
                    @error="item.avatar = constants.DEFAULT_PLAYER_URL"
                    alt="avatar"
                    cover
                    height="40"
                    width="40"
                  />
                </v-row>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      variant="text"
                      icon
                      color="info"
                      @click=";(editingPlayer = item), (dialog = true)"
                      v-bind="props"
                    >
                      <v-icon size="18">mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar jugador</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      variant="text"
                      icon
                      color="error"
                      v-bind="props"
                      @click="
                        ;(deletingPlayer = item.id), (deleteDialog = true)
                      "
                    >
                      <v-icon size="18">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Borrar jugador</span>
                </v-tooltip>
              </template>
              <template v-slot:no-data>
                <v-col>
                  <v-alert :value="true" type="error" icon="warning">
                    No hay jugadores en este equipo :(
                  </v-alert>
                </v-col>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-tooltip location="left">
      <template v-slot:activator="{ props }">
        <v-btn
          floating
          color="accent"
          location="bottom right"
          fixed
          @click.stop="dialog = !dialog"
          v-bind="props"
        >
          <v-icon class="material-icons">mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Añadir jugador</span>
    </v-tooltip>
    <CreatePlayer
      v-if="dialog"
      :player="editingPlayer ? editingPlayer : null"
      :show="dialog"
      @confirm="createPlayer"
      @close=";(dialog = !dialog), (editingPlayer = null)"
    ></CreatePlayer>
    <DeleteDialog
      v-if="deleteDialog"
      :show="deleteDialog"
      type="player"
      @close=";(deleteDialog = !deleteDialog), (deletingPlayer = null)"
      @delete="deletePlayerFunction"
    ></DeleteDialog>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import constants from '@/assets/constants/constants'
import CreatePlayer from '@/components/modals/CreatePlayer.vue'
import DeleteDialog from '@/components/modals/DeleteDialog.vue'
import colors from 'vuetify/util/colors'
import UserAvatar from '@/components/team/userAvatar.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import LineChart from '@/components/charts/LineChart.vue'

export default {
  name: 'team-view',
  components: {
    CreatePlayer,
    DeleteDialog,
    LineChart,
    UserAvatar
  },
  setup() {
    const display = useDisplay()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const dialog = ref(false)
    const deleteDialog = ref(false)
    const deletingPlayer = ref(null)
    const editingPlayer = ref(null)
    const headers = ref([
      { text: '', align: 'center', sortable: false, value: 'avatar' },
      { text: 'Nombre', align: 'center', sortable: true, value: 'name' },
      { text: 'Posición', value: 'position', align: 'center' },
      { text: 'Año de nacimiento', value: 'year', align: 'center' },
      { text: 'Acciones', value: 'actions', align: 'center' }
    ])
    const pichichiOptions = ref({
      responsive: true,
      plugins: {
        title: {
        display: true,
        text: 'Pichichis del equipo'
        }
      },
      scales: {
        y: {
        title: {
          display: false,
          text: 'Goles'
        },
        ticks: {
          reverse: false,
          min: 0,
          stepSize: 1
        }
        },
        x: {
        title: {
          display: false,
          text: 'Jornada'
        }
        }
      }
      })
    const cardOptions = ref({
        responsive: true,
        plugins: {
          title: {
        display: true,
        text: 'Jugadores con más tarjetas'
          }
        },
        scales: {
          y: {
        title: {
          display: false,
          text: 'Tarjetas'
        },
        ticks: {
          reverse: false,
          min: 0,
          stepSize: 1
        }
          },
          x: {
        title: {
          display: false,
          text: 'Jornada'
        }
          }
        }
      }
)
    const team = computed(() => store.getters['team/teamById'](route.params.id))
    const players = computed(() => {
      let playerList = store.getters['team/playersByTeamId'](
        route.params.id
      )
      for (const player of playerList) {
        player.fullname = player.firstname + ' ' + player.lastname
      }
      return playerList
    })

    const pichichiList = computed(() => {
      if (store.getters['team/pichichiList'].length != 0) {
        const list = store.getters['team/pichichiList']
        const primero = list[0]
        const segundo = list[1]
        const tercero = list[2]
        const cuarto = list[3]
        const quinto = list[4]
        const labels = []
        const goals1 = []
        const goals2 = []
        const goals3 = []
        const goals4 = []
        const goals5 = []
        const rounds = list[0].roundsGoals.length
        for (let i = 0; i < rounds; i++) {
          // labels.push(this.statsPerRound[i].name)
          labels.push('J' + (i + 1))
          goals1.push(primero.roundsGoals[i])
          goals2.push(segundo.roundsGoals[i])
          goals3.push(tercero.roundsGoals[i])
          goals4.push(cuarto.roundsGoals[i])
          goals5.push(quinto.roundsGoals[i])
        }
        let style = getComputedStyle(document.body)
        const primaryColor = style.getPropertyValue('--v-primary-base')
        const secondaryColor = style.getPropertyValue('--v-secondary-base')
        const color3 = colors.shades.black
        const color4 = colors.indigo.base
        const color5 = colors.cyan.base

        return {
          labels: labels,
          datasets: [
            {
              label: primero.playerName,
              data: goals1,
              backgroundColor: 'rgb(0,0,0,0.1)',
              borderColor: primaryColor,
              fill: 'start' //esto provoca que se pinte la parte de abajo de la linia (por hacer el reverse)
            },
            {
              label: segundo.playerName,
              data: goals2,
              backgroundColor: 'rgb(0,0,0,0)',
              borderColor: secondaryColor,
              fill: 'start' //esto provoca que se pinte la parte de abajo de la linia (por hacer el reverse)
            },
            {
              label: tercero.playerName,
              data: goals3,
              backgroundColor: 'rgb(0,0,0,0)',
              borderColor: color3,
              fill: 'start' //esto provoca que se pinte la parte de abajo de la linia (por hacer el reverse)
            },
            {
              label: cuarto.playerName,
              data: goals4,
              backgroundColor: 'rgb(0,0,0,0)',
              borderColor: color4,
              fill: 'start' //esto provoca que se pinte la parte de abajo de la linia (por hacer el reverse)
            },
            {
              label: quinto.playerName,
              data: goals5,
              backgroundColor: 'rgb(0,0,0,0)',
              borderColor: color5,
              fill: 'start' //esto provoca que se pinte la parte de abajo de la linia (por hacer el reverse)
            }
          ]
        }
      } else {
        return undefined
      }
    })

    const cardList = computed(() => {
      if (store.getters['team/cardList'].length != 0) {
        const list = store.getters['team/cardList']
        const primero = list[0]
        const segundo = list[1]
        const tercero = list[2]
        const labels = []
        const cards1 = []
        const cards2 = []
        const cards3 = []
        const rounds = list[0].roundCards.length
        for (let i = 0; i < rounds; i++) {
          labels.push('J' + (i + 1))
          cards1.push(primero.roundCards[i])
          cards2.push(segundo.roundCards[i])
          cards3.push(tercero.roundCards[i])
        }
        let style = getComputedStyle(document.body)
        const primaryColor = style.getPropertyValue('--v-primary-base')
        const secondaryColor = style.getPropertyValue('--v-secondary-base')
        const accentColor = style.getPropertyValue('--v-error-base')

        return {
          labels: labels,
          datasets: [
            {
              label: primero.playerName,
              data: cards1,
              backgroundColor: 'rgb(0,0,0,0.1)',
              borderColor: primaryColor,
              fill: 'start'
            },
            {
              label: segundo.playerName,
              data: cards2,
              backgroundColor: 'rgb(0,0,0,0.1)',
              borderColor: secondaryColor,
              fill: 'start'
            },
            {
              label: tercero.playerName,
              data: cards3,
              backgroundColor: 'rgb(0,0,0,0.1)',
              borderColor: accentColor,
              fill: 'start'
            }
          ]
        }
      } else {
        return undefined
      }
    })

    const breakpoint = computed(() => {
      return display.name
    })

    const goTo = (id) => {
      router.push({
        name: 'teams-id',
        params: {
          id: id
        }
      })
    }

    const createPlayer = () => {
      dialog.value = false
    }

    const deletePlayerFunction = () => {
      store.dispatch('team/deletePlayer', deletingPlayer.value)
        .then(() => {
          deleteDialog.value = false
        })
        .catch(() => {
          deleteDialog.value = false
        })
    }

    const getTeamData = async () => {
      await store.dispatch('team/getTeam', route.params.id)
      const team = store.getters['team/teamById'](route.params.id)
      await store.dispatch('team/getPlayersByTeamId', route.params.id)
      if (team.competitionId != null) {
        await store.dispatch('team/getTeamScorers', {
          teamId: route.params.id,
          competitionId: team.competitionId
        })
        await store.dispatch('team/getTeamCards', {
          teamId: route.params.id,
          competitionId: team.competitionId
        })
      }
    }

    onMounted(() => {
      getTeamData()
    })

    return {
      constants,
      headers,
      dialog,
      deleteDialog,
      deletingPlayer,
      editingPlayer,
      team,
      players,
      cardList,
      breakpoint,
      goTo,
      createPlayer,
      deletePlayerFunction,
      getTeamData,
      pichichiList,
      pichichiOptions,
      cardOptions
    }
  }
}
</script>

<style scoped></style>
