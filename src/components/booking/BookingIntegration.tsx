import React from 'react';
import { bookingService, CreateAppointmentData, CreateConsultationData } from '@/services/bookingService';
import { useToast } from '@/components/ui/use-toast';

interface BookingIntegrationProps {
  children: React.ReactNode;
}

// This component provides booking functionality to child components
export function BookingIntegration({ children }: BookingIntegrationProps) {
  const { toast } = useToast();

  const createGuestAppointment = async (bookingData: any) => {
    try {
      // For guest bookings, we would typically create a temporary user or handle differently
      // For now, this is a placeholder that shows the structure
      const appointmentData: CreateAppointmentData = {
        user_id: 'guest', // Would need special handling for guest users
        specialist_id: bookingData.specialist?.id,
        appointment_date: new Date(`${bookingData.date}T${bookingData.time}:00`).toISOString(),
        appointment_type: 'consultation',
        duration_minutes: 30,
        fee: bookingData.specialist?.price,
        notes: bookingData.guestDetails?.notes,
        payment_status: 'pending',
        status: 'scheduled'
      };

      console.log('Guest booking data (not saved to DB):', appointmentData);
      
      toast({
        title: "Booking Created",
        description: "Your appointment has been scheduled successfully. (Demo mode - not saved to database)",
      });

      return { success: true, data: appointmentData };
    } catch (error) {
      console.error('Error creating guest appointment:', error);
      toast({
        title: "Booking Error",
        description: "There was an error creating your appointment. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const createUserConsultation = async (consultationData: any, userId: string) => {
    try {
      const data: CreateConsultationData = {
        user_id: userId,
        consultation_type: consultationData.type,
        appointment_date: consultationData.appointmentDateTime.toISOString(),
        fee: consultationData.fee,
        notes: consultationData.notes,
        payment_status: 'pending',
        status: 'scheduled'
      };

      const result = await bookingService.createConsultation(data);
      
      toast({
        title: "Consultation Booked",
        description: "Your consultation has been scheduled successfully.",
      });

      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating consultation:', error);
      toast({
        title: "Booking Error",
        description: "There was an error creating your consultation. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const createUserAppointment = async (appointmentData: any, userId: string) => {
    try {
      const data: CreateAppointmentData = {
        user_id: userId,
        specialist_id: appointmentData.specialist_id,
        appointment_date: appointmentData.appointment_date,
        appointment_type: appointmentData.appointment_type,
        duration_minutes: appointmentData.duration_minutes || 30,
        fee: appointmentData.fee,
        notes: appointmentData.notes,
        payment_status: 'pending',
        status: 'scheduled'
      };

      const result = await bookingService.createAppointment(data);
      
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been scheduled successfully.",
      });

      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Booking Error",
        description: "There was an error creating your appointment. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  // Provide these functions to child components via context or props
  const bookingFunctions = {
    createGuestAppointment,
    createUserConsultation,
    createUserAppointment
  };

  return (
    <div>
      {children}
    </div>
  );
}