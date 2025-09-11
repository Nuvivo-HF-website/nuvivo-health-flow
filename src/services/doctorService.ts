import { supabase } from '@/integrations/supabase/client'
import type { Json } from '@/integrations/supabase/types'

export interface DoctorProfile {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  specialty?: string
  qualification?: string
  license_number?: string
  years_of_experience?: number
  phone?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  postcode?: string
  country?: string
  clinic_name?: string
  clinic_address?: string
  consultation_fee?: number
  available_hours?: Json
  available_days?: string[]
  bio?: string
  languages?: string[]
  created_at: string
  updated_at: string
}

export const doctorService = {
  // Doctor Profile Management
  async createDoctorProfile(profileData: Omit<DoctorProfile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('doctor_profiles')
      .insert({
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    return { data, error }
  },

  async getDoctorProfile(userId: string) {
    const { data, error } = await supabase
      .from('doctor_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    
    return { data, error }
  },

  async updateDoctorProfile(doctorId: string, updates: Partial<DoctorProfile>) {
    const { data, error } = await supabase
      .from('doctor_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', doctorId)
      .select()
      .single()
    
    return { data, error }
  },

  // Search and Filter
  async searchDoctors(searchTerm: string) {
    const { data, error } = await supabase
      .from('doctor_profiles')
      .select('*')
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%`)
    
    return { data, error }
  },

  // Optimized dashboard data
  async getDoctorDashboard(doctorId: string) {
    const [profileResult, appointmentsResult, consultationsResult] = await Promise.all([
      this.getDoctorProfile(doctorId),
      supabase
        .from('appointments')
        .select('id, appointment_date, appointment_type, status')
        .eq('doctor_id', doctorId)
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date', { ascending: true })
        .limit(5),
      supabase
        .from('consultations')
        .select('id, appointment_date, consultation_type, status')
        .eq('doctor_id', doctorId)
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date', { ascending: true })
        .limit(5)
    ])

    return {
      profile: profileResult.data,
      upcomingAppointments: appointmentsResult.data || [],
      upcomingConsultations: consultationsResult.data || [],
      summary: {
        upcomingAppointments: appointmentsResult.data?.length || 0,
        upcomingConsultations: consultationsResult.data?.length || 0,
      }
    }
  }
}