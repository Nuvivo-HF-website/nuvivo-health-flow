import { useState } from "react";
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
import ClinicMap from "@/components/ClinicMap";

const clinics = [
  // London & South East England
  {
    id: 1,
    name: "Harley Street Blood Centre",
    address: "25 Harley Street, London W1G 9QW",
    city: "London",
    region: "England",
    phone: "020 7636 8333",
    rating: 4.9,
    distance: "0.5 miles",
    openingHours: "Mon-Fri: 7:00-18:00, Sat: 8:00-16:00",
    services: ["Fasting Blood Tests", "Standard Blood Tests", "Health Screenings", "Home Visits"],
    facilities: ["Parking Available", "Wheelchair Access", "Air Conditioning", "WiFi"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 51.5194,
    lng: -0.1448
  },
  {
    id: 2,
    name: "Canary Wharf Health Hub",
    address: "1 Churchill Place, London E14 5HP",
    city: "London",
    region: "England",
    phone: "020 7712 1234",
    rating: 4.8,
    distance: "2.1 miles",
    openingHours: "Mon-Fri: 6:30-19:00, Sat: 8:00-14:00",
    services: ["Express Blood Tests", "Corporate Health", "Nutrition Testing"],
    facilities: ["Underground Parking", "Cafe", "Express Service"],
    appointments: ["Same Day", "Next Day"],
    lat: 51.5045,
    lng: -0.0194
  },
  {
    id: 3,
    name: "Brighton Medical Centre",
    address: "45 Western Road, Brighton BN1 2EB",
    city: "Brighton",
    region: "England",
    phone: "01273 555 789",
    rating: 4.7,
    distance: "48.3 miles",
    openingHours: "Mon-Fri: 8:00-17:00, Sat: 9:00-13:00",
    services: ["Standard Blood Tests", "Allergy Testing", "Hormone Testing"],
    facilities: ["Street Parking", "Wheelchair Access"],
    appointments: ["Next Day", "Weekly"],
    lat: 50.8225,
    lng: -0.1372
  },

  // Midlands & North England
  {
    id: 4,
    name: "Birmingham Blood Lab",
    address: "78 Corporation Street, Birmingham B4 6SX",
    city: "Birmingham",
    region: "England",
    phone: "0121 234 5678",
    rating: 4.6,
    distance: "95.2 miles",
    openingHours: "Mon-Fri: 7:30-18:00, Sat: 8:00-15:00",
    services: ["Comprehensive Health Panels", "Diabetes Testing", "Cardiac Markers"],
    facilities: ["Multi-storey Parking", "Wheelchair Access", "Children's Area"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 52.4814,
    lng: -1.8998
  },
  {
    id: 5,
    name: "Manchester Medical Labs",
    address: "123 Deansgate, Manchester M3 2BW",
    city: "Manchester",
    region: "England",
    phone: "0161 789 0123",
    rating: 4.8,
    distance: "162.5 miles",
    openingHours: "Mon-Fri: 7:00-19:00, Sat: 8:00-16:00",
    services: ["Full Blood Count", "Liver Function", "Kidney Function", "Sports Medicine"],
    facilities: ["Secure Parking", "Fast Track Service", "Online Results"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 53.4794,
    lng: -2.2453
  },
  {
    id: 6,
    name: "Liverpool Health Centre",
    address: "56 Bold Street, Liverpool L1 4DS",
    city: "Liverpool",
    region: "England",
    phone: "0151 456 7890",
    rating: 4.5,
    distance: "178.9 miles",
    openingHours: "Mon-Fri: 8:00-17:30, Sat: 9:00-14:00",
    services: ["Standard Blood Tests", "Travel Health", "Occupational Health"],
    facilities: ["Public Transport Links", "Wheelchair Access"],
    appointments: ["Next Day", "Weekly"],
    lat: 53.4048,
    lng: -2.9916
  },
  {
    id: 7,
    name: "Leeds Diagnostic Centre",
    address: "89 The Headrow, Leeds LS1 6HW",
    city: "Leeds",
    region: "England",
    phone: "0113 567 8901",
    rating: 4.7,
    distance: "185.4 miles",
    openingHours: "Mon-Fri: 7:30-18:30, Sat: 8:00-15:00",
    services: ["Comprehensive Testing", "Women's Health", "Men's Health"],
    facilities: ["City Centre Parking", "Express Results", "Comfortable Waiting Area"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 53.7997,
    lng: -1.5492
  },
  {
    id: 8,
    name: "Newcastle Blood Services",
    address: "34 Grey Street, Newcastle NE1 6AE",
    city: "Newcastle",
    region: "England",
    phone: "0191 234 5678",
    rating: 4.6,
    distance: "248.7 miles",
    openingHours: "Mon-Fri: 8:00-17:00, Sat: 9:00-13:00",
    services: ["Standard Panels", "Infectious Disease Testing", "Nutritional Analysis"],
    facilities: ["Metro Access", "Wheelchair Access", "Family Friendly"],
    appointments: ["Next Day", "Weekly"],
    lat: 54.9738,
    lng: -1.6131
  },

  // Wales
  {
    id: 9,
    name: "Cardiff Bay Health Lab",
    address: "12 Bute Street, Cardiff CF10 5BZ",
    city: "Cardiff",
    region: "Wales",
    phone: "029 2034 5678",
    rating: 4.8,
    distance: "132.6 miles",
    openingHours: "Mon-Fri: 8:00-18:00, Sat: 9:00-15:00",
    services: ["Full Health Assessments", "Thyroid Testing", "Vitamin Deficiency"],
    facilities: ["Waterfront Parking", "Bay Views", "Modern Equipment"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 51.4816,
    lng: -3.1791
  },
  {
    id: 10,
    name: "Swansea Medical Labs",
    address: "67 High Street, Swansea SA1 1LN",
    city: "Swansea",
    region: "Wales",
    phone: "01792 345 678",
    rating: 4.5,
    distance: "162.8 miles",
    openingHours: "Mon-Fri: 8:30-17:00, Sat: 9:00-13:00",
    services: ["Basic Health Checks", "Allergy Panels", "Hormone Analysis"],
    facilities: ["Town Centre Location", "Public Parking", "Bilingual Service"],
    appointments: ["Next Day", "Weekly"],
    lat: 51.6214,
    lng: -3.9436
  },
  {
    id: 11,
    name: "Newport Blood Centre",
    address: "23 Commercial Road, Newport NP20 2PS",
    city: "Newport",
    region: "Wales",
    phone: "01633 456 789",
    rating: 4.4,
    distance: "125.3 miles",
    openingHours: "Mon-Fri: 8:00-17:30",
    services: ["Standard Blood Tests", "Health Screenings"],
    facilities: ["Free Parking", "Wheelchair Access"],
    appointments: ["Weekly"],
    lat: 51.5842,
    lng: -2.9977
  },

  // Scotland
  {
    id: 12,
    name: "Edinburgh Royal Lab",
    address: "45 Princes Street, Edinburgh EH2 2BY",
    city: "Edinburgh",
    region: "Scotland",
    phone: "0131 225 6789",
    rating: 4.9,
    distance: "345.2 miles",
    openingHours: "Mon-Fri: 7:30-18:30, Sat: 8:00-16:00",
    services: ["Comprehensive Health Panels", "Genetic Testing", "Executive Health"],
    facilities: ["City Centre", "Valet Parking", "Historic Building", "Premium Service"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 55.9533,
    lng: -3.1883
  },
  {
    id: 13,
    name: "Glasgow Health Hub",
    address: "78 Buchanan Street, Glasgow G1 3BA",
    city: "Glasgow",
    region: "Scotland",
    phone: "0141 334 5678",
    rating: 4.7,
    distance: "389.4 miles",
    openingHours: "Mon-Fri: 8:00-18:00, Sat: 9:00-15:00",
    services: ["Full Blood Analysis", "Sports Performance", "Wellness Checks"],
    facilities: ["Shopping District", "Public Transport", "Modern Facilities"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 55.8642,
    lng: -4.2518
  },
  {
    id: 14,
    name: "Aberdeen Medical Centre",
    address: "34 Union Street, Aberdeen AB11 6BD",
    city: "Aberdeen",
    region: "Scotland",
    phone: "01224 567 890",
    rating: 4.6,
    distance: "462.7 miles",
    openingHours: "Mon-Fri: 8:00-17:00, Sat: 9:00-14:00",
    services: ["Standard Testing", "Offshore Worker Health", "Oil Industry Medicals"],
    facilities: ["Industrial Access", "Quick Service", "Specialized Testing"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 57.1497,
    lng: -2.0943
  },
  {
    id: 15,
    name: "Dundee Blood Lab",
    address: "12 Reform Street, Dundee DD1 1RJ",
    city: "Dundee",
    region: "Scotland",
    phone: "01382 234 567",
    rating: 4.5,
    distance: "418.9 miles",
    openingHours: "Mon-Fri: 8:30-17:30",
    services: ["Health Assessments", "University Research", "Student Health"],
    facilities: ["University District", "Student Discounts", "Research Partnership"],
    appointments: ["Next Day", "Weekly"],
    lat: 56.4620,
    lng: -2.9707
  }
];

const ClinicFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedServices, setSelectedServices] = useState("all");
  const [filteredClinics, setFilteredClinics] = useState(clinics);
  const { toast } = useToast();

  const handleSearch = () => {
    let filtered = clinics;

    if (searchTerm) {
      filtered = filtered.filter(clinic => 
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter(clinic => clinic.region === selectedRegion);
    }

    if (selectedServices !== "all") {
      filtered = filtered.filter(clinic => 
        clinic.services.some(service => service.toLowerCase().includes(selectedServices.toLowerCase()))
      );
    }

    setFilteredClinics(filtered);
  };

  const handleBooking = (clinicId: number) => {
    const clinic = clinics.find(c => c.id === clinicId);
    toast({
      title: "Booking initiated",
      description: `Booking blood draw at ${clinic?.name}`,
    });
  };

  const getDirections = (clinic: any) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

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

          {/* Search and Filter Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find Your Nearest Clinic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by city, clinic name, or postcode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="England">England</SelectItem>
                    <SelectItem value="Wales">Wales</SelectItem>
                    <SelectItem value="Scotland">Scotland</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedServices} onValueChange={setSelectedServices}>
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="fasting">Fasting Tests</SelectItem>
                    <SelectItem value="standard">Standard Tests</SelectItem>
                    <SelectItem value="health">Health Screenings</SelectItem>
                    <SelectItem value="specialist">Specialist Tests</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch} className="md:w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Map Section */}
          <div className="mb-8">
            <ClinicMap 
              clinics={filteredClinics} 
              onClinicSelect={(clinic) => {
                toast({
                  title: "Clinic Selected",
                  description: `${clinic.name} - ${clinic.address}`,
                });
              }}
            />
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Found {filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} 
              {selectedRegion !== "all" && ` in ${selectedRegion}`}
            </p>
          </div>

          {/* Clinics Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredClinics.map((clinic) => (
              <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-primary" />
                        {clinic.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{clinic.rating}</span>
                        </div>
                        <Badge variant="outline">{clinic.region}</Badge>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <MapPin className="w-3 h-3 mr-1" />
                      {clinic.distance}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{clinic.address}</p>
                        <p className="text-sm text-muted-foreground">{clinic.city}, {clinic.region}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">{clinic.phone}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">{clinic.openingHours}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Available Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {clinic.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {clinic.services.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{clinic.services.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Facilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {clinic.facilities.slice(0, 3).map((facility, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Appointment Availability:</p>
                    <div className="flex gap-1">
                      {clinic.appointments.map((availability, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-green-700 border-green-200">
                          {availability}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        window.location.href = '/booking';
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Blood Draw
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => getDirections(clinic)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Partner Clinics?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-semibold mb-2">Expert Phlebotomists</h3>
                  <p className="text-sm text-muted-foreground">Trained professionals ensuring comfortable and safe blood draws</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="font-semibold mb-2">Quick Service</h3>
                  <p className="text-sm text-muted-foreground">Fast appointments with minimal waiting times</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="font-semibold mb-2">Convenient Locations</h3>
                  <p className="text-sm text-muted-foreground">Clinics across England, Wales, and Scotland</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Car className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="font-semibold mb-2">Easy Access</h3>
                  <p className="text-sm text-muted-foreground">Parking and public transport links available</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClinicFinder;