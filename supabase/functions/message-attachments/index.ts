import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const messageId = formData.get('messageId') as string;
    const receiverEmail = formData.get('receiverEmail') as string;

    // Validate file
    if (!file) {
      throw new Error('No file uploaded');
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only PDF, DOCX, and JPEG files are allowed.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit.');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate safe filename
    const fileExt = file.name.split('.').pop();
    const safeFileName = `${crypto.randomUUID()}.${fileExt}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('message_attachments')
      .upload(safeFileName, file);

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Save attachment metadata to database
    const { error: dbError } = await supabase
      .from('message_attachments')
      .insert({
        message_id: messageId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: safeFileName,
      });

    if (dbError) {
      throw new Error(`Failed to save attachment metadata: ${dbError.message}`);
    }

    // Send email notification if receiver email is provided
    if (receiverEmail && RESEND_API_KEY) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'notifications@resend.dev',
          to: receiverEmail,
          subject: 'New Message Attachment',
          html: `<p>You have received a new message with an attachment. Please log in to view it.</p>`,
        }),
      });

      if (!emailRes.ok) {
        console.error('Failed to send email notification:', await emailRes.text());
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'File uploaded successfully',
        path: uploadData?.path 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in message-attachments function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
