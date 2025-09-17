import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, Heart, MessageCircle, Search, Filter, Clock, Verified } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
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
  followers: number;
  posts: number;
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
    "Rheumatology"
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      // Fetch specialists with their profile data using user_id join
      const { data: specialists, error } = await supabase
        .from('specialists')
        .select(`
          id,
          user_id,
          specialty,
          experience_years,
          bio,
          consultation_fee,
          available_days,
          clinic_name,
          address,
          rating,
          verified,
          registration_number,
          profiles!specialists_user_id_fkey(
            full_name,
            email
          )
        `)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching doctors:', error);
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again later.",
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match the expected Doctor interface
      const transformedDoctors: Doctor[] = specialists?.map((specialist: any, index) => ({
        id: specialist.id,
        name: specialist.profiles?.full_name || `Dr. ${specialist.profiles?.email?.split('@')[0] || 'Unknown'}`,
        specialty: specialist.specialty || 'General Practice',
        location: specialist.address || 'UK',
        rating: specialist.rating || 4.5,
        reviews: Math.floor(Math.random() * 200) + 50, // Random reviews for now
        experience: `${specialist.experience_years || 0}+ years`,
        avatar: "/placeholder.svg",
        isVerified: specialist.verified || false,
        isOnline: Math.random() > 0.5, // Random online status
        price: `£${specialist.consultation_fee || 100}/consultation`,
        nextAvailable: index % 3 === 0 ? "Today 3:00 PM" : index % 3 === 1 ? "Tomorrow 10:00 AM" : "Wed 2:00 PM",
        tags: specialist.specialty ? specialist.specialty.split(', ').slice(0, 3) : [],
        followers: Math.floor(Math.random() * 2000) + 100,
        posts: Math.floor(Math.random() * 200) + 50,
        bio: specialist.bio || `Specialist in ${specialist.specialty}`,
        hospital: specialist.clinic_name || 'Private Practice',
        gmcNumber: specialist.registration_number
      })) || [];

      setDoctors(transformedDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm === "" || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === "" || 
      selectedSpecialty === "All Specialties" || 
      doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  const toggleLike = (doctorId: string) => {
    setLikedDoctors(prev => 
      prev.includes(doctorId) 
        ? prev.filter(id => id !== doctorId)
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
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty === "All Specialties" ? "" : specialty}>
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
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {selectedSpecialty && (
              <Badge variant="secondary" className="gap-1">
                {selectedSpecialty}
                <button onClick={() => setSelectedSpecialty("")} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
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
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                </CardContent>
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
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={doctor.avatar} alt={doctor.name} />
                        <AvatarFallback className="text-lg font-semibold">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {doctor.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">{doctor.name}</h3>
                        {doctor.isVerified && (
                          <Verified className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{doctor.specialty}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{doctor.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleLike(doctor.id)}
                      className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          likedDoctors.includes(doctor.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* Rating & Reviews */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="text-sm text-muted-foreground">({doctor.reviews} reviews)</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{doctor.experience}</div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {doctor.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Hospital/Clinic */}
                  <div className="text-sm">
                    <span className="font-medium">Practice:</span> {doctor.hospital}
                  </div>

                  {/* GMC Number */}
                  {doctor.gmcNumber && (
                    <div className="text-sm">
                      <span className="font-medium">Registration:</span> {doctor.gmcNumber}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>{doctor.followers} followers</span>
                      <span>{doctor.posts} posts</span>
                    </div>
                  </div>

                  {/* Availability & Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>{doctor.nextAvailable}</span>
                    </div>
                    <div className="font-semibold text-primary">{doctor.price}</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/booking?doctor=${doctor.id}`)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Book Now
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
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