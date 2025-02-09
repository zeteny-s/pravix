import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FinancialMetricsChartProps {
  dateRange: { from: Date; to: Date };
}

export function FinancialMetricsChart({ dateRange }: FinancialMetricsChartProps) {
  const { data: invoices } = useQuery({
    queryKey: ['invoices', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, clients(name)');
      
      if (error) throw error;
      return data;
    },
  });

  const chartOptions = {
    chart: {
      type: 'column',
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: 'Revenue Overview'
    },
    xAxis: {
      categories: invoices?.map(invoice => invoice.clients?.name) || [],
      title: {
        text: 'Clients'
      }
    },
    yAxis: {
      title: {
        text: 'Amount ($)'
      }
    },
    series: [{
      name: 'Revenue',
      data: invoices?.map(invoice => Number(invoice.amount)) || [],
      color: '#0c8de4'
    }],
    credits: {
      enabled: false
    },
    plotOptions: {
      column: {
        borderRadius: 5
      }
    }
  };

  return (
    <div className="w-full h-[400px]">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
}
