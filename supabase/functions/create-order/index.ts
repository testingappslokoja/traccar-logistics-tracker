import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  console.log('Function received a request');
  console.log('Request method:', req.method);

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    console.log('Inside try block');
    const { lineItems, startCoords, destinationCoords } = await req.json()
    console.log('Parsed lineItems:', lineItems);
    console.log('Start Coords:', startCoords);
    console.log('Destination Coords:', destinationCoords);

    // Create a Supabase client with the Auth context of the user that called the function.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    console.log('Supabase client created');

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    console.log('User object:', user);

    if (!user) {
      console.log('User is not authenticated');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
    }

    const total = 0; // Placeholder
    console.log('Attempting to insert order into database');

    const { data, error } = await supabase
      .from('orders')
      .insert([{ user_id: user.id, line_items: lineItems, total: total, status: 'Placed', start_coords: startCoords, destination_coords: destinationCoords }])
      .select()

    if (error) {
      console.error('Database insertion error:', error);
      return new Response(JSON.stringify({ error: error.message, details: error.details, hint: error.hint, code: error.code }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
    }

    console.log('Order created successfully:', data);
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  } catch (err) {
    console.error('Caught an exception:', err);
    return new Response(String(err?.message ?? err), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }
})
