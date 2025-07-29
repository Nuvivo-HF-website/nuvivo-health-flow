// Advanced Appointment Booking System with Specialist Selection
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PaymentButton } from '@/components/PaymentButton';
import { 
  CalendarDays, Clock, User, MapPin, Star, 
  Stethoscope, GraduationCap, Award, Phone, Video,
  ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { format, addDays, isBefore, isSameDay, startOfDay } from 'date-fns';

interface Specialist {
  id: string;
  user_id: string;
  specialty: string;
  qualifications: string[];
  experience_years: number;
  bio: string;
  consultation_fee: number;
  available_days: string[];
  available_hours: { start: string; end: string };
  consultation_duration: number;
  booking_advance_days: number;
  profile: {
    full_name: string;
    avatar_url?: string;
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
  specialist_id: string;
}

const consultationTypes = [
  { 
    id: 'general', 
    name: 'General Consultation', 
    duration: 30, 
    icon: Stethoscope,
    description: 'General health consultation and check-up'
  },
  { 
    id: 'follow-up', 
    name: 'Follow-up Appointment', 
    duration: 20, 
    icon: User,
    description: 'Follow-up on previous consultation or treatment'
  },
  { 
    id: 'specialist', 
    name: 'Specialist Consultation', 
    duration: 45, 
    icon: GraduationCap,
    description: 'Specialized medical consultation'
  },
  { 
    id: 'urgent', 
    name: 'Urgent Consultation', 
    duration: 30, 
    icon: AlertCircle,
    description: 'Urgent medical consultation'
  }
];

const specialties = [
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Psychiatry',
  'Pulmonology',
  'Rheumatology'
];

export function AdvancedAppointmentBooking() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedConsultationType, setSelectedConsultationType] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [notes, setNotes] = useState('');
  const [urgentReason, setUrgentReason] = useState('');
  const [preferredMethod, setPreferredMethod] = useState<'in-person' | 'video'>('in-person');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSpecialists();
  }, [selectedSpecialty]);

  useEffect(() => {
    if (selectedSpecialist && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedSpecialist, selectedDate]);

  const loadSpecialists = async () => {
    try {
      let query = supabase
        .from('specialists')
        .select(`
          *,
          profile:profiles!specialists_user_id_fkey(full_name, avatar_url)
        `)
        .eq('is_active', true);

      if (selectedSpecialty) {
        query = query.eq('specialty', selectedSpecialty);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSpecialists((data as any[]) || []);  // Type assertion to fix the type mismatch
    } catch (error: any) {
      console.error('Error loading specialists:', error);
      toast({
        title: "Error loading specialists",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedSpecialist || !selectedDate) return;

    try {
      const dayName = format(selectedDate, 'EEEE').toLowerCase();
      
      // Check if specialist is available on this day
      if (!selectedSpecialist.available_days.includes(dayName)) {
        setAvailableSlots([]);
        return;
      }

      // Generate time slots based on specialist's hours
      const { start, end } = selectedSpecialist.available_hours;
      const slots: TimeSlot[] = [];
      
      const startHour = parseInt(start.split(':')[0]);
      const startMinute = parseInt(start.split(':')[1]);
      const endHour = parseInt(end.split(':')[0]);
      const endMinute = parseInt(end.split(':')[1]);
      
      const slotDuration = selectedSpecialist.consultation_duration;
      
      let currentTime = new Date();
      currentTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 0, 0);
      
      while (currentTime < endTime) {
        const timeString = format(currentTime, 'HH:mm');
        
        // Check if slot is already booked
        const { data: existingAppointments } = await supabase
          .from('appointments')
          .select('*')
          .eq('specialist_id', selectedSpecialist.id)
          .eq('appointment_date', format(selectedDate, 'yyyy-MM-dd'))
          .like('appointment_date', `%${timeString}%`)
          .neq('status', 'cancelled');

        slots.push({
          time: timeString,
          available: !existingAppointments || existingAppointments.length === 0,
          specialist_id: selectedSpecialist.id
        });
        
        currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
      }
      
      setAvailableSlots(slots);
    } catch (error: any) {
      console.error('Error loading available slots:', error);
    }
  };

  const handleBookAppointment = async () => {
    if (!user || !selectedSpecialist || !selectedDate || !selectedTime || !selectedConsultationType) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (selectedConsultationType === 'urgent' && !urgentReason.trim()) {
      toast({
        title: "Urgent reason required",
        description: "Please provide a reason for urgent consultation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      const consultationType = consultationTypes.find(t => t.id === selectedConsultationType);

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          specialist_id: selectedSpecialist.id,
          appointment_date: appointmentDateTime.toISOString(),
          appointment_type: consultationType?.name || 'General Consultation',
          consultation_type: selectedConsultationType,
          duration_minutes: consultationType?.duration || 30,
          fee: selectedSpecialist.consultation_fee,
          status: 'scheduled',
          notes: notes || null,
          meeting_link: preferredMethod === 'video' ? 'To be provided' : null,
          location: preferredMethod === 'in-person' ? 'Clinic' : null,
          preparation_instructions: selectedConsultationType === 'urgent' ? urgentReason : null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Appointment booked successfully!",
        description: `Your ${consultationType?.name.toLowerCase()} with ${selectedSpecialist.profile.full_name} is scheduled for ${format(appointmentDateTime, 'dd/MM/yyyy at HH:mm')}.`,
      });

      // Reset form
      setCurrentStep(1);
      setSelectedSpecialty('');
      setSelectedSpecialist(null);
      setSelectedConsultationType('');
      setSelectedDate(undefined);
      setSelectedTime('');
      setNotes('');
      setUrgentReason('');

    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    return addDays(new Date(), 1); // Can book from tomorrow
  };

  const getMaxDate = () => {
    const maxDays = selectedSpecialist?.booking_advance_days || 30;
    return addDays(new Date(), maxDays);
  };

  const canSelectDate = (date: Date) => {
    const today = startOfDay(new Date());
    const minDate = addDays(today, 1);
    const maxDate = getMaxDate();
    
    if (isBefore(date, minDate) || isBefore(maxDate, date)) {
      return false;
    }

    if (!selectedSpecialist) return true;

    const dayName = format(date, 'EEEE').toLowerCase();
    return selectedSpecialist.available_days.includes(dayName);
  };

  const renderSpecialtySelection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Stethoscope className="h-5 w-5" />
          <span>Select Specialty</span>
        </CardTitle>
        <CardDescription>
          Choose the medical specialty for your consultation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              className="justify-start p-4 h-auto"
              onClick={() => {
                setSelectedSpecialty(specialty);
                setCurrentStep(2);
              }}
            >
              <div className="text-left">
                <div className="font-medium">{specialty}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSpecialistSelection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Select Specialist</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </CardTitle>
        <CardDescription>
          Choose from available {selectedSpecialty.toLowerCase()} specialists
        </CardDescription>
      </CardHeader>
      <CardContent>
        {specialists.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No specialists available</h3>
            <p className="text-muted-foreground">
              No specialists are currently available for {selectedSpecialty.toLowerCase()}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {specialists.map((specialist) => (
              <Card 
                key={specialist.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedSpecialist?.id === specialist.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => {
                  setSelectedSpecialist(specialist);
                  setCurrentStep(3);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{specialist.profile.full_name}</h3>
                      <p className="text-primary font-medium">{specialist.specialty}</p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="h-4 w-4" />
                          <span>{specialist.experience_years} years experience</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{specialist.consultation_duration} min sessions</span>
                        </div>
                      </div>

                      {specialist.qualifications.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {specialist.qualifications.slice(0, 3).map((qual, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {qual}
                            </Badge>
                          ))}
                          {specialist.qualifications.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{specialist.qualifications.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {specialist.bio && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {specialist.bio}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-lg font-semibold text-primary">
                          £{specialist.consultation_fee}
                        </div>
                        <Button size="sm">
                          Select Specialist
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAppointmentDetails = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5" />
              <span>Appointment Details</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </CardTitle>
          <CardDescription>
            Complete your appointment booking with {selectedSpecialist?.profile.full_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consultation Type */}
          <div>
            <Label>Consultation Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {consultationTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={selectedConsultationType === type.id ? "default" : "outline"}
                    className="justify-start p-4 h-auto"
                    onClick={() => setSelectedConsultationType(type.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="h-5 w-5 mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium">{type.name}</div>
                        <div className="text-xs opacity-75">{type.description}</div>
                        <div className="text-xs opacity-75">{type.duration} minutes</div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Urgent Reason */}
          {selectedConsultationType === 'urgent' && (
            <div>
              <Label htmlFor="urgent-reason">Reason for Urgent Consultation *</Label>
              <Textarea
                id="urgent-reason"
                placeholder="Please describe why this consultation is urgent..."
                value={urgentReason}
                onChange={(e) => setUrgentReason(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {/* Appointment Method */}
          <div>
            <Label>Appointment Method</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button
                variant={preferredMethod === 'in-person' ? "default" : "outline"}
                className="justify-start p-4 h-auto"
                onClick={() => setPreferredMethod('in-person')}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">In-Person</div>
                    <div className="text-xs opacity-75">Visit the clinic</div>
                  </div>
                </div>
              </Button>
              <Button
                variant={preferredMethod === 'video' ? "default" : "outline"}
                className="justify-start p-4 h-auto"
                onClick={() => setPreferredMethod('video')}
              >
                <div className="flex items-center space-x-3">
                  <Video className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Video Call</div>
                    <div className="text-xs opacity-75">Online consultation</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <Label>Select Date</Label>
            <div className="mt-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => !canSelectDate(date)}
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <Label>Select Time</Label>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className="h-10"
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
              {availableSlots.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No available slots for the selected date.
                </p>
              )}
            </div>
          )}

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information you'd like to share..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Book Appointment Button */}
          {selectedDate && selectedTime && selectedConsultationType && (
            <div className="pt-4">
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Appointment Summary</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Specialist:</strong> {selectedSpecialist?.profile.full_name}</p>
                  <p><strong>Type:</strong> {consultationTypes.find(t => t.id === selectedConsultationType)?.name}</p>
                  <p><strong>Date:</strong> {format(selectedDate, 'EEEE, dd MMMM yyyy')}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Method:</strong> {preferredMethod === 'in-person' ? 'In-Person' : 'Video Call'}</p>
                  <p><strong>Fee:</strong> £{selectedSpecialist?.consultation_fee}</p>
                </div>
              </div>

              <PaymentButton
                amount={selectedSpecialist?.consultation_fee || 0}
                description={`${consultationTypes.find(t => t.id === selectedConsultationType)?.name} with ${selectedSpecialist?.profile.full_name}`}
                metadata={{
                  consultation_type: selectedConsultationType,
                  specialist_id: selectedSpecialist?.id,
                  appointment_date: selectedDate.toISOString(),
                  appointment_time: selectedTime
                }}
                onSuccess={handleBookAppointment}
                className="w-full"
                size="lg"
              >
                {loading ? 'Booking...' : `Book Appointment - £${selectedSpecialist?.consultation_fee}`}
              </PaymentButton>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book Appointment</h1>
        <p className="text-muted-foreground mt-1">
          Schedule a consultation with our qualified specialists
        </p>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-center mt-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div 
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center space-x-8 mt-2 text-sm text-muted-foreground">
          <span className={currentStep >= 1 ? 'text-primary' : ''}>Specialty</span>
          <span className={currentStep >= 2 ? 'text-primary' : ''}>Specialist</span>
          <span className={currentStep >= 3 ? 'text-primary' : ''}>Details</span>
        </div>
      </div>

      {currentStep === 1 && renderSpecialtySelection()}
      {currentStep === 2 && renderSpecialistSelection()}
      {currentStep === 3 && renderAppointmentDetails()}
    </div>
  );
}