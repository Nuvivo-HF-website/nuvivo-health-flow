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
  Navigation,
  Droplets,
  Users,
  Car
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ClinicFinder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('is_active', true)
        .eq('is_verified', true);

      if (error) throw error;

      // Transform database data to match expected format
      const transformedClinics = data.map(clinic => ({
        id: clinic.id,
        name: clinic.clinic_name,
        address: clinic.address,
        city: clinic.city || "Unknown",
        region: clinic.region,
        phone: clinic.phone,
        rating: clinic.rating || 0,
        distance: "Calculating...",
        openingHours: clinic.operating_hours || "Contact for hours",
        services: clinic.services_offered || [],
        facilities: clinic.facilities || [],
        appointments: ["Next Day", "Weekly"], // Default for now
        registrationNumber: clinic.registration_number || "Pending",
        certifications: clinic.certifications || []
      }));

      setClinics(transformedClinics);
      setFilteredClinics(transformedClinics);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      toast({
        title: "Error",
        description: "Failed to load clinics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterClinics();
  }, [clinics, searchQuery, selectedRegion, selectedService, sortBy]);

  const filterClinics = () => {
    if (!clinics.length) return;
    
    let filtered = clinics.filter(clinic => {
      const matchesSearch = 
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === "all" || clinic.region === selectedRegion;
      
      const matchesService = selectedService === "all" || 
        clinic.services?.some(service => 
          service.toLowerCase().includes(selectedService.toLowerCase())
        );
      
      return matchesSearch && matchesRegion && matchesService;
    });

    // Sort clinics
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredClinics(filtered);
  };

  const handleBooking = (clinicId: number) => {
    const clinic = clinics.find(c => c.id === clinicId);
    toast({
      title: "Booking initiated",
      description: `Booking blood draw at ${clinic?.name}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading clinics...</p>
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
            <h1 className="text-4xl font-bold text-primary mb-4">Find a Blood Draw Clinic</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Locate partner clinics near you for convenient blood draws. Professional phlebotomists, 
              fast service, and comprehensive testing available across England, Wales, and Scotland.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Find Clinics Near Your Postcode
              </CardTitle>
              <CardDescription>
                Enter your postcode to find the nearest blood draw clinics in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Enter postcode (e.g., SW1A 1AA)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="England">England</SelectItem>
                    <SelectItem value="Wales">Wales</SelectItem>
                    <SelectItem value="Scotland">Scotland</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="blood tests">Blood Tests</SelectItem>
                    <SelectItem value="health screenings">Health Screenings</SelectItem>
                    <SelectItem value="home visits">Home Visits</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {filteredClinics.length} of {clinics.length} clinics</span>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Verified partner clinics only</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinics List */}
          {filteredClinics.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No clinics found</h3>
                <p className="text-muted-foreground mb-4">
                  No partner clinics are currently available in your area. Please check back soon or try a different location.
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("all");
                  setSelectedService("all");
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredClinics.map((clinic) => (
                <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{clinic.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {clinic.address}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{clinic.rating || "New"}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{clinic.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs">{clinic.openingHours}</span>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Services Available</h4>
                      <div className="flex flex-wrap gap-1">
                        {clinic.services?.slice(0, 4).map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {clinic.services?.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{clinic.services.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Facilities */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Facilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {clinic.facilities?.slice(0, 3).map((facility, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                        {clinic.facilities?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{clinic.facilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-1">
                        {clinic.certifications?.map((cert, index) => (
                          <Badge key={index} variant="default" className="text-xs bg-green-100 text-green-800 hover:bg-green-200">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        onClick={() => handleBooking(clinic.id)}
                        className="flex-1 flex items-center gap-1"
                      >
                        <Calendar className="w-4 h-4" />
                        Book Blood Draw
                      </Button>
                      <Button variant="outline" size="sm">
                        <Navigation className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
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