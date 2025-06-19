
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const bugData = await req.json()

    // Validate required fields
    const { agent_name, title, summary, input, error, logs, bounty, status } = bugData
    
    if (!agent_name || !title || !input || !error) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: agent_name, title, input, error' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Insert bug report
    const { data, error: insertError } = await supabase
      .from('bugs')
      .insert({
        agent_name,
        title,
        summary: summary || '',
        input,
        error,
        logs: logs || [],
        bounty: bounty || 0,
        status: status || 'open',
        upvotes: 0
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Error inserting bug report:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create bug report' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('Bug report created:', data.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id,
        message: 'Bug report created successfully'
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
