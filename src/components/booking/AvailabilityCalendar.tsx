import React, { useMemo, useState } from "react";
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
    if (h === 12) h = isPM ? 12 : 0;
    else if (isPM) h += 12;
  } else {
    const [hh, mm] = s.split(":").map(Number);
    h = hh ?? 0; m = mm ?? 0;
  }
  return h * 60 + m;
};

const minutesToTimeStr = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
};

const getTodayMidnight = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const isSameDay = (a: Date, b: Date) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

/* ---------------------------- Parsing from DB ----------------------------- */
// available_days can come as text[] (already array) or string; normalize to string[]
const normalizeDays = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.map(v => normalizeDay(String(v))).filter(Boolean);
  if (typeof val !== "string") return [];
  const s = val.trim();
  if (s.startsWith("{") && s.endsWith("}")) {
    return s.slice(1,-1).split(",").map(x => normalizeDay(x.replace(/^"+|"+$/g,"").trim())).filter(Boolean);
  }
  if (s.startsWith("[") && s.endsWith("]")) {
    try { const arr = JSON.parse(s); return Array.isArray(arr) ? arr.map((x:string)=>normalizeDay(String(x))).filter(Boolean) : []; } catch { return []; }
  }
  return s.split(",").map(x => normalizeDay(x)).filter(Boolean);
};

// available_hours is jsonb -> either {start,end} or per-day map; keep as-is
type Window = { start: string; end: string };
type PerDay = Record<string, Window>;
const normalizeHours = (val: unknown): Window | PerDay | null => {
  if (!val) return null;
  if (typeof val === "object") return val as any;
  if (typeof val === "string") {
    const s = val.trim();
    if (s.startsWith("{") || s.startsWith("[")) {
      try { return JSON.parse(s); } catch { /* ignore */ }
    }
    const m = s.match(/(\d{1,2}:\d{2}\s*(?:am|pm)?)\s*-\s*(\d{1,2}:\d{2}\s*(?:am|pm)?)/i);
    if (m) return { start: m[1], end: m[2] };
  }
  return null;
};

/* ------------------------- Normalise Specialist Obj ----------------------- */
// Map snake_case doctor_profile rows (from your schema) to the shape the UI expects
const useNormalizedSpecialist = (specialist: Specialist) => {
  return useMemo(() => {
    const sp: any = specialist;

    const available_days = normalizeDays(
      sp.available_days ?? sp.availableDays
    );

    const available_hours = normalizeHours(
      sp.available_hours ?? sp.availableHours
    );

    const name =
      sp.name ||
      [sp.first_name, sp.last_name].filter(Boolean).join(" ").trim() ||
      "Specialist";

    return {
      // scheduling-critical fields
      available_days,         // string[]
      available_hours,        // {start,end} or per-day map
      duration: sp.duration || 30, // default 30 mins if you don't store it
      breaks: sp.breaks || null,

      // UI fields mapped from your schema
      name,
      image: sp.image ?? sp.avatar_url ?? undefined,
      specialty: sp.specialty ?? sp.profession ?? "",
      qualifications: sp.qualifications ?? sp.qualification ?? "",
      price: sp.price ?? sp.consultation_fee ?? undefined,
      locations: sp.locations ?? (sp.clinic_name ? [sp.clinic_name] : undefined),

      // keep the original too (if you need other properties)
      _raw: sp,
    };
  }, [specialist]);
};

/* ------------------------ Generate Time Slots (Respect DB) ---------------- */
const getAvailableDaysSet = (days: string[]) => new Set(days);

const getWorkingWindowForDate = (date: Date, available_hours: Window | PerDay | null): { startMin: number; endMin: number } | null => {
  const day = DAY_NAMES[date.getDay()];
  let start: string | undefined, end: string | undefined;

  if (available_hours) {
    if ((available_hours as Window).start) {
      start = (available_hours as Window).start;
      end = (available_hours as Window).end;
    } else if ((available_hours as PerDay)[day]) {
      start = (available_hours as PerDay)[day].start;
      end = (available_hours as PerDay)[day].end;
    }
  }

  // fallback only if undefined
  if (!start || !end) { start = "09:00"; end = "17:00"; }

  const startMin = timeStrToMinutes(start);
  const endMin = timeStrToMinutes(end);
  if (!Number.isFinite(startMin) || !Number.isFinite(endMin) || endMin <= startMin) return null;

  return { startMin, endMin };
};

const inAnyBreak = (minutes: number, duration: number, breaks?: Array<{start:string;end:string}> | null) => {
  if (!Array.isArray(breaks) || breaks.length === 0) return false;
  const slotStart = minutes;
  const slotEnd = minutes + duration;
  return breaks.some(b => {
    if (!b?.start || !b?.end) return false;
    const bStart = timeStrToMinutes(String(b.start));
    const bEnd = timeStrToMinutes(String(b.end));
    return Math.max(slotStart, bStart) < Math.min(slotEnd, bEnd);
  });
};

const generateTimeSlots = (date: Date, S: ReturnType<typeof useNormalizedSpecialist>) => {
  const slots: { time: string; available: boolean }[] = [];

  const availableDays = getAvailableDaysSet(S.available_days || []);
  const dayName = DAY_NAMES[date.getDay()];
  if (!availableDays.has(dayName)) return slots;

  const window = getWorkingWindowForDate(date, S.available_hours);
  if (!window) return slots;

  const duration = typeof S.duration === "number" ? S.duration : parseInt(String(S.duration), 10) || 30;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = isSameDay(date, now);

  for (let t = window.startMin; t + duration <= window.endMin; t += duration) {
    const isPast = isToday && t <= nowMinutes; // hide past slots today
    const isOnBreak = inAnyBreak(t, duration, S.breaks);
    slots.push({ time: minutesToTimeStr(t), available: !isPast && !isOnBreak });
  }

  return slots;
};

/* ----------------------------- Component ---------------------------------- */
interface AvailabilityCalendarProps {
  specialist: Specialist;
  onTimeSlotSelect: (date: string, time: string) => void;
  onBack: () => void;
}

export function AvailabilityCalendar({ specialist, onTimeSlotSelect, onBack }: AvailabilityCalendarProps) {
  const S = useNormalizedSpecialist(specialist);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [nextAvailableSlot, setNextAvailableSlot] = useState<string>("");

  const isDateDisabled = (date: Date) => {
    const today = getTodayMidnight();
    if (date < today) return true;
    const availableDays = getAvailableDaysSet(S.available_days || []);
    const dayName = DAY_NAMES[date.getDay()];
    return !availableDays.has(dayName);
  };

  const findNextAvailableSlot = () => {
    const today = getTodayMidnight();
    for (let i = 0; i < 14; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const slots = generateTimeSlots(checkDate, S);
      const firstAvailable = slots.find(s => s.available);
      if (firstAvailable) {
        const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : checkDate.toLocaleDateString("en-GB", { weekday: "long", month: "short", day: "numeric" });
        setNextAvailableSlot(`${label} at ${firstAvailable.time}`);
        return;
      }
    }
    setNextAvailableSlot("");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setAvailableSlots(date ? generateTimeSlots(date, S) : []);
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) onTimeSlotSelect(selectedDate.toISOString().split("T")[0], time);
  };

  React.useEffect(() => {
    findNextAvailableSlot();
    const today = new Date();
    if (!isDateDisabled(today)) {
      setSelectedDate(today);
      setAvailableSlots(generateTimeSlots(today, S));
    } else {
      for (let i = 1; i <= 14; i++) {
        const nextDay = new Date();
        nextDay.setDate(today.getDate() + i);
        if (!isDateDisabled(nextDay)) {
          setSelectedDate(nextDay);
          setAvailableSlots(generateTimeSlots(nextDay, S));
          break;
        }
      }
    }
  }, [S.available_days?.join(","), JSON.stringify(S.available_hours)]);

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
            <AvatarImage src={S.image} alt={S.name} />
            <AvatarFallback>{S.name.split(" ").map(n => n[0]).join("") || "SP"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{S.name}</h3>
            <Badge variant="secondary" className="mb-1">{S.specialty}</Badge>
            <p className="text-sm text-muted-foreground">{S.qualifications}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{S.duration || "30 min"}</span>
              </span>
              {S.locations && <span>Available: {S.locations.join(", ")}</span>}
            </div>
          </div>
          <div className="text-right">
            {S.price != null && (
              <>
                <p className="text-2xl font-bold text-primary">£{S.price}</p>
                <p className="text-sm text-muted-foreground">per consultation</p>
              </>
            )}
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
                📅 Available: {(S.available_days || []).map(d => d.charAt(0).toUpperCase()+d.slice(1)).join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">
                🕘 Sessions: {selectedDate ? (() => {
                  const w = getWorkingWindowForDate(selectedDate, S.available_hours);
                  return w ? `${minutesToTimeStr(w.startMin)} - ${minutesToTimeStr(w.endMin)}` : "—";
                })() : "—"}
              </p>
              <p className="text-sm text-muted-foreground">⏱️ Duration: {S.duration || "30 minutes"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Times</CardTitle>
            {selectedDate && (
              <p className="text-sm text-muted-foreground">
                {selectedDate.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
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
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {availableSlots.map((slot, i) => (
                  <Button
                    key={i}
                    variant={slot.available ? "outline" : "ghost"}
                    disabled={!slot.available}
                    onClick={() => handleTimeSelect(slot.time)}
                    className={`justify-center text-sm ${slot.available ? "hover:bg-primary hover:text-primary-foreground border-primary/20" : "opacity-50 cursor-not-allowed"}`}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
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
