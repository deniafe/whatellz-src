// eslint-disable-next-line no-unused-vars
import { Pie, mixins } from 'vue-chartjs'
export default {
  extends: Pie,
  props: ['data', 'options'],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.data, {
      borderWidth: '5px',
      hoverBackgroundColor: 'red',
      hoverBorderWidth: '10px',
    })
  },
}
