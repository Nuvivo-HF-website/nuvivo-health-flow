// src/services/doctorService.ts
import { supabase } from '@/integrations/supabase/client'
import type { Json } from '@/integrations/supabase/types'

export interface DoctorProfile {
  id: string
  user_id: string

  first_name?: string | null
  last_name?: string | null

  // NEW canonical fields
  profession?: string | null
  specializations?: string[] | null

  // Legacy (kept for backward compatibility/readers that still expect it)
  specialty?: string | null

  qualification?: string | null
  license_number?: string | null
  years_of_experience?: number | null
  phone?: string | null

  address_line_1?: string | null
  address_line_2?: string | null
  city?: string | null
  postcode?: string | null
  country?: string | null

  clinic_name?: string | null
  clinic_address?: string | null

  consultation_fee?: number | null
  available_hours?: Json | null
  available_days?: string[] | null
  bio?: string | null
  languages?: string[] | null

  // Media + documents
  avatar_url?: string | null
  indemnity_document_url?: string | null
  dbs_pvg_document_url?: string | null

  // Flags
  is_marketplace_ready?: boolean | null
  verification_status?: 'incomplete' | 'pending_review' | 'approved' | 'rejected' | null
  is_active?: boolean | null

  created_at: string
  updated_at: string
}

type CreatePayload = Omit<DoctorProfile, 'id' | 'created_at' | 'updated_at'>
type UpdatePayload = Partial<DoctorProfile>

/**
 * Helper to build a write payload that:
 * - Stores canonical fields (profession, specializations)
 * - Mirrors profession -> specialty for legacy readers
 */
function withLegacyShim<T extends Record<string, any>>(obj: T) {
  const profession = obj.profession ?? obj.specialty ?? null
  const payload = {
    ...obj,
    // legacy mirror so old UIs using `specialty` still see something
    specialty: obj.specialty ?? profession ?? null,
  }
  return payload
}

export const doctorService = {
  // Doctor Profile Management
  async createDoctorProfile(profileData: CreatePayload) {
    const now = new Date().toISOString()
    const payload: any = withLegacyShim({
      ...profileData,
      // Be explicit on array columns to avoid null vs empty surprises
      specializations: profileData.specializations ?? [],
      available_days: profileData.available_days ?? [],
      languages: profileData.languages ?? [],
      created_at: now,
      updated_at: now,
    })
    console.debug('[doctorService.createDoctorProfile] payload →', payload)
    const { data, error } = await supabase
      .from('doctor_profiles')
      .insert(payload)
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

  async updateDoctorProfile(doctorId: string, updates: UpdatePayload) {
    const payload: any = withLegacyShim({
      ...updates,
      // normalize arrays on update too
      specializations: updates.specializations ?? undefined,
      available_days: updates.available_days ?? undefined,
      languages: updates.languages ?? undefined,
      updated_at: new Date().toISOString(),
    })
    console.debug('[doctorService.updateDoctorProfile] payload →', payload)
    const { data, error } = await supabase
      .from('doctor_profiles')
      .update(payload)
      .eq('id', doctorId)
      .select()
      .single()

    return { data, error }
  },

  // Search and Filter (uses NEW fields, then falls back to legacy)
  async searchDoctors(searchTerm: string) {
    const { data, error } = await supabase
      .from('doctor_profiles')
      .select('*')
      .or(
        [
          `first_name.ilike.%${searchTerm}%`,
          `last_name.ilike.%${searchTerm}%`,
          `profession.ilike.%${searchTerm}%`,   // new
          `specialty.ilike.%${searchTerm}%`,    // legacy fallback
        ].join(',')
      )

    return { data, error }
  },

  // Optimized dashboard data (kept as-is; note: this expects doctorId == user_id)
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
        .limit(5),
    ])

    return {
      profile: profileResult.data as DoctorProfile | null,
      upcomingAppointments: appointmentsResult.data || [],
      upcomingConsultations: consultationsResult.data || [],
      summary: {
        upcomingAppointments: appointmentsResult.data?.length || 0,
        upcomingConsultations: consultationsResult.data?.length || 0,
      },
    }
  },
}
