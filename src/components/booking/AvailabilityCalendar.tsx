import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Clock, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Specialist } from "@/pages/GuestBooking";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Generate time slots based on actual specialist availability
const generateTimeSlots = (date: Date, specialist: Specialist) => {
  const slots = [];
  const dayOfWeek = date.getDay();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[dayOfWeek];
  
  // Check if specialist is available on this day
  const availableDays = specialist.available_days || [];
  if (!availableDays.includes(currentDay)) {
    return slots; // Return empty array if not available on this day
  }
  
  // Get specialist's working hours
  const workingHours = specialist.available_hours || { start: '09:00', end: '17:00' };
  const startHour = parseInt(workingHours.start.split(':')[0]);
  const startMinute = parseInt(workingHours.start.split(':')[1]);
  const endHour = parseInt(workingHours.end.split(':')[0]);
  const endMinute = parseInt(workingHours.end.split(':')[1]);
  
  // Generate slots based on consultation duration
  const duration = parseInt(specialist.duration?.replace(' min', '') || '30');
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += duration) {
      // Don't exceed end time
      if (hour === endHour && minute >= endMinute) break;
      if (hour > endHour) break;
      
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      let available = true;
      
      // Lunch break 12:30-13:30
      if (hour === 12 && minute >= 30) available = false;
      if (hour === 13 && minute < 30) available = false;
      
      // Some random unavailability for realism (booked slots)
      if (Math.random() > 0.8) available = false;
      
      slots.push({ time, available });
    }
  }
  
  return slots;
};

interface AvailabilityCalendarProps {
  specialist: Specialist;
  onTimeSlotSelect: (date: string, time: string) => void;
  onBack: () => void;
}

export function AvailabilityCalendar({ 
  specialist, 
  onTimeSlotSelect, 
  onBack 
}: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [nextAvailableSlot, setNextAvailableSlot] = useState<string>("");

  // Find next available slot across multiple days
  const findNextAvailableSlot = () => {
    const today = new Date();
    const availableDays = specialist.available_days || [];
    
    for (let i = 0; i < 14; i++) { // Check next 14 days
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[checkDate.getDay()];
      
      // Skip if specialist is not available on this day
      if (!availableDays.includes(dayName)) continue;
      
      const slots = generateTimeSlots(checkDate, specialist);
      const firstAvailable = slots.find(slot => slot.available);
      
      if (firstAvailable) {
        const displayDayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : checkDate.toLocaleDateString('en-UK', { weekday: 'long', month: 'short', day: 'numeric' });
        setNextAvailableSlot(`${displayDayName} at ${firstAvailable.time}`);
        break;
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setAvailableSlots(generateTimeSlots(date, specialist));
    } else {
      setAvailableSlots([]);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      onTimeSlotSelect(selectedDate.toISOString().split('T')[0], time);
    }
  };

  // Disable past dates and days when specialist is not available
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    // Check specialist availability
    const availableDays = specialist.available_days || [];
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    
    return !availableDays.includes(dayName);
  };

  // Auto-select today if available, otherwise find next available day
  React.useEffect(() => {
    findNextAvailableSlot();
    const today = new Date();
    if (!isDateDisabled(today)) {
      setSelectedDate(today);
      setAvailableSlots(generateTimeSlots(today, specialist));
    } else {
      // Find next available day
      const availableDays = specialist.available_days || [];
      for (let i = 1; i <= 7; i++) {
        const nextDay = new Date();
        nextDay.setDate(today.getDate() + i);
        if (!isDateDisabled(nextDay)) {
          setSelectedDate(nextDay);
          setAvailableSlots(generateTimeSlots(nextDay, specialist));
          break;
        }
      }
    }
  }, [specialist]);

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Specialists
      </Button>

      {/* Next Available Quick Book */}
      {nextAvailableSlot && (
        <Alert className="mb-6 border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Quick Book:</strong> Next available appointment is {nextAvailableSlot}
          </AlertDescription>
        </Alert>
      )}

      {/* Selected Specialist Summary */}
      <Card className="mb-6">
        <CardContent className="flex items-center space-x-4 p-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src={specialist.image} alt={specialist.name || 'Specialist'} />
            <AvatarFallback>
              {specialist.name ? specialist.name.split(' ').map(n => n[0]).join('') : 'SP'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{specialist.name || 'Specialist'}</h3>
            <Badge variant="secondary" className="mb-1">
              {specialist.specialty}
            </Badge>
            <p className="text-sm text-muted-foreground">{specialist.qualifications}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{specialist.duration || '30 min'}</span>
              </span>
              {specialist.locations && (
                <span>Available: {specialist.locations.join(', ')}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">£{specialist.price}</p>
            <p className="text-sm text-muted-foreground">per consultation</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border"
            />
            <div className="mt-2 space-y-1">
              <p className="text-sm text-muted-foreground">
                📅 Available: {specialist.available_days ? 
                  specialist.available_days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ') : 
                  'Monday - Friday'
                }
              </p>
              <p className="text-sm text-muted-foreground">
                🕘 Sessions: {specialist.available_hours?.start || '9:00'} - {specialist.available_hours?.end || '17:00'}
              </p>
              <p className="text-sm text-muted-foreground">
                ⏱️ Duration: {specialist.duration || '30 minutes'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle>Available Times</CardTitle>
            {selectedDate && (
              <p className="text-sm text-muted-foreground">
                {selectedDate.toLocaleDateString('en-UK', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Please select a date to view available times
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    💡 Booking Tips:
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Morning slots fill up quickly</li>
                    <li>• Lunch break: 12:30 PM - 1:30 PM</li>
                    <li>• Online consultations available all day</li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">{availableSlots.map((slot, index) => {
                    const isLunchBreak = slot.time === '12:30' || slot.time === '13:00';
                    return (
                      <Button
                        key={index}
                        variant={slot.available ? "outline" : "ghost"}
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`justify-center text-sm ${
                          slot.available 
                            ? "hover:bg-primary hover:text-primary-foreground border-primary/20" 
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {slot.time}
                        {isLunchBreak && !slot.available && (
                          <span className="ml-1 text-xs">🍽️</span>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </>
            )}
            
            {selectedDate && availableSlots.filter(s => s.available).length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  No available slots for this date
                </p>
                <p className="text-sm text-muted-foreground">
                  Try selecting a different day or book for {nextAvailableSlot}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}