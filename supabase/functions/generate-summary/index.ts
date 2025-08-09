import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logStep = (step: string, data?: any) => {
  console.log(`[generate-summary] ${step}`, data ? JSON.stringify(data, null, 2) : '');
}

interface BloodTestValue {
  name: string;
  value: string | number;
  unit?: string;
  reference?: string;
  status?: 'normal' | 'high' | 'low' | 'critical';
}

interface AnonymizedData {
  tests: BloodTestValue[];
  age_range?: string; // "20-30", "30-40", etc.
  gender?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Starting AI summary generation');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth token
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      logStep('Authentication failed', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication required' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logStep('User authenticated', { userId: user.id });

    // Check AI consent
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ai_consent')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile?.ai_consent) {
      logStep('AI consent not granted', profileError);
      return new Response(
        JSON.stringify({ error: 'AI consent required. Please enable AI insights in your profile.' }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logStep('AI consent confirmed');

    // Parse request body
    const { resultId } = await req.json();
    
    if (!resultId) {
      return new Response(
        JSON.stringify({ error: 'Result ID is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the blood test result
    const { data: result, error: resultError } = await supabase
      .from('results')
      .select('*')
      .eq('id', resultId)
      .eq('user_id', user.id)
      .single();

    if (resultError || !result) {
      logStep('Result not found', resultError);
      return new Response(
        JSON.stringify({ error: 'Blood test result not found' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logStep('Retrieved result', { resultId, hasData: !!result.parsed_data });

    // Anonymize the data - only keep clinical values
    const anonymizedData: AnonymizedData = {
      tests: []
    };

    // Extract and sanitize test values from parsed_data
    if (result.parsed_data && typeof result.parsed_data === 'object') {
      const data = result.parsed_data as any;
      
      // Handle different possible data structures
      if (data.tests && Array.isArray(data.tests)) {
        anonymizedData.tests = data.tests.map((test: any) => ({
          name: test.name || test.test_name || 'Unknown Test',
          value: test.value || test.result_value || 'N/A',
          unit: test.unit || test.units || '',
          reference: test.reference || test.reference_range || '',
          status: test.status || 'normal'
        }));
      } else if (data.biomarkers && Array.isArray(data.biomarkers)) {
        anonymizedData.tests = data.biomarkers.map((biomarker: any) => ({
          name: biomarker.name || 'Unknown Test',
          value: biomarker.value || 'N/A',
          unit: biomarker.unit || '',
          reference: biomarker.reference_range || '',
          status: biomarker.status || 'normal'
        }));
      } else {
        // Try to extract from flat structure
        Object.keys(data).forEach(key => {
          if (typeof data[key] === 'object' && data[key].value !== undefined) {
            anonymizedData.tests.push({
              name: key,
              value: data[key].value,
              unit: data[key].unit || '',
              reference: data[key].reference || '',
              status: data[key].status || 'normal'
            });
          }
        });
      }
    }

    logStep('Anonymized data prepared', { testCount: anonymizedData.tests.length });

    if (anonymizedData.tests.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No test data found to analyze' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare OpenAI prompt
    const systemPrompt = `You are a medical AI assistant that creates patient-friendly explanations of blood test results. 
Your role is to help patients understand their test results in simple, clear language while emphasizing that this is for educational purposes only.

Guidelines:
- Use simple, non-medical language
- Explain what each test measures and why it matters
- If values are outside normal ranges, explain what this might indicate
- Always emphasize that only a healthcare provider can make medical decisions
- Keep explanations concise but informative
- Focus on actionable insights where appropriate
- If critical values are present, emphasize the need for immediate medical attention

The data provided contains only clinical test values - no personal identifying information.`;

    const userPrompt = `Please provide a patient-friendly summary of these blood test results:

${anonymizedData.tests.map(test => 
  `- ${test.name}: ${test.value} ${test.unit} (Reference: ${test.reference}) [Status: ${test.status}]`
).join('\n')}

Please structure your response as a clear, encouraging summary that helps the patient understand their results while emphasizing the importance of discussing with their healthcare provider.`;

    logStep('Calling OpenAI API');

    // Call OpenAI API
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!openAIResponse.ok) {
      logStep('OpenAI API error', { status: openAIResponse.status });
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }), 
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIData = await openAIResponse.json();
    const summary = openAIData.choices[0]?.message?.content;

    if (!summary) {
      logStep('No summary generated');
      return new Response(
        JSON.stringify({ error: 'Failed to generate summary' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logStep('AI summary generated', { length: summary.length });

    // Update the result with AI summary
    const { error: updateError } = await supabase
      .from('results')
      .update({
        ai_summary: summary,
        ai_generated_at: new Date().toISOString()
      })
      .eq('id', resultId);

    if (updateError) {
      logStep('Failed to update result', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save summary' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log AI usage for audit trail
    const { error: logError } = await supabase
      .from('ai_logs')
      .insert({
        result_id: resultId,
        model: 'gpt-4o-mini',
        response_snippet: summary.substring(0, 200)
      });

    if (logError) {
      logStep('Failed to create audit log', logError);
    }

    logStep('Summary generation completed successfully');

    return new Response(
      JSON.stringify({ 
        summary,
        disclaimer: "This AI-generated summary is for educational purposes only and should not replace professional medical advice. Please discuss these results with your healthcare provider."
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logStep('Unexpected error', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
