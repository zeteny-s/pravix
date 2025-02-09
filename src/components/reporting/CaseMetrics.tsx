import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "./MetricCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { isWithinInterval } from "date-fns";

interface CaseMetricsProps {
  dateRange: { from: Date; to: Date };
}

export function CaseMetrics({ dateRange }: CaseMetricsProps) {
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

  const { data: caseOutcomes } = useQuery({
    queryKey: ['case-outcomes', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_outcomes')
        .select('*');
      
      if (error) throw error;
      return data.filter((outcome) => 
        outcome.resolution_date && 
        isWithinInterval(new Date(outcome.resolution_date), { 
          start: dateRange.from, 
          end: dateRange.to 
        })
      );
    },
  });

  const activeCases = cases?.filter(c => c.status === 'active') || [];
  const upcomingDeadlines = cases?.filter(c => 
    c.deadline && 
    isWithinInterval(new Date(c.deadline), { 
      start: dateRange.from, 
      end: dateRange.to 
    })
  ) || [];

  const successRate = caseOutcomes?.length ? 
    (caseOutcomes.filter(outcome => outcome.outcome_type === 'won').length / caseOutcomes.length * 100).toFixed(1) : 
    0;

  const caseStatusData = [
    { name: 'Active', count: activeCases.length },
    { name: 'Upcoming Deadlines', count: upcomingDeadlines.length },
    { name: 'Completed', count: caseOutcomes?.length || 0 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Active Cases"
        value={activeCases.length}
        description="Current open cases"
        chart={
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={caseStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        }
        detailView={
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Active Cases Breakdown</h3>
            <div className="divide-y">
              {activeCases.map((c) => (
                <div key={c.id} className="py-2">
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />
      
      <MetricCard
        title="Upcoming Deadlines"
        value={upcomingDeadlines.length}
        description="Deadlines in selected date range"
        detailView={
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
            <div className="divide-y">
              {upcomingDeadlines.map((c) => (
                <div key={c.id} className="py-2">
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(c.deadline).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        }
      />
      
      <MetricCard
        title="Case Success Rate"
        value={`${successRate}%`}
        description="Cases won or successfully settled"
        detailView={
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Case Outcomes</h3>
            <div className="divide-y">
              {caseOutcomes?.map((outcome) => (
                <div key={outcome.id} className="py-2">
                  <p className="font-medium capitalize">{outcome.outcome_type}</p>
                  <p className="text-sm text-muted-foreground">
                    {outcome.resolution_details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
}
