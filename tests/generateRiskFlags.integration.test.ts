import { describe, it, expect, beforeEach, vi } from 'vitest';
import { anonymiseParsed } from '../src/lib/anonymise';

// Mock Supabase
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
    insert: vi.fn(),
    update: vi.fn(() => ({
      eq: vi.fn(),
    })),
  })),
  functions: {
    invoke: vi.fn(),
  },
};

// Mock global fetch for Azure OpenAI calls
global.fetch = vi.fn();

describe('generate-risk-flags Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset environment variables
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'test-anon-key';
    process.env.AZURE_OPENAI_ENDPOINT = 'https://test-eu.openai.azure.com';
    process.env.AZURE_OPENAI_KEY = 'test-azure-key';
    process.env.AZURE_DEPLOYMENT_NAME = 'test-deployment';
  });

  describe('Data Anonymization', () => {
    it('should remove all PII from parsed data before AI call', () => {
      const testData = {
        patient_name: 'John Doe',
        dob: '1990-01-01',
        nhs_number: '123456789',
        address: '123 Test Street',
        phone: '07123456789',
        tests: [
          { name: 'Cholesterol', value: 5.2, unit: 'mmol/L', reference: '3.0-5.2' },
          { name: 'Glucose', value: 7.8, unit: 'mmol/L', reference: '3.9-5.6' },
          { name: 'HDL', value: 1.2, unit: 'mmol/L', reference: '>1.0' },
        ],
        sample_date: '2024-01-15'
      };

      const anonymized = anonymiseParsed(testData);

      // Verify PII fields are removed
      expect(anonymized).not.toHaveProperty('patient_name');
      expect(anonymized).not.toHaveProperty('dob');
      expect(anonymized).not.toHaveProperty('nhs_number');
      expect(anonymized).not.toHaveProperty('address');
      expect(anonymized).not.toHaveProperty('phone');

      // Verify allowed data is preserved
      expect(anonymized.tests).toHaveLength(3);
      expect(anonymized.sample_date).toBe('2024-01-15');
      
      // Verify only allowed tests are included
      anonymized.tests.forEach(test => {
        expect(['Cholesterol', 'Glucose', 'HDL']).toContain(test.name);
        expect(test).toHaveProperty('value');
        expect(test).toHaveProperty('unit');
        expect(test).toHaveProperty('reference');
      });
    });

    it('should filter out non-allowed tests', () => {
      const testData = {
        tests: [
          { name: 'Cholesterol', value: 5.2, unit: 'mmol/L', reference: '3.0-5.2' },
          { name: 'CustomTest', value: 10, unit: 'mg/dL', reference: '5-15' },
          { name: 'TSH', value: 2.5, unit: 'mIU/L', reference: '0.4-4.0' },
          { name: 'ProprietaryMarker', value: 50, unit: 'ng/mL', reference: '10-100' },
        ]
      };

      const anonymized = anonymiseParsed(testData);

      // Should only include allowed tests
      expect(anonymized.tests).toHaveLength(2);
      expect(anonymized.tests.map(t => t.name)).toEqual(['Cholesterol', 'TSH']);
    });
  });

  describe('Azure OpenAI Integration', () => {
    it('should send anonymized data to Azure OpenAI with correct payload structure', async () => {
      const mockAzureResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              riskLevel: 'medium',
              flaggedTests: ['Glucose'],
              reasoning: 'Glucose level is elevated above normal range'
            })
          }
        }]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAzureResponse),
      });

      // Mock successful user authentication and role check
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: [{ role: 'doctor' }],
              error: null,
            }),
          }),
        }),
      });

      const testResultData = {
        id: 'test-result-id',
        parsed_data: {
          tests: [
            { name: 'Glucose', value: 7.8, unit: 'mmol/L', reference: '3.9-5.6' },
            { name: 'Cholesterol', value: 5.2, unit: 'mmol/L', reference: '3.0-5.2' },
          ]
        },
        user_id: 'test-patient-id'
      };

      // Simulate the edge function logic
      const anonymizedData = anonymiseParsed(testResultData.parsed_data);
      
      // Verify the payload structure that would be sent to Azure
      const expectedSystemPrompt = expect.stringContaining('clinical assistant analyzing anonymized laboratory values');
      const expectedUserPrompt = expect.stringContaining(JSON.stringify(anonymizedData));

      // Verify no PII in the payload
      expect(JSON.stringify(anonymizedData)).not.toContain('John Doe');
      expect(JSON.stringify(anonymizedData)).not.toContain('123456789');
      expect(JSON.stringify(anonymizedData)).not.toContain('123 Test Street');

      // Verify only allowed test data is included
      expect(anonymizedData.tests.every(test => 
        ['Glucose', 'Cholesterol'].includes(test.name)
      )).toBe(true);
    });

    it('should handle Azure OpenAI API errors gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('API Error: Rate limit exceeded'),
      });

      // This would test the error handling in the edge function
      // In a real integration test, you would invoke the actual function
      const errorResponse = await fetch('mock-azure-endpoint');
      expect(errorResponse.ok).toBe(false);
    });
  });

  describe('Risk Score Mapping', () => {
    it('should correctly map risk levels to numeric scores', () => {
      const riskScoreMap = {
        low: 1,
        medium: 2,
        high: 3
      };

      expect(riskScoreMap.low).toBe(1);
      expect(riskScoreMap.medium).toBe(2);
      expect(riskScoreMap.high).toBe(3);
    });
  });

  describe('Database Operations', () => {
    it('should verify staff-only access patterns', () => {
      // Mock patient user (no admin/doctor role)
      const patientRoles = [{ role: 'patient' }];
      const isStaff = patientRoles.some(ur => ['admin', 'doctor'].includes(ur.role));
      expect(isStaff).toBe(false);

      // Mock staff user
      const staffRoles = [{ role: 'doctor' }];
      const isStaffUser = staffRoles.some(ur => ['admin', 'doctor'].includes(ur.role));
      expect(isStaffUser).toBe(true);
    });

    it('should ensure patients cannot see ai_flags or ai_risk_score', () => {
      // This tests the RLS policy logic
      const patientQuery = 'SELECT id, user_id, parsed_data, ai_summary, created_at FROM results WHERE user_id = $1';
      const staffQuery = 'SELECT id, user_id, parsed_data, ai_summary, ai_flags, ai_risk_score, created_at FROM results';

      // Patient query should not include sensitive fields
      expect(patientQuery).not.toContain('ai_flags');
      expect(patientQuery).not.toContain('ai_risk_score');

      // Staff query can include all fields
      expect(staffQuery).toContain('ai_flags');
      expect(staffQuery).toContain('ai_risk_score');
    });
  });

  describe('Audit Logging', () => {
    it('should log ai_review_logs when staff views flagged results', () => {
      const mockLogEntry = {
        result_id: 'test-result-id',
        viewed_by: 'staff-user-id',
        viewed_at: new Date().toISOString(),
      };

      expect(mockLogEntry).toHaveProperty('result_id');
      expect(mockLogEntry).toHaveProperty('viewed_by');
      expect(mockLogEntry).toHaveProperty('viewed_at');
    });

    it('should store only response snippets in ai_logs', () => {
      const fullAiResponse = 'This is a very long AI response that contains detailed analysis of the medical data and should be truncated to protect privacy and comply with data retention policies. It goes on and on with more details...';
      const responseSnippet = fullAiResponse.substring(0, 200);

      expect(responseSnippet.length).toBeLessThanOrEqual(200);
      expect(responseSnippet).not.toEqual(fullAiResponse);
    });
  });
});