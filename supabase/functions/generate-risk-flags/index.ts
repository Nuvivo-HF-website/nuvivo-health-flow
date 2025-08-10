import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// Anonymization logic (copied from src/lib/anonymise.ts)
type AnonTest = { 
  name: string; 
  value: number | string; 
  unit?: string; 
  reference?: string; 
};

const allowedTests = new Set([
  'Cholesterol',
  'HDL', 
  'LDL', 
  'TSH', 
  'Glucose', 
  'HbA1c', 
  'WBC', 
  'RBC', 
  'Platelets'
]);

function anonymiseParsed(raw: any): { tests: AnonTest[]; sample_date?: string } {
  const tests: AnonTest[] = [];
  
  if (!raw || !Array.isArray(raw.tests)) {
    return { tests: [] };
  }
  
  for (const t of raw.tests) {
    const name = String(t.name || '').trim();
    if (!allowedTests.has(name)) continue;
    
    const value = t.value === undefined ? null : (Number(t.value) ?? t.value);
    
    tests.push({ 
      name, 
      value, 
      unit: t.unit || null, 
      reference: t.reference || null 
    });
  }
  
  return { 
    tests, 
    sample_date: raw.sample_date || null 
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  flaggedTests: string[];
  reasoning?: string;
}

const RISK_SCORE_MAP = {
  low: 1,
  medium: 2,
  high: 3
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Authentication failed:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is staff (admin or doctor)
    const { data: userRoles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (rolesError) {
      console.error('Error checking user roles:', rolesError);
      return new Response(JSON.stringify({ error: 'Failed to verify permissions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isStaff = userRoles?.some(ur => ['admin', 'doctor'].includes(ur.role));
    if (!isStaff) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { resultId } = await req.json();

    if (!resultId) {
      return new Response(JSON.stringify({ error: 'Result ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch the result
    const { data: result, error: resultError } = await supabaseClient
      .from('results')
      .select('id, parsed_data, user_id')
      .eq('id', resultId)
      .single();

    if (resultError || !result) {
      console.error('Result not found:', resultError);
      return new Response(JSON.stringify({ error: 'Result not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if risk flags already exist
    const { data: existingResult } = await supabaseClient
      .from('results')
      .select('ai_flags, ai_risk_score')
      .eq('id', resultId)
      .single();

    if (existingResult?.ai_flags) {
      return new Response(JSON.stringify({ 
        message: 'Risk flags already exist',
        ai_flags: existingResult.ai_flags,
        ai_risk_score: existingResult.ai_risk_score
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Anonymize the parsed data
    const anonymizedData = anonymiseParsed(result.parsed_data);

    if (!anonymizedData.tests || anonymizedData.tests.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid test data to analyze' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generating risk flags for result ${resultId} with ${anonymizedData.tests.length} tests`);

    // Prepare system prompt for Azure OpenAI
    const systemPrompt = `You are a clinical assistant analyzing anonymized laboratory values. 
Analyze the provided lab values and reference ranges to identify potential health risks.

Respond with a JSON object containing:
{
  "riskLevel": "low" | "medium" | "high",
  "flaggedTests": ["test_name1", "test_name2"],
  "reasoning": "Brief clinical reasoning"
}

Risk levels:
- low: All values within normal ranges or minor deviations
- medium: Some values outside normal ranges requiring attention
- high: Critical values or patterns indicating urgent medical attention

Only include test names in flaggedTests if they are significantly outside normal ranges.
No PII is included in this data.`;

    const userPrompt = `Analyze these anonymized lab results:
${JSON.stringify(anonymizedData, null, 2)}

Provide risk assessment in the specified JSON format.`;

    // Call Azure OpenAI (EU region)
    const azureEndpoint = Deno.env.get('AZURE_OPENAI_ENDPOINT');
    const azureKey = Deno.env.get('AZURE_OPENAI_KEY');
    const deploymentName = Deno.env.get('AZURE_DEPLOYMENT_NAME');

    if (!azureEndpoint || !azureKey || !deploymentName) {
      console.error('Missing Azure OpenAI configuration');
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = await fetch(`${azureEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`, {
      method: 'POST',
      headers: {
        'api-key': azureKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Azure OpenAI API error:', errorText);
      return new Response(JSON.stringify({ error: 'AI analysis failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0]?.message?.content;

    if (!aiContent) {
      console.error('No content in AI response');
      return new Response(JSON.stringify({ error: 'AI analysis incomplete' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse AI response
    let riskAssessment: RiskAssessment;
    try {
      riskAssessment = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return new Response(JSON.stringify({ error: 'AI response format error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate risk assessment structure
    if (!riskAssessment.riskLevel || !['low', 'medium', 'high'].includes(riskAssessment.riskLevel)) {
      console.error('Invalid risk level in AI response');
      return new Response(JSON.stringify({ error: 'Invalid AI risk assessment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const riskScore = RISK_SCORE_MAP[riskAssessment.riskLevel];

    // Update result with risk flags and score
    const { error: updateError } = await supabaseClient
      .from('results')
      .update({
        ai_flags: riskAssessment,
        ai_risk_score: riskScore,
      })
      .eq('id', resultId);

    if (updateError) {
      console.error('Failed to update result with risk flags:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to save risk assessment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log audit entry
    const { error: logError } = await supabaseClient
      .from('ai_logs')
      .insert({
        result_id: resultId,
        model: 'azure-openai-risk-flags',
        response_snippet: aiContent.substring(0, 200),
      });

    if (logError) {
      console.error('Failed to create audit log:', logError);
      // Don't fail the request for logging errors
    }

    console.log(`Risk flags generated successfully for result ${resultId}: ${riskAssessment.riskLevel} (${riskScore})`);

    return new Response(JSON.stringify({
      message: 'Risk flags generated successfully',
      ai_flags: riskAssessment,
      ai_risk_score: riskScore,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-risk-flags function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});