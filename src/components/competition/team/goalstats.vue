<template>
  <v-card style="overflow: visible;">
    <v-sheet
      class="v-sheet--offset mx-auto"
      color="rgb(220,220,220,0.9)"
      elevation="4"
      max-width="calc(100% - 32px)"
      max-height="calc(100% - 32px)"
    >
      <BarChart
        :chart-data="this.chartData"
        :options="options"
        class="chartStyle"
      ></BarChart>
    </v-sheet>

    <v-card-text class="pt-0">
      <div class="text-h6 font-weight-light mb-2">Goles del equipo</div>
      <div class="subheading font-weight-light text-grey">
        Temporada {{ team.season }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import BarChart from '@/components/charts/BarChart.vue'
import { defineComponent } from 'vue';

export default defineComponent({
  name: "goalStats",
  components: { BarChart },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    team: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      options: {
        responsive: true,
        height: this.height,
        plugins: {
          title: {
            display: true,
            text: 'Goles por jornada'
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Goles'
            },
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          },
          x: {
            title: {
              display: true,
              text: 'Jornadas'
            }
          }
        }
      }
    }
  }
});
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
