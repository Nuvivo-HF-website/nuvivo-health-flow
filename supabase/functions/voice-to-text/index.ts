import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audio, language = 'en' } = await req.json()
    
    if (!audio) {
      throw new Error('No audio data provided')
    }

    // Process audio in chunks to handle large files
    const binaryAudio = processBase64Chunks(audio)
    
    // Prepare form data for OpenAI Whisper
    const formData = new FormData()
    const blob = new Blob([binaryAudio], { type: 'audio/webm' })
    formData.append('file', blob, 'audio.webm')
    formData.append('model', 'whisper-1')
    formData.append('language', language)
    formData.append('response_format', 'verbose_json')

    // Send to OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API error: ${errorText}`)
    }

    const result = await response.json()

    // Enhanced response with confidence and medical keyword detection
    const enhancedResult = {
      text: result.text,
      language: result.language,
      duration: result.duration,
      confidence: calculateConfidence(result.segments || []),
      medicalKeywords: extractMedicalKeywords(result.text),
      timestamp: new Date().toISOString(),
      isHealthRelated: isHealthRelatedText(result.text)
    }

    return new Response(
      JSON.stringify(enhancedResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Voice-to-text error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallbackMessage: "Unable to process audio. Please try again or type your message."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function calculateConfidence(segments: any[]): number {
  if (!segments.length) return 0.8 // Default confidence
  
  const avgConfidence = segments.reduce((acc, seg) => acc + (seg.avg_logprob || 0), 0) / segments.length
  return Math.max(0, Math.min(1, (avgConfidence + 5) / 5)) // Normalize to 0-1
}

function extractMedicalKeywords(text: string): string[] {
  const medicalKeywords = [
    'pain', 'symptoms', 'medication', 'doctor', 'hospital', 'treatment', 'diagnosis',
    'fever', 'headache', 'nausea', 'fatigue', 'dizziness', 'breathing', 'chest',
    'blood pressure', 'heart rate', 'temperature', 'prescription', 'allergy',
    'surgery', 'injury', 'infection', 'chronic', 'acute', 'emergency'
  ]
  
  const found = medicalKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  )
  
  return found
}

function isHealthRelatedText(text: string): boolean {
  const healthIndicators = [
    'feel', 'hurt', 'pain', 'sick', 'doctor', 'hospital', 'medicine', 'treatment',
    'symptoms', 'diagnosis', 'health', 'medical', 'prescription', 'appointment'
  ]
  
  const lowerText = text.toLowerCase()
  return healthIndicators.some(indicator => lowerText.includes(indicator))
}