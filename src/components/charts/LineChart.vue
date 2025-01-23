<template>
  <LineChartComponent
    :chartOptions="chartOptionsComputed"
    :chartData="chartDataComputed"
  />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { defineComponent, computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default defineComponent({
  name: 'LineChart',
  components: { LineChartComponent: Line },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chatOptions: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const chartDataComputed = computed(() => props.chartData)
    const chartOptionsComputed = computed(() => props.chatOptions)
    console.log(chartDataComputed.value);
    console.log(chartOptionsComputed.value);

    return {
      chartDataComputed,
      chartOptionsComputed
    }
  }
})
</script>
