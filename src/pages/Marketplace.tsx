// src/pages/Marketplace.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Search, Filter, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// ---- Types coming from the view / tables (extended with `availability`)
type ViewRow = {
  id: string;
  user_id: string;
  dp_profession: string | null;
  profession: string | null;
  specializations: string[] | null;
  consultation_fee: number | null;
  years_of_experience: number | null;
  bio: string | null;
  clinic_name: string | null;
  available_days: string[] | null;
  available_hours: any | null;
  availability?: any | null;            // NEW: per-day JSON possible
  full_name: string | null;
  avatar_url: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
};

type SpecialistRow = {
  id: string;
  user_id: string;
  specialty?: string | null;
  specializations?: string[] | null;
  experience_years?: number | null;
  verified?: boolean | null;
  is_active?: boolean | null;
  is_marketplace_ready?: boolean | null;
  verification_status?: string | null;
  consultation_fee?: number | null;
  bio?: string | null;
  clinic_name?: string | null;
  address?: string | null;
  available_days?: string[] | null;
  available_hours?: any | null;
  availability?: any | null;            // NEW: per-day JSON possible (if you add it)
  rating?: number | null;
};

type ProfileRow = {
  user_id: string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  profession?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
};

interface Doctor {
  id: string;
  userId: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  reviews: number;
  experience: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
  price?: string;
  nextAvailable?: string | null;
  specializations: string[];
  bio: string;
  hospital: string;
}

const WEEK_ORDER = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"] as const;

/** Format a bio to exactly 55 visible chars, padding short ones with spaces, then add "...". */
function formatBio(input: string | null | undefined, width = 55): string {
  const text = (input ?? "").replace(/\s+/g, " ").trim(); // normalize inner spacing a bit
  const clipped = text.length > width ? text.slice(0, width) : text.padEnd(width, " ");
  return clipped + "...";
}

// --- NEW: normalise any incoming availability shape into { days[], hoursMap }
function normalizeAvailability(input: {
  available_days?: string[] | null;
  available_hours?: any | null;
  availability?: any | null; // per-day JSON: { monday:{enabled,startTime,endTime}, ... }
}) {
  let days: string[] = Array.isArray(input.available_days) ? input.available_days.map(d => d.toLowerCase()) : [];
  const hoursMap: Record<string, { start: string; end: string }> = {};

  const fallbackStart = "09:00";
  const fallbackEnd = "17:00";

  if (input.availability && typeof input.availability === "object") {
    const keys = Object.keys(input.availability);
    const knownDays = new Set([
      "monday","tuesday","wednesday","thursday","friday","saturday","sunday",
    ]);
    const enabledDays: string[] = [];
    keys.forEach((k) => {
      const low = k.toLowerCase();
      if (!knownDays.has(low)) return;
      const cfg = input.availability[k] || input.availability[low] || {};
      const enabled = !!cfg.enabled;
      const start = cfg.startTime || cfg.start || fallbackStart;
      const end = cfg.endTime || cfg.end || fallbackEnd;
      if (enabled) {
        enabledDays.push(low);
        hoursMap[low] = { start, end };
      }
    });
    if (days.length === 0 && enabledDays.length > 0) {
      days = enabledDays;
    }
  }

  if (input.available_hours && typeof input.available_hours === "object") {
    const ah = input.available_hours;
    WEEK_ORDER.forEach((dow) => {
      const cfg = ah[dow];
      if (cfg && typeof cfg === "object") {
        const start = cfg.startTime || cfg.start || fallbackStart;
        const end = cfg.endTime || cfg.end || fallbackEnd;
        hoursMap[dow] = { start, end };
      }
    });
    if (ah.start || ah.end) {
      const start = ah.start || fallbackStart;
      const end = ah.end || fallbackEnd;
      WEEK_ORDER.forEach((dow) => {
        if (!hoursMap[dow]) {
          hoursMap[dow] = { start, end };
        }
      });
    }
  }

  if (days.length === 0) {
    days = ["monday","tuesday","wednesday","thursday","friday"];
  }

  days.forEach((d) => {
    if (!hoursMap[d]) {
      hoursMap[d] = { start: fallbackStart, end: fallbackEnd };
    }
  });

  return { availableDays: days, availableHours: hoursMap };
}

function computeNextAvailable(
  availableDays: string[] = [],
  availableHours: any = { start: "09:00", end: "17:00" }
) {
  try {
    const now = new Date();
    const daysSet = new Set(availableDays.map((d) => d.toLowerCase()));

    if (daysSet.size === 0) {
      ["monday","tuesday","wednesday","thursday","friday"].forEach((day) => daysSet.add(day));
    }

    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dow = WEEK_ORDER[d.getDay()];
      if (!daysSet.has(dow)) continue;

      let start = "09:00";
      let end = "17:00";

      if (availableHours && typeof availableHours === "object") {
        if (availableHours[dow]) {
          start = availableHours[dow].startTime || availableHours[dow].start || start;
          end = availableHours[dow].endTime || availableHours[dow].end || end;
        } else if (availableHours.start || availableHours.end) {
          start = availableHours.start || start;
          end = availableHours.end || end;
        }
      }

      if (i === 0) {
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [endHour, endMin] = end.split(":").map(Number);
        const endTime = endHour * 60 + endMin;
        if (currentTime >= endTime) continue;
      }

      const dayStr = d.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      const nextText = `Next: ${dayStr}, ${start}–${end}`;
      return { date: d, start, end, nextText };
    }
  } catch (error) {
    console.error("Error computing next available:", error);
  }
  return { date: null, start: null, end: null, nextText: "No slots available" };
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});

  const baseSpecialties = useMemo(
    () => [
      "All Specialties",
      "GP (General Practitioner)",
      "Nurse",
      "Physiotherapist",
      "Psychologist",
      "Medical Specialist",
      "Therapist",
      "Nutritionist",
      "Counsellor",
      "Cardiology",
      "Dermatology",
      "Endocrinology",
      "Neurology",
      "Psychiatry",
      "Orthopedics",
      "Gastroenterology",
      "Pulmonology",
      "Ophthalmology",
      "Urology",
      "Rheumatology",
    ],
    []
  );
  const [specialties, setSpecialties] = useState<string[]>(baseSpecialties);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const ok = await tryLoadFromView();
      if (!ok) {
        await tryLoadFromTables();
      }
      setLoading(false);
    })();
  }, []);

  const tryLoadFromView = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("marketplace_providers")
        .select("*");
      if (error) {
        console.warn("marketplace_providers error:", error);
        return false;
      }
      if (!data || data.length === 0) {
        console.info("marketplace_providers returned 0 rows; falling back to tables.");
        return false;
      }

      const transformed = (data as ViewRow[]).map((r) => {
        const { availableDays, availableHours } = normalizeAvailability({
          available_days: r.available_days,
          available_hours: r.available_hours,
          availability: (r as any).availability,
        });
        const { nextText } = computeNextAvailable(availableDays, availableHours);

        const name = r.full_name || "Healthcare Professional";
        const profession = r.profession || r.dp_profession || "General Practice";
        const specs = Array.isArray(r.specializations) ? r.specializations : [];
        const location = r.location || [r.city, r.country].filter(Boolean).join(", ") || "UK";

        return makeDoctor({
          id: r.id,
          userId: r.user_id,
          name,
          profession,
          location,
          years: r.years_of_experience ?? 0,
          avatar: r.avatar_url || "/placeholder.svg",
          verified: true,
          price: r.consultation_fee ?? null,
          nextText,
          specs,
          bio: r.bio || (profession ? `Specialist in ${profession}` : ""),
          clinic: r.clinic_name || "Private Practice",
          rating: 4.8,
          reviews: 120,
        });
      });

      finalizeDoctors(transformed);
      return true;
    } catch (e) {
      console.error("tryLoadFromView failed:", e);
      return false;
    }
  };

  const tryLoadFromTables = async () => {
    try {
      const { data: specialists, error: sErr } = await supabase
        .from("specialists")
        .select("*")
        .eq("is_active", true);

      if (sErr) throw sErr;
      if (!specialists || specialists.length === 0) {
        setDoctors([]);
        return;
      }

      const userIds = (specialists as SpecialistRow[]).map((s) => s.user_id);
      const [profilesResult, doctorProfilesResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("user_id, full_name, email, avatar_url, profession, address, city, country")
          .in("user_id", userIds),
        supabase
          .from("doctor_profiles") 
          .select("user_id, available_days, available_hours")
          .in("user_id", userIds)
      ]);

      const { data: profiles, error: pErr } = profilesResult;
      const { data: doctorProfiles, error: dpErr } = doctorProfilesResult;
      
      if (pErr) throw pErr;
      if (dpErr) throw dpErr;

      const pMap = new Map<string, ProfileRow>();
      (profiles as ProfileRow[]).forEach((p) => pMap.set(p.user_id, p));
      
      const dpMap = new Map<string, any>();
      (doctorProfiles || []).forEach((dp: any) => dpMap.set(dp.user_id, dp));

      const transformed: Doctor[] = (specialists as SpecialistRow[]).map((s) => {
        const doctorProfile = dpMap.get(s.user_id);
        const { availableDays, availableHours } = normalizeAvailability({
          available_days: doctorProfile?.available_days || s.available_days,
          available_hours: doctorProfile?.available_hours || s.available_hours,
        });
        const { nextText } = computeNextAvailable(availableDays, availableHours);

        const profile: ProfileRow =
          pMap.get(s.user_id) || {
            user_id: s.user_id,
            full_name: null,
            email: null,
            avatar_url: null,
            profession: null,
            address: null,
            city: null,
            country: null,
          };

        const name =
          profile.full_name ||
          (profile.email ? `Dr. ${profile.email.split("@")[0]}` : "Healthcare Professional");

        const profession =
          profile.profession ||
          (s.specialty && !Array.isArray(s.specializations) ? s.specialty : "General Practice");

        const specs = Array.isArray(s.specializations)
          ? s.specializations
          : typeof s.specialty === "string"
          ? s.specialty.split(",").map((t) => t.trim()).filter(Boolean)
          : [];

        const location =
          profile.address ||
          [profile.city, profile.country].filter(Boolean).join(", ") ||
          s.address ||
          "UK";

        return makeDoctor({
          id: s.id,
          userId: s.user_id,
          name,
          profession,
          location,
          years: s.experience_years ?? 0,
          avatar: profile.avatar_url || "/placeholder.svg",
          verified: !!s.verified,
          price: s.consultation_fee ?? null,
          nextText,
          specs,
          bio: s.bio || (profession ? `Specialist in ${profession}` : ""),
          clinic: s.clinic_name || "Private Practice",
          rating: s.rating ?? 4.6,
          reviews: 100 + Math.floor(Math.random() * 150),
        });
      });

      finalizeDoctors(transformed);
    } catch (e: any) {
      console.error("tryLoadFromTables failed:", e);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again later.",
        variant: "destructive",
      });
      setDoctors([]);
    }
  };

  function makeDoctor(args: {
    id: string;
    userId: string;
    name: string;
    profession: string;
    location: string;
    years: number;
    avatar: string;
    verified: boolean;
    price: number | null;
    nextText: string | null | undefined;
    specs: string[];
    bio: string;
    clinic: string;
    rating: number;
    reviews: number;
  }): Doctor {
    return {
      id: args.id,
      userId: args.userId,
      name: args.name,
      profession: args.profession,
      location: args.location,
      rating: args.rating,
      reviews: args.reviews,
      experience: `${args.years}+ years`,
      avatar: args.avatar,
      isVerified: args.verified,
      isOnline: Math.random() > 0.5,
      price: args.price != null ? `£${args.price}/consultation` : undefined,
      nextAvailable: args.nextText || "No slots available",
      specializations: args.specs,
      bio: args.bio,
      hospital: args.clinic,
    };
  }

  function finalizeDoctors(list: Doctor[]) {
    setDoctors(list);
    const dynamic = new Set(baseSpecialties);
    list.forEach((d) => {
      if (d.profession) dynamic.add(d.profession);
      d.specializations?.forEach((s) => s && dynamic.add(s));
    });
    setSpecialties(Array.from(dynamic));
  }

  const filteredDoctors = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const matchesSearch =
        term === "" ||
        doctor.name.toLowerCase().includes(term) ||
        doctor.profession.toLowerCase().includes(term) ||
        doctor.specializations.some((tag) => tag.toLowerCase().includes(term));

      const matchesSpecialty =
        selectedSpecialty === "" ||
        selectedSpecialty === "All Specialties" ||
        doctor.profession === selectedSpecialty ||
        doctor.specializations.includes(selectedSpecialty);

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchTerm, selectedSpecialty]);

  const toggleExpandedTags = (doctorId: string) => {
    setExpandedTags((prev) => ({ ...prev, [doctorId]: !prev[doctorId] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Find Your Healthcare Professional</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with verified healthcare specialists and book consultations at your convenience
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, specialty, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {specialties.map((s) => (
                  <option key={s} value={s === "All Specialties" ? "" : s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedSpecialty && (
              <Badge variant="secondary" className="gap-1">
                {selectedSpecialty}
                <button
                  onClick={() => setSelectedSpecialty("")}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${filteredDoctors.length} healthcare professionals found`}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for new specialists.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => {
              const isExpanded = expandedTags[doctor.id] || false;
              const shown = isExpanded ? doctor.specializations : doctor.specializations.slice(0, 2);
              const remaining = Math.max(doctor.specializations.length - shown.length, 0);
              const initials = doctor.name
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow duration-300 p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={doctor.avatar} alt={doctor.name} />
                            <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
                          </Avatar>
                          {doctor.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{doctor.name}</h3>
                          <p className="text-muted-foreground">{doctor.profession}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bio (fixed 55 characters + "...", with visible padding) */}
                    <div className="text-sm text-muted-foreground">
                      <p className="whitespace-pre">{formatBio(doctor.bio)}</p>
                    </div>

                    {/* Rating & Location */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{doctor.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({doctor.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{doctor.location}</span>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-2">
                      {shown.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                      {remaining > 0 && !isExpanded && (
                        <button
                          onClick={() => toggleExpandedTags(doctor.id)}
                          className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                        >
                          + more
                        </button>
                      )}
                      {isExpanded && doctor.specializations.length > 2 && (
                        <button
                          onClick={() => toggleExpandedTags(doctor.id)}
                          className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                        >
                          show less
                        </button>
                      )}
                    </div>

                    {/* Experience */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>{doctor.experience}</span>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{doctor.nextAvailable || "No slots available"}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button size="sm" className="flex-1" onClick={() => navigate(`/booking?doctor=${doctor.id}`)}>
                        Book Consultation
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/doctor/${doctor.id}`)}>
                        View Details
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3"
                      onClick={() => navigate(`/messages?doctor=${doctor.userId}`)}
                    >
                      Message the doctor
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filteredDoctors.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">Load More Doctors</Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
