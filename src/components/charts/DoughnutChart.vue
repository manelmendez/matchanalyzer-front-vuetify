<template>
  <Doughnut
    :chartOptions="chartOptionsComputed"
    :chartData="chartDataComputed"
  />
</template>

<script>
import { defineComponent, computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default defineComponent({
  name: 'DoughnutChart',
  components: { Doughnut },
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

    return {
      chartDataComputed,
      chartOptionsComputed
    }
  }
})
</script>
