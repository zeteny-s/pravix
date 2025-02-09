import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const COURT_LISTENER_BASE_URL = "https://www.courtlistener.com/api/rest/v3"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, court, page } = await req.json()
    const apiKey = Deno.env.get('COURT_LISTENER_API_KEY')

    if (!apiKey) {
      throw new Error('COURT_LISTENER_API_KEY is not configured')
    }

    console.log('Searching opinions with query:', query)

    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
    })

    if (court) {
      params.append("court", court)
    }

    const response = await fetch(
      `${COURT_LISTENER_BASE_URL}/search/?${params.toString()}`,
      {
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('CourtListener API error:', await response.text())
      throw new Error('Failed to fetch opinions')
    }

    const data = await response.json()
    console.log('Opinion search successful')

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in search-opinions:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
