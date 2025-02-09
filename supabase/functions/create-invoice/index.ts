import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { client_id, amount, description, due_date } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the user from the auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Not authenticated');
    }

    // Get client details
    const { data: client } = await supabaseClient
      .from('clients')
      .select('*')
      .eq('id', client_id)
      .single();

    if (!client) {
      throw new Error('Client not found');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create or get customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: client.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: client.email,
        name: client.name,
        phone: client.phone,
      });
    }

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 30,
    });

    // Add invoice items
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      description: description,
    });

    // Get the base URL from the request
    const origin = req.headers.get('origin') || 'http://localhost:5173';

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id, {
      // Ensure proper URL construction for success and failure redirects
      success_url: `${origin}/billing/success`,
      cancel_url: `${origin}/billing/cancel`,
    });

    // Store invoice in our database
    const { data: dbInvoice, error } = await supabaseClient
      .from('invoices')
      .insert({
        user_id: user.id,
        client_id,
        stripe_invoice_id: invoice.id,
        amount,
        status: 'draft',
        due_date: due_date,
        notes: description,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ invoice: finalizedInvoice, dbInvoice }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
