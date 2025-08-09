import { supabase } from '@/integrations/supabase/client'

// Type definitions
export interface TestResult {
  id: string
  user_id: string
  test_type: string
  test_name: string
  test_date: string
  result_values: any
  reference_ranges: any
  status: 'pending' | 'completed' | 'in_progress' | 'cancelled'
  result_status: 'normal' | 'abnormal' | 'critical' | 'pending'
  clinic_name?: string
  doctor_name?: string
  doctor_notes?: string
  ai_summary?: string
  file_url?: string
  order_id?: string
  created_at: string
  updated_at: string
}

export interface Consultation {
  id: string
  user_id: string
  doctor_id?: string
  consultation_type: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  appointment_date: string
  duration_minutes: number
  notes?: string
  doctor_notes?: string
  prescription?: string
  follow_up_required: boolean
  follow_up_date?: string
  meeting_link?: string
  symptoms?: string
  diagnosis?: string
  treatment_plan?: string
  fee?: number
  payment_status: 'pending' | 'paid' | 'refunded'
  created_at: string
  updated_at: string
}

export interface MedicalDocument {
  id: string
  user_id: string
  document_type: string
  document_name: string
  file_url: string
  file_size?: number
  file_type?: string
  description?: string
  tags: string[]
  is_test_result: boolean
  test_result_id?: string
  consultation_id?: string
  uploaded_by_doctor: boolean
  doctor_id?: string
  created_at: string
  updated_at: string
}

export interface Medication {
  id: string
  user_id: string
  medication_name: string
  dosage?: string
  frequency?: string
  prescribed_by?: string
  prescription_date?: string
  start_date?: string
  end_date?: string
  status: 'active' | 'completed' | 'discontinued'
  notes?: string
  side_effects?: string
  consultation_id?: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  user_id: string
  doctor_id?: string
  appointment_type: string
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  appointment_date: string
  duration_minutes: number
  location?: string
  meeting_link?: string
  notes?: string
  reminder_sent: boolean
  fee?: number
  payment_status: 'pending' | 'paid' | 'refunded'
  created_at: string
  updated_at: string
}

export const patientPortalService = {
  // Test Results
  async getTestResults(userId: string) {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', userId)
      .order('test_date', { ascending: false })
    
    return { data, error }
  },

  async getTestResultById(id: string) {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  async createTestResult(testResult: Omit<TestResult, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('test_results')
      .insert(testResult)
      .select()
      .single()
    
    return { data, error }
  },

  // Consultations
  async getConsultations(userId: string) {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: false })
    
    return { data, error }
  },

  async getUpcomingConsultations(userId: string) {
    const today = new Date().toISOString()
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', userId)
      .gte('appointment_date', today)
      .in('status', ['scheduled', 'in_progress'])
      .order('appointment_date', { ascending: true })
    
    return { data, error }
  },

  async createConsultation(consultation: Omit<Consultation, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('consultations')
      .insert(consultation)
      .select()
      .single()
    
    return { data, error }
  },

  async updateConsultation(id: string, updates: Partial<Consultation>) {
    const { data, error } = await supabase
      .from('consultations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Medical Documents
  async getMedicalDocuments(userId: string) {
    const { data, error } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  async uploadMedicalDocument(document: Omit<MedicalDocument, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('medical_documents')
      .insert(document)
      .select()
      .single()
    
    return { data, error }
  },

  // Medications
  async getMedications(userId: string) {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  async getActiveMedications(userId: string) {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('medication_name')
    
    return { data, error }
  },

  async addMedication(medication: Omit<Medication, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('medications')
      .insert(medication)
      .select()
      .single()
    
    return { data, error }
  },

  async updateMedication(id: string, updates: Partial<Medication>) {
    const { data, error } = await supabase
      .from('medications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Appointments
  async getAppointments(userId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: false })
    
    return { data, error }
  },

  async getUpcomingAppointments(userId: string) {
    const today = new Date().toISOString()
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .gte('appointment_date', today)
      .in('status', ['scheduled', 'confirmed'])
      .order('appointment_date', { ascending: true })
    
    return { data, error }
  },

  async createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single()
    
    return { data, error }
  },

  async updateAppointment(id: string, updates: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Optimized Dashboard Summary with selective fields
  async getDashboardSummary(userId: string) {
    const [testResults, consultations, appointments, medications] = await Promise.all([
      supabase
        .from('test_results')
        .select('id, test_name, test_date, result_status, ai_summary')
        .eq('user_id', userId)
        .order('test_date', { ascending: false })
        .limit(3),
      supabase
        .from('consultations')
        .select('id, consultation_type, appointment_date, status, doctor_id')
        .eq('user_id', userId)
        .gte('appointment_date', new Date().toISOString())
        .in('status', ['scheduled', 'in_progress'])
        .order('appointment_date', { ascending: true })
        .limit(3),
      supabase
        .from('appointments')
        .select('id, appointment_type, appointment_date, status, location')
        .eq('user_id', userId)
        .gte('appointment_date', new Date().toISOString())
        .in('status', ['scheduled', 'confirmed'])
        .order('appointment_date', { ascending: true })
        .limit(3),
      supabase
        .from('medications')
        .select('id, medication_name, dosage, frequency, prescribed_by')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('medication_name')
        .limit(5)
    ])

    return {
      recentTestResults: testResults.data || [],
      upcomingConsultations: consultations.data || [],
      upcomingAppointments: appointments.data || [],
      activeMedications: medications.data || [],
      summary: {
        totalTestResults: testResults.data?.length || 0,
        totalConsultations: consultations.data?.length || 0,
        totalAppointments: appointments.data?.length || 0,
        totalMedications: medications.data?.length || 0
      }
    }
  },

  // Cached static data
  async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, description, category, base_price, duration_minutes')
      .eq('is_active', true)
      .order('category, name')
    
    return { data, error }
  },

  async getSpecialists() {
    const { data, error } = await supabase
      .from('specialists')
      .select(`
        id, specialty, consultation_fee, bio, experience_years,
        profiles:user_id (full_name)
      `)
      .eq('is_active', true)
      .order('specialty')
    
    return { data, error }
  }
}