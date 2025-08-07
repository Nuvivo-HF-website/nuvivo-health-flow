import { supabase } from '@/integrations/supabase/client';

export interface CreateAppointmentData {
  user_id: string;
  specialist_id?: string;
  appointment_date: string;
  appointment_type: string;
  duration_minutes?: number;
  fee?: number;
  notes?: string;
  payment_status?: string;
  status?: string;
}

export interface CreateConsultationData {
  user_id: string;
  consultation_type: string;
  appointment_date: string;
  fee: number;
  notes?: string;
  payment_status?: string;
  status?: string;
}

export const bookingService = {
  async createAppointment(data: CreateAppointmentData) {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }

    return appointment;
  },

  async createConsultation(data: CreateConsultationData) {
    const { data: consultation, error } = await supabase
      .from('consultations')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Error creating consultation:', error);
      throw error;
    }

    return consultation;
  },

  async getAppointmentsByUser(userId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        specialist:specialists(
          *,
          profile:profiles(full_name, avatar_url)
        )
      `)
      .eq('user_id', userId)
      .order('appointment_date', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }

    return data;
  },

  async getConsultationsByUser(userId: string) {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: false });

    if (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }

    return data;
  },

  async updateAppointmentStatus(appointmentId: string, status: string, cancellationReason?: string) {
    const updateData: any = { status };
    if (cancellationReason) {
      updateData.cancellation_reason = cancellationReason;
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }

    return data;
  }
};