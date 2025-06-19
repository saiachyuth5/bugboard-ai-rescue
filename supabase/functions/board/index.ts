
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

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch the 20 most recent bugs
    const { data: bugs, error } = await supabase
      .from('bugs')
      .select('id, title, status, bounty, created_at, agent_name')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching bugs:', error)
      return new Response('Error fetching bugs', { status: 500 })
    }

    // Generate HTML response
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BugBoard AI - Bug Reports</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Courier New', monospace; }
    </style>
</head>
<body class="min-h-screen bg-gray-900 text-gray-100">
    <div class="container mx-auto px-4 py-8">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-green-400 mb-2">BugBoard AI</h1>
            <p class="text-gray-400">When your AI agent breaks, let the internet fix it.</p>
        </header>
        
        <div class="bg-gray-800 border border-gray-700 rounded overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-700">
                    <tr>
                        <th class="px-6 py-3 text-left text-sm font-mono text-gray-300">Title</th>
                        <th class="px-6 py-3 text-left text-sm font-mono text-gray-300">Agent</th>
                        <th class="px-6 py-3 text-left text-sm font-mono text-gray-300">Status</th>
                        <th class="px-6 py-3 text-left text-sm font-mono text-gray-300">Bounty</th>
                        <th class="px-6 py-3 text-left text-sm font-mono text-gray-300">Created</th>
                    </tr>
                </thead>
                <tbody>
                    ${bugs?.map(bug => `
                        <tr class="border-t border-gray-700 hover:bg-gray-750">
                            <td class="px-6 py-4 text-gray-100 font-mono">${bug.title}</td>
                            <td class="px-6 py-4 text-gray-300 font-mono text-sm">${bug.agent_name}</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 rounded text-xs font-mono border ${
                                  bug.status === 'open' ? 'text-red-400 bg-red-900/20 border-red-700' :
                                  bug.status === 'in-progress' ? 'text-yellow-400 bg-yellow-900/20 border-yellow-700' :
                                  'text-green-400 bg-green-900/20 border-green-700'
                                }">
                                    ${bug.status.toUpperCase()}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-green-400 font-mono font-bold">$${(bug.bounty / 100).toFixed(2)}</td>
                            <td class="px-6 py-4 text-gray-400 font-mono text-sm">${new Date(bug.created_at).toLocaleDateString()}</td>
                        </tr>
                    `).join('') || '<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">No bugs found</td></tr>'}
                </tbody>
            </table>
        </div>
        
        <div class="mt-8 text-center">
            <p class="text-gray-500 font-mono text-sm">
                This page is optimized for web crawlers and bots. 
                <a href="/" class="text-green-400 hover:text-green-300">Visit the interactive version</a>
            </p>
        </div>
    </div>
    
    <!-- Load React app for human users -->
    <script type="module">
        // Only load React if this is a human user (has JavaScript enabled)
        if (typeof window !== 'undefined') {
            import('/src/main.tsx');
        }
    </script>
</body>
</html>
    `

    return new Response(html, {
      status: 200,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})
