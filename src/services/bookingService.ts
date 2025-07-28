import { supabase } from '@/lib/supabase'

export interface Appointment {
  id: string
  patient_id: string
  clinic_id?: string
  healthcare_professional_id?: string
  service_type: string
  service_name: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  location_type: 'clinic' | 'home' | 'online'
  location_address?: string
  price: number
  currency: string
  special_instructions?: string
  patient_name: string
  patient_phone: string
  patient_email: string
  created_at: string
  updated_at: string
}

export interface AvailableSlot {
  id: string
  healthcare_professional_id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  max_appointments: number
  created_at: string
}

export interface BookingRequest {
  patient_id: string
  service_type: string
  service_name: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  location_type: 'clinic' | 'home' | 'online'
  location_address?: string
  price: number
  special_instructions?: string
  patient_name: string
  patient_phone: string
  patient_email: string
}

export const bookingService = {
  // Appointment Management
  async createBooking(bookingData: BookingRequest) {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        ...bookingData,
        status: 'pending',
        currency: 'GBP',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    return { data, error }
  },

  async getPatientAppointments(patientId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: true })
    
    return { data, error }
  },

  async getClinicAppointments(clinicId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('clinic_id', clinicId)
      .order('appointment_date', { ascending: true })
    
    return { data, error }
  },

  async getProfessionalAppointments(professionalId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('healthcare_professional_id', professionalId)
      .order('appointment_date', { ascending: true })
    
    return { data, error }
  },

  async updateAppointmentStatus(appointmentId: string, status: Appointment['status'], notes?: string) {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }
    
    if (notes) {
      updateData.special_instructions = notes
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .select()
      .single()
    
    return { data, error }
  },

  async cancelAppointment(appointmentId: string, reason?: string) {
    return this.updateAppointmentStatus(appointmentId, 'cancelled', reason)
  },

  async confirmAppointment(appointmentId: string) {
    return this.updateAppointmentStatus(appointmentId, 'confirmed')
  },

  async completeAppointment(appointmentId: string, notes?: string) {
    return this.updateAppointmentStatus(appointmentId, 'completed', notes)
  },

  // Availability Management
  async getAvailableSlots(date: string, serviceType?: string) {
    let query = supabase
      .from('available_slots')
      .select(`
        *,
        healthcare_professional:healthcare_professional_id (
          id,
          name,
          specialization,
          clinic_name
        )
      `)
      .eq('date', date)
      .eq('is_available', true)

    const { data, error } = await query

    return { data, error }
  },

  async createAvailableSlot(slotData: Omit<AvailableSlot, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('available_slots')
      .insert({
        ...slotData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    return { data, error }
  },

  async updateSlotAvailability(slotId: string, isAvailable: boolean) {
    const { data, error } = await supabase
      .from('available_slots')
      .update({ is_available: isAvailable })
      .eq('id', slotId)
      .select()
      .single()
    
    return { data, error }
  },

  // Search and Filter
  async searchAppointments(searchTerm: string, filters?: {
    status?: string
    date_from?: string
    date_to?: string
    service_type?: string
  }) {
    let query = supabase
      .from('appointments')
      .select('*')

    if (searchTerm) {
      query = query.or(`patient_name.ilike.%${searchTerm}%,patient_email.ilike.%${searchTerm}%,service_name.ilike.%${searchTerm}%`)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.date_from) {
      query = query.gte('appointment_date', filters.date_from)
    }

    if (filters?.date_to) {
      query = query.lte('appointment_date', filters.date_to)
    }

    if (filters?.service_type) {
      query = query.eq('service_type', filters.service_type)
    }

    const { data, error } = await query.order('appointment_date', { ascending: true })

    return { data, error }
  },

  // Analytics
  async getBookingStats(professionalId?: string, clinicId?: string) {
    let query = supabase.from('appointments').select('*')

    if (professionalId) {
      query = query.eq('healthcare_professional_id', professionalId)
    }

    if (clinicId) {
      query = query.eq('clinic_id', clinicId)
    }

    const { data: appointments, error } = await query

    if (error) return { data: null, error }

    const stats = {
      total: appointments?.length || 0,
      pending: appointments?.filter(a => a.status === 'pending').length || 0,
      confirmed: appointments?.filter(a => a.status === 'confirmed').length || 0,
      completed: appointments?.filter(a => a.status === 'completed').length || 0,
      cancelled: appointments?.filter(a => a.status === 'cancelled').length || 0,
      revenue: appointments?.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.price, 0) || 0,
      upcomingToday: appointments?.filter(a => 
        a.appointment_date === new Date().toISOString().split('T')[0] && 
        ['pending', 'confirmed'].includes(a.status)
      ).length || 0
    }

    return { data: stats, error: null }
  },

  // Notifications
  async getUpcomingAppointments(userId: string, userType: 'patient' | 'professional') {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    let query = supabase
      .from('appointments')
      .select('*')
      .gte('appointment_date', new Date().toISOString().split('T')[0])
      .lte('appointment_date', tomorrow.toISOString().split('T')[0])
      .in('status', ['pending', 'confirmed'])

    if (userType === 'patient') {
      query = query.eq('patient_id', userId)
    } else {
      query = query.eq('healthcare_professional_id', userId)
    }

    const { data, error } = await query.order('appointment_date', { ascending: true })

    return { data, error }
  }
}