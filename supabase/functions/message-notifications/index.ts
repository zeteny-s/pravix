import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { receiverEmail, messageType } = await req.json();

    if (!receiverEmail || !messageType) {
      throw new Error('Missing required parameters');
    }

    if (!RESEND_API_KEY) {
      throw new Error('Resend API key not configured');
    }

    let subject, content;
    switch (messageType) {
      case 'new_message':
        subject = 'New Message Received';
        content = 'You have received a new message. Please log in to view it.';
        break;
      case 'message_request':
        subject = 'New Message Request';
        content = 'Someone wants to connect with you. Please log in to review the request.';
        break;
      default:
        throw new Error('Invalid message type');
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'notifications@resend.dev',
        to: receiverEmail,
        subject,
        html: `<p>${content}</p>`,
      }),
    });

    if (!emailRes.ok) {
      throw new Error('Failed to send email notification');
    }

    return new Response(
      JSON.stringify({ message: 'Notification sent successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in message-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
