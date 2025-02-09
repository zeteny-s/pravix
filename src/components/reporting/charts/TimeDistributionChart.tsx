import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface TimeDistributionChartProps {
  billableHours: number;
  nonBillableHours: number;
}

export function TimeDistributionChart({ billableHours, nonBillableHours }: TimeDistributionChartProps) {
  const chartOptions = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Time Tracking Overview'
    },
    xAxis: {
      categories: ['Billable Hours', 'Non-Billable Hours']
    },
    yAxis: {
      title: {
        text: 'Hours'
      }
    },
    series: [{
      name: 'Hours',
      data: [billableHours, nonBillableHours]
    }]
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}
