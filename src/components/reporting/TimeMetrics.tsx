import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "./MetricCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { isWithinInterval } from "date-fns";

interface TimeMetricsProps {
  dateRange: { from: Date; to: Date };
}

export function TimeMetrics({ dateRange }: TimeMetricsProps) {
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

  const pieData = [
    { name: 'Billable', value: billableHours },
    { name: 'Non-Billable', value: nonBillableHours },
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Billable Hours"
        value={billableHours.toFixed(1)}
        description="Total billable hours logged"
        chart={
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        }
        detailView={
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billable Time Entries</h3>
            <div className="divide-y">
              {timeEntries?.filter(e => e.billable).map((entry) => (
                <div key={entry.id} className="py-2">
                  <p className="font-medium">{entry.case?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {(entry.duration_seconds / 3600).toFixed(1)} hours - {entry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        }
      />
      
      <MetricCard
        title="Non-Billable Hours"
        value={nonBillableHours.toFixed(1)}
        description="Hours spent on administrative tasks"
        detailView={
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Non-Billable Time Entries</h3>
            <div className="divide-y">
              {timeEntries?.filter(e => !e.billable).map((entry) => (
                <div key={entry.id} className="py-2">
                  <p className="font-medium">{entry.case?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {(entry.duration_seconds / 3600).toFixed(1)} hours - {entry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        }
      />
      
      <MetricCard
        title="Utilization Rate"
        value={`${utilizationRate}%`}
        description="Percentage of billable hours"
        detailView={
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Time Utilization Summary</h3>
            <div className="space-y-2">
              <p>Total Hours: {totalHours.toFixed(1)}</p>
              <p>Billable Hours: {billableHours.toFixed(1)}</p>
              <p>Non-Billable Hours: {nonBillableHours.toFixed(1)}</p>
              <p>Utilization Rate: {utilizationRate}%</p>
            </div>
          </div>
        }
      />
    </div>
  );
}
