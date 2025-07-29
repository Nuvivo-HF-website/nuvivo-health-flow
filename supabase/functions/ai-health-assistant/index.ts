import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HealthQuery {
  query: string
  userHealth?: {
    age?: number
    gender?: string
    conditions?: string[]
    medications?: string[]
    symptoms?: string[]
    vitalSigns?: any
  }
  conversationHistory?: Array<{role: string, content: string}>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, userHealth, conversationHistory }: HealthQuery = await req.json()
    
    if (!query) {
      throw new Error('No query provided')
    }

    // Build comprehensive health context
    const healthContext = userHealth ? `
Patient Context:
- Age: ${userHealth.age || 'Not specified'}
- Gender: ${userHealth.gender || 'Not specified'}
- Medical Conditions: ${userHealth.conditions?.join(', ') || 'None specified'}
- Current Medications: ${userHealth.medications?.join(', ') || 'None specified'}
- Current Symptoms: ${userHealth.symptoms?.join(', ') || 'None specified'}
- Recent Vital Signs: ${JSON.stringify(userHealth.vitalSigns) || 'None available'}
` : ''

    const systemPrompt = `You are an advanced AI Health Assistant integrated into a comprehensive healthcare platform. You provide intelligent, evidence-based health insights while emphasizing the importance of professional medical care.

Key Capabilities:
- Analyze symptoms and provide risk assessments
- Explain medical test results and their implications
- Suggest lifestyle modifications and health improvements
- Identify potential medication interactions
- Recommend when to seek immediate medical attention
- Provide personalized health education

Guidelines:
- Always prioritize patient safety and recommend professional medical consultation for serious concerns
- Provide clear, actionable recommendations based on evidence-based medicine
- Be empathetic and supportive while maintaining clinical accuracy
- Explain medical concepts in understandable language
- Include risk levels (Low/Moderate/High) for symptom assessments
- Suggest specific follow-up actions and timelines

${healthContext}

Remember: You are not replacing medical professionals but enhancing healthcare by providing intelligent insights and guidance.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: query }
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY'),
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.3,
        messages: messages.slice(-10) // Keep last 10 messages for context
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Anthropic API error: ${errorText}`)
    }

    const result = await response.json()
    const assistantResponse = result.content[0].text

    // Enhanced response with structured data
    const enhancedResponse = {
      response: assistantResponse,
      timestamp: new Date().toISOString(),
      riskLevel: extractRiskLevel(assistantResponse),
      recommendations: extractRecommendations(assistantResponse),
      urgency: extractUrgency(assistantResponse)
    }

    return new Response(
      JSON.stringify(enhancedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Health Assistant error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallbackMessage: "I'm having trouble processing your request right now. For urgent health concerns, please contact your healthcare provider or emergency services immediately."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function extractRiskLevel(text: string): 'Low' | 'Moderate' | 'High' | 'Unknown' {
  const lowRisk = /low.{0,20}risk/i.test(text)
  const highRisk = /high.{0,20}risk|urgent|emergency|immediate/i.test(text)
  const moderateRisk = /moderate.{0,20}risk|caution/i.test(text)
  
  if (highRisk) return 'High'
  if (moderateRisk) return 'Moderate'
  if (lowRisk) return 'Low'
  return 'Unknown'
}

function extractRecommendations(text: string): string[] {
  const recommendations: string[] = []
  const lines = text.split('\n')
  
  for (const line of lines) {
    if (line.includes('•') || line.includes('-') || line.includes('*')) {
      const clean = line.replace(/[•\-*]/g, '').trim()
      if (clean && clean.length > 10) {
        recommendations.push(clean)
      }
    }
  }
  
  return recommendations.slice(0, 5) // Limit to top 5 recommendations
}

function extractUrgency(text: string): 'Immediate' | 'Soon' | 'Routine' | 'Monitor' {
  if (/emergency|urgent|immediate|911|ER/i.test(text)) return 'Immediate'
  if (/within.{0,10}(24|48).{0,10}hours?|soon|promptly/i.test(text)) return 'Soon'
  if (/routine|schedule|regular|when convenient/i.test(text)) return 'Routine'
  return 'Monitor'
}