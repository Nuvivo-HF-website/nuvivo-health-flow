import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Anonymizer function (copied from src/lib/anonymise.ts)
type AnonTest = { 
  name: string; 
  value: number | string; 
  unit?: string; 
  reference?: string; 
};

const allowedTests = new Set([
  'Cholesterol', 'HDL', 'LDL', 'TSH', 'Glucose', 'HbA1c', 'WBC', 'RBC', 'Platelets'
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const azureOpenAIEndpoint = Deno.env.get('AZURE_OPENAI_ENDPOINT')!;
    const azureOpenAIKey = Deno.env.get('AZURE_OPENAI_KEY')!;
    const azureDeploymentName = Deno.env.get('AZURE_DEPLOYMENT_NAME')!;

    // Check required environment variables
    if (!supabaseUrl || !supabaseServiceKey || !azureOpenAIEndpoint || !azureOpenAIKey || !azureDeploymentName) {
      console.error('Missing required environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Authenticate request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with service role for data access
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    // Create client with user JWT for auth verification
    const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Authenticated user:', user.id);

    // Get request body
    const { resultId } = await req.json();
    if (!resultId) {
      return new Response(JSON.stringify({ error: 'Missing resultId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check user's AI consent
    const { data: profile, error: profileError } = await supabaseService
      .from('profiles')
      .select('ai_consent')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return new Response(JSON.stringify({ error: 'Unable to verify AI consent' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!profile?.ai_consent) {
      console.log('AI consent not granted for user:', user.id);
      return new Response(JSON.stringify({ error: 'AI consent required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Load result by resultId
    const { data: result, error: resultError } = await supabaseService
      .from('results')
      .select('*')
      .eq('id', resultId)
      .eq('user_id', user.id)
      .single();

    if (resultError || !result) {
      console.error('Result fetch error:', resultError);
      return new Response(JSON.stringify({ error: 'Result not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Found result:', result.id);

    // Use parsed_data if present
    let parsedData = result.parsed_data;
    if (!parsedData) {
      console.error('No parsed_data available for result:', resultId);
      return new Response(JSON.stringify({ error: 'No parsed data available' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Anonymize the data
    const anonymizedData = anonymiseParsed(parsedData);
    
    // Check if we have any tests after anonymization
    if (anonymizedData.tests.length === 0) {
      console.log('No valid tests found after anonymization');
      return new Response(JSON.stringify({ error: 'No valid test data available' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Anonymized tests count:', anonymizedData.tests.length);

    // Build system prompt EXACTLY as specified
    const systemPrompt = "You are a clinical assistant generating short, non-alarming patient-friendly summaries from ANONYMISED lab values only. NEVER ask for or infer identity. Output 2–4 sentences, avoid jargon, include one next step like 'discuss with your GP'. At the end add: 'This is not a diagnosis; consult your GP.'";

    // Build user prompt with bullet-list of tests
    const testList = anonymizedData.tests.map(test => {
      const valueStr = test.value !== null ? String(test.value) : 'N/A';
      const unitStr = test.unit ? ` ${test.unit}` : '';
      const refStr = test.reference ? ` (Reference: ${test.reference})` : '';
      return `• ${test.name}: ${valueStr}${unitStr}${refStr}`;
    }).join('\n');

    const userPrompt = `Blood test results:\n${testList}`;

    console.log('Calling Azure OpenAI...');

    // Call Azure OpenAI
    const azureUrl = `${azureOpenAIEndpoint}/openai/deployments/${azureDeploymentName}/chat/completions?api-version=2024-06-01-preview`;
    
    const openAIResponse = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'api-key': azureOpenAIKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('Azure OpenAI API error:', openAIResponse.status, errorText);
      return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIData = await openAIResponse.json();
    const aiSummary = openAIData.choices?.[0]?.message?.content;

    if (!aiSummary) {
      console.error('No summary generated from AI');
      return new Response(JSON.stringify({ error: 'Failed to generate summary' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generated summary length:', aiSummary.length);

    // Update results table with AI summary
    const { error: updateError } = await supabaseService
      .from('results')
      .update({
        ai_summary: aiSummary,
        ai_generated_at: new Date().toISOString(),
      })
      .eq('id', resultId);

    if (updateError) {
      console.error('Failed to update result:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to save summary' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log to ai_logs
    const { error: logError } = await supabaseService
      .from('ai_logs')
      .insert({
        result_id: resultId,
        model: 'azure-openai',
        response_snippet: aiSummary.slice(0, 200),
      });

    if (logError) {
      console.error('Failed to log AI usage:', logError);
      // Don't fail the request for logging errors
    }

    console.log('Summary generation completed successfully');

    return new Response(JSON.stringify({ ai_summary: aiSummary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
