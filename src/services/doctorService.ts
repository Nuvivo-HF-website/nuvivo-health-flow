// src/services/doctorService.ts
import { supabase } from '@/integrations/supabase/client'
import type { Json } from '@/integrations/supabase/types'

export interface DoctorProfile {
  id: string
  user_id: string
  first_name?: string | null
  last_name?: string | null

  profession?: string | null
  specializations?: string[] | null

  // legacy
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

  // doc paths stored in doctor_profiles
  indemnity_document_url?: string | null
  dbs_pvg_document_url?: string | null

  // flags
  is_marketplace_ready?: boolean | null
  verification_status?: 'incomplete' | 'pending_review' | 'approved' | 'rejected' | null
  is_active?: boolean | null

  created_at: string
  updated_at: string
}

// Only allow columns that actually exist in doctor_profiles
const ALLOWED_COLS = new Set([
  'user_id',
  'first_name',
  'last_name',
  'phone',
  'profession',
  'specializations',
  'specialty', // legacy mirror
  'qualification',
  'license_number',
  'years_of_experience',
  'consultation_fee',
  'bio',
  'clinic_name',
  'clinic_address',
  'address_line_1',
  'address_line_2',
  'city',
  'postcode',
  'country',
  'available_hours',
  'available_days',
  'languages',
  'indemnity_document_url',
  'dbs_pvg_document_url',
  'is_marketplace_ready',
  'verification_status',
  'is_active',
  'created_at',
  'updated_at',
])

function withLegacyShim<T extends Record<string, any>>(obj: T) {
  const profession = obj.profession ?? obj.specialty ?? null
  return {
    ...obj,
    specialty: obj.specialty ?? profession ?? null,
  }
}

function pickAllowed(obj: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue
    if (ALLOWED_COLS.has(k)) out[k] = v
  }
  return out
}

export const doctorService = {
  async createDoctorProfile(profileData: Omit<DoctorProfile, 'id' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString()
    const base = withLegacyShim({
      ...profileData,
      specializations: profileData.specializations ?? [],
      available_days: profileData.available_days ?? [],
      languages: profileData.languages ?? [],
      created_at: now,
      updated_at: now,
    })
    const payload = pickAllowed(base) as any

    console.debug('doctor_profiles INSERT payload →', payload)

    const { data, error } = await supabase
      .from('doctor_profiles')
      .insert(payload as any)
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
    const base = withLegacyShim({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    const payload = pickAllowed(base) as any

    console.debug('doctor_profiles UPDATE payload →', payload)

    const { data, error } = await supabase
      .from('doctor_profiles')
      .update(payload as any)
      .eq('id', doctorId)
      .select()
      .single()

    return { data, error }
  },

  async searchDoctors(searchTerm: string) {
    const { data, error } = await supabase
      .from('doctor_profiles')
      .select('*')
      .or([
        `first_name.ilike.%${searchTerm}%`,
        `last_name.ilike.%${searchTerm}%`,
        `profession.ilike.%${searchTerm}%`,
        `specialty.ilike.%${searchTerm}%`,
      ].join(','))

    return { data, error }
  },

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
