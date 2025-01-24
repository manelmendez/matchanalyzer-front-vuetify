import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { defineComponent, ref } from 'vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default defineComponent({
  name: 'LineChart',
  components: { LineChart: Line },
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
    const chartDataComputed = ref(props.chartData)
    const chartOptionsComputed = ref(props.chatOptions)
    console.log(chartDataComputed.value);
    console.log(chartOptionsComputed.value);

    return {
      chartDataComputed,
      chartOptionsComputed
    }
  }
})
