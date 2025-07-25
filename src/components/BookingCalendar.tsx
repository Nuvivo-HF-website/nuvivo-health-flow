import { useState } from "react";
import { format, addDays, isSameDay, isAfter, isBefore, startOfDay } from "date-fns";
import { CalendarIcon, Clock, MapPin, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  time: string;
  available: boolean;
  price?: number;
}

interface BookingData {
  date: Date | undefined;
  time: string;
  service: string;
  location: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

const locations = [
  { id: "livingston", name: "Livingston Clinic", address: "123 Main St, Livingston" },
  { id: "edinburgh", name: "Edinburgh Centre", address: "456 High St, Edinburgh" },
  { id: "glasgow", name: "Glasgow Clinic", address: "789 Queen St, Glasgow" },
  { id: "home", name: "Home Visit", address: "Your location" }
];

const services = [
  { id: "blood-test", name: "Blood Test", duration: "15 min", price: 50 },
  { id: "consultation", name: "Doctor Consultation", duration: "30 min", price: 85 },
  { id: "health-check", name: "Full Health Check", duration: "45 min", price: 120 },
  { id: "specialist", name: "Specialist Consultation", duration: "60 min", price: 150 }
];

// Mock availability data - in real app this would come from an API
const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const startHour = isWeekend ? 10 : 8;
  const endHour = isWeekend ? 16 : 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      // Randomly make some slots unavailable for demo
      const available = Math.random() > 0.3;
      slots.push({ time, available });
    }
  }
  return slots;
};

const BookingCalendar = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [step, setStep] = useState<'date' | 'details' | 'confirmation'>('date');
  const [bookingData, setBookingData] = useState<BookingData>({
    date: undefined,
    time: "",
    service: "",
    location: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });

  const today = new Date();
  const maxDate = addDays(today, 60); // Allow booking up to 60 days ahead
  
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
    setBookingData(prev => ({ ...prev, date, time: "" }));
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingData(prev => ({ ...prev, time }));
  };

  const handleContinueToDetails = () => {
    if (!selectedDate || !selectedTime || !bookingData.service || !bookingData.location) {
      toast({
        title: "Missing Information",
        description: "Please select date, time, service, and location",
        variant: "destructive"
      });
      return;
    }
    setStep('details');
  };

  const handleSubmitBooking = () => {
    if (!bookingData.firstName || !bookingData.lastName || !bookingData.email || !bookingData.phone) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would submit to your API
    console.log('Booking submitted:', bookingData);
    
    toast({
      title: "Booking Confirmed!",
      description: `Your appointment is scheduled for ${format(selectedDate!, 'PPP')} at ${selectedTime}`,
      duration: 5000
    });
    
    setStep('confirmation');
  };

  const selectedService = services.find(s => s.id === bookingData.service);
  const selectedLocation = locations.find(l => l.id === bookingData.location);

  if (step === 'confirmation') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-success">Booking Confirmed!</CardTitle>
          <CardDescription>
            Your appointment has been successfully scheduled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="bg-success/10 rounded-lg p-6">
              <div className="space-y-2">
                <p className="font-semibold">{selectedService?.name}</p>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{selectedTime}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedLocation?.name}</span>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Confirmation details have been sent to {bookingData.email}</p>
              <p>You'll receive a reminder 24 hours before your appointment</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={() => {
                setStep('date');
                setSelectedDate(undefined);
                setSelectedTime("");
                setBookingData({
                  date: undefined,
                  time: "",
                  service: "",
                  location: "",
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  notes: ""
                });
              }}>
                Book Another Appointment
              </Button>
              <Button variant="outline">
                Add to Calendar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar Section */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {step === 'date' ? 'Select Date & Time' : 'Appointment Details'}
            </CardTitle>
            <CardDescription>
              {step === 'date' 
                ? 'Choose your preferred date and time slot'
                : 'Please provide your contact information'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === 'date' ? (
              <div className="space-y-6">
                {/* Service Selection */}
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Select
                    value={bookingData.service}
                    onValueChange={(value) => setBookingData(prev => ({ ...prev, service: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{service.name}</span>
                            <span className="text-sm text-muted-foreground ml-4">
                              £{service.price} • {service.duration}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Selection */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    value={bookingData.location}
                    onValueChange={(value) => setBookingData(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location.id} value={location.id}>
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-muted-foreground">{location.address}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Calendar */}
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => 
                        isBefore(date, startOfDay(today)) || isAfter(date, maxDate)
                      }
                      className={cn("rounded-md border p-3 pointer-events-auto")}
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          Available times for {format(selectedDate, 'MMM d')}
                        </h4>
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                          {timeSlots.map((slot) => (
                            <Button
                              key={slot.time}
                              variant={selectedTime === slot.time ? "default" : "outline"}
                              size="sm"
                              disabled={!slot.available}
                              onClick={() => handleTimeSelect(slot.time)}
                              className="text-xs"
                            >
                              {slot.time}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {selectedTime && (
                        <div className="p-4 bg-accent/10 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Selected: {format(selectedDate, 'MMM d')} at {selectedTime}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedDate && selectedTime && bookingData.service && bookingData.location && (
                  <Button onClick={handleContinueToDetails} className="w-full" size="lg">
                    Continue to Details
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Personal Information Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={bookingData.firstName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={bookingData.lastName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+44 7XXX XXXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={bookingData.notes}
                    onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special requirements or questions..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep('date')} className="flex-1">
                    Back to Calendar
                  </Button>
                  <Button onClick={handleSubmitBooking} className="flex-1">
                    Confirm Booking
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Summary Sidebar */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedService && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{selectedService.name}</span>
                  <Badge variant="secondary">{selectedService.duration}</Badge>
                </div>
                <div className="text-2xl font-bold text-accent">£{selectedService.price}</div>
              </div>
            )}

            {selectedLocation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{selectedLocation.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
              </div>
            )}

            {selectedDate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                {selectedTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedTime}</span>
                  </div>
                )}
              </div>
            )}

            {step === 'details' && bookingData.firstName && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{bookingData.firstName} {bookingData.lastName}</span>
                </div>
                {bookingData.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{bookingData.email}</span>
                  </div>
                )}
                {bookingData.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{bookingData.phone}</span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 space-y-2 text-xs text-muted-foreground">
              <p>• Free cancellation up to 24 hours before</p>
              <p>• Confirmation will be sent via email</p>
              <p>• Please arrive 10 minutes early</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingCalendar;