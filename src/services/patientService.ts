import { supabase } from '@/lib/supabase'

export interface PatientProfile {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | ''
  phone?: string
  address?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  postcode?: string
  country?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_conditions?: string[]
  allergies?: string[]
  current_medications?: string[]
  created_at: string
  updated_at: string
}

export interface MedicalHistory {
  id: string
  patient_id: string
  condition: string
  diagnosed_date: string
  status: 'active' | 'resolved' | 'ongoing'
  notes?: string
  created_at: string
}

export interface TestResult {
  id: string
  patient_id: string
  test_type: string
  test_name: string
  result_values: any
  reference_ranges: any
  status: 'normal' | 'abnormal' | 'critical' | 'pending'
  test_date: string
  clinic_name?: string
  doctor_notes?: string
  file_url?: string
  created_at: string
}

export const patientService = {
  // Patient Profile Management
  async createPatientProfile(profileData: Omit<PatientProfile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('patient_profiles')
      .insert({
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    return { data, error }
  },

  async getPatientProfile(userId: string) {
    const { data, error } = await supabase
      .from('patient_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    
    return { data, error }
  },

  async updatePatientProfile(patientId: string, updates: Partial<PatientProfile>) {
    const { data, error } = await supabase
      .from('patient_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId)
      .select()
      .single()
    
    return { data, error }
  },

  // Medical History Management
  async addMedicalHistory(historyData: Omit<MedicalHistory, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('medical_history')
      .insert({
        ...historyData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    return { data, error }
  },

  async getMedicalHistory(patientId: string) {
    const { data, error } = await supabase
      .from('medical_history')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  async updateMedicalHistory(historyId: string, updates: Partial<MedicalHistory>) {
    const { data, error } = await supabase
      .from('medical_history')
      .update(updates)
      .eq('id', historyId)
      .select()
      .single()
    
    return { data, error }
  },

  // Test Results Management
  async saveTestResult(resultData: Omit<TestResult, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('test_results')
      .insert({
        ...resultData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    return { data, error }
  },

  async getTestResults(patientId: string) {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('patient_id', patientId)
      .order('test_date', { ascending: false })
    
    return { data, error }
  },

  async getTestResultById(resultId: string) {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('id', resultId)
      .single()
    
    return { data, error }
  },

  async updateTestResult(resultId: string, updates: Partial<TestResult>) {
    const { data, error } = await supabase
      .from('test_results')
      .update(updates)
      .eq('id', resultId)
      .select()
      .single()
    
    return { data, error }
  },

  // Search and Filter
  async searchPatients(searchTerm: string) {
    const { data, error } = await supabase
      .from('patient_profiles')
      .select('*')
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
    
    return { data, error }
  },

  async getPatientStats(patientId: string) {
    const [profileResult, historyResult, resultsResult] = await Promise.all([
      this.getPatientProfile(patientId),
      this.getMedicalHistory(patientId),
      this.getTestResults(patientId)
    ])

    return {
      profile: profileResult.data,
      totalConditions: historyResult.data?.length || 0,
      totalTests: resultsResult.data?.length || 0,
      recentTests: resultsResult.data?.slice(0, 5) || [],
      activeConditions: historyResult.data?.filter(h => h.status === 'active').length || 0
    }
  }
}