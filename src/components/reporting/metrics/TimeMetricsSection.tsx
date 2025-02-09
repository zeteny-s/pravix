import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "../MetricCard";
import { isWithinInterval } from "date-fns";
import { D3TimeDistributionChart } from "../charts/D3TimeDistributionChart";
import { Clock, DollarSign, PieChart } from "lucide-react";

interface TimeMetricsSectionProps {
  dateRange: { from: Date; to: Date };
}

export function TimeMetricsSection({ dateRange }: TimeMetricsSectionProps) {
  const { data: timeEntries } = useQuery({
    queryKey: ['time-entries', dateRange],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          case:cases(title)
        `)
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      return data.filter((entry) => 
        entry.start_time && 
        isWithinInterval(new Date(entry.start_time), { 
          start: dateRange.from, 
          end: dateRange.to 
        })
      );
    },
  });

  const billableHours = timeEntries?.reduce((acc, entry) => {
    if (entry.billable && entry.duration_seconds) {
      return acc + (entry.duration_seconds / 3600);
    }
    return acc;
  }, 0) || 0;

  const nonBillableHours = timeEntries?.reduce((acc, entry) => {
    if (!entry.billable && entry.duration_seconds) {
      return acc + (entry.duration_seconds / 3600);
    }
    return acc;
  }, 0) || 0;

  const totalHours = billableHours + nonBillableHours;
  const utilizationRate = totalHours ? ((billableHours / totalHours) * 100).toFixed(1) : 0;

  const timeDistributionData = [
    { name: 'Billable', hours: billableHours, color: '#0088FE' },
    { name: 'Non-Billable', hours: nonBillableHours, color: '#FF8042' }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Time Distribution"
        value={`${totalHours.toFixed(1)}h`}
        description="Total hours tracked"
        icon={<Clock className="h-5 w-5" />}
        chart={<D3TimeDistributionChart data={timeDistributionData} height={100} />}
        expandedChart={<D3TimeDistributionChart data={timeDistributionData} height={400} />}
        detailView={
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Time Breakdown</h3>
              <div className="grid gap-4">
                {timeDistributionData.map((type) => (
                  <div key={type.name} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="font-medium">{type.name}</span>
                    </div>
                    <span className="font-bold">{type.hours.toFixed(1)}h</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Time Entries</h3>
              <div className="space-y-3">
                {timeEntries?.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="p-3 bg-accent/5 rounded-lg">
                    <div className="font-medium">{entry.case?.title || 'No Case'}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {(entry.duration_seconds / 3600).toFixed(1)}h • {entry.billable ? 'Billable' : 'Non-Billable'}
                    </div>
                    <div className="text-sm mt-1">{entry.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />
      
      <MetricCard
        title="Billable Hours"
        value={`${billableHours.toFixed(1)}h`}
        description="Total billable hours"
        icon={<DollarSign className="h-5 w-5" />}
        detailView={
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billable Time Details</h3>
            <div className="space-y-4">
              {timeEntries?.filter(e => e.billable).map((entry) => (
                <div key={entry.id} className="p-4 bg-accent/5 rounded-lg">
                  <div className="font-medium">{entry.case?.title || 'No Case'}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {(entry.duration_seconds / 3600).toFixed(1)}h • Rate: ${entry.hourly_rate || 0}/h
                  </div>
                  <div className="text-sm mt-2">{entry.description}</div>
                </div>
              ))}
            </div>
          </div>
        }
      />
      
      <MetricCard
        title="Utilization Rate"
        value={`${utilizationRate}%`}
        description="Billable hours percentage"
        icon={<PieChart className="h-5 w-5" />}
        detailView={
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Utilization Metrics</h3>
              <div className="grid gap-4">
                <div className="p-4 bg-accent/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                  <div className="text-2xl font-bold mt-1">{totalHours.toFixed(1)}h</div>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Billable Hours</div>
                  <div className="text-2xl font-bold mt-1">{billableHours.toFixed(1)}h</div>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Non-Billable Hours</div>
                  <div className="text-2xl font-bold mt-1">{nonBillableHours.toFixed(1)}h</div>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Target Utilization</div>
                  <div className="text-2xl font-bold mt-1">75%</div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
