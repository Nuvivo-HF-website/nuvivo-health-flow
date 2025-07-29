import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, Clock, CheckCircle2, AlertTriangle, Droplets, Star } from "lucide-react";
import { LocalSpecialist, BloodTest } from "@/pages/BloodTestBooking";

// Enhanced time slot generation for blood tests
const generateTimeSlots = (date: Date, isMobile: boolean = false) => {
  const slots = [];
  const startHour = isMobile ? 8 : 9; // Mobile service starts earlier
  const endHour = isMobile ? 18 : 17; // Mobile service ends later
  const dayOfWeek = date.getDay();
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      let available = true;
      
      // Lunch break for clinic/hospital
      if (!isMobile && hour === 12 && minute === 30) available = false;
      if (!isMobile && hour === 13 && minute === 0) available = false;
      
      // Weekend availability only for mobile
      if (!isMobile && (dayOfWeek === 0 || dayOfWeek === 6)) available = false;
      
      // Random unavailability for realism
      if (Math.random() > 0.8) available = false;
      
      slots.push({ time, available });
    }
  }
  
  return slots;
};

interface BloodTestCalendarProps {
  specialist: LocalSpecialist;
  tests: BloodTest[];
  onTimeSlotSelect: (date: string, time: string) => void;
  onBack: () => void;
}

export function BloodTestCalendar({ 
  specialist, 
  tests,
  onTimeSlotSelect, 
  onBack 
}: BloodTestCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [nextAvailableSlot, setNextAvailableSlot] = useState<string>("");

  const totalPrice = tests.reduce((sum, test) => sum + test.price, 0);
  const homeVisitFee = specialist.location.type === 'mobile' ? 15 : 0;
  const finalPrice = totalPrice + homeVisitFee;
  const requiresFasting = tests.some(test => test.fastingRequired);
  const isMobile = specialist.location.type === 'mobile';

  // Find next available slot
  const findNextAvailableSlot = () => {
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      
      // Skip weekends for non-mobile services
      if (!isMobile && (checkDate.getDay() === 0 || checkDate.getDay() === 6)) continue;
      
      const slots = generateTimeSlots(checkDate, isMobile);
      const firstAvailable = slots.find(slot => slot.available);
      
      if (firstAvailable) {
        const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : checkDate.toLocaleDateString('en-UK', { weekday: 'long', month: 'short', day: 'numeric' });
        setNextAvailableSlot(`${dayName} at ${firstAvailable.time}`);
        break;
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setAvailableSlots(generateTimeSlots(date, isMobile));
    } else {
      setAvailableSlots([]);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      onTimeSlotSelect(selectedDate.toISOString().split('T')[0], time);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = date.getDay();
    
    if (date < today) return true;
    
    // Mobile service available 7 days, others Mon-Fri only
    if (!isMobile && (dayOfWeek === 0 || dayOfWeek === 6)) return true;
    
    return false;
  };

  useEffect(() => {
    findNextAvailableSlot();
    const today = new Date();
    if (!isDateDisabled(today)) {
      setSelectedDate(today);
      setAvailableSlots(generateTimeSlots(today, isMobile));
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      if (!isDateDisabled(tomorrow)) {
        setSelectedDate(tomorrow);
        setAvailableSlots(generateTimeSlots(tomorrow, isMobile));
      }
    }
  }, [isMobile]);

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

      {/* Quick Book Alert */}
      {nextAvailableSlot && (
        <Alert className="mb-6 border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Quick Book:</strong> Next available appointment is {nextAvailableSlot}
          </AlertDescription>
        </Alert>
      )}

      {/* Fasting Warning */}
      {requiresFasting && (
        <Alert className="mb-6 border-orange-500 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Fasting Required:</strong> Some of your tests require 12 hours fasting. Please book for morning appointments and avoid food/drinks except water.
          </AlertDescription>
        </Alert>
      )}

      {/* Specialist & Test Summary */}
      <Card className="mb-6">
        <CardContent className="flex items-center space-x-4 p-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/placeholder.svg" alt={specialist.name} />
            <AvatarFallback>
              {specialist.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{specialist.name}</h3>
            <Badge variant="secondary" className="mb-1">
              {isMobile ? 'Mobile Blood Testing' : 'Blood Testing Specialist'}
            </Badge>
            <p className="text-sm text-muted-foreground">{specialist.location.name}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{specialist.rating} ({specialist.reviewCount} reviews)</span>
              </span>
              <span className="flex items-center space-x-1">
                <Droplets className="w-4 h-4" />
                <span>{tests.length} test{tests.length !== 1 ? 's' : ''}</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">£{finalPrice}</p>
            <p className="text-sm text-muted-foreground">
              Tests: £{totalPrice}
              {homeVisitFee > 0 && <span><br />Home visit: £{homeVisitFee}</span>}
            </p>
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
                📅 Available {isMobile ? '7 days a week' : 'Monday - Friday'}
              </p>
              <p className="text-sm text-muted-foreground">
                🕘 Sessions: {isMobile ? '8:00 AM - 6:00 PM' : '9:00 AM - 5:00 PM'}
              </p>
              <p className="text-sm text-muted-foreground">
                ⏱️ Duration: 15-30 minutes
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
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Please select a date to view available times
                </p>
              </div>
            ) : (
              <>
                {requiresFasting && (
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-medium text-orange-800 mb-1">
                      💡 Fasting Test Tips:
                    </p>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Book morning appointments (before 11 AM)</li>
                      <li>• Fast for 12 hours before your appointment</li>
                      <li>• Water is allowed during fasting</li>
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {availableSlots.map((slot, index) => {
                    const isLunchBreak = !isMobile && (slot.time === '12:30' || slot.time === '13:00');
                    const isMorning = parseInt(slot.time.split(':')[0]) < 12;
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
                        } ${requiresFasting && isMorning && slot.available ? "border-green-300 bg-green-50" : ""}`}
                      >
                        {slot.time}
                        {isLunchBreak && !slot.available && (
                          <span className="ml-1 text-xs">🍽️</span>
                        )}
                        {requiresFasting && isMorning && slot.available && (
                          <span className="ml-1 text-xs">✅</span>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </>
            )}
            
            {selectedDate && availableSlots.filter(s => s.available).length === 0 && (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
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

      {/* Test Details */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Droplets className="w-5 h-5 mr-2" />
            Your Blood Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">{test.name}</h4>
                  <p className="text-sm text-muted-foreground">{test.resultsTime}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">£{test.price}</p>
                  {test.fastingRequired && (
                    <Badge variant="destructive" className="text-xs">
                      Fasting
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}