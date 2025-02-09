import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text1, text2 } = await req.json()
    const apiKey = Deno.env.get('AI21_API_KEY')

    if (!apiKey) {
      throw new Error('AI21_API_KEY is not configured')
    }

    console.log('Calculating similarity between texts')

    const response = await fetch('https://api.ai21.com/studio/v1/experimental/similarity', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: [text1, text2]
      }),
    })

    if (!response.ok) {
      console.error('AI21 API error:', await response.text())
      throw new Error('Failed to calculate similarity')
    }

    const data = await response.json()
    console.log('Similarity calculation successful')

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in calculate-similarity:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
