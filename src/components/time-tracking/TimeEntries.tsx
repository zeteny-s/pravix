import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function TimeEntries() {
  const { data: timeEntries, isLoading } = useQuery({
    queryKey: ['timeEntries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .order('start_time', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading time entries...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Time Entries</h2>
        {/* We'll implement the time entries table in the next iteration */}
        <p className="text-muted-foreground">Time entries will be displayed here</p>
      </div>
    </Card>
  );
}
