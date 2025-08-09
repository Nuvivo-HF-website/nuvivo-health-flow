import { describe, test, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Mock the Azure OpenAI API
const mockAzureOpenAIResponse = {
  choices: [
    {
      message: {
        content: "Your blood test results show normal cholesterol levels at 4.2 mmol/L, which is within the healthy range. Your HDL (good cholesterol) at 1.5 mmol/L is excellent for heart health. These results suggest good cardiovascular health. Consider discussing with your GP about maintaining these healthy levels through diet and exercise. This is not a diagnosis; consult your GP."
      }
    }
  ]
};

// Mock fetch for Azure OpenAI calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test configuration
const SUPABASE_URL = 'https://duuplufbkzynrhmtshlm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1dXBsdWZia3p5bnJobXRzaGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NzgwMzYsImV4cCI6MjA2OTI1NDAzNn0.cLrIyi_cyTrRfFdGcRR_TVxg8TknIIqQb5TmXPpDnOc';

// Create Supabase client for testing
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test data
const testUser = {
  id: 'test-user-123',
  email: 'test@example.com'
};

const testProfile = {
  user_id: testUser.id,
  full_name: 'Test User',
  email: testUser.email,
  ai_consent: true
};

const testResultData = {
  user_id: testUser.id,
  parsed_data: {
    // Include both allowed and non-allowed tests to verify filtering
    tests: [
      // Allowed tests
      {
        name: 'Cholesterol',
        value: 4.2,
        unit: 'mmol/L',
        reference: '< 5.0',
        status: 'normal'
      },
      {
        name: 'HDL',
        value: 1.5,
        unit: 'mmol/L',
        reference: '> 1.0',
        status: 'normal'
      },
      {
        name: 'LDL',
        value: 2.1,
        unit: 'mmol/L',
        reference: '< 3.0',
        status: 'normal'
      },
      // Non-allowed test (should be filtered out)
      {
        name: 'PrivateTestMarker',
        value: 99,
        unit: 'units',
        reference: '< 100',
        status: 'normal'
      }
    ],
    // PII data that should be filtered out
    patient_name: 'John Doe',
    dob: '1990-01-01',
    nhs_number: 'AB123456C',
    address: '123 Test Street',
    sample_date: '2024-01-15'
  }
};

describe('Generate Summary Integration Tests', () => {
  let testResultId: string;
  let authToken: string;

  beforeAll(async () => {
    // Set up environment variables for the test
    process.env.SUPABASE_URL = SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = SUPABASE_ANON_KEY;
    process.env.AZURE_OPENAI_ENDPOINT = 'https://test-azure-openai.openai.azure.com';
    process.env.AZURE_OPENAI_KEY = 'test-azure-key';
    process.env.AZURE_DEPLOYMENT_NAME = 'test-deployment';
  });

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup mock for Azure OpenAI API
    mockFetch.mockImplementation((url: string, options: any) => {
      if (url.includes('azure.com')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAzureOpenAIResponse)
        });
      }
      return Promise.reject(new Error('Unmocked fetch call'));
    });

    // Create test user session (mock authentication)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: 'test-password'
    });

    if (authError && authError.message !== 'Invalid login credentials') {
      // If user doesn't exist, this is expected in a test environment
      // In a real test, you'd set up proper test user creation
      authToken = 'mock-jwt-token';
    } else {
      authToken = authData?.session?.access_token || 'mock-jwt-token';
    }
  });

  afterAll(async () => {
    // Clean up test data if needed
    if (testResultId) {
      await supabase.from('results').delete().eq('id', testResultId);
    }
    await supabase.from('profiles').delete().eq('user_id', testUser.id);
  });

  test('should generate AI summary with proper anonymization', async () => {
    // 1. Create test profile with AI consent
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(testProfile);
    
    expect(profileError).toBeNull();

    // 2. Create test result with parsed data
    const { data: resultData, error: resultError } = await supabase
      .from('results')
      .insert(testResultData)
      .select()
      .single();

    expect(resultError).toBeNull();
    expect(resultData).toBeTruthy();
    testResultId = resultData.id;

    // 3. Call the generate-summary function
    const { data: functionResponse, error: functionError } = await supabase.functions.invoke(
      'generate-summary',
      {
        body: { resultId: testResultId },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    // 4. Verify function executed successfully
    expect(functionError).toBeNull();
    expect(functionResponse).toBeTruthy();
    expect(functionResponse.ai_summary).toBeTruthy();

    // 5. Verify result was updated with AI summary
    const { data: updatedResult, error: fetchError } = await supabase
      .from('results')
      .select('ai_summary, ai_generated_at')
      .eq('id', testResultId)
      .single();

    expect(fetchError).toBeNull();
    expect(updatedResult.ai_summary).toBeTruthy();
    expect(updatedResult.ai_generated_at).toBeTruthy();

    // 6. Verify AI log was created
    const { data: aiLogs, error: logsError } = await supabase
      .from('ai_logs')
      .select('*')
      .eq('result_id', testResultId);

    expect(logsError).toBeNull();
    expect(aiLogs).toHaveLength(1);
    expect(aiLogs[0].model).toBe('azure-openai');
    expect(aiLogs[0].response_snippet).toBeTruthy();
    expect(aiLogs[0].response_snippet.length).toBeLessThanOrEqual(200);

    // 7. Verify Azure OpenAI API was called with anonymized data
    expect(mockFetch).toHaveBeenCalledTimes(1);
    
    const azureApiCall = mockFetch.mock.calls[0];
    const apiUrl = azureApiCall[0];
    const apiOptions = azureApiCall[1];

    // Check the API URL
    expect(apiUrl).toContain('azure.com');
    expect(apiUrl).toContain('chat/completions');

    // Check the headers
    expect(apiOptions.headers['api-key']).toBe('test-azure-key');
    expect(apiOptions.headers['Content-Type']).toBe('application/json');

    // Parse and verify the request body
    const requestBody = JSON.parse(apiOptions.body);
    expect(requestBody.messages).toHaveLength(2);
    
    // Verify system prompt
    const systemMessage = requestBody.messages[0];
    expect(systemMessage.role).toBe('system');
    expect(systemMessage.content).toContain('clinical assistant');
    expect(systemMessage.content).toContain('ANONYMISED lab values only');
    expect(systemMessage.content).toContain('This is not a diagnosis; consult your GP');

    // Verify user prompt contains only allowed tests and no PII
    const userMessage = requestBody.messages[1];
    expect(userMessage.role).toBe('user');
    expect(userMessage.content).toContain('Cholesterol: 4.2 mmol/L');
    expect(userMessage.content).toContain('HDL: 1.5 mmol/L');
    expect(userMessage.content).toContain('LDL: 2.1 mmol/L');
    
    // Verify filtered out data is NOT present
    expect(userMessage.content).not.toContain('PrivateTestMarker');
    expect(userMessage.content).not.toContain('John Doe');
    expect(userMessage.content).not.toContain('1990-01-01');
    expect(userMessage.content).not.toContain('AB123456C');
    expect(userMessage.content).not.toContain('123 Test Street');

    // Verify API request parameters
    expect(requestBody.max_tokens).toBe(500);
    expect(requestBody.temperature).toBe(0.3);
  });

  test('should reject request when AI consent is disabled', async () => {
    // 1. Create test profile WITHOUT AI consent
    const profileWithoutConsent = { ...testProfile, ai_consent: false };
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileWithoutConsent);
    
    expect(profileError).toBeNull();

    // 2. Create test result
    const { data: resultData, error: resultError } = await supabase
      .from('results')
      .insert(testResultData)
      .select()
      .single();

    expect(resultError).toBeNull();
    testResultId = resultData.id;

    // 3. Call the generate-summary function
    const { error: functionError } = await supabase.functions.invoke(
      'generate-summary',
      {
        body: { resultId: testResultId },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    // 4. Verify function returns 403 error
    expect(functionError).toBeTruthy();
    expect(functionError.message).toContain('AI consent required');

    // 5. Verify no Azure API call was made
    expect(mockFetch).not.toHaveBeenCalled();

    // 6. Verify no AI summary was created
    const { data: updatedResult } = await supabase
      .from('results')
      .select('ai_summary')
      .eq('id', testResultId)
      .single();

    expect(updatedResult.ai_summary).toBeNull();
  });

  test('should handle empty test data gracefully', async () => {
    // 1. Create test profile with AI consent
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(testProfile);
    
    expect(profileError).toBeNull();

    // 2. Create test result with no valid tests
    const emptyTestData = {
      ...testResultData,
      parsed_data: {
        tests: [
          // Only non-allowed tests
          {
            name: 'UnknownTest1',
            value: 100,
            unit: 'units'
          },
          {
            name: 'UnknownTest2',
            value: 200,
            unit: 'units'
          }
        ]
      }
    };

    const { data: resultData, error: resultError } = await supabase
      .from('results')
      .insert(emptyTestData)
      .select()
      .single();

    expect(resultError).toBeNull();
    testResultId = resultData.id;

    // 3. Call the generate-summary function
    const { error: functionError } = await supabase.functions.invoke(
      'generate-summary',
      {
        body: { resultId: testResultId },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    // 4. Verify function returns 400 error for no valid test data
    expect(functionError).toBeTruthy();
    expect(functionError.message).toContain('No valid test data available');

    // 5. Verify no Azure API call was made
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('should handle Azure API errors gracefully', async () => {
    // 1. Setup mock to simulate Azure API error
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('azure.com')) {
        return Promise.resolve({
          ok: false,
          status: 503,
          text: () => Promise.resolve('Service Temporarily Unavailable')
        });
      }
      return Promise.reject(new Error('Unmocked fetch call'));
    });

    // 2. Create test profile with AI consent
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(testProfile);
    
    expect(profileError).toBeNull();

    // 3. Create test result
    const { data: resultData, error: resultError } = await supabase
      .from('results')
      .insert(testResultData)
      .select()
      .single();

    expect(resultError).toBeNull();
    testResultId = resultData.id;

    // 4. Call the generate-summary function
    const { error: functionError } = await supabase.functions.invoke(
      'generate-summary',
      {
        body: { resultId: testResultId },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    // 5. Verify function returns appropriate error
    expect(functionError).toBeTruthy();
    expect(functionError.message).toContain('AI service unavailable');

    // 6. Verify Azure API was called but failed
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // 7. Verify no AI summary was created due to API failure
    const { data: updatedResult } = await supabase
      .from('results')
      .select('ai_summary')
      .eq('id', testResultId)
      .single();

    expect(updatedResult.ai_summary).toBeNull();
  });
});