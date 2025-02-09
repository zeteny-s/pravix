import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "../MetricCard";
import { isWithinInterval } from "date-fns";
import { D3CaseDistributionChart } from "../charts/D3CaseDistributionChart";
import { Briefcase, Calendar, Trophy } from "lucide-react";

interface CaseMetricsSectionProps {
  dateRange: { from: Date; to: Date };
}

export function CaseMetricsSection({ dateRange }: CaseMetricsSectionProps) {
  const { data: cases } = useQuery({
    queryKey: ['cases', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*, case_outcomes(*)');
      
      if (error) throw error;
      return data.filter((c) => 
        c.created_at && 
        isWithinInterval(new Date(c.created_at), { 
          start: dateRange.from, 
          end: dateRange.to 
        })
      );
    },
  });

  const activeCases = cases?.filter(c => c.status === 'active') || [];
  const closedCases = cases?.filter(c => c.status === 'closed') || [];
  const pendingCases = cases?.filter(c => c.status === 'pending') || [];
  
  const upcomingDeadlines = cases?.filter(c => 
    c.deadline && 
    isWithinInterval(new Date(c.deadline), { 
      start: dateRange.from, 
      end: dateRange.to 
    })
  ) || [];

  const caseDistributionData = [
    { name: 'Active', value: activeCases.length, color: '#0088FE' },
    { name: 'Closed', value: closedCases.length, color: '#00C49F' },
    { name: 'Pending', value: pendingCases.length, color: '#FFBB28' }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Case Distribution"
        value={cases?.length || 0}
        description="Total cases in selected period"
        icon={<Briefcase className="h-5 w-5" />}
        chart={<D3CaseDistributionChart data={caseDistributionData} height={100} />}
        expandedChart={<D3CaseDistributionChart data={caseDistributionData} height={400} />}
        detailView={
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Case Status Breakdown</h3>
              <div className="grid gap-4">
                {caseDistributionData.map((status) => (
                  <div key={status.name} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                      <span className="font-medium">{status.name}</span>
                    </div>
                    <span className="font-bold">{status.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Cases</h3>
              <div className="space-y-3">
                {cases?.slice(0, 5).map((c) => (
                  <div key={c.id} className="p-3 bg-accent/5 rounded-lg">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Status: {c.status} • Created: {new Date(c.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />
      
      <MetricCard
        title="Upcoming Deadlines"
        value={upcomingDeadlines.length}
        description="Deadlines in selected period"
        icon={<Calendar className="h-5 w-5" />}
        detailView={
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Deadline Timeline</h3>
            <div className="space-y-4">
              {upcomingDeadlines.map((c) => (
                <div key={c.id} className="p-4 bg-accent/5 rounded-lg">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Due: {new Date(c.deadline).toLocaleDateString()}
                  </div>
                  <div className="text-sm mt-2">{c.description}</div>
                </div>
              ))}
            </div>
          </div>
        }
      />
      
      <MetricCard
        title="Case Success Rate"
        value={`${cases?.length ? 
          ((closedCases.length / cases.length) * 100).toFixed(1) : 0}%`}
        description="Successfully closed cases"
        icon={<Trophy className="h-5 w-5" />}
        detailView={
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Success Metrics</h3>
              <div className="grid gap-4">
                <div className="p-4 bg-accent/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Cases</div>
                  <div className="text-2xl font-bold mt-1">{cases?.length || 0}</div>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Closed Cases</div>
                  <div className="text-2xl font-bold mt-1">{closedCases.length}</div>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Average Case Duration</div>
                  <div className="text-2xl font-bold mt-1">
                    {closedCases.length ? 
                      `${Math.round(closedCases.reduce((acc, c) => {
                        const duration = new Date(c.updated_at).getTime() - new Date(c.created_at).getTime();
                        return acc + duration / (1000 * 60 * 60 * 24);
                      }, 0) / closedCases.length)} days` : 
                      'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
