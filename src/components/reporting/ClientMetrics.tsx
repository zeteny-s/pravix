import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "./MetricCard";
import { isWithinInterval } from "date-fns";

interface ClientMetricsProps {
  dateRange: { from: Date; to: Date };
}

export function ClientMetrics({ dateRange }: ClientMetricsProps) {
  const { data: clients } = useQuery({
    queryKey: ['clients', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      
      if (error) throw error;
      return data.filter((client) => 
        client.created_at && 
        isWithinInterval(new Date(client.created_at), { 
          start: dateRange.from, 
          end: dateRange.to 
        })
      );
    },
  });

  const { data: referrals } = useQuery({
    queryKey: ['client-referrals', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_referrals')
        .select('*, referring_client:clients!client_referrals_referring_client_id_fkey(name), referred_client:clients!client_referrals_referred_client_id_fkey(name)');
      
      if (error) throw error;
      return data.filter((referral) => 
        referral.referral_date && 
        isWithinInterval(new Date(referral.referral_date), { 
          start: dateRange.from, 
          end: dateRange.to 
        })
      );
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Total Clients"
        value={clients?.length || 0}
        description="Active clients"
        detailView={
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Client List</h3>
            <div className="divide-y">
              {clients?.map((client) => (
                <div key={client.id} className="py-2">
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {client.company && `${client.company} - `}{client.email}
                  </p>
                </div>
              ))}
            </div>
          </div>
        }
      />
      
      <MetricCard
        title="Client Referrals"
        value={referrals?.length || 0}
        description="Total client referrals"
        detailView={
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Referral Details</h3>
            <div className="divide-y">
              {referrals?.map((referral) => (
                <div key={referral.id} className="py-2">
                  <p className="font-medium">
                    {referral.referring_client?.name} → {referral.referred_client?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(referral.referral_date).toLocaleDateString()} - {referral.status}
                  </p>
                  {referral.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{referral.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
}
