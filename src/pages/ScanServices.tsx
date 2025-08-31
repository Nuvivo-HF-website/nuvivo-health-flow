import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Heart,
  Brain,
  Bone,
  Activity,
  Shield,
  Users,
  Award
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const scanServices = [
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
    bodyParts: ["Brain", "Spine", "Joints", "Abdomen"],
    detailedInfo: {
      procedure: "MRI uses powerful magnets and radio waves to create detailed images of organs and tissues inside your body.",
      benefits: ["No radiation exposure", "Excellent soft tissue contrast", "Multiple imaging planes", "Non-invasive procedure"],
      conditions: ["Neurological disorders", "Joint problems", "Spinal conditions", "Abdominal issues"]
    }
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
    bodyParts: ["Chest", "Abdomen", "Pelvis", "Head"],
    detailedInfo: {
      procedure: "CT scans use X-rays to create detailed cross-sectional images of your body.",
      benefits: ["Quick procedure", "Excellent bone detail", "Emergency diagnostics", "Wide availability"],
      conditions: ["Cancer screening", "Trauma assessment", "Lung conditions", "Kidney stones"]
    }
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
    bodyParts: ["Chest", "Limbs", "Spine", "Pelvis"],
    detailedInfo: {
      procedure: "X-rays use electromagnetic radiation to create images of bones and some soft tissues.",
      benefits: ["Quick and painless", "Widely available", "Cost-effective", "Immediate results"],
      conditions: ["Bone fractures", "Chest infections", "Dental problems", "Joint conditions"]
    }
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
    bodyParts: ["Abdomen", "Pelvis", "Heart", "Blood vessels"],
    detailedInfo: {
      procedure: "Ultrasound uses high-frequency sound waves to create real-time images of internal structures.",
      benefits: ["No radiation", "Real-time imaging", "Safe during pregnancy", "Non-invasive"],
      conditions: ["Pregnancy monitoring", "Abdominal pain", "Heart conditions", "Blood vessel disorders"]
    }
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
    bodyParts: ["Spine", "Hip", "Forearm"],
    detailedInfo: {
      procedure: "DEXA uses low-energy X-rays to measure bone mineral density and assess fracture risk.",
      benefits: ["Early osteoporosis detection", "Fracture risk assessment", "Treatment monitoring", "Quick procedure"],
      conditions: ["Osteoporosis", "Fracture risk", "Hormone deficiency", "Medication monitoring"]
    }
  },
  {
    id: 6,
    name: "Mammography",
    category: "Women's Health",
    description: "Specialised breast imaging for screening and diagnosis",
    price: "£180",
    duration: "20-30 minutes",
    preparation: "Schedule for week after menstrual period",
    availability: ["Monday", "Wednesday", "Friday"],
    features: ["Digital mammography", "3D tomosynthesis", "Female radiographer", "Comfortable environment"],
    icon: Heart,
    bodyParts: ["Breast tissue"],
    detailedInfo: {
      procedure: "Mammography uses low-dose X-rays to examine breast tissue for abnormalities.",
      benefits: ["Early cancer detection", "Screening and diagnosis", "3D imaging available", "Female staff"],
      conditions: ["Breast cancer screening", "Breast lumps", "Breast pain", "Family history"]
    }
  }
];

const ScanServices = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const { toast } = useToast();

  const handleBooking = (serviceId: number) => {
    const service = scanServices.find(s => s.id === serviceId);
    navigate(`/booking?service=${service?.name.toLowerCase().replace(' ', '-')}`);
  };

  const ServiceIcon = ({ service }: { service: any }) => {
    const Icon = service.icon;
    return <Icon className="w-8 h-8 text-primary" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Scan Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive medical imaging services with state-of-the-art equipment and expert radiologists. 
              Choose from our range of diagnostic scans for accurate, reliable results.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {scanServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
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
                  <div className="space-y-4">
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

                    <Button 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBooking(service.id);
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
          {selectedService && (
            <Card className="mb-12">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl mb-2">
                      {scanServices.find(s => s.id === selectedService)?.name}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {scanServices.find(s => s.id === selectedService)?.description}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedService(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const service = scanServices.find(s => s.id === selectedService);
                  return service ? (
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="procedure">Procedure</TabsTrigger>
                        <TabsTrigger value="booking">Book Now</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Pricing & Duration
                              </h3>
                              <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-primary">{service.price}</span>
                                <div className="flex items-center text-muted-foreground">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {service.duration}
                                </div>
                              </div>
                            </div>

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
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h3 className="font-semibold mb-2">Body Parts Examined</h3>
                              <div className="flex flex-wrap gap-2">
                                {service.bodyParts.map((part) => (
                                  <Badge key={part} variant="secondary">{part}</Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Availability</h3>
                              <div className="flex flex-wrap gap-2">
                                {service.availability.map((day) => (
                                  <Badge key={day} variant="outline">{day}</Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Preparation Required</h3>
                              <p className="text-muted-foreground">{service.preparation}</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="procedure" className="space-y-6 mt-6">
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Scan className="w-5 h-5" />
                              How it works
                            </h3>
                            <p className="text-muted-foreground">{service.detailedInfo.procedure}</p>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Shield className="w-5 h-5" />
                              Key Benefits
                            </h3>
                            <ul className="space-y-2">
                              {service.detailedInfo.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Activity className="w-5 h-5" />
                              Common Uses
                            </h3>
                            <ul className="space-y-2">
                              {service.detailedInfo.conditions.map((condition, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="w-3 h-3 text-blue-500" />
                                  {condition}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="booking" className="space-y-6 mt-6">
                        <div className="max-w-2xl mx-auto text-center space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">Ready to book your {service.name}?</h3>
                            <p className="text-muted-foreground">
                              Book your appointment today and get fast, accurate results from our expert radiologists.
                            </p>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-center">
                            <div className="space-y-2">
                              <Clock className="w-8 h-8 mx-auto text-primary" />
                              <p className="font-medium">Quick Results</p>
                              <p className="text-sm text-muted-foreground">Same-day reports available</p>
                            </div>
                            <div className="space-y-2">
                              <Users className="w-8 h-8 mx-auto text-primary" />
                              <p className="font-medium">Expert Team</p>
                              <p className="text-sm text-muted-foreground">Qualified radiologists</p>
                            </div>
                            <div className="space-y-2">
                              <Award className="w-8 h-8 mx-auto text-primary" />
                              <p className="font-medium">Quality Care</p>
                              <p className="text-sm text-muted-foreground">State-of-the-art equipment</p>
                            </div>
                          </div>

                          <Button 
                            size="lg" 
                            className="text-lg px-8 py-6"
                            onClick={() => handleBooking(service.id)}
                          >
                            <Calendar className="w-5 h-5 mr-2" />
                            Book {service.name} - {service.price}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}

          {/* Why Choose Our Scan Services */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Why Choose Our Scan Services?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We provide comprehensive medical imaging with cutting-edge technology and expert care
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Scan className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Advanced Technology</h3>
                  <p className="text-sm text-muted-foreground">
                    State-of-the-art imaging equipment for the most accurate diagnostics
                  </p>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Expert Radiologists</h3>
                  <p className="text-sm text-muted-foreground">
                    Highly qualified specialists with years of experience in medical imaging
                  </p>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Fast Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick turnaround times with same-day results available for most scans
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ScanServices;