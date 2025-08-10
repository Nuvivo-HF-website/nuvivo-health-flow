import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AI-REPORT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const azureEndpoint = Deno.env.get("AZURE_OPENAI_ENDPOINT");
    const azureApiKey = Deno.env.get("AZURE_OPENAI_API_KEY");
    const azureDeploymentName = Deno.env.get("AZURE_DEPLOYMENT_NAME") || "gpt-4o-mini";
    if (!azureEndpoint || !azureApiKey) {
      throw new Error("Azure OpenAI credentials not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.id) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id });

    const { bloodTestResults, patientInfo } = await req.json();

    // Validate blood test results
    if (!bloodTestResults || !Array.isArray(bloodTestResults) || bloodTestResults.length === 0) {
      throw new Error("Valid blood test results are required");
    }

    // Build NHS-compliant prompt
    const systemPrompt = `You are an NHS-approved AI assistant providing blood test interpretations for healthcare professionals. 

CRITICAL NHS REQUIREMENTS:
- All interpretations must be preliminary and require clinical validation
- Include standard NHS disclaimers about seeking medical advice
- Use NHS reference ranges when available
- Highlight any critical values requiring immediate attention
- Maintain professional medical terminology
- Structure output as JSON with clear sections

Return response as JSON with this structure:
{
  "summary": "Brief clinical summary",
  "keyFindings": ["List of key findings"],
  "criticalValues": ["Any critical values requiring immediate attention"],
  "recommendations": ["Clinical recommendations"],
  "disclaimer": "NHS-compliant disclaimer text"
}`;

    const userPrompt = `Patient Information:
${patientInfo ? `Age: ${patientInfo.age || 'Not specified'}
Gender: ${patientInfo.gender || 'Not specified'}
Medical Conditions: ${patientInfo.medicalConditions?.join(', ') || 'None specified'}
Current Medications: ${patientInfo.currentMedications?.join(', ') || 'None specified'}` : 'Limited patient information available'}

Blood Test Results:
${bloodTestResults.map(result => 
  `${result.testName}: ${result.value} ${result.unit || ''} (Reference: ${result.referenceRange || 'Not specified'})`
).join('\n')}

Please provide a comprehensive NHS-compliant interpretation of these blood test results.`;

    logStep("Calling Azure OpenAI API");

    const response = await fetch(`${azureEndpoint}/openai/deployments/${azureDeploymentName}/chat/completions?api-version=2024-06-01-preview`, {
      method: 'POST',
      headers: {
        'api-key': azureApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      logStep("Azure OpenAI API error", { status: response.status, error: errorData });
      throw new Error(`Azure OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    logStep("AI response received");

    // Parse JSON response
    let interpretation;
    try {
      interpretation = JSON.parse(content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      interpretation = {
        summary: "AI interpretation generated",
        keyFindings: [content.substring(0, 500) + "..."],
        criticalValues: [],
        recommendations: ["Please review with qualified healthcare professional"],
        disclaimer: "This is an AI-generated interpretation and must be validated by a qualified healthcare professional before clinical use."
      };
    }

    // Create audit log
    await supabaseClient.from("medical_documents").insert({
      user_id: user.id,
      document_name: `AI Blood Test Interpretation - ${new Date().toISOString().split('T')[0]}`,
      document_type: "ai_interpretation",
      description: "AI-generated blood test interpretation",
      file_url: "", // No file for AI interpretation
      tags: ["ai-generated", "blood-test", "interpretation"]
    });

    logStep("Audit log created");

    return new Response(JSON.stringify(interpretation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in AI report generation", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});