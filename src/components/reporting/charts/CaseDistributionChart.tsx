import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface CaseDistributionChartProps {
  activeCases: number;
  closedCases: number;
  pendingCases: number;
}

export function CaseDistributionChart({ activeCases, closedCases, pendingCases }: CaseDistributionChartProps) {
  const chartOptions = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Case Status Distribution'
    },
    series: [{
      name: 'Cases',
      data: [
        ['Active', activeCases],
        ['Closed', closedCases],
        ['Pending', pendingCases]
      ]
    }]
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}
