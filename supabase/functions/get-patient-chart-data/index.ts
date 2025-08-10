import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NormalizedTestResult {
  test_name: string;
  value: number;
  unit: string;
  reference_min: number;
  reference_max: number;
  date: string; // ISO8601
  result_id: string;
}

interface ChartDataResponse {
  test_results: NormalizedTestResult[];
  test_names: string[];
}

// Unit conversion functions
const UNIT_CONVERSIONS: Record<string, Record<string, number>> = {
  // Cholesterol: mmol/L to mg/dL (multiply by 38.67)
  'cholesterol': {
    'mmol/l': 38.67,
    'mg/dl': 1,
  },
  // Glucose: mmol/L to mg/dL (multiply by 18.02)
  'glucose': {
    'mmol/l': 18.02,
    'mg/dl': 1,
  },
  // Default: no conversion
  'default': {
    'default': 1,
  }
};

function normalizeUnit(testName: string, unit: string): string {
  const normalizedTestName = testName.toLowerCase();
  const normalizedUnit = unit.toLowerCase().replace(/\s+/g, '');
  
  if (UNIT_CONVERSIONS[normalizedTestName]) {
    // Return the preferred unit (first one in the conversion table)
    return Object.keys(UNIT_CONVERSIONS[normalizedTestName])[1] || unit; // Skip conversion factor, get actual unit
  }
  
  return unit;
}

function convertValue(testName: string, value: number, fromUnit: string, toUnit: string): number {
  const normalizedTestName = testName.toLowerCase();
  const normalizedFromUnit = fromUnit.toLowerCase().replace(/\s+/g, '');
  const normalizedToUnit = toUnit.toLowerCase().replace(/\s+/g, '');
  
  if (normalizedFromUnit === normalizedToUnit) {
    return value;
  }
  
  const conversions = UNIT_CONVERSIONS[normalizedTestName] || UNIT_CONVERSIONS['default'];
  const fromFactor = conversions[normalizedFromUnit] || 1;
  const toFactor = conversions[normalizedToUnit] || 1;
  
  // Convert from source unit to base, then to target unit
  return (value * fromFactor) / toFactor;
}

function parseReferenceRange(reference: string): { min: number; max: number } {
  if (!reference || typeof reference !== 'string') {
    return { min: 0, max: 100 }; // Default fallback
  }
  
  // Handle various reference range formats
  // Examples: "3.0-5.2", "< 5.0", "> 1.0", "3.0 - 5.2", "Normal: 3.0-5.2"
  const cleaned = reference.replace(/[^\d\.\-<>]/g, ' ').trim();
  
  // Pattern for range like "3.0-5.2" or "3.0 - 5.2"
  const rangeMatch = cleaned.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
  if (rangeMatch) {
    return {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2])
    };
  }
  
  // Pattern for "< 5.0"
  const lessThanMatch = cleaned.match(/<\s*(\d+\.?\d*)/);
  if (lessThanMatch) {
    return {
      min: 0,
      max: parseFloat(lessThanMatch[1])
    };
  }
  
  // Pattern for "> 1.0"
  const greaterThanMatch = cleaned.match(/>\s*(\d+\.?\d*)/);
  if (greaterThanMatch) {
    return {
      min: parseFloat(greaterThanMatch[1]),
      max: parseFloat(greaterThanMatch[1]) * 10 // Arbitrary upper bound
    };
  }
  
  // Default fallback
  return { min: 0, max: 100 };
}

function normalizeTestResults(results: any[]): NormalizedTestResult[] {
  const normalized: NormalizedTestResult[] = [];
  
  for (const result of results) {
    if (!result.parsed_data || !Array.isArray(result.parsed_data.tests)) {
      continue;
    }
    
    for (const test of result.parsed_data.tests) {
      if (!test.name || test.value === undefined || test.value === null) {
        continue;
      }
      
      const numericValue = parseFloat(test.value);
      if (isNaN(numericValue)) {
        continue;
      }
      
      const referenceRange = parseReferenceRange(test.reference || '');
      
      normalized.push({
        test_name: test.name,
        value: numericValue,
        unit: test.unit || '',
        reference_min: referenceRange.min,
        reference_max: referenceRange.max,
        date: result.created_at,
        result_id: result.id
      });
    }
  }
  
  return normalized;
}

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

    console.log(`Fetching chart data for user ${user.id}`);

    // Fetch patient's results (RLS automatically filters to user's own data)
    // IMPORTANT: Only select fields that patients should see, excluding ai_flags and ai_risk_score
    const { data: results, error: resultsError } = await supabaseClient
      .from('results')
      .select('id, parsed_data, created_at, ai_summary, ai_generated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (resultsError) {
      console.error('Error fetching results:', resultsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch results' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ 
        test_results: [], 
        test_names: [] 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Normalize test results
    const normalizedResults = normalizeTestResults(results);
    
    // Get unique test names
    const testNames = [...new Set(normalizedResults.map(r => r.test_name))].sort();

    console.log(`Returning ${normalizedResults.length} normalized test results for ${testNames.length} unique tests`);

    const response: ChartDataResponse = {
      test_results: normalizedResults,
      test_names: testNames
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-patient-chart-data function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});