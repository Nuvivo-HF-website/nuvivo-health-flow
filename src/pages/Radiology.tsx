import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scan, 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle, 
  X,
  Heart,
  Brain,
  Bone,
  Activity
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const radiologyServices = [
  {
    id: 1,
    name: "MRI Scan",
    category: "Advanced Imaging",
    description: "High-resolution magnetic resonance imaging for detailed soft tissue analysis",
    price: "£350",
    duration: "45-60 minutes",
    preparation: "Remove metal objects, may require contrast",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    features: ["3T High-Field MRI", "Expert Radiologist", "Same-day results", "CD with images"],
    icon: Brain,
    bodyParts: ["Brain", "Spine", "Joints", "Abdomen"]
  },
  {
    id: 2,
    name: "CT Scan",
    category: "Computed Tomography",
    description: "Fast, detailed cross-sectional imaging using X-rays",
    price: "£280",
    duration: "15-30 minutes",
    preparation: "May require fasting or contrast",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    features: ["Low-dose CT", "Rapid imaging", "3D reconstruction", "Expert analysis"],
    icon: Scan,
    bodyParts: ["Chest", "Abdomen", "Pelvis", "Head"]
  },
  {
    id: 3,
    name: "X-Ray",
    category: "Standard Imaging",
    description: "Quick and effective imaging for bones and certain soft tissues",
    price: "£85",
    duration: "10-15 minutes",
    preparation: "Remove jewelry and metal objects",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    features: ["Digital X-ray", "Immediate results", "High-quality images", "Minimal radiation"],
    icon: Bone,
    bodyParts: ["Chest", "Limbs", "Spine", "Pelvis"]
  },
  {
    id: 4,
    name: "Ultrasound",
    category: "Ultrasound Imaging",
    description: "Safe, non-invasive imaging using sound waves",
    price: "£120",
    duration: "20-45 minutes",
    preparation: "Varies by examination type",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    features: ["Real-time imaging", "No radiation", "Expert sonographer", "Immediate results"],
    icon: Heart,
    bodyParts: ["Abdomen", "Pelvis", "Heart", "Blood vessels"]
  },
  {
    id: 5,
    name: "DEXA Scan",
    category: "Bone Density",
    description: "Precise measurement of bone mineral density",
    price: "£150",
    duration: "15-30 minutes",
    preparation: "Avoid calcium supplements 24h before",
    availability: ["Tuesday", "Wednesday", "Thursday", "Friday"],
    features: ["Osteoporosis screening", "Fracture risk assessment", "Follow-up monitoring", "Expert interpretation"],
    icon: Activity,
    bodyParts: ["Spine", "Hip", "Forearm"]
  },
  {
    id: 6,
    name: "Mammography",
    category: "Women's Health",
    description: "Specialized breast imaging for screening and diagnosis",
    price: "£180",
    duration: "20-30 minutes",
    preparation: "Schedule for week after menstrual period",
    availability: ["Monday", "Wednesday", "Friday"],
    features: ["Digital mammography", "3D tomosynthesis", "Female radiographer", "Comfortable environment"],
    icon: Heart,
    bodyParts: ["Breast tissue"]
  }
];

const locations = [
  // London
  {
    name: "Central London Clinic",
    address: "123 Harley Street, London W1G 6BA",
    distance: "2.1 miles",
    rating: 4.9,
    services: ["MRI", "CT", "X-Ray", "Ultrasound", "DEXA"]
  },
  {
    name: "West London Imaging",
    address: "456 Kings Road, Chelsea, London SW3 5UX",
    distance: "3.4 miles",
    rating: 4.8,
    services: ["MRI", "CT", "X-Ray", "Mammography"]
  },
  {
    name: "North London Centre",
    address: "789 High Street, Camden, London NW1 7JE",
    distance: "4.2 miles",
    rating: 4.7,
    services: ["CT", "X-Ray", "Ultrasound", "DEXA"]
  },
  
  // England (Outside London)
  {
    name: "Manchester Medical Imaging",
    address: "234 Oxford Road, Manchester M13 9PL",
    distance: "12.5 miles",
    rating: 4.8,
    services: ["MRI", "CT", "X-Ray", "Ultrasound", "DEXA", "Mammography"]
  },
  {
    name: "Birmingham Radiology Centre",
    address: "567 Broad Street, Birmingham B1 2HE",
    distance: "8.3 miles",
    rating: 4.6,
    services: ["MRI", "CT", "X-Ray", "Ultrasound"]
  },
  {
    name: "Leeds Diagnostic Centre",
    address: "890 Wellington Street, Leeds LS1 4JJ",
    distance: "15.7 miles",
    rating: 4.7,
    services: ["CT", "X-Ray", "Ultrasound", "DEXA"]
  },
  {
    name: "Bristol Imaging Services",
    address: "123 Park Street, Bristol BS1 5NA",
    distance: "18.2 miles",
    rating: 4.9,
    services: ["MRI", "CT", "X-Ray", "Mammography"]
  },
  {
    name: "Liverpool Medical Centre",
    address: "456 Bold Street, Liverpool L1 4HY",
    distance: "22.1 miles",
    rating: 4.5,
    services: ["MRI", "CT", "X-Ray", "Ultrasound", "DEXA"]
  },
  {
    name: "Newcastle Radiology",
    address: "789 Grey Street, Newcastle NE1 6EF",
    distance: "28.4 miles",
    rating: 4.8,
    services: ["CT", "X-Ray", "Ultrasound", "Mammography"]
  },
  
  // Wales
  {
    name: "Cardiff Imaging Centre",
    address: "234 Queen Street, Cardiff CF10 2BQ",
    distance: "35.2 miles",
    rating: 4.7,
    services: ["MRI", "CT", "X-Ray", "Ultrasound", "DEXA"]
  },
  {
    name: "Swansea Medical Imaging",
    address: "567 Oxford Street, Swansea SA1 3AQ",
    distance: "42.8 miles",
    rating: 4.6,
    services: ["CT", "X-Ray", "Ultrasound", "Mammography"]
  },
  {
    name: "Newport Radiology Services",
    address: "890 Commercial Road, Newport NP20 2DA",
    distance: "38.5 miles",
    rating: 4.5,
    services: ["MRI", "X-Ray", "Ultrasound"]
  },
  
  // Scotland
  {
    name: "Edinburgh Medical Centre",
    address: "123 Princes Street, Edinburgh EH2 4AD",
    distance: "45.7 miles",
    rating: 4.9,
    services: ["MRI", "CT", "X-Ray", "Ultrasound", "DEXA", "Mammography"]
  },
  {
    name: "Glasgow Imaging Institute",
    address: "456 Sauchiehall Street, Glasgow G2 3LW",
    distance: "52.3 miles",
    rating: 4.8,
    services: ["MRI", "CT", "X-Ray", "Ultrasound"]
  },
  {
    name: "Aberdeen Radiology Centre",
    address: "789 Union Street, Aberdeen AB11 6BD",
    distance: "68.9 miles",
    rating: 4.7,
    services: ["CT", "X-Ray", "Ultrasound", "DEXA"]
  },
  {
    name: "Dundee Medical Imaging",
    address: "234 High Street, Dundee DD1 1EU",
    distance: "58.4 miles",
    rating: 4.6,
    services: ["MRI", "X-Ray", "Mammography"]
  },
  {
    name: "Stirling Diagnostic Services",
    address: "567 King Street, Stirling FK8 1AY",
    distance: "48.1 miles",
    rating: 4.5,
    services: ["CT", "X-Ray", "Ultrasound"]
  }
];

const Radiology = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const { toast } = useToast();

  const handleBooking = (serviceId: number, locationName: string) => {
    const service = radiologyServices.find(s => s.id === serviceId);
    toast({
      title: "Booking initiated",
      description: `Booking ${service?.name} at ${locationName}`,
    });
  };

  const ServiceIcon = ({ service }: { service: any }) => {
    const Icon = service.icon;
    return <Icon className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Radiology Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced medical imaging with state-of-the-art equipment and expert radiologists. 
              Get accurate diagnostics with same-day results.
            </p>
          </div>

          {/* Services Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {radiologyServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedService(service.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <ServiceIcon service={service} />
                    <Badge variant="secondary">{service.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">{service.price}</span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Body parts examined:</p>
                      <div className="flex flex-wrap gap-1">
                        {service.bodyParts.map((part) => (
                          <Badge key={part} variant="outline" className="text-xs">
                            {part}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Key features:</p>
                      <ul className="text-xs space-y-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full mt-4"
                      onClick={() => {
                        window.location.href = '/booking';
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Service Information */}
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Service Details</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="space-y-6">
              {selectedService && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">
                          {radiologyServices.find(s => s.id === selectedService)?.name}
                        </CardTitle>
                        <CardDescription className="text-lg">
                          {radiologyServices.find(s => s.id === selectedService)?.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedService(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const service = radiologyServices.find(s => s.id === selectedService);
                      return service ? (
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-semibold mb-2">Pricing & Duration</h3>
                              <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-primary">{service.price}</span>
                                <div className="flex items-center text-muted-foreground">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {service.duration}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Preparation Required</h3>
                              <p className="text-muted-foreground">{service.preparation}</p>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Availability</h3>
                              <div className="flex flex-wrap gap-2">
                                {service.availability.map((day) => (
                                  <Badge key={day} variant="outline">{day}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h3 className="font-semibold mb-2">What's Included</h3>
                              <ul className="space-y-2">
                                {service.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Body Parts Examined</h3>
                              <div className="flex flex-wrap gap-2">
                                {service.bodyParts.map((part) => (
                                  <Badge key={part} variant="secondary">{part}</Badge>
                                ))}
                              </div>
                            </div>

                            <Button 
                              size="lg" 
                              className="w-full"
                              onClick={() => {
                                window.location.href = '/booking';
                              }}
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Book {service.name}
                            </Button>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="locations" className="space-y-6">
              <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {locations.map((location, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{location.name}</CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{location.rating}</span>
                          </div>
                        </div>
                        <Badge variant="outline">
                          <MapPin className="w-3 h-3 mr-1" />
                          {location.distance}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Available Services:</p>
                          <div className="flex flex-wrap gap-1">
                            {location.services.map((service) => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => {
                            setSelectedLocation(location.name);
                            if (selectedService) {
                              handleBooking(selectedService, location.name);
                            }
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book at this location
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Why Choose Us Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Radiology Services?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="font-semibold mb-2">Expert Radiologists</h3>
                  <p className="text-sm text-muted-foreground">Board-certified specialists with years of experience</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-semibold mb-2">Latest Technology</h3>
                  <p className="text-sm text-muted-foreground">State-of-the-art imaging equipment for accurate results</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="font-semibold mb-2">Fast Results</h3>
                  <p className="text-sm text-muted-foreground">Same-day or next-day report delivery</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="font-semibold mb-2">Convenient Locations</h3>
                  <p className="text-sm text-muted-foreground">Multiple clinics across London for easy access</p>
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

export default Radiology;