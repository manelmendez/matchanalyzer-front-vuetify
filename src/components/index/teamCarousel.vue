<template>
  <v-container fluid v-if="this.teamStats.stats">
    <v-row justify="center">
      <v-col class="text-center" cols="6" sm="6" md="3" lg="3">
        <v-card flat>
          <v-card-title style="justify-content: center; word-break: keep-all">
            Posicion en liga
          </v-card-title>
          <v-card-text>
            <p style="font-size: 20px">{{ this.teamStats.position }}</p>
            <v-icon
              v-if="
                this.teamStats.position == 1 ||
                this.teamStats.position == 2 ||
                this.teamStats.position == 3
              "
              :color="
                this.teamStats.position == 1
                  ? colors.yellow.darken3
                  : this.teamStats.position == 2
                    ? colors.blueGrey.lighten1
                    : this.teamStats.position == 3
                      ? colors.deepOrange.darken1
                      : ''
              "
            >
              mdi-trophy
            </v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="text-center" cols="6" sm="6" md="3" lg="3">
        <v-card flat>
          <v-card-title style="justify-content: center"> Puntos </v-card-title>
          <v-card-text>
            <p style="font-size: 20px">
              {{ this.teamStats.stats.points }}/{{
                this.teamStats.stats.gamesPlayed * 3
              }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="text-center" cols="6" sm="6" md="3" lg="3">
        <v-card flat>
          <v-card-title style="justify-content: center"> Goles </v-card-title>
          <v-card-text>
            <p style="font-size: 20px">{{ this.teamStats.stats.goals }}</p>
            <v-icon>mdi-soccer </v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="text-center" cols="6" sm="6" md="3" lg="3">
        <v-card flat>
          <v-card-title style="justify-content: center; word-break: keep-all">
            Resumen partidos
          </v-card-title>
          <v-card-text>
            <DoughnutChart
              :chartData="chartData"
              :chartOptions="chartOptions"
            ></DoughnutChart>
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
import { ref, onMounted, getCurrentInstance } from 'vue'
import colors from 'vuetify/util/colors'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import { useTheme } from 'vuetify'

export default {
  name: 'TeamCarousel',
  props: {
    team: {
      type: Object,
      required: true
    }
  },
  components: {
    DoughnutChart
  },
  setup(props) {
    const { proxy } = getCurrentInstance()
    const theme = useTheme()
    const teamStats = ref(props.team)
    const chartData = ref(null)
    const chartOptions = ref({
      aspectRatio: 3.5,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      responsive: true
    })

    const getTeamStats = async () => {
      try {
        const response = await proxy.$axios.get(
          `teams/${props.team.id}/competition/${props.team.competitionId}`
        )
        console.log(response)
        teamStats.value = response.data.teamStats
        // Aquí puedes actualizar chartData con los datos obtenidos
        let victorias = teamStats.value.stats.wins
        let empates = teamStats.value.stats.draws
        let derrotas = teamStats.value.stats.loses
        chartData.value = {
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
      } catch (error) {
        console.error(error)
      }
    }
    onMounted(() => {
      getTeamStats()
    })

    return {
      theme,
      teamStats,
      chartData,
      chartOptions,
      colors
    }
  }
}
</script>
<style scoped></style>
