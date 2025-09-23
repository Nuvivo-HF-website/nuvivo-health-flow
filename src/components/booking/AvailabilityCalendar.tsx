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
    if (h === 12) h = isPM ? 12 : 0; // 12am -> 0, 12pm -> 12
    else if (isPM) h += 12;
  } else {
    const [hh, mm] = s.split(":").map(Number);
    h = hh ?? 0;
    m = mm ?? 0;
  }
  return h * 60 + m;
};

const minutesToTimeStr = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
};

const getTodayMidnight = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/* ---------------------------- Parse from DB shape ------------------------- */

// available_days can be text[], Postgres "{mon,tue}", JSON '["mon"]', or CSV "mon,tue"
const normalizeDays = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(v => normalizeDay(String(v))).filter(Boolean);
  if (typeof val !== "string") return [];
  const s = val.trim();
  if (s.startsWith("[") && s.endsWith("]")) {
    try {
      const arr = JSON.parse(s);
      return Array.isArray(arr) ? arr.map((x:any)=>normalizeDay(String(x))).filter(Boolean) : [];
    } catch { return []; }
  }
  if (s.startsWith("{") && s.endsWith("}")) {
    const inner = s.slice(1, -1);
    return inner.split(",").map(x => normalizeDay(x.replace(/^"+|"+$/g, "").trim())).filter(Boolean);
  }
  return s.split(",").map(x => normalizeDay(x)).filter(Boolean);
};

// available_hours: single window {start,end} or per-day map {monday:{start,end},...}
type Window = { start: string; end: string };
type PerDay = Record<string, Window>;

const normalizeHours = (val: unknown): Window | PerDay | null => {
  const toWindow = (o:any): Window | null =>
    o && typeof o === "object" && o.start && o.end ? { start: String(o.start), end: String(o.end) } : null;
  const toPerDay = (o:any): PerDay | null => {
    if (!o || typeof o !== "object") return null;
    const out: PerDay = {};
    for (const k of Object.keys(o)) {
      const day = normalizeDay(k);
      const w = toWindow(o[k]);
      if (day && w) out[day] = w;
    }
    return Object.keys(out).length ? out : null;
  };

  if (!val) return null;
  if (typeof val === "object") return toWindow(val) ?? toPerDay(val) ?? null;

  if (typeof val === "string") {
    const s = val.trim();
    if (s.startsWith("{") || s.startsWith("[")) {
      try {
        const parsed = JSON.parse(s);
        return toWindow(parsed) ?? toPerDay(parsed) ?? null;
      } catch { /* ignore */ }
    }
    const m = s.match(/(\d{1,2}:\d{2}\s*(?:am|pm)?)\s*-\s*(\d{1,2}:\d{2}\s*(?:am|pm)?)/i);
    if (m) return { start: m[1], end: m[2] };
  }
  return null;
};

/* ------------------------- Normalise Specialist Obj ----------------------- */

const useNormalizedSpecialist = (specialist: Specialist) => {
  return useMemo(() => {
    const sp: any = specialist;

    const available_days = normalizeDays(sp.available_days ?? sp.availableDays);
    const available_hours = normalizeHours(sp.available_hours ?? sp.availableHours);

    // If days empty but per-day hours exist, infer from keys
    let days = available_days;
    if ((!days || days.length === 0) && available_hours && !(available_hours as Window).start) {
      days = Object.keys(available_hours as PerDay);
    }

    const name =
      sp.name ||
      [sp.first_name, sp.last_name].filter(Boolean).join(" ").trim() ||
      "Specialist";

    return {
      // scheduling-critical
      available_days: days,            // string[]
      available_hours,                 // Window | PerDay | null
      slot_step_minutes: sp.slot_step_minutes ?? sp.slotStep ?? sp.slot_interval ?? 30, // default 30
      // (NO duration logic)

      // UI
      name,
      image: sp.image ?? sp.avatar_url ?? undefined,
      specialty: sp.specialty ?? sp.profession ?? "",
      qualifications: sp.qualifications ?? sp.qualification ?? "",
      price: sp.price ?? sp.consultation_fee ?? undefined,
      locations: sp.locations ?? (sp.clinic_name ? [sp.clinic_name] : undefined),

      _raw: sp,
    };
  }, [specialist]);
};

/* --------------------------- Slot generation (grid) ----------------------- */

const getAvailableDaysSet = (days: string[]) => new Set(days);

const getWorkingWindowForDate = (
  date: Date,
  available_hours: Window | PerDay | null
): { startMin: number; endMin: number } | null => {
  if (!available_hours) return null;
  const day = DAY_NAMES[date.getDay()];

  if ((available_hours as Window).start) {
    const { start, end } = available_hours as Window;
    const startMin = timeStrToMinutes(start);
    const endMin = timeStrToMinutes(end);
    return Number.isFinite(startMin) && Number.isFinite(endMin) && endMin > startMin
      ? { startMin, endMin }
      : null;
  }

  const per = available_hours as PerDay;
  const entry = per[day];
  if (!entry) return null; // closed if no entry

  const startMin = timeStrToMinutes(entry.start);
  const endMin = timeStrToMinutes(entry.end);
  return Number.isFinite(startMin) && Number.isFinite(endMin) && endMin > startMin
    ? { startMin, endMin }
    : null;
};

const generateTimeSlots = (
  date: Date,
  S: ReturnType<typeof useNormalizedSpecialist>
) => {
  const slots: { time: string; available: boolean }[] = [];

  const availableDays = getAvailableDaysSet(S.available_days || []);
  const dayName = DAY_NAMES[date.getDay()];
  if (!availableDays.has(dayName)) return slots;

  const window = getWorkingWindowForDate(date, S.available_hours);
  if (!window) return slots;

  const step = Math.max(1, parseInt(String(S.slot_step_minutes), 10) || 30);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = isSameDay(date, now);

  for (let t = window.startMin; t < window.endMin; t += step) {
    const isPast = isToday && t <= nowMinutes; // hide past starts today
    slots.push({ time: minutesToTimeStr(t), available: !isPast });
  }

  return slots;
};

/* ----------------------------- Component Props ---------------------------- */

interface AvailabilityCalendarProps {
  specialist: Specialist;
  onTimeSlotSelect: (date: string, time: string) => void;
  onBack: () => void;
}

/* -------------------------------- Component ------------------------------- */

export function AvailabilityCalendar({
  specialist,
  onTimeSlotSelect,
  onBack,
}: AvailabilityCalendarProps) {
  const S = useNormalizedSpecialist(specialist);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [nextAvailableSlot, setNextAvailableSlot] = useState<string>("");

  const isDateDisabled = (date: Date) => {
    const today = getTodayMidnight();
    if (date < today) return true;

    const availableDays = getAvailableDaysSet(S.available_days || []);
    const dayName = DAY_NAMES[date.getDay()];
    if (!availableDays.has(dayName)) return true;

    // Also disable if there is no working window on that day
    const w = getWorkingWindowForDate(date, S.available_hours);
    return !w;
  };

  const findNextAvailableSlot = () => {
    const today = getTodayMidnight();

    for (let i = 0; i < 14; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);

      if (isDateDisabled(checkDate)) continue;

      const slots = generateTimeSlots(checkDate, S);
      const firstAvailable = slots.find(s => s.available);
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
    // rerun when hours/days/slot grid change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(S.available_hours),
    (S.available_days || []).join(","),
    String(S.slot_step_minutes),
  ]);

  const workingWindowForSelected = selectedDate ? getWorkingWindowForDate(selectedDate, S.available_hours) : null;

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="outline" onClick={onBack} className="mb-6">
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
            <AvatarImage src={S.image} alt={S.name || "Specialist"} />
            <AvatarFallback>{S.name ? S.name.split(" ").map(n => n[0]).join("") : "SP"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{S.name || "Specialist"}</h3>
            <Badge variant="secondary" className="mb-1">{S.specialty}</Badge>
            <p className="text-sm text-muted-foreground">{S.qualifications}</p>
            {S.locations && (
              <div className="text-sm text-muted-foreground mt-2">Available: {S.locations.join(", ")}</div>
            )}
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
                📅 Available: {(S.available_days || []).map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">
                🕘 Sessions: {workingWindowForSelected
                  ? `${minutesToTimeStr(workingWindowForSelected.startMin)} - ${minutesToTimeStr(workingWindowForSelected.endMin)}`
                  : "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                ⌚ Slot grid: {S.slot_step_minutes} min
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
                {selectedDate.toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
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
