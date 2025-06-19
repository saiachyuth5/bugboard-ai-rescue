
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const botUserAgents = [
  'googlebot',
  'bingbot',
  'chatgptbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'discordbot',
  'whatsapp',
  'telegrambot'
]

serve(async (req) => {
  const userAgent = req.headers.get('user-agent')?.toLowerCase() || ''
  const url = new URL(req.url)
  
  // Check if this is a bot and the path is root
  const isBot = botUserAgents.some(bot => userAgent.includes(bot))
  
  if (isBot && url.pathname === '/') {
    // Redirect bots to the server-side rendered board
    return new Response(null, {
      status: 301,
      headers: {
        'Location': '/board'
      }
    })
  }
  
  // For non-bots or non-root paths, return a simple response
  return new Response('OK', { status: 200 })
})
