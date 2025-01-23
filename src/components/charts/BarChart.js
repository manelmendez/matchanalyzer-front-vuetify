import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { defineComponent, ref, watch } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'BarChart',
  components: {
    Bar
  },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => { }
    }
  },
  setup(props) {
    const chartRef = ref(null)

    watch(
      () => props.chartData,
      (newData) => {
        if (chartRef.value) {
          chartRef.value.chartInstance.data = newData
          chartRef.value.chartInstance.update()
        }
      },
      { deep: true }
    )

    return {
      chartRef
    }
  },
  mounted() {
    this.chartRef.renderChart(this.chartData, this.options)
  }
})
