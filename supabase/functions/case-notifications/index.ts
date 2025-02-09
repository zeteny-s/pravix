import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  recipientEmail: string;
  caseTitle: string;
  notificationType: 'deadline' | 'share' | 'update';
  deadline?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, caseTitle, notificationType, deadline } = await req.json() as NotificationRequest;

    if (!recipientEmail || !caseTitle || !notificationType) {
      throw new Error('Missing required parameters');
    }

    if (!RESEND_API_KEY) {
      throw new Error('Resend API key not configured');
    }

    let subject = '';
    let content = '';

    switch (notificationType) {
      case 'deadline':
        subject = `Deadline Approaching: ${caseTitle}`;
        content = `
          <p>Hello,</p>
          <p>This is a reminder that the case "${caseTitle}" has a deadline coming up on ${deadline}.</p>
          <p>Please review the case and take necessary actions.</p>
          <p>Best regards,<br/>Your Legal Team</p>
        `;
        break;
      case 'share':
        subject = `Case Shared: ${caseTitle}`;
        content = `
          <p>Hello,</p>
          <p>A case has been shared with you: "${caseTitle}"</p>
          <p>You can now access and collaborate on this case.</p>
          <p>Best regards,<br/>Your Legal Team</p>
        `;
        break;
      case 'update':
        subject = `Case Updated: ${caseTitle}`;
        content = `
          <p>Hello,</p>
          <p>The case "${caseTitle}" has been updated.</p>
          <p>Please review the latest changes.</p>
          <p>Best regards,<br/>Your Legal Team</p>
        `;
        break;
      default:
        throw new Error('Invalid notification type');
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'crew@pravixsolutions.com',
        to: recipientEmail,
        subject,
        html: content,
      }),
    });

    if (!emailRes.ok) {
      const error = await emailRes.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    return new Response(
      JSON.stringify({ message: 'Notification sent successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in case-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
