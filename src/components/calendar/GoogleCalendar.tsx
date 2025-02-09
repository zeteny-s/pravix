import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

// Get the Google OAuth Client ID from environment variables
const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

interface Case {
  id: string;
  title: string;
  deadline: string;
  is_task: boolean;
}

export const GoogleCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Get access token from URL hash if present
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get('provider_token');
    if (token) {
      setAccessToken(token);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const { data: googleEvents } = useQuery({
    queryKey: ['calendar-events', date, accessToken],
    queryFn: async () => {
      try {
        if (!accessToken) {
          console.log('No access token available');
          return [];
        }

        const { data, error } = await supabase.functions.invoke('get-calendar-events', {
          body: { 
            date: date?.toISOString(),
            accessToken 
          },
        });
        
        if (error) {
          console.error('Error fetching calendar events:', error);
          throw error;
        }
        
        return data.events as CalendarEvent[];
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        return [];
      }
    },
    enabled: !!accessToken && !!date,
  });

  const { data: cases } = useQuery({
    queryKey: ['case-deadlines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('id, title, deadline, is_task')
        .not('deadline', 'is', null)
        .order('deadline');
      
      if (error) throw error;
      return data as Case[];
    },
  });

  const selectedDateEvents = cases?.filter(caseItem => {
    if (!date || !caseItem.deadline) return false;
    const deadlineDate = new Date(caseItem.deadline);
    return (
      deadlineDate.getDate() === date.getDate() &&
      deadlineDate.getMonth() === date.getMonth() &&
      deadlineDate.getFullYear() === date.getFullYear()
    );
  });

  const handleGoogleAuth = () => {
    if (!GOOGLE_OAUTH_CLIENT_ID) {
      toast({
        title: "Configuration Error",
        description: "Google OAuth Client ID is not configured",
        variant: "destructive",
      });
      return;
    }
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=token&scope=https://www.googleapis.com/auth/calendar.readonly`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          {!accessToken && (
            <Button onClick={handleGoogleAuth} className="mt-4">
              Connect Google Calendar
            </Button>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">Events & Deadlines</h3>
          <div className="space-y-4">
            {selectedDateEvents?.map((caseItem) => (
              <Card key={caseItem.id} className="bg-muted">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">
                      {caseItem.title}
                      {caseItem.is_task && " (Task)"}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Deadline: {format(new Date(caseItem.deadline), 'PPp')}
                  </p>
                </CardContent>
              </Card>
            ))}
            
            {googleEvents?.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">{event.summary}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(event.start.dateTime).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
