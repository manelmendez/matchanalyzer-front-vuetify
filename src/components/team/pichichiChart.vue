<template>
  <v-sheet
    rounded
    class="v-sheet--offset mx-auto"
    color="rgb(220,220,220,0.9)"
    elevation="12"
    max-width="calc(100% - 32px)"
    max-height="calc(100% - 32px)"
  >
    <LineChart
      :chartData="this.chartData"
      :chartOptions="options"
      class="chartStyle"
    ></LineChart>
  </v-sheet>
</template>

<script>
import LineChart from '@/components/charts/LineChart.js'

export default {
  components: { LineChart },
  props: ['chartData', 'height'],
  data() {
    return {
      options: {
        title: {
          display: true,
          text: 'Pichichis del equipo'
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: false,
                labelString: 'Goles'
              },
              ticks: {
                reverse: false,
                min: 0,
                stepSize: 1
              }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: false,
                labelString: 'Jornada'
              }
            }
          ]
        }
      }
    }
  }
}
</script>
<style scoped>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
.chartStyle {
  padding-bottom: 10px;
}
</style>
