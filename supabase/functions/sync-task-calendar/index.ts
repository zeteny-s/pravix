import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID');
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { task, accessToken } = await req.json();

    if (!accessToken) {
      throw new Error('No access token provided');
    }

    // Create calendar event
    const event = {
      summary: task.title,
      description: task.description,
      start: {
        dateTime: new Date(task.deadline).toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(task.deadline).toISOString(),
        timeZone: 'UTC',
      },
    };

    const calendarResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!calendarResponse.ok) {
      throw new Error('Failed to create calendar event');
    }

    const calendarEvent = await calendarResponse.json();

    return new Response(
      JSON.stringify({ success: true, event: calendarEvent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
