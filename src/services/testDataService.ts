import { supabase } from '@/integrations/supabase/client'

export interface SampleTestData {
  test_name: string;
  value: number | string;
  unit: string;
  reference_range: string;
  status: 'normal' | 'high' | 'low' | 'critical';
}

const sampleBloodTestData: SampleTestData[] = [
  {
    test_name: "Total Cholesterol",
    value: 180,
    unit: "mg/dL",
    reference_range: "<200",
    status: "normal"
  },
  {
    test_name: "HDL Cholesterol",
    value: 65,
    unit: "mg/dL", 
    reference_range: ">40",
    status: "normal"
  },
  {
    test_name: "LDL Cholesterol",
    value: 95,
    unit: "mg/dL",
    reference_range: "<100",
    status: "normal"
  },
  {
    test_name: "Triglycerides",
    value: 120,
    unit: "mg/dL",
    reference_range: "<150",
    status: "normal"
  },
  {
    test_name: "Vitamin D",
    value: 18,
    unit: "ng/mL",
    reference_range: "20-50",
    status: "low"
  },
  {
    test_name: "Iron",
    value: 45,
    unit: "μg/dL",
    reference_range: "50-170",
    status: "low"
  },
  {
    test_name: "Hemoglobin A1c",
    value: 5.2,
    unit: "%",
    reference_range: "<5.7",
    status: "normal"
  },
  {
    test_name: "TSH",
    value: 2.8,
    unit: "mU/L",
    reference_range: "0.4-4.0",
    status: "normal"
  }
]

export const testDataService = {
  /**
   * Create a sample blood test result for testing
   */
  async createSampleResult(userId: string): Promise<{ data: any; error: any }> {
    try {
      const sampleData = {
        tests: sampleBloodTestData,
        test_date: new Date().toISOString().split('T')[0],
        laboratory: "Sample Lab for Testing",
        patient_id: "SAMPLE_" + Math.random().toString(36).substr(2, 9)
      }

      const { data, error } = await supabase
        .from('results')
        .insert({
          user_id: userId,
          parsed_data: sampleData as any,
          uploaded_by: userId
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Validate that AI consent is properly set
   */
  async checkAIConsent(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('ai_consent')
        .eq('user_id', userId)
        .single()

      if (error || !data) return false
      return !!data.ai_consent
    } catch {
      return false
    }
  },

  /**
   * Enable AI consent for testing
   */
  async enableAIConsent(userId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ai_consent: true })
        .eq('user_id', userId)

      return { success: !error, error }
    } catch (error) {
      return { success: false, error }
    }
  }
}