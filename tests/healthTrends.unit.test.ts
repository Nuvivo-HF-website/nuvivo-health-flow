import { describe, it, expect } from 'vitest';

describe('Health Trends Color Zone Calculation', () => {
  // Function to test color zone logic
  const getValueStatus = (value: number, min: number, max: number): 'normal' | 'borderline' | 'abnormal' => {
    const range = max - min;
    const borderlineMargin = range * 0.1; // 10% margin for borderline
    
    if (value >= (min - borderlineMargin) && value <= (max + borderlineMargin)) {
      if (value >= min && value <= max) {
        return 'normal';
      }
      return 'borderline';
    }
    
    return 'abnormal';
  };

  describe('Normal Range Values', () => {
    it('should classify values within reference range as normal', () => {
      expect(getValueStatus(4.0, 3.0, 5.0)).toBe('normal');
      expect(getValueStatus(3.0, 3.0, 5.0)).toBe('normal'); // Minimum boundary
      expect(getValueStatus(5.0, 3.0, 5.0)).toBe('normal'); // Maximum boundary
      expect(getValueStatus(4.5, 3.0, 5.0)).toBe('normal'); // Middle value
    });
  });

  describe('Borderline Values', () => {
    it('should classify values just outside reference range as borderline', () => {
      // For range 3.0-5.0, margin is 0.2 (10% of 2.0)
      expect(getValueStatus(2.9, 3.0, 5.0)).toBe('borderline'); // Just below min
      expect(getValueStatus(5.1, 3.0, 5.0)).toBe('borderline'); // Just above max
      expect(getValueStatus(2.8, 3.0, 5.0)).toBe('borderline'); // Within 10% margin below
      expect(getValueStatus(5.2, 3.0, 5.0)).toBe('borderline'); // Within 10% margin above
    });
  });

  describe('Abnormal Values', () => {
    it('should classify values far outside reference range as abnormal', () => {
      // For range 3.0-5.0, margin is 0.2, so < 2.8 or > 5.2 is abnormal
      expect(getValueStatus(2.7, 3.0, 5.0)).toBe('abnormal'); // Well below range
      expect(getValueStatus(5.3, 3.0, 5.0)).toBe('abnormal'); // Well above range
      expect(getValueStatus(1.0, 3.0, 5.0)).toBe('abnormal'); // Very low
      expect(getValueStatus(10.0, 3.0, 5.0)).toBe('abnormal'); // Very high
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values correctly', () => {
      expect(getValueStatus(0, 0, 10)).toBe('normal');
      expect(getValueStatus(0, 1, 10)).toBe('borderline'); // Just outside min
    });

    it('should handle very small ranges', () => {
      expect(getValueStatus(1.01, 1.0, 1.02)).toBe('normal');
      expect(getValueStatus(1.03, 1.0, 1.02)).toBe('borderline'); // 10% margin applies
    });

    it('should handle large ranges', () => {
      expect(getValueStatus(500, 0, 1000)).toBe('normal');
      expect(getValueStatus(-50, 0, 1000)).toBe('borderline'); // Within 10% margin (100)
      expect(getValueStatus(-150, 0, 1000)).toBe('abnormal'); // Outside 10% margin
    });
  });
});

describe('Reference Range Parsing', () => {
  const parseReferenceRange = (reference: string): { min: number; max: number } => {
    if (!reference || typeof reference !== 'string') {
      return { min: 0, max: 100 }; // Default fallback
    }
    
    // Handle various reference range formats
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
  };

  describe('Standard Range Formats', () => {
    it('should parse hyphen-separated ranges', () => {
      expect(parseReferenceRange('3.0-5.2')).toEqual({ min: 3.0, max: 5.2 });
      expect(parseReferenceRange('3.0 - 5.2')).toEqual({ min: 3.0, max: 5.2 });
      expect(parseReferenceRange('0.4-4.0')).toEqual({ min: 0.4, max: 4.0 });
    });

    it('should parse less-than ranges', () => {
      expect(parseReferenceRange('< 5.0')).toEqual({ min: 0, max: 5.0 });
      expect(parseReferenceRange('<5.0')).toEqual({ min: 0, max: 5.0 });
    });

    it('should parse greater-than ranges', () => {
      expect(parseReferenceRange('> 1.0')).toEqual({ min: 1.0, max: 10.0 });
      expect(parseReferenceRange('>1.0')).toEqual({ min: 1.0, max: 10.0 });
    });
  });

  describe('Complex Range Formats', () => {
    it('should handle ranges with units and labels', () => {
      expect(parseReferenceRange('Normal: 3.0-5.2 mmol/L')).toEqual({ min: 3.0, max: 5.2 });
      expect(parseReferenceRange('Reference range: 0.4 - 4.0 mIU/L')).toEqual({ min: 0.4, max: 4.0 });
    });
  });

  describe('Invalid or Empty References', () => {
    it('should handle empty or null references', () => {
      expect(parseReferenceRange('')).toEqual({ min: 0, max: 100 });
      expect(parseReferenceRange(null as any)).toEqual({ min: 0, max: 100 });
      expect(parseReferenceRange(undefined as any)).toEqual({ min: 0, max: 100 });
    });

    it('should handle non-string references', () => {
      expect(parseReferenceRange(123 as any)).toEqual({ min: 0, max: 100 });
      expect(parseReferenceRange({} as any)).toEqual({ min: 0, max: 100 });
    });
  });
});

describe('Unit Conversion Logic', () => {
  const UNIT_CONVERSIONS: Record<string, Record<string, number>> = {
    'cholesterol': {
      'mmol/l': 38.67,
      'mg/dl': 1,
    },
    'glucose': {
      'mmol/l': 18.02,
      'mg/dl': 1,
    },
  };

  const convertValue = (testName: string, value: number, fromUnit: string, toUnit: string): number => {
    const normalizedTestName = testName.toLowerCase();
    const normalizedFromUnit = fromUnit.toLowerCase().replace(/\s+/g, '');
    const normalizedToUnit = toUnit.toLowerCase().replace(/\s+/g, '');
    
    if (normalizedFromUnit === normalizedToUnit) {
      return value;
    }
    
    const conversions = UNIT_CONVERSIONS[normalizedTestName];
    if (!conversions) {
      return value; // No conversion available
    }
    
    const fromFactor = conversions[normalizedFromUnit] || 1;
    const toFactor = conversions[normalizedToUnit] || 1;
    
    return (value * fromFactor) / toFactor;
  };

  describe('Cholesterol Conversions', () => {
    it('should convert cholesterol from mmol/L to mg/dL', () => {
      expect(convertValue('cholesterol', 5.0, 'mmol/L', 'mg/dL')).toBeCloseTo(193.35, 1);
      expect(convertValue('cholesterol', 3.0, 'mmol/L', 'mg/dL')).toBeCloseTo(116.01, 1);
    });

    it('should convert cholesterol from mg/dL to mmol/L', () => {
      expect(convertValue('cholesterol', 200, 'mg/dL', 'mmol/L')).toBeCloseTo(5.17, 2);
      expect(convertValue('cholesterol', 150, 'mg/dL', 'mmol/L')).toBeCloseTo(3.88, 2);
    });
  });

  describe('Glucose Conversions', () => {
    it('should convert glucose from mmol/L to mg/dL', () => {
      expect(convertValue('glucose', 5.0, 'mmol/L', 'mg/dL')).toBeCloseTo(90.1, 1);
      expect(convertValue('glucose', 7.0, 'mmol/L', 'mg/dL')).toBeCloseTo(126.14, 1);
    });

    it('should convert glucose from mg/dL to mmol/L', () => {
      expect(convertValue('glucose', 100, 'mg/dL', 'mmol/L')).toBeCloseTo(5.55, 2);
      expect(convertValue('glucose', 126, 'mg/dL', 'mmol/L')).toBeCloseTo(6.99, 2);
    });
  });

  describe('Same Unit Handling', () => {
    it('should return the same value for identical units', () => {
      expect(convertValue('cholesterol', 5.0, 'mmol/L', 'mmol/L')).toBe(5.0);
      expect(convertValue('glucose', 100, 'mg/dL', 'mg/dL')).toBe(100);
    });
  });

  describe('Unknown Test Handling', () => {
    it('should return the original value for unknown tests', () => {
      expect(convertValue('unknown_test', 5.0, 'mmol/L', 'mg/dL')).toBe(5.0);
      expect(convertValue('random_marker', 100, 'units', 'other')).toBe(100);
    });
  });
});