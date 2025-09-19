import { useState, useEffect } from "react";
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

interface Doctor {
  id: string;
  userId: string; // <-- added so we can message the right user
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  experience: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
  price: string;
  nextAvailable: string;
  tags: string[];
  // followers: number;   // commented out
  // posts: number;       // commented out
  bio: string;
  hospital: string;
  gmcNumber?: string;
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [likedDoctors, setLikedDoctors] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const specialties = [
    "All Specialties",
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
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const getSignedAvatarUrl = async (maybePath?: string) => {
    if (!maybePath) return "/placeholder.svg";
    // If it’s already a full URL, just use it.
    if (/^https?:\/\//i.test(maybePath)) return maybePath;

    // Otherwise, treat it as a storage path in the private "avatars" bucket.
    // Adjust the bucket name if yours is different (e.g., "profile-avatars").
    try {
      const { data, error } = await supabase
        .storage
        .from("avatars")
        .createSignedUrl(maybePath, 60 * 60); // 1 hour

      if (error || !data?.signedUrl) return "/placeholder.svg";
      return data.signedUrl;
    } catch {
      return "/placeholder.svg";
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      // 1) Specialists
      const { data: specialists, error: specialistsError } = await supabase
        .from("specialists")
        .select("*")
        .eq("is_active", true);

      if (specialistsError) {
        console.error("Error fetching specialists:", specialistsError);
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again later.",
          variant: "destructive",
        });
        setDoctors([]);
        return;
      }

      if (!specialists || specialists.length === 0) {
        setDoctors([]);
        return;
      }

      // 2) Profiles (include avatar fields!)
      const userIds = specialists.map((s: any) => s.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, avatar_url") // <-- avatar_url expected here
        .in("user_id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        toast({
          title: "Error",
          description: "Failed to load doctor profiles. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      const profileMap = new Map<string, any>();
      profiles?.forEach((p: any) => profileMap.set(p.user_id, p));

      // 3) Build doctors with signed avatar URLs
      const transformedDoctors: Doctor[] = await Promise.all(
        specialists.map(async (specialist: any, index: number) => {
          const profile = profileMap.get(specialist.user_id);
          const displayName =
            profile?.full_name ||
            `Dr. ${profile?.email?.split("@")[0] || "Unknown"}`;

          const avatar = await getSignedAvatarUrl(profile?.avatar_url);

          return {
            id: specialist.id,
            userId: specialist.user_id,
            name: displayName,
            specialty: specialist.specialty || "General Practice",
            location: specialist.address || "UK",
            rating: specialist.rating || 4.5,
            reviews: Math.floor(Math.random() * 200) + 50,
            experience: `${specialist.experience_years || 0}+ years`,
            avatar,
            isVerified: specialist.verified || false,
            isOnline: Math.random() > 0.5,
            price: `£${specialist.consultation_fee || 100}/consultation`,
            nextAvailable:
              index % 3 === 0
                ? "Today 3:00 PM"
                : index % 3 === 1
                ? "Tomorrow 10:00 AM"
                : "Wed 2:00 PM",
            tags: specialist.specialty
              ? String(specialist.specialty).split(", ").slice(0, 3)
              : [],
            // followers: Math.floor(Math.random() * 2000) + 100, // commented out
            // posts: Math.floor(Math.random() * 200) + 50,       // commented out
            bio: specialist.bio || `Specialist in ${specialist.specialty}`,
            hospital: specialist.clinic_name || "Private Practice",
            gmcNumber: specialist.registration_number,
          };
        })
      );

      setDoctors(transformedDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      searchTerm === "" ||
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesSpecialty =
      selectedSpecialty === "" ||
      selectedSpecialty === "All Specialties" ||
      doctor.specialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  const toggleLike = (doctorId: string) => {
    setLikedDoctors((prev) =>
      prev.includes(doctorId)
        ? prev.filter((id) => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                {specialties.map((specialty) => (
                  <option
                    key={specialty}
                    value={specialty === "All Specialties" ? "" : specialty}
                  >
                    {specialty}
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
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="space-y-4">
                  {/* Header with name and heart icon */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={doctor.avatar} alt={doctor.name} />
                          <AvatarFallback className="text-sm font-semibold">
                            {doctor.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {doctor.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{doctor.name}</h3>
                        <p className="text-muted-foreground">{doctor.specialty}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleLike(doctor.id)}
                      className="p-1 hover:bg-muted rounded-full transition-colors"
                    >
                      <svg
                        className={`h-5 w-5 ${
                          likedDoctors.includes(doctor.id)
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground"
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21s-6.716-4.35-9.384-7.017C.948 12.315 1 9.5 3.343 7.157a4.8 4.8 0 0 1 6.788 0L12 9.025l1.869-1.868a4.8 4.8 0 0 1 6.788 6.788C18.716 16.65 12 21 12 21z" />
                      </svg>
                    </button>
                  </div>

                  {/* Bio (without GMC here) */}
                  <div className="text-sm text-muted-foreground">
                    <p>{doctor.bio}</p>
                  </div>

                  {/* Rating and Location */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="text-muted-foreground">({doctor.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.location}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {doctor.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Experience + GMC (followers/posts removed) */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>{doctor.experience}</span>
                    {doctor.gmcNumber && <span>GMC: {doctor.gmcNumber}</span>}
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{doctor.nextAvailable}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/booking?doctor=${doctor.id}`)}
                    >
                      Book Consultation
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/messages/new?to=${doctor.userId}`)}
                    >
                      Message
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && filteredDoctors.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Doctors
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
