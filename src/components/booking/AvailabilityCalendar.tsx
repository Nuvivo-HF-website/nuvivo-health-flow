import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Specialist } from "@/pages/GuestBooking";
import { Alert, AlertDescription } from "@/components/ui/alert";

/* --------------------------- Helpers & Utilities -------------------------- */

const DAY_NAMES = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

const normalizeDay = (d: string) => {
  const s = d?.toString().trim().toLowerCase();
  if (!s) return "";
  if (s.startsWith("mon")) return "monday";
  if (s.startsWith("tue")) return "tuesday";
  if (s.startsWith("wed")) return "wednesday";
  if (s.startsWith("thu")) return "thursday";
  if (s.startsWith("fri")) return "friday";
  if (s.startsWith("sat")) return "saturday";
  if (s.startsWith("sun")) return "sunday";
  return s;
};

// Parse "09:00", "9:00", "5 pm", "5:30 PM"
const timeStrToMinutes = (raw: string) => {
  if (!raw) return NaN;
  const s = raw.trim().toLowerCase();
  const ampm = s.endsWith("am") || s.endsWith("pm");
  let h = 0, m = 0;

  if (ampm) {
    const match = s.match(/^(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)$/);
    if (!match) return NaN;
    h = parseInt(match[1], 10);
    m = match[2] ? parseInt(match[2], 10) : 0;
    const isPM = match[3] === "pm";
    if (h === 12) h = isPM ? 12 : 0;        // 12am -> 0, 12pm -> 12
    else if (isPM) h += 12;
  } else {
    const parts = s.split(":").map(Number);
    h = parts[0] ?? 0;
    m = parts[1] ?? 0;
  }
  return h * 60 + m;
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

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Accept Postgres array "{monday,tuesday}" | JSON '["monday","tuesday"]' | CSV "monday,tuesday"
const parseDays = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String);
  if (typeof val !== "string") return [];

  const s = val.trim();
  // JSON array
  if ((s.startsWith("[") && s.endsWith("]")) || (s.startsWith('"') && s.endsWith('"'))) {
    try {
      const arr = JSON.parse(s);
      return Array.isArray(arr) ? arr.map(String) : [];
    } catch { /* ignore */ }
  }
  // Postgres array {a,b,c}
  if (s.startsWith("{") && s.endsWith("}")) {
    const inner = s.slice(1, -1);
    return inner.split(",").map(x => x.replace(/^"+|"+$/g, "").trim());
  }
  // CSV
  return s.split(",").map(x => x.trim()).filter(Boolean);
};

// Safely parse available_hours which can be object, JSON string, or "09:00-17:00"
type Window = { start: string; end: string };
type PerDayWindows = Record<string, Window>;

const parseAvailableHours = (val: unknown): Window | PerDayWindows | null => {
  if (!val) return null;

  const tryObject = (o: any): Window | PerDayWindows | null => {
    if (!o || typeof o !== "object") return null;
    if ("start" in o && "end" in o) return { start: String(o.start), end: String(o.end) };
    // per-day map: keys are day names
    const keys = Object.keys(o);
    if (keys.length) {
      const perDay: PerDayWindows = {};
      for (const k of keys) {
        const v = o[k];
        if (v && typeof v === "object" && v.start && v.end) {
          perDay[normalizeDay(k)] = { start: String(v.start), end: String(v.end) };
        }
      }
      if (Object.keys(perDay).length) return perDay;
    }
    return null;
  };

  if (typeof val === "object") return tryObject(val);

  if (typeof val === "string") {
    const s = val.trim();
    // Try JSON
    if (s.startsWith("{") || s.startsWith("[")) {
      try {
        const parsed = JSON.parse(s);
        const out = tryObject(parsed);
        if (out) return out;
      } catch { /* fall through */ }
    }
    // Try "09:00-17:00"
    const match = s.match(/(\d{1,2}:\d{2}\s*(?:am|pm)?)\s*-\s*(\d{1,2}:\d{2}\s*(?:am|pm)?)/i);
    if (match) return { start: match[1], end: match[2] };
  }

  return null;
};

const getAvailableDaysSet = (specialist: Specialist): Set<string> => {
  const set = new Set<string>();
  const anySp: any = specialist;

  const rawDays =
    anySp.available_days ??
    anySp.availableDays ??
    anySp.days_available ??
    anySp.daysAvailable ??
    null;

  const parsedDays = parseDays(rawDays);
  parsedDays.forEach((d) => set.add(normalizeDay(d)));

  // If days empty, infer from per-day hours
  if (set.size === 0) {
    const ah = parseAvailableHours(
      anySp.available_hours ?? anySp.availableHours ?? anySp.working_hours ?? anySp.workingHours
    );
    if (ah && !(ah as Window).start) {
      Object.keys(ah as PerDayWindows).forEach((k) => set.add(normalizeDay(k)));
    }
  }

  // Fallback Mon-Fri
  if (set.size === 0) ["monday","tuesday","wednesday","thursday","friday"].forEach(d => set.add(d));
  return set;
};

const getWorkingWindowForDate = (date: Date, specialist: Specialist): { startMin: number; endMin: number } | null => {
  const anySp: any = specialist;
  const ah = parseAvailableHours(
    anySp.available_hours ?? anySp.availableHours ?? anySp.working_hours ?? anySp.workingHours
  );
  const day = DAY_NAMES[date.getDay()];

  let start: string | undefined;
  let end: string | undefined;

  if (ah) {
    if ((ah as Window).start) {
      start = (ah as Window).start;
      end = (ah as Window).end;
    } else if ((ah as PerDayWindows)[day]) {
      start = (ah as PerDayWindows)[day].start;
      end = (ah as PerDayWindows)[day].end;
    }
  }

  // Sensible default only if nothing parsed
  if (!start || !end) {
    start = "09:00";
    end = "17:00";
  }

  const startMin = timeStrToMinutes(start);
  const endMin = timeStrToMinutes(end);
  if (!Number.isFinite(startMin) || !Number.isFinite(endMin) || endMin <= startMin) return null;

  return { startMin, endMin };
};

const inAnyBreak = (minutes: number, duration: number, specialist: Specialist) => {
  const br: any[] | undefined = (specialist as any).breaks;
  if (!Array.isArray(br) || br.length === 0) return false;
  const slotStart = minutes;
  const slotEnd = minutes + duration;
  return br.some(b => {
    if (!b?.start || !b?.end) return false;
    const bStart = timeStrToMinutes(String(b.start));
    const bEnd = timeStrToMinutes(String(b.end));
    return Math.max(slotStart, bStart) < Math.min(slotEnd, bEnd);
  });
};

const getDurationMinutes = (specialist: Specialist) => {
  const raw: any = (specialist as any).duration;
  if (!raw) return 30;
  if (typeof raw === "number") return raw;
  const n = parseInt(String(raw), 10);
  return Number.isFinite(n) && n > 0 ? n : 30;
};

/* ------------------------ Generate Time Slots (Robust) --------------------- */

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

  for (let t = window.startMin; t + duration <= window.endMin; t += duration) {
    const isPast = isToday && t <= nowMinutes;     // hide times up to "now"
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

  const findNextAvailableSlot = () => {
    const today = getTodayMidnight();

    for (let i = 0; i < 14; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);

      const slots = generateTimeSlots(checkDate, specialist);
      const firstAvailable = slots.find(slot => slot.available);
      if (firstAvailable) {
        const label =
          i === 0 ? "Today" :
          i === 1 ? "Tomorrow" :
          checkDate.toLocaleDateString("en-GB", { weekday: "long", month: "short", day: "numeric" });
        setNextAvailableSlot(`${label} at ${firstAvailable.time}`);
        return;
      }
    }
    setNextAvailableSlot("");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setAvailableSlots(date ? generateTimeSlots(date, specialist) : []);
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      onTimeSlotSelect(selectedDate.toISOString().split("T")[0], time);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = getTodayMidnight();
    if (date < today) return true;
    const availableDays = getAvailableDaysSet(specialist);
    const dayName = DAY_NAMES[date.getDay()];
    return !availableDays.has(dayName);
  };

  React.useEffect(() => {
    findNextAvailableSlot();

    const today = new Date();
    if (!isDateDisabled(today)) {
      setSelectedDate(today);
      setAvailableSlots(generateTimeSlots(today, specialist));
    } else {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(specialist)]); // rerun if specialist payload shape/strings change

  const workingWindowForSelected = selectedDate ? getWorkingWindowForDate(selectedDate, specialist) : null;

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="outline" onClick={onBack} className="mb-6">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Specialists
      </Button>

      {nextAvailableSlot && (
        <Alert className="mb-6 border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Quick Book:</strong> Next available appointment is {nextAvailableSlot}
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardContent className="flex items-center space-x-4 p-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src={(specialist as any).image} alt={specialist.name || "Specialist"} />
            <AvatarFallback>
              {specialist.name ? specialist.name.split(" ").map(n => n[0]).join("") : "SP"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{specialist.name || "Specialist"}</h3>
            <Badge variant="secondary" className="mb-1">
              {(specialist as any).specialty}
            </Badge>
            <p className="text-sm text-muted-foreground">{(specialist as any).qualifications}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{(specialist as any).duration || "30 min"}</span>
              </span>
              {(specialist as any).locations && (
                <span>Available: {(specialist as any).locations.join(", ")}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">£{(specialist as any).price}</p>
            <p className="text-sm text-muted-foreground">per consultation</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
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
                📅 Available: {(() => {
                  const days = Array.from(getAvailableDaysSet(specialist));
                  return days.length
                    ? days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")
                    : "Monday - Friday";
                })()}
              </p>
              <p className="text-sm text-muted-foreground">
                🕘 Sessions: {workingWindowForSelected
                  ? `${minutesToTimeStr(workingWindowForSelected.startMin)} - ${minutesToTimeStr(workingWindowForSelected.endMin)}`
                  : "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                ⏱️ Duration: {(specialist as any).duration || "30 minutes"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Times</CardTitle>
            {selectedDate && (
              <p className="text-sm text-muted-foreground">
                {selectedDate.toLocaleDateString("en-GB", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Please select a date to view available times</p>
              </div>
            ) : (
              <>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">💡 Booking Tips:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Morning slots fill up quickly</li>
                    <li>• Some providers have lunch breaks</li>
                    <li>• Online consultations available all day</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {availableSlots.map((slot, index) => (
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
                    </Button>
                  ))}
                </div>
              </>
            )}

            {selectedDate && availableSlots.filter(s => s.available).length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No available slots for this date</p>
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
