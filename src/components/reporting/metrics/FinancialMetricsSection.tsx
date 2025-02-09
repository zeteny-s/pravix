import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinancialMetricsChart } from "../charts/FinancialMetricsChart";
import { MetricCard } from "../MetricCard";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";

interface FinancialMetricsSectionProps {
  dateRange: { from: Date; to: Date };
}

export function FinancialMetricsSection({ dateRange }: FinancialMetricsSectionProps) {
  const { data: invoices } = useQuery({
    queryKey: ['invoices', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: timeEntries } = useQuery({
    queryKey: ['billable-time', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('billable', true);
      
      if (error) throw error;
      return data;
    },
  });

  const totalRevenue = invoices?.reduce((sum, invoice) => sum + Number(invoice.amount), 0) || 0;
  const billableHours = timeEntries?.reduce((sum, entry) => 
    sum + (entry.duration_seconds ? entry.duration_seconds / 3600 : 0), 0
  ) || 0;
  const averageHourlyRate = billableHours ? totalRevenue / billableHours : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <FinancialMetricsChart dateRange={dateRange} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          description="Total revenue in selected period"
          icon={<DollarSign className="h-4 w-4 text-legal-600" />}
          detailView={
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Revenue Breakdown</h3>
              <div className="divide-y">
                {invoices?.map((invoice) => (
                  <div key={invoice.id} className="py-2">
                    <p className="font-medium">${invoice.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <MetricCard
          title="Billable Hours"
          value={billableHours.toFixed(1)}
          description="Total billable hours"
          icon={<TrendingUp className="h-4 w-4 text-legal-600" />}
          detailView={
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Time Entry Details</h3>
              <div className="divide-y">
                {timeEntries?.map((entry) => (
                  <div key={entry.id} className="py-2">
                    <p className="font-medium">
                      {(entry.duration_seconds / 3600).toFixed(1)} hours
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <MetricCard
          title="Average Rate"
          value={`$${averageHourlyRate.toFixed(2)}/hr`}
          description="Average billable rate"
          icon={<CreditCard className="h-4 w-4 text-legal-600" />}
          detailView={
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rate Analysis</h3>
              <div className="space-y-2">
                <p>Total Revenue: ${totalRevenue.toLocaleString()}</p>
                <p>Total Billable Hours: {billableHours.toFixed(1)}</p>
                <p>Average Hourly Rate: ${averageHourlyRate.toFixed(2)}</p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
