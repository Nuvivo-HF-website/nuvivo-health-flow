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

// Types coming from the view
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
  full_name: string | null;
  avatar_url: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
};

// Fallback table shapes (loose)
type SpecialistRow = {
  id: string;
  user_id: string;
  specialty?: string | null;        // sometimes profession or CSV of specs
  specializations?: string[] | null;// preferred array
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

function computeNextAvailable(
  availableDays: string[] = [],
  availableHours: any = { start: "09:00", end: "17:00" }
) {
  try {
    const now = new Date();
    const daysSet = new Set(availableDays.map((d) => d.toLowerCase()));

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
          end = availableHours[dow].endTime   || availableHours[dow].end   || end;
        } else if (availableHours.start && availableHours.end) {
          start = availableHours.start;
          end   = availableHours.end;
        }
      }

      const timeStr = start === end ? start : `${start}-${end}`;
      const isToday = i === 0;
      const isPast = isToday && new Date().getHours() >= parseInt(end.split(':')[0]);
      
      if (!isPast) {
        return i === 0 ? `Today ${timeStr}` : 
               i === 1 ? `Tomorrow ${timeStr}` : 
               `${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ${timeStr}`;
      }
    }
    return "Schedule appointment";
  } catch (error) {
    console.error("Error computing next available:", error);
    return "Schedule appointment";
  }
}

export default function Marketplace() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      console.log("Fetching doctors...");
      
      // Query doctor_profiles directly
      const { data: doctorProfiles, error: doctorError } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('is_marketplace_ready', true)
        .eq('is_active', true);

      if (doctorError) {
        console.error("Error fetching doctor profiles:", doctorError);
        return;
      }

      console.log("Doctor profiles:", doctorProfiles?.length || 0);

      // Query profiles separately
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');

      if (profileError) {
        console.error("Error fetching profiles:", profileError);
        return;
      }

      console.log("Profiles:", profiles?.length || 0);

      // Create a map for easy profile lookup
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      // Transform the data
      const transformedDoctors: Doctor[] = (doctorProfiles || []).map((dp: SpecialistRow) => {
        const profile = profileMap.get(dp.user_id) as ProfileRow;
        
        const location = profile?.city && profile?.country 
          ? `${profile.city}, ${profile.country}`
          : profile?.address || "Location not specified";

        const name = profile?.full_name || "Dr. Unknown";
        const profession = dp.specialty || profile?.profession || "General Practitioner";
        
        // Parse specializations
        let specializations: string[] = [];
        if (dp.specializations && Array.isArray(dp.specializations)) {
          specializations = dp.specializations;
        } else if (typeof dp.specialty === 'string' && dp.specialty.includes(',')) {
          specializations = dp.specialty.split(',').map(s => s.trim());
        } else if (dp.specialty) {
          specializations = [dp.specialty];
        }

        const nextAvailable = computeNextAvailable(
          dp.available_days || [],
          dp.available_hours || { start: "09:00", end: "17:00" }
        );

        return {
          id: dp.id,
          userId: dp.user_id,
          name,
          profession,
          location,
          rating: dp.rating || 4.5,
          reviews: Math.floor(Math.random() * 100) + 10,
          experience: dp.experience_years ? `${dp.experience_years} years` : "5+ years",
          avatar: profile?.avatar_url || "",
          isVerified: dp.verified || false,
          isOnline: Math.random() > 0.5,
          price: dp.consultation_fee ? `$${dp.consultation_fee}` : "$75",
          nextAvailable,
          specializations,
          bio: dp.bio || "Experienced medical professional",
          hospital: dp.clinic_name || "Private Practice"
        };
      });

      console.log("Transformed doctors:", transformedDoctors.length);
      console.log("Sample doctor:", transformedDoctors[0]);
      
      setDoctors(transformedDoctors);
    } catch (error) {
      console.error("Error in fetchDoctors:", error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    if (!searchTerm.trim()) return doctors;
    
    const term = searchTerm.toLowerCase();
    return doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(term) ||
      doctor.profession.toLowerCase().includes(term) ||
      doctor.location.toLowerCase().includes(term) ||
      doctor.specializations.some(spec => spec.toLowerCase().includes(term))
    );
  }, [doctors, searchTerm]);

  const handleBookConsultation = (doctorId: string) => {
    navigate(`/consultations?doctorId=${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Find Healthcare Professionals
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Connect with verified doctors and specialists for online consultations
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, specialty, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? "No doctors found matching your search." : "No doctors available at the moment."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Total doctors in database: {doctors.length}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={doctor.avatar} alt={doctor.name} />
                      <AvatarFallback>
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {doctor.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{doctor.name}</h3>
                      {doctor.isVerified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    
                    <p className="text-primary font-medium text-sm mb-1">{doctor.profession}</p>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{doctor.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{doctor.rating}</span>
                        <span className="text-muted-foreground">({doctor.reviews})</span>
                      </div>
                      <span className="text-muted-foreground">{doctor.experience}</span>
                    </div>
                  </div>
                </div>

                {doctor.specializations.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {doctor.specializations.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {doctor.specializations.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{doctor.specializations.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Starting from</span>
                    <span className="font-semibold text-lg">{doctor.price}</span>
                  </div>
                  
                  {doctor.nextAvailable && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{doctor.nextAvailable}</span>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={() => handleBookConsultation(doctor.id)}
                  >
                    Book Consultation
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
