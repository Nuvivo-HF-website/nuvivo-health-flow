import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock the edge function dependencies
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn()
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn()
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null }))
    })),
    insert: vi.fn(() => Promise.resolve({ error: null }))
  }))
};

const mockCreateClient = vi.fn(() => mockSupabaseClient);

// Mock the edge function logic (simplified version for testing)
async function generateSummaryHandler(request: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { resultId } = await request.json();
    if (!resultId) {
      return new Response(JSON.stringify({ error: 'Missing resultId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mock user authentication
    const user = { id: 'test-user-123' };

    // Mock profile check
    const profile = { ai_consent: true };
    if (!profile?.ai_consent) {
      return new Response(JSON.stringify({ error: 'AI consent required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mock result data
    const result = {
      id: resultId,
      user_id: user.id,
      parsed_data: {
        tests: [
          { name: 'Cholesterol', value: 4.2, unit: 'mmol/L', reference: '< 5.0' },
          { name: 'HDL', value: 1.5, unit: 'mmol/L', reference: '> 1.0' },
          { name: 'PrivateTest', value: 99, unit: 'units', reference: '< 100' }
        ],
        patient_name: 'John Doe',
        dob: '1990-01-01'
      }
    };

    // Apply anonymization (same logic as in the actual function)
    function anonymiseParsed(raw: any) {
      const allowedTests = new Set(['Cholesterol', 'HDL', 'LDL', 'TSH', 'Glucose', 'HbA1c', 'WBC', 'RBC', 'Platelets']);
      const tests: any[] = [];
      
      if (raw && Array.isArray(raw.tests)) {
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
      }
      
      return { tests, sample_date: raw.sample_date || null };
    }

    const anonymizedData = anonymiseParsed(result.parsed_data);
    
    if (anonymizedData.tests.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid test data available' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mock system prompt (exact same as in function)
    const systemPrompt = "You are a clinical assistant generating short, non-alarming patient-friendly summaries from ANONYMISED lab values only. NEVER ask for or infer identity. Output 2–4 sentences, avoid jargon, include one next step like 'discuss with your GP'. At the end add: 'This is not a diagnosis; consult your GP.'";

    // Build user prompt
    const testList = anonymizedData.tests.map(test => {
      const valueStr = test.value !== null ? String(test.value) : 'N/A';
      const unitStr = test.unit ? ` ${test.unit}` : '';
      const refStr = test.reference ? ` (Reference: ${test.reference})` : '';
      return `• ${test.name}: ${valueStr}${unitStr}${refStr}`;
    }).join('\n');

    const userPrompt = `Blood test results:\n${testList}`;

    // Store the API request details for verification
    (globalThis as any).lastAzureAPICall = {
      systemPrompt,
      userPrompt,
      anonymizedData
    };

    // Mock Azure OpenAI response
    const aiSummary = "Your cholesterol levels are within normal range. HDL levels are good for heart health. This is not a diagnosis; consult your GP.";

    return new Response(JSON.stringify({ ai_summary: aiSummary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }
}

describe('Generate Summary Edge Function Tests', () => {
  let mockFetch: any;

  beforeEach(() => {
    // Reset global state
    (globalThis as any).lastAzureAPICall = null;
    
    // Mock fetch for Azure OpenAI calls
    mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [
          {
            message: {
              content: "Your cholesterol levels are within normal range. HDL levels are good for heart health. This is not a diagnosis; consult your GP."
            }
          }
        ]
      })
    });
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should process request and anonymize data correctly', async () => {
    const request = new Request('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer valid-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resultId: 'test-result-123'
      })
    });

    const response = await generateSummaryHandler(request);
    const responseData = await response.json();

    // Verify successful response
    expect(response.status).toBe(200);
    expect(responseData.ai_summary).toBeTruthy();

    // Verify anonymization worked correctly
    const apiCall = (globalThis as any).lastAzureAPICall;
    expect(apiCall).toBeTruthy();

    // Check system prompt is exactly as specified
    expect(apiCall.systemPrompt).toContain("You are a clinical assistant generating short, non-alarming patient-friendly summaries from ANONYMISED lab values only");
    expect(apiCall.systemPrompt).toContain("This is not a diagnosis; consult your GP.");

    // Check user prompt contains only allowed tests
    expect(apiCall.userPrompt).toContain("Cholesterol: 4.2 mmol/L");
    expect(apiCall.userPrompt).toContain("HDL: 1.5 mmol/L");
    
    // Verify non-allowed test is filtered out
    expect(apiCall.userPrompt).not.toContain("PrivateTest");
    
    // Verify PII is not included
    expect(apiCall.userPrompt).not.toContain("John Doe");
    expect(apiCall.userPrompt).not.toContain("1990-01-01");

    // Check anonymized data structure
    expect(apiCall.anonymizedData.tests).toHaveLength(2); // Only allowed tests
    expect(apiCall.anonymizedData.tests[0].name).toBe('Cholesterol');
    expect(apiCall.anonymizedData.tests[1].name).toBe('HDL');
  });

  test('should handle missing authorization', async () => {
    const request = new Request('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resultId: 'test-result-123'
      })
    });

    const response = await generateSummaryHandler(request);
    const responseData = await response.json();

    expect(response.status).toBe(401);
    expect(responseData.error).toContain('Missing authorization header');
  });

  test('should handle missing resultId', async () => {
    const request = new Request('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer valid-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const response = await generateSummaryHandler(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.error).toContain('Missing resultId');
  });

  test('should handle CORS preflight requests', async () => {
    const request = new Request('http://localhost:8000', {
      method: 'OPTIONS'
    });

    const response = await generateSummaryHandler(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Headers')).toContain('authorization');
  });

  test('should verify exact anonymization behavior', () => {
    // Test the anonymization function directly
    const allowedTests = new Set(['Cholesterol', 'HDL', 'LDL', 'TSH', 'Glucose', 'HbA1c', 'WBC', 'RBC', 'Platelets']);
    
    function anonymiseParsed(raw: any) {
      const tests: any[] = [];
      
      if (raw && Array.isArray(raw.tests)) {
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
      }
      
      return { tests, sample_date: raw.sample_date || null };
    }

    const testData = {
      patient_name: 'John Doe',
      dob: '1990-01-01',
      nhs_number: 'AB123456C',
      tests: [
        { name: 'Cholesterol', value: 4.2, unit: 'mmol/L', reference: '< 5.0' },
        { name: 'UnknownTest', value: 99, unit: 'units' },
        { name: 'HDL', value: 1.5, unit: 'mmol/L', reference: '> 1.0' },
        { name: 'PrivateMarker', value: 200, unit: 'ng/mL' }
      ],
      sample_date: '2024-01-15'
    };

    const result = anonymiseParsed(testData);

    // Should only include allowed tests
    expect(result.tests).toHaveLength(2);
    expect(result.tests.map(t => t.name)).toEqual(['Cholesterol', 'HDL']);
    
    // Should preserve sample_date but not PII
    expect(result.sample_date).toBe('2024-01-15');
    expect(result).not.toHaveProperty('patient_name');
    expect(result).not.toHaveProperty('dob');
    expect(result).not.toHaveProperty('nhs_number');

    // Test values should be properly formatted
    expect(result.tests[0].value).toBe(4.2);
    expect(result.tests[0].unit).toBe('mmol/L');
    expect(result.tests[0].reference).toBe('< 5.0');
  });

  test('should generate correct prompt format', () => {
    const anonymizedData = {
      tests: [
        { name: 'Cholesterol', value: 4.2, unit: 'mmol/L', reference: '< 5.0' },
        { name: 'HDL', value: 1.5, unit: 'mmol/L', reference: '> 1.0' },
        { name: 'TSH', value: 2.1, unit: 'mIU/L', reference: '0.4-4.0' }
      ]
    };

    const testList = anonymizedData.tests.map(test => {
      const valueStr = test.value !== null ? String(test.value) : 'N/A';
      const unitStr = test.unit ? ` ${test.unit}` : '';
      const refStr = test.reference ? ` (Reference: ${test.reference})` : '';
      return `• ${test.name}: ${valueStr}${unitStr}${refStr}`;
    }).join('\n');

    const expectedPrompt = `Blood test results:
• Cholesterol: 4.2 mmol/L (Reference: < 5.0)
• HDL: 1.5 mmol/L (Reference: > 1.0)
• TSH: 2.1 mIU/L (Reference: 0.4-4.0)`;

    expect(`Blood test results:\n${testList}`).toBe(expectedPrompt);
  });
});