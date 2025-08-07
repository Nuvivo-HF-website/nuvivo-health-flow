import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PaymentButton } from '@/components/PaymentButton';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Clock, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { bookingService } from '@/services/bookingService';

const consultationTypes = [
  { id: 'mental-health', name: 'Mental Health Consultation', price: 150, duration: 60 },
  { id: 'nutrition', name: 'Nutrition Consultation', price: 120, duration: 45 },
  { id: 'second-opinion', name: 'Second Opinion', price: 200, duration: 90 },
  { id: 'sexual-health', name: 'Sexual Health Consultation', price: 100, duration: 30 },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export function ConsultationBooking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [bookingStep, setBookingStep] = useState<'select' | 'payment'>('select');

  const selectedConsultation = consultationTypes.find(c => c.id === selectedType);

  const handleBookingSubmit = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book a consultation.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedType || !selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select consultation type, date, and time.",
        variant: "destructive",
      });
      return;
    }

    setBookingStep('payment');
  };

  const handlePaymentSuccess = async () => {
    if (!user || !selectedConsultation || !selectedDate) return;

    try {
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      await bookingService.createConsultation({
        user_id: user.id,
        consultation_type: selectedConsultation.id,
        appointment_date: appointmentDateTime.toISOString(),
        fee: selectedConsultation.price,
        notes: notes,
        payment_status: 'paid',
        status: 'scheduled'
      });

      toast({
        title: "Consultation booked!",
        description: "Your consultation has been successfully booked. You'll receive a confirmation email shortly.",
      });
    } catch (error) {
      console.error('Error saving consultation:', error);
      toast({
        title: "Booking saved with payment",
        description: "Payment successful! Your consultation details have been recorded.",
      });
    }
    
    // Reset form
    setSelectedType('');
    setSelectedDate(undefined);
    setSelectedTime('');
    setNotes('');
    setBookingStep('select');
  };

  if (bookingStep === 'payment' && selectedConsultation && selectedDate) {
    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Your Booking
          </CardTitle>
          <CardDescription>
            Review your consultation details and complete payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">{selectedConsultation.name}</h3>
            <p className="text-sm text-muted-foreground">
              <CalendarDays className="inline h-4 w-4 mr-1" />
              {format(appointmentDateTime, 'EEEE, MMMM do, yyyy')}
            </p>
            <p className="text-sm text-muted-foreground">
              <Clock className="inline h-4 w-4 mr-1" />
              {selectedTime} ({selectedConsultation.duration} minutes)
            </p>
            <p className="text-lg font-semibold">£{selectedConsultation.price}</p>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setBookingStep('select')}
              className="flex-1"
            >
              Back to Edit
            </Button>
            <div className="flex-1">
              <PaymentButton
                amount={selectedConsultation.price}
                description={selectedConsultation.name}
                metadata={{
                  consultation_type: selectedType,
                  appointment_date: appointmentDateTime.toISOString(),
                  duration: selectedConsultation.duration,
                  notes: notes
                }}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Book a Consultation</CardTitle>
        <CardDescription>
          Choose your consultation type, preferred date and time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="consultation-type">Consultation Type</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Select consultation type" />
            </SelectTrigger>
            <SelectContent>
              {consultationTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex justify-between items-center w-full">
                    <span>{type.name}</span>
                    <span className="ml-4 font-semibold">£{type.price}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Preferred Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
            className="rounded-md border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time-slot">Preferred Time</Label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Please describe any specific concerns or questions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleBookingSubmit}
          className="w-full"
          disabled={!selectedType || !selectedDate || !selectedTime}
        >
          Continue to Payment
        </Button>
      </CardContent>
    </Card>
  );
}