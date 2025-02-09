import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { clockifyHeaders, CLOCKIFY_API_BASE } from "../_shared/clockify.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, timeEntryData } = await req.json()
    const workspaceId = 'your-workspace-id' // You'll need to get this from Clockify

    switch (action) {
      case 'start':
        const startResponse = await fetch(`${CLOCKIFY_API_BASE}/workspaces/${workspaceId}/time-entries`, {
          method: 'POST',
          headers: { ...clockifyHeaders, ...corsHeaders },
          body: JSON.stringify({
            start: new Date().toISOString(),
            description: timeEntryData.description,
            projectId: timeEntryData.projectId,
            billable: timeEntryData.billable,
            hourlyRate: timeEntryData.hourlyRate
          })
        })
        const startData = await startResponse.json()
        return new Response(JSON.stringify(startData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'stop':
        const stopResponse = await fetch(`${CLOCKIFY_API_BASE}/workspaces/${workspaceId}/user/time-entries`, {
          method: 'PATCH',
          headers: { ...clockifyHeaders, ...corsHeaders },
          body: JSON.stringify({
            end: new Date().toISOString()
          })
        })
        const stopData = await stopResponse.json()
        return new Response(JSON.stringify(stopData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'pause':
        const pauseResponse = await fetch(`${CLOCKIFY_API_BASE}/workspaces/${workspaceId}/user/time-entries`, {
          method: 'PATCH',
          headers: { ...clockifyHeaders, ...corsHeaders },
          body: JSON.stringify({
            status: 'PAUSED'
          })
        })
        const pauseData = await pauseResponse.json()
        return new Response(JSON.stringify(pauseData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'resume':
        const resumeResponse = await fetch(`${CLOCKIFY_API_BASE}/workspaces/${workspaceId}/user/time-entries`, {
          method: 'PATCH',
          headers: { ...clockifyHeaders, ...corsHeaders },
          body: JSON.stringify({
            status: 'RUNNING'
          })
        })
        const resumeData = await resumeResponse.json()
        return new Response(JSON.stringify(resumeData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
