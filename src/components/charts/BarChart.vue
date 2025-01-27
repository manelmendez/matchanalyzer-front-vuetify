<template>
  <Bar
    :chartOptions="chartOptionsComputed"
    :chartData="chartDataComputed"
  />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { defineComponent, computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'PieChart',
  components: {
    Bar
  },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const chartDataComputed = computed(() => props.chartData)
    const chartOptionsComputed = computed(() => props.chartOptions)

    return {
      chartDataComputed,
      chartOptionsComputed
    }
  }
})
</script>
