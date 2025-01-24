<template>
  <v-sheet
    rounded
    class="v-sheet--offset mx-auto"
    color="rgb(220,220,220,0.9)"
    elevation="12"
    max-width="calc(100% - 32px)"
    max-height="calc(100% - 32px)"
  >
    <line-chart
      :chart-data="this.chartData"
      :height="this.height"
      :options="options"
      class="chartStyle"
    ></line-chart>
  </v-sheet>
</template>

<script>
import LineChart from '@/components/charts/LineChart.js'

export default {
  components: { LineChart },
  props: ['chart-data', 'height'],
  data() {
    return {
      options: {
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
