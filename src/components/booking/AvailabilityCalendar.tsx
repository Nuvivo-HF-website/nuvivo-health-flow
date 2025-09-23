import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Clock, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Specialist } from "@/pages/GuestBooking";
import { Alert, AlertDescription } from "@/components/ui/alert";

/* --------------------------- Helpers & Utilities -------------------------- */

const DAY_NAMES = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

const normalizeDay = (d: string) => {
  const s = d?.toString().trim().toLowerCase();
  if (!s) return "";
  // Accept Mon, MONDAY, etc.
  if (s.startsWith("mon")) return "monday";
  if (s.startsWith("tue")) return "tuesday";
  if (s.startsWith("wed")) return "wednesday";
  if (s.startsWith("thu")) return "thursday";
  if (s.startsWith("fri")) return "friday";
  if (s.startsWith("sat")) return "saturday";
  if (s.startsWith("sun")) return "sunday";
  return s;
};

const timeStrToMinutes = (t: string) => {
  // supports "9:00", "09:00"
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const minutesToTimeStr = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
};

const getTodayMidnight = () => {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
};

const isSameDay = (a: Date, b: Date) => {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
};

// Determine which days the specialist works.
// Accepts either:
//   available_days: string[]
// OR an object like available_hours = { monday:{start,end}, ... }
const getAvailableDaysSet = (specialist: Specialist): Set<string> => {
  const set = new Set<string>();
  const ad: any = (specialist as any).available_days;

  if (Array.isArray(ad) && ad.length) {
    ad.forEach((d: string) => set.add(normalizeDay(d)));
    return set;
  }

  // Fallback: infer from per-day hours if present
  const ah: any = (specialist as any).available_hours;
  if (ah && typeof ah === "object" && !("start" in ah) && !("end" in ah)) {
    // looks like per-day map
    for (const key of Object.keys(ah)) {
      const day = normalizeDay(key);
      const val = ah[key];
      if (val && val.start && val.end) set.add(day);
    }
    return set;
  }

  // Last fallback: assume Mon-Fri
  ["monday","tuesday","wednesday","thursday","friday"].forEach(d => set.add(d));
  return set;
};

// Get working window for a specific date.
// Supports:
//   available_hours: { start, end }
//   available_hours: { monday:{start,end}, tuesday:{...}, ... }
const getWorkingWindowForDate = (date: Date, specialist: Specialist): { startMin: number; endMin: number } | null => {
  const ah: any = (specialist as any).available_hours;
  const day = DAY_NAMES[date.getDay()]; // sunday..saturday

  let start: string | undefined;
  let end: string | undefined;

  if (ah && typeof ah === "object") {
    if ("start" in ah && "end" in ah) {
      start = ah.start;
      end = ah.end;
    } else if (ah[day] && ah[day].start && ah[day].end) {
      start = ah[day].start;
      end = ah[day].end;
    }
  }

  // sensible default if not provided
  if (!start || !end) {
    start = "09:00";
    end = "17:00";
  }

  const startMin = timeStrToMinutes(start);
  const endMin = timeStrToMinutes(end);

  if (endMin <= startMin) return null; // invalid window
  return { startMin, endMin };
};

// Optional breaks support: specialist.breaks = [{ start: "12:30", end: "13:30" }, ...]
const inAnyBreak = (minutes: number, duration: number, specialist: Specialist) => {
  const br: any[] | undefined = (specialist as any).breaks;
  if (!Array.isArray(br) || br.length === 0) return false;
  const slotStart = minutes;
  const slotEnd = minutes + duration;
  return br.some(b => {
    if (!b?.start || !b?.end) return false;
    const bStart = timeStrToMinutes(b.start);
    const bEnd = timeStrToMinutes(b.end);
    // overlap?
    return Math.max(slotStart, bStart) < Math.min(slotEnd, bEnd);
  });
};

// Parse duration that may be "30", "30 min", "45 minutes"
const getDurationMinutes = (specialist: Specialist) => {
  const raw: any = (specialist as any).duration;
  if (!raw) return 30;
  if (typeof raw === "number") return raw;
  const n = parseInt(String(raw), 10);
  return Number.isFinite(n) && n > 0 ? n : 30;
};

/* ------------------------ Generate Time Slots (Fixed) ---------------------- */

// Generate time slots based on actual specialist availability
const generateTimeSlots = (date: Date, specialist: Specialist) => {
  const slots: { time: string; available: boolean }[] = [];

  const availableDays = getAvailableDaysSet(specialist);
  const dayName = DAY_NAMES[date.getDay()];
  if (!availableDays.has(dayName)) return slots;

  const window = getWorkingWindowForDate(date, specialist);
  if (!window) return slots;

  const duration = getDurationMinutes(specialist);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = isSameDay(date, now);

  // Generate on the minute grid aligned to "start"
  for (let t = window.startMin; t + duration <= window.endMin; t += duration) {
    const isPast = isToday && t <= nowMinutes - 1; // anything strictly before "now" is not available
    const isOnBreak = inAnyBreak(t, duration, specialist);

    slots.push({
      time: minutesToTimeStr(t),
      available: !isPast && !isOnBreak,
    });
  }

  return slots;
};

/* ----------------------------- Component Props ---------------------------- */

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

  // Find next available slot across multiple days (respects past times today)
  const findNextAvailableSlot = () => {
    const today = getTodayMidnight();
    const availableDays = getAvailableDaysSet(specialist);

    for (let i = 0; i < 14; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);

      const dayName = DAY_NAMES[checkDate.getDay()];
      if (!availableDays.has(dayName)) continue;

      const slots = generateTimeSlots(checkDate, specialist);
      const firstAvailable = slots.find(slot => slot.available);

      if (firstAvailable) {
        const displayDayName =
          i === 0 ? "Today" :
          i === 1 ? "Tomorrow" :
          checkDate.toLocaleDateString("en-GB", { weekday: "long", month: "short", day: "numeric" });
        setNextAvailableSlot(`${displayDayName} at ${firstAvailable.time}`);
        return;
      }
    }
    setNextAvailableSlot(""); // none in 14 days
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
    const today = getTodayMidnight();
    if (date < today) return true;

    const availableDays = getAvailableDaysSet(specialist);
    const dayName = DAY_NAMES[date.getDay()];
    return !availableDays.has(dayName);
  };

  // Auto-select today if available, otherwise next available day
  React.useEffect(() => {
    findNextAvailableSlot();

    const today = new Date();
    if (!isDateDisabled(today)) {
      setSelectedDate(today);
      setAvailableSlots(generateTimeSlots(today, specialist));
    } else {
      // Find next available day
      for (let i = 1; i <= 14; i++) {
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
                <span>{(specialist as any).duration || '30 min'}</span>
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
                📅 Available: {
                  (() => {
                    const days = Array.from(getAvailableDaysSet(specialist));
                    return days.length
                      ? days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")
                      : "Monday - Friday";
                  })()
                }
              </p>
              <p className="text-sm text-muted-foreground">
                🕘 Sessions: {
                  (() => {
                    const today = selectedDate || new Date();
                    const window = getWorkingWindowForDate(today, specialist);
                    if (!window) return "—";
                    return `${minutesToTimeStr(window.startMin)} - ${minutesToTimeStr(window.endMin)}`;
                  })()
                }
              </p>
              <p className="text-sm text-muted-foreground">
                ⏱️ Duration: {(specialist as any).duration || '30 minutes'}
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
                {selectedDate.toLocaleDateString('en-GB', { 
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
                    <li>• Lunch break times may be unavailable</li>
                    <li>• Online consultations available all day</li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {availableSlots.map((slot, index) => {
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
                  {nextAvailableSlot ? `Try selecting a different day or book for ${nextAvailableSlot}` : "Try another date."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
