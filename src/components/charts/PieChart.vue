<template>
  <Pie
    :chartOptions="chartOptionsComputed"
    :chartData="chartDataComputed"
  />
</template>

<script>
import { defineComponent, computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default defineComponent({
  name: 'PieChart',
  components: {
    Pie
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
