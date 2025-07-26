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
}

interface ReportRequest {
  patientInfo: PatientInfo;
  testResults: BloodTestResult[];
  testDate: string;
  requestingClinician: string;
}

interface AIInterpretation {
  summary: string;
  findings: string[];
  redFlags: string[];
  followUp: string[];
  causes: string[];
  confidence: number;
  sources: string[];
}

export class AIReportService {
  private static API_KEY_STORAGE_KEY = 'nhs_ai_api_key';
  private static ENDPOINT_STORAGE_KEY = 'nhs_ai_endpoint';

  /**
   * Save API configuration for AI service
   */
  static saveApiConfig(apiKey: string, endpoint: string = 'openai'): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    localStorage.setItem(this.ENDPOINT_STORAGE_KEY, endpoint);
    console.log('AI API configuration saved');
  }

  /**
   * Get stored API key
   */
  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  /**
   * Get configured AI endpoint
   */
  static getEndpoint(): string {
    return localStorage.getItem(this.ENDPOINT_STORAGE_KEY) || 'openai';
  }

  /**
   * Test API connection
   */
  static async testConnection(): Promise<boolean> {
    const apiKey = this.getApiKey();
    if (!apiKey) return false;

    try {
      const endpoint = this.getEndpoint();
      
      if (endpoint === 'openai') {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        return response.ok;
      }
      
      // Add other AI service tests here (Claude, etc.)
      return false;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Generate NHS-compliant blood test interpretation
   */
  static async generateInterpretation(request: ReportRequest): Promise<AIInterpretation> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not configured. Please set up AI service credentials.');
    }

    const endpoint = this.getEndpoint();
    
    try {
      if (endpoint === 'openai') {
        return await this.generateWithOpenAI(request, apiKey);
      }
      
      throw new Error(`Unsupported AI endpoint: ${endpoint}`);
    } catch (error) {
      console.error('AI interpretation generation failed:', error);
      throw new Error('Failed to generate AI interpretation. Please try again.');
    }
  }

  /**
   * Generate interpretation using OpenAI GPT-4
   */
  private static async generateWithOpenAI(request: ReportRequest, apiKey: string): Promise<AIInterpretation> {
    const prompt = this.buildNHSPrompt(request);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: this.getNHSSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return this.parseAIResponse(content);
  }

  /**
   * Build NHS-compliant system prompt
   */
  private static getNHSSystemPrompt(): string {
    return `You are a clinical AI assistant specializing in blood test interpretation for NHS patients. 

CRITICAL REQUIREMENTS:
1. Follow NHS clinical guidelines and NICE recommendations
2. Use patient-friendly language while maintaining clinical accuracy
3. Always include safety-netting advice
4. Identify red flags requiring urgent medical attention
5. Use SNOMED CT/ICD-10 codes where appropriate
6. Reference LOINC codes for laboratory tests
7. Comply with UK clinical governance standards

SAFETY RULES:
- Never provide definitive diagnoses
- Always recommend clinical correlation
- Include clear red flag warnings
- Emphasize when urgent medical attention is needed
- Maintain professional medical terminology accuracy

OUTPUT FORMAT:
Provide response as structured JSON with these sections:
- summary: Patient-friendly overview
- findings: List of key abnormal results with explanations
- redFlags: Critical safety warnings
- followUp: Recommended next steps
- causes: Possible causes for abnormal results
- confidence: Confidence level (0-100)
- sources: Clinical guidelines referenced`;
  }

  /**
   * Build patient-specific prompt
   */
  private static buildNHSPrompt(request: ReportRequest): string {
    const resultsText = request.testResults.map(result => 
      `${result.testName}: ${result.value} ${result.unit} (Normal: ${result.referenceRange}) - Status: ${result.status}${result.loincCode ? ` [LOINC: ${result.loincCode}]` : ''}`
    ).join('\n');

    return `Patient Information:
- Age: ${this.calculateAge(request.patientInfo.dateOfBirth)} years
- Gender: ${request.patientInfo.gender}
- Test Date: ${request.testDate}

Blood Test Results:
${resultsText}

Please provide a comprehensive NHS-standard interpretation focusing on:
1. Patient-friendly explanation of abnormal results
2. Clinical significance and potential causes
3. Red flags requiring immediate attention
4. Appropriate follow-up recommendations
5. Safety-netting advice

Ensure all advice follows current NHS and NICE guidelines.`;
  }

  /**
   * Parse AI response into structured format
   */
  private static parseAIResponse(content: string): AIInterpretation {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      return {
        summary: parsed.summary || '',
        findings: parsed.findings || [],
        redFlags: parsed.redFlags || [],
        followUp: parsed.followUp || [],
        causes: parsed.causes || [],
        confidence: parsed.confidence || 85,
        sources: parsed.sources || ['NHS Guidelines', 'NICE Recommendations']
      };
    } catch {
      // Fallback: parse structured text
      return this.parseStructuredText(content);
    }
  }

  /**
   * Fallback parser for structured text responses
   */
  private static parseStructuredText(content: string): AIInterpretation {
    const sections = {
      summary: this.extractSection(content, 'summary', 'Summary'),
      findings: this.extractListSection(content, 'findings', 'Key Findings'),
      redFlags: this.extractListSection(content, 'red flags', 'Red Flags'),
      followUp: this.extractListSection(content, 'follow', 'Follow-up'),
      causes: this.extractListSection(content, 'causes', 'Causes'),
    };

    return {
      summary: sections.summary || 'Blood test interpretation generated',
      findings: sections.findings,
      redFlags: sections.redFlags,
      followUp: sections.followUp,
      causes: sections.causes,
      confidence: 85,
      sources: ['NHS Guidelines', 'Clinical Knowledge Base']
    };
  }

  /**
   * Extract text section from AI response
   */
  private static extractSection(content: string, keyword: string, header?: string): string {
    const patterns = [
      new RegExp(`${header}:?\\s*([^\\n]+(?:\\n(?!\\w+:)[^\\n]+)*)`, 'i'),
      new RegExp(`${keyword}:?\\s*([^\\n]+(?:\\n(?!\\w+:)[^\\n]+)*)`, 'i')
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) return match[1].trim();
    }
    
    return '';
  }

  /**
   * Extract list section from AI response
   */
  private static extractListSection(content: string, keyword: string, header?: string): string[] {
    const sectionText = this.extractSection(content, keyword, header);
    if (!sectionText) return [];

    return sectionText
      .split(/\n[-•*]\s*|^\d+\.\s*/)
      .filter(item => item.trim().length > 0)
      .map(item => item.trim());
  }

  /**
   * Calculate age from date of birth
   */
  private static calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
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
      confidence: interpretation.confidence,
      testCount: request.testResults.length,
      criticalCount: request.testResults.filter(r => r.status === 'critical').length,
      redFlagCount: interpretation.redFlags.length,
      userId: 'current_user', // Should be replaced with actual user ID
      sessionId: 'current_session' // Should be replaced with actual session ID
    };
  }
}