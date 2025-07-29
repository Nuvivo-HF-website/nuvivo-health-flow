// AI Report Service for NHS-compliant blood test interpretation
// This service handles the integration with AI models for generating medical reports

interface BloodTestResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  loincCode?: string;
}

interface PatientInfo {
  name: string;
  nhsNumber: string;
  dateOfBirth: string;
  gender: string;
  age?: number;
  medicalConditions?: string[];
  currentMedications?: string[];
}

interface ReportRequest {
  patientInfo: PatientInfo;
  testResults: BloodTestResult[];
  testDate: string;
  requestingClinician: string;
}

interface AIInterpretation {
  summary: string;
  keyFindings: string[];
  criticalValues: string[];
  recommendations: string[];
  disclaimer: string;
}

export class AIReportService {
  /**
   * Test API connection - now uses secure server-side configuration
   */
  static async testConnection(): Promise<boolean> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Test connection by making a simple API call to our edge function
      const { error } = await supabase.functions.invoke('generate-ai-report', {
        body: { test: true }
      });
      
      return !error;
    } catch (error) {
      console.error('AI service connection test failed:', error);
      return false;
    }
  }

  /**
   * Generate NHS-compliant blood test interpretation using secure server-side API
   */
  static async generateInterpretation(request: ReportRequest): Promise<AIInterpretation> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-report', {
        body: {
          bloodTestResults: request.testResults,
          patientInfo: request.patientInfo
        }
      });

      if (error) {
        throw new Error(`AI service error: ${error.message}`);
      }

      return data as AIInterpretation;
    } catch (error) {
      console.error('AI interpretation generation failed:', error);
      throw error;
    }
  }

  /**
   * Validate blood test results for clinical safety
   */
  static validateResults(results: BloodTestResult[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const result of results) {
      // Check for critical values that need immediate attention
      if (result.status === 'critical') {
        errors.push(`Critical value detected for ${result.testName}: ${result.value} ${result.unit}`);
      }

      // Validate LOINC codes if provided
      if (result.loincCode && !this.isValidLOINCode(result.loincCode)) {
        errors.push(`Invalid LOINC code for ${result.testName}: ${result.loincCode}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Basic LOINC code validation
   */
  private static isValidLOINCode(code: string): boolean {
    // Basic format validation for LOINC codes (XXXXX-X)
    const loincPattern = /^\d{4,5}-\d$/;
    return loincPattern.test(code);
  }

  /**
   * Generate audit log entry for report generation
   */
  static createAuditLog(request: ReportRequest, interpretation: AIInterpretation): any {
    return {
      timestamp: new Date().toISOString(),
      patientNHS: request.patientInfo.nhsNumber,
      action: 'AI_REPORT_GENERATED',
      testCount: request.testResults.length,
      criticalCount: request.testResults.filter(r => r.status === 'critical').length,
      redFlagCount: interpretation.criticalValues.length,
      userId: 'current_user', // Should be replaced with actual user ID
      sessionId: 'current_session' // Should be replaced with actual session ID
    };
  }
}