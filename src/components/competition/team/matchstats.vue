<template>
  <v-card style="overflow: visible;">
    <v-sheet
      class="v-sheet--offset mx-auto"
      color="rgb(220,220,220,0.9)"
      elevation="4"
      max-width="calc(100% - 32px)"
      max-height="calc(100% - 32px)"
    >
      <PieChart
        :chartData="this.chartData"
        :chartOptions="options"
        class="chartStyle"
      ></PieChart>
    </v-sheet>

    <v-card-text class="pt-0">
      <div class="text-h6 font-weight-light mb-2">Partidos del equipo</div>
      <div class="subheading font-weight-light text-grey">
        Temporada {{ team.season }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent } from 'vue';
import PieChart from '@/components/charts/PieChart.vue';

export default defineComponent({
  name: "matchStats",
  components: { PieChart },
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
            display: false,
            text: '% victorias / empates / derrotas'
          }
        },
        borderColor: 'red',
        cutout: '50%'
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
