import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID');
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Check if required credentials are available
    if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET) {
      console.error('Missing Google OAuth credentials');
      throw new Error('Google OAuth credentials are not configured');
    }

    const { date, accessToken } = await req.json();
    
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    // Convert date to RFC3339 timestamp
    const timeMin = new Date(date);
    timeMin.setHours(0, 0, 0, 0);
    const timeMax = new Date(timeMin);
    timeMax.setDate(timeMax.getDate() + 1);

    console.log(`Fetching calendar events between ${timeMin.toISOString()} and ${timeMax.toISOString()}`);

    const calendarId = 'primary';
    const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars';
    const url = `${baseUrl}/${encodeURIComponent(calendarId)}/events`;
    const params = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    const fullUrl = `${url}?${params}`;
    console.log('Requesting calendar events from URL:', fullUrl);

    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    console.log('Calendar API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Calendar API error:', errorData);
      throw new Error(`Calendar API returned status ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log(`Retrieved ${data.items?.length || 0} calendar events`);

    return new Response(
      JSON.stringify({ events: data.items || [] }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in get-calendar-events:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
