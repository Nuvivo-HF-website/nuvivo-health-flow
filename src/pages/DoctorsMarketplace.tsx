import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  Calendar, 
  Search,
  Filter,
  User,
  Award,
  Stethoscope
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
  id: string;
  user_id: string;
  specialty: string;
  qualifications: string[];
  bio: string;
  experience_years: number;
  consultation_fee: number;
  registration_number: string;
  clinic_name: string;
  address: string;
  phone: string;
  rating: number;
  verified: boolean;
  available_days: string[];
  available_hours: any;
  full_name: string;
}

export default function DoctorsMarketplace() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const specialties = [
    "General Practice",
    "Cardiology",
    "Dermatology", 
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology"
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterAndSortDoctors();
  }, [doctors, searchQuery, selectedSpecialty, sortBy]);

  const fetchDoctors = async () => {
    try {
      // First get specialists
      const { data: specialistsData, error: specialistsError } = await supabase
        .from('specialists')
        .select('*')
        .eq('is_active', true);

      if (specialistsError) throw specialistsError;

      // Then get profiles for those specialists
      const userIds = specialistsData.map(s => s.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const doctorsWithProfiles = specialistsData.map(doctor => {
        const profile = profilesData.find(p => p.user_id === doctor.user_id);
        return {
          ...doctor,
          full_name: profile?.full_name || 'Unknown'
        };
      });

      setDoctors(doctorsWithProfiles);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortDoctors = () => {
    let filtered = doctors.filter(doctor => {
      const matchesSearch = 
        doctor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.clinic_name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
      
      return matchesSearch && matchesSpecialty;
    });

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "experience":
          return (b.experience_years || 0) - (a.experience_years || 0);
        case "fee":
          return (a.consultation_fee || 0) - (b.consultation_fee || 0);
        case "name":
          return (a.full_name || "").localeCompare(b.full_name || "");
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  };

  const handleBookConsultation = (doctorId: string) => {
    navigate(`/booking?specialist=${doctorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading doctors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Find Healthcare Professionals</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with verified doctors and specialists. Book consultations, get expert advice, 
              and manage your healthcare with trusted professionals.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find Your Doctor
              </CardTitle>
              <CardDescription>
                Search by name, specialty, or clinic to find the right healthcare professional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search doctors, specialties, or clinics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="fee">Lowest Fee</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {filteredDoctors.length} of {doctors.length} doctors</span>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Verified professionals only</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctors Grid */}
          {filteredDoctors.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No doctors found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all specialties
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialty("all");
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {doctor.full_name}
                          {doctor.verified && <Award className="w-4 h-4 text-green-600" />}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Stethoscope className="w-4 h-4" />
                          {doctor.specialty}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{doctor.rating || "New"}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {doctor.qualifications && doctor.qualifications.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {doctor.qualifications.slice(0, 2).map((qual, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {qual}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {doctor.experience_years && (
                        <p className="text-sm text-muted-foreground">
                          {doctor.experience_years} years experience
                        </p>
                      )}
                      
                      {doctor.clinic_name && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {doctor.clinic_name}
                        </div>
                      )}
                      
                      {doctor.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {doctor.phone}
                        </div>
                      )}
                    </div>

                    {doctor.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {doctor.bio}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-lg font-semibold text-primary">
                        £{doctor.consultation_fee || "Contact"}
                      </div>
                      <Button 
                        onClick={() => handleBookConsultation(doctor.id)}
                        className="flex items-center gap-1"
                      >
                        <Calendar className="w-4 h-4" />
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}