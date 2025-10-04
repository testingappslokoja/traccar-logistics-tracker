import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
    }

    const { orderId } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const deviceId = 1;

    const traccarUrl = Deno.env.get('TRACCAR_API_URL') + '/api/positions';
    const traccarUsername = Deno.env.get('TRACCAR_USERNAME');
    const traccarPassword = Deno.env.get('TRACCAR_PASSWORD');

    const traccarRes = await fetch(traccarUrl, {
      headers: {
        'Authorization': 'Basic ' + btoa(traccarUsername + ':' + traccarPassword),
        'Accept': 'application/json'
      }
    });

    if (!traccarRes.ok) {
      throw new Error(`Traccar API request failed with status ${traccarRes.status}`);
    }

    const positions = await traccarRes.json();
    const latestPosition = positions.find(p => p.deviceId === deviceId);

    if (!latestPosition) {
      throw new Error(`Could not find position for deviceId ${deviceId}`);
    }

    return new Response(JSON.stringify(latestPosition), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })

  } catch (err) {
    console.error('Caught an exception in get-order-location:', err);
    return new Response(String(err?.message ?? err), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }
})
