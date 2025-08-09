import { describe, test, expect } from 'vitest';
import { anonymiseParsed, AnonTest } from '../anonymise';

describe('anonymiseParsed', () => {
  test('removes PII fields and only includes allowed tests', () => {
    const input = {
      name: 'John Doe',
      dob: '1990-01-01',
      nhs_number: 'AB123456C',
      address: '123 Test Street',
      tests: [
        { name: 'Cholesterol', value: 5.2, unit: 'mmol/L', reference: '< 5.0' },
        { name: 'HDL', value: 1.4, unit: 'mmol/L', reference: '> 1.0' },
        { name: 'UnknownTest', value: 100, unit: 'mg/dL', reference: 'N/A' },
        { name: 'TSH', value: 2.1, unit: 'mIU/L', reference: '0.4-4.0' }
      ],
      sample_date: '2024-01-15'
    };

    const result = anonymiseParsed(input);

    // Should not contain PII
    expect(result).not.toHaveProperty('name');
    expect(result).not.toHaveProperty('dob');
    expect(result).not.toHaveProperty('nhs_number');
    expect(result).not.toHaveProperty('address');

    // Should only contain allowed tests
    expect(result.tests).toHaveLength(3);
    expect(result.tests.map(t => t.name)).toEqual(['Cholesterol', 'HDL', 'TSH']);
    
    // Should preserve sample_date
    expect(result.sample_date).toBe('2024-01-15');
  });

  test('handles missing or invalid input gracefully', () => {
    expect(anonymiseParsed(null)).toEqual({ tests: [] });
    expect(anonymiseParsed({})).toEqual({ tests: [] });
    expect(anonymiseParsed({ tests: null })).toEqual({ tests: [] });
    expect(anonymiseParsed({ tests: 'not-array' })).toEqual({ tests: [] });
  });

  test('filters out non-allowed test names', () => {
    const input = {
      tests: [
        { name: 'AllowedTest', value: 100 },
        { name: 'Cholesterol', value: 5.2, unit: 'mmol/L' },
        { name: 'RandomTest', value: 50 }
      ]
    };

    const result = anonymiseParsed(input);
    expect(result.tests).toHaveLength(1);
    expect(result.tests[0].name).toBe('Cholesterol');
  });

  test('handles missing test properties', () => {
    const input = {
      tests: [
        { name: 'Cholesterol' }, // missing value
        { name: 'HDL', value: 1.4 }, // missing unit and reference
        { value: 100, unit: 'mg/dL' } // missing name
      ]
    };

    const result = anonymiseParsed(input);
    expect(result.tests).toHaveLength(1);
    expect(result.tests[0]).toEqual({
      name: 'HDL',
      value: 1.4,
      unit: null,
      reference: null
    });
  });
});