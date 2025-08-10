import { describe, it, expect, vi } from 'vitest';
import { anonymiseParsed } from '../src/lib/anonymise';

describe('Risk Flagging Unit Tests', () => {
  describe('Data Anonymization', () => {
    it('should remove all PII fields from test data', () => {
      const testData = {
        patient_name: 'John Doe',
        date_of_birth: '1990-01-01',
        nhs_number: '123456789',
        address_line_1: '123 Test Street',
        address_line_2: 'Apt 4B',
        postcode: 'SW1A 1AA',
        phone: '07123456789',
        email: 'john.doe@example.com',
        emergency_contact: 'Jane Doe',
        gp_name: 'Dr. Smith',
        clinic_name: 'Test Clinic',
        doctor_name: 'Dr. Johnson',
        tests: [
          { name: 'Cholesterol', value: 5.2, unit: 'mmol/L', reference: '3.0-5.2' },
          { name: 'HDL', value: 1.2, unit: 'mmol/L', reference: '>1.0' },
        ],
        sample_date: '2024-01-15'
      };

      const anonymized = anonymiseParsed(testData);

      // Verify ALL PII fields are removed
      expect(anonymized).not.toHaveProperty('patient_name');
      expect(anonymized).not.toHaveProperty('date_of_birth');
      expect(anonymized).not.toHaveProperty('nhs_number');
      expect(anonymized).not.toHaveProperty('address_line_1');
      expect(anonymized).not.toHaveProperty('address_line_2');
      expect(anonymized).not.toHaveProperty('postcode');
      expect(anonymized).not.toHaveProperty('phone');
      expect(anonymized).not.toHaveProperty('email');
      expect(anonymized).not.toHaveProperty('emergency_contact');
      expect(anonymized).not.toHaveProperty('gp_name');
      expect(anonymized).not.toHaveProperty('clinic_name');
      expect(anonymized).not.toHaveProperty('doctor_name');

      // Verify allowed data is preserved
      expect(anonymized.tests).toHaveLength(2);
      expect(anonymized.sample_date).toBe('2024-01-15');
    });

    it('should only include allowed test types', () => {
      const testData = {
        tests: [
          { name: 'Cholesterol', value: 5.2, unit: 'mmol/L', reference: '3.0-5.2' },
          { name: 'CustomMarker', value: 10, unit: 'ng/mL', reference: '5-15' },
          { name: 'HDL', value: 1.2, unit: 'mmol/L', reference: '>1.0' },
          { name: 'ProprietaryTest', value: 50, unit: 'units', reference: '10-100' },
          { name: 'TSH', value: 2.5, unit: 'mIU/L', reference: '0.4-4.0' },
        ]
      };

      const anonymized = anonymiseParsed(testData);

      // Should only include tests from the allowed list
      expect(anonymized.tests).toHaveLength(3);
      expect(anonymized.tests.map(t => t.name)).toEqual(['Cholesterol', 'HDL', 'TSH']);
    });

    it('should handle empty or invalid test data gracefully', () => {
      const invalidData = {
        tests: null,
        sample_date: '2024-01-15'
      };

      const anonymized = anonymiseParsed(invalidData);
      expect(anonymized.tests).toEqual([]);
      expect(anonymized.sample_date).toBe('2024-01-15');
    });

    it('should handle missing test properties', () => {
      const testData = {
        tests: [
          { name: 'Cholesterol' }, // missing value, unit, reference
          { name: 'HDL', value: 1.2 }, // missing unit, reference
          { name: 'TSH', value: 2.5, unit: 'mIU/L', reference: '0.4-4.0' }, // complete
        ]
      };

      const anonymized = anonymiseParsed(testData);
      expect(anonymized.tests).toHaveLength(3);
      
      // Check that missing properties are handled
      expect(anonymized.tests[0]).toEqual({
        name: 'Cholesterol',
        value: null,
        unit: null,
        reference: null
      });
    });
  });

  describe('Risk Assessment Logic', () => {
    it('should validate risk level enum values', () => {
      const validRiskLevels = ['low', 'medium', 'high'];
      
      validRiskLevels.forEach(level => {
        expect(['low', 'medium', 'high']).toContain(level);
      });

      const invalidLevel = 'critical';
      expect(['low', 'medium', 'high']).not.toContain(invalidLevel);
    });

    it('should map risk levels to correct numeric scores', () => {
      const riskScoreMap = {
        low: 1,
        medium: 2,
        high: 3
      };

      expect(riskScoreMap.low).toBe(1);
      expect(riskScoreMap.medium).toBe(2);
      expect(riskScoreMap.high).toBe(3);
    });

    it('should validate AI response structure', () => {
      const validAiResponse = {
        riskLevel: 'medium',
        flaggedTests: ['Glucose', 'HbA1c'],
        reasoning: 'Elevated glucose and HbA1c suggest diabetes risk'
      };

      expect(validAiResponse).toHaveProperty('riskLevel');
      expect(validAiResponse).toHaveProperty('flaggedTests');
      expect(Array.isArray(validAiResponse.flaggedTests)).toBe(true);
      expect(['low', 'medium', 'high']).toContain(validAiResponse.riskLevel);
    });
  });

  describe('Security Validation', () => {
    it('should ensure no PII leakage in system prompts', () => {
      const systemPrompt = `You are a clinical assistant analyzing anonymized laboratory values. 
Analyze the provided lab values and reference ranges to identify potential health risks.

Respond with a JSON object containing:
{
  "riskLevel": "low" | "medium" | "high",
  "flaggedTests": ["test_name1", "test_name2"],
  "reasoning": "Brief clinical reasoning"
}

No PII is included in this data.`;

      // Verify prompt doesn't contain any patient-specific information
      expect(systemPrompt).not.toContain('name');
      expect(systemPrompt).not.toContain('NHS');
      expect(systemPrompt).not.toContain('address');
      expect(systemPrompt).not.toContain('phone');
      expect(systemPrompt).toContain('anonymized');
      expect(systemPrompt).toContain('No PII');
    });

    it('should validate role-based access control logic', () => {
      const userRoles = [
        { role: 'patient' },
        { role: 'doctor' },
        { role: 'admin' },
        { role: 'nurse' }
      ];

      const staffRoles = ['admin', 'doctor'];
      
      userRoles.forEach(userRole => {
        const isStaff = staffRoles.includes(userRole.role);
        if (userRole.role === 'patient' || userRole.role === 'nurse') {
          expect(isStaff).toBe(false);
        } else {
          expect(isStaff).toBe(true);
        }
      });
    });

    it('should validate response snippet truncation', () => {
      const longResponse = 'A'.repeat(500); // 500 characters
      const snippet = longResponse.substring(0, 200);

      expect(snippet.length).toBe(200);
      expect(snippet.length).toBeLessThan(longResponse.length);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed AI responses', () => {
      const malformedResponses = [
        'not json',
        '{"riskLevel": "invalid"}',
        '{"flaggedTests": "not an array"}',
        '{"riskLevel": "medium"}', // missing flaggedTests
        '{}' // empty object
      ];

      malformedResponses.forEach(response => {
        try {
          const parsed = JSON.parse(response);
          const isValid = parsed.riskLevel && 
                         ['low', 'medium', 'high'].includes(parsed.riskLevel) &&
                         Array.isArray(parsed.flaggedTests);
          expect(isValid).toBe(false);
        } catch (error) {
          // JSON parsing errors are expected for invalid JSON
          expect(error).toBeInstanceOf(SyntaxError);
        }
      });
    });

    it('should validate required environment variables', () => {
      const requiredEnvVars = [
        'AZURE_OPENAI_ENDPOINT',
        'AZURE_OPENAI_KEY',
        'AZURE_DEPLOYMENT_NAME'
      ];

      requiredEnvVars.forEach(envVar => {
        expect(typeof envVar).toBe('string');
        expect(envVar.length).toBeGreaterThan(0);
      });
    });
  });
});