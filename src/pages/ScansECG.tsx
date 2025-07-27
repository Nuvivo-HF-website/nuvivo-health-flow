import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Home, 
  Clock, 
  Shield, 
  Activity, 
  Monitor, 
  CheckCircle, 
  Calendar,
  MapPin,
  Star,
  User,
  Stethoscope
} from "lucide-react";

const ecgServices = [
  {
    id: 1,
    name: "12-Lead ECG at Home",
    category: "Diagnostic ECG",
    description: "Professional 12-lead ECG performed in the comfort of your home by qualified technicians",
    detailedDescription: "Our mobile ECG service brings hospital-grade cardiac monitoring to your home. Our certified cardiac technicians use advanced 12-lead ECG equipment to record your heart's electrical activity and detect any abnormalities.",
    price: "£120",
    duration: "30 minutes",
    preparation: "Wear loose clothing, avoid caffeine 2 hours before test",
    icon: Heart,
    features: [
      "Hospital-grade ECG equipment",
      "Certified cardiac technician",
      "Immediate preliminary reading",
      "Cardiologist review within 24 hours",
      "Digital report and printout",
      "Same-day urgent results if needed"
    ],
    detects: ["Arrhythmias", "Heart attacks", "Heart block", "Atrial fibrillation", "Ventricular abnormalities"],
    suitableFor: ["Chest pain assessment", "Palpitation investigation", "Pre-operative clearance", "Routine cardiac screening"],
    accuracy: "99%+",
    results: "24 hours"
  },
  {
    id: 2,
    name: "24-Hour Holter Monitor",
    category: "Continuous Monitoring",
    description: "Continuous heart rhythm monitoring for 24 hours to detect intermittent abnormalities",
    detailedDescription: "The Holter monitor is a portable ECG device that records your heart rhythm continuously for 24 hours. This extended monitoring can detect irregular heartbeats that might not show up during a standard ECG.",
    price: "£195",
    duration: "24 hours + setup/removal visits",
    preparation: "Normal daily activities, keep diary of symptoms",
    icon: Monitor,
    features: [
      "Lightweight portable monitor",
      "24-hour continuous recording",
      "Activity and symptom diary",
      "Waterproof design",
      "Advanced arrhythmia detection",
      "Comprehensive analysis report"
    ],
    detects: ["Intermittent arrhythmias", "Silent heart attacks", "Atrial fibrillation episodes", "Heart rate variability"],
    suitableFor: ["Unexplained palpitations", "Syncope investigation", "Medication monitoring", "Post-cardiac procedure follow-up"],
    accuracy: "98%+",
    results: "48 hours after return"
  },
  {
    id: 3,
    name: "48-Hour Extended Holter",
    category: "Extended Monitoring",
    description: "Extended 48-hour monitoring for better detection of infrequent cardiac events",
    detailedDescription: "For patients with less frequent symptoms, our 48-hour Holter monitoring provides extended observation to capture intermittent cardiac events that might be missed with shorter monitoring periods.",
    price: "£285",
    duration: "48 hours + setup/removal visits",
    preparation: "Continue normal activities, detailed symptom diary",
    icon: Clock,
    features: [
      "Extended 48-hour monitoring",
      "Enhanced battery life",
      "Shower-friendly design",
      "Real-time event marking",
      "Advanced signal processing",
      "Detailed rhythm analysis"
    ],
    detects: ["Rare arrhythmias", "Weekly rhythm patterns", "Exercise-induced abnormalities", "Sleep-related events"],
    suitableFor: ["Infrequent symptoms", "Sports cardiology", "Complex arrhythmia assessment", "Treatment effectiveness monitoring"],
    accuracy: "99%+",
    results: "72 hours after return"
  },
  {
    id: 4,
    name: "24-Hour Blood Pressure Monitor",
    category: "Blood Pressure Monitoring",
    description: "Ambulatory blood pressure monitoring over 24 hours for accurate hypertension assessment",
    detailedDescription: "Ambulatory blood pressure monitoring provides a complete picture of your blood pressure patterns throughout the day and night, offering more accurate assessment than clinic readings alone.",
    price: "£95",
    duration: "24 hours + setup/removal visits",
    preparation: "Wear loose-fitting upper arm clothing",
    icon: Activity,
    features: [
      "Automatic 24-hour monitoring",
      "Day and night profiles",
      "Activity correlation",
      "White coat hypertension detection",
      "Medication timing optimization",
      "Comprehensive BP analysis"
    ],
    detects: ["True hypertension", "White coat syndrome", "Masked hypertension", "Nocturnal blood pressure patterns"],
    suitableFor: ["Hypertension diagnosis", "Medication adjustment", "Pregnancy monitoring", "Cardiovascular risk assessment"],
    accuracy: "Clinical grade",
    results: "48 hours"
  },
  {
    id: 5,
    name: "Complete Cardiac Risk Assessment",
    category: "Comprehensive Evaluation",
    description: "Comprehensive cardiac health evaluation combining ECG, monitoring, and specialist consultation",
    detailedDescription: "Our most comprehensive cardiac package includes ECG, blood pressure monitoring, cholesterol testing, and consultation with a consultant cardiologist to assess your overall cardiovascular risk.",
    price: "£395",
    duration: "90 minutes + 24-hour monitoring",
    preparation: "Fasting 12 hours for cholesterol test, bring medication list",
    icon: Shield,
    features: [
      "12-lead ECG",
      "24-hour BP monitoring",
      "Lipid profile blood test",
      "Consultant cardiologist consultation",
      "10-year cardiovascular risk calculation",
      "Personalized prevention plan"
    ],
    detects: ["Cardiovascular disease risk", "Silent heart conditions", "Metabolic risk factors", "Early coronary disease"],
    suitableFor: ["Executive health screening", "Family history of heart disease", "Diabetes patients", "Men over 40, women over 50"],
    accuracy: "Comprehensive assessment",
    results: "Complete report within 7 days"
  },
  {
    id: 6,
    name: "Event Monitor (7-30 days)",
    category: "Long-term Monitoring",
    description: "Patient-activated event monitor for capturing infrequent cardiac symptoms over weeks",
    detailedDescription: "For very infrequent symptoms, our event monitor can be worn for up to 30 days. You activate the device when you feel symptoms, allowing us to capture the heart rhythm during these episodes.",
    price: "£450",
    duration: "7-30 days as needed",
    preparation: "Training provided for device activation",
    icon: User,
    features: [
      "Patient-activated recording",
      "7-30 day monitoring period",
      "Automatic arrhythmia detection",
      "Phone transmission capability",
      "Immediate physician review of events",
      "24/7 monitoring center support"
    ],
    detects: ["Rare symptomatic arrhythmias", "Syncope causes", "Palpitation triggers", "Medication effects"],
    suitableFor: ["Very infrequent symptoms", "Post-ablation monitoring", "Pacemaker follow-up", "Unexplained syncope"],
    accuracy: "Event-specific 99%+",
    results: "Immediate for urgent events"
  }
];

const locations = [
  {
    name: "Central London Mobile Team",
    coverage: "Central London, Zone 1-2",
    response: "Same day",
    rating: 4.9,
    services: ["All ECG services", "Home visits", "Emergency response"],
    team: ["Cardiac technicians", "Registered nurses", "Emergency support"],
    availability: "7 days a week, 7am-9pm"
  },
  {
    name: "Greater London Mobile Unit",
    coverage: "Greater London, all zones",
    response: "Next day",
    rating: 4.8,
    services: ["ECG", "Holter monitoring", "BP monitoring"],
    team: ["Mobile cardiac team", "Equipment specialists"],
    availability: "Monday-Saturday, 8am-6pm"
  },
  {
    name: "Birmingham Cardiac Services",
    coverage: "Birmingham and surrounding areas",
    response: "Same/next day",
    rating: 4.7,
    services: ["Complete cardiac assessment", "Home monitoring"],
    team: ["Consultant cardiologist", "Specialist nurses"],
    availability: "Monday-Friday, 8am-8pm"
  },
  {
    name: "Manchester Heart Health",
    coverage: "Greater Manchester region",
    response: "Same day for urgent",
    rating: 4.8,
    services: ["ECG services", "Risk assessments", "Follow-up care"],
    team: ["Cardiac specialists", "Mobile technicians"],
    availability: "Monday-Saturday, 7am-7pm"
  }
];

const ScansECG = () => {
  const navigate = useNavigate();

  const handleBooking = (serviceId: number) => {
    navigate(`/service/ecg-monitoring-${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Home ECG & Cardiac Monitoring</h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Professional cardiac monitoring services delivered to your home. Our certified technicians bring 
              hospital-grade equipment to provide accurate heart health assessments in your comfortable environment.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Badge variant="secondary" className="px-4 py-2">
                <Home className="w-4 h-4 mr-2" />
                Home Service
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Stethoscope className="w-4 h-4 mr-2" />
                Certified Technicians
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                24-Hour Results
              </Badge>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {ecgServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-8 h-8 text-primary" />
                      <Badge variant="outline">{service.category}</Badge>
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

                      <div>
                        <p className="text-sm font-medium mb-2">Detects:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.detects.slice(0, 2).map((condition) => (
                            <Badge key={condition} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                          {service.detects.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{service.detects.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Key Features:</p>
                        <ul className="text-xs space-y-1">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Results:</span>
                          <Badge variant="secondary">{service.results}</Badge>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleBooking(service.id)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Home Visit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Information Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About ECG Monitoring</TabsTrigger>
              <TabsTrigger value="coverage">Service Areas</TabsTrigger>
              <TabsTrigger value="preparation">How It Works</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Home ECG Monitoring?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Home ECG monitoring offers the convenience of professional cardiac assessment without the stress 
                    of hospital visits. Our services are particularly valuable for detecting intermittent heart 
                    conditions that might be missed during brief clinic visits.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">When You Need ECG Monitoring</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Chest pain or discomfort
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Heart palpitations or racing
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Dizziness or fainting spells
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Shortness of breath
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Family history of heart disease
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Pre-operative assessment
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Our Service Advantages</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Certified cardiac technicians
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Hospital-grade equipment
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Same-day urgent results
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Cardiologist review included
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          24/7 emergency support
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Follow-up care coordination
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="coverage" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                          <Clock className="w-3 h-3 mr-1" />
                          {location.response}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">Coverage Area:</p>
                          <p className="text-sm text-muted-foreground">{location.coverage}</p>
                        </div>
                        
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

                        <div>
                          <p className="text-sm font-medium">Availability:</p>
                          <p className="text-sm text-muted-foreground">{location.availability}</p>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => navigate('/booking')}
                        >
                          Book in {location.name.split(' ')[0]}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preparation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How Our Home ECG Service Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-1 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
                        <div>
                          <h3 className="font-semibold">Book Your Appointment</h3>
                          <p className="text-sm text-muted-foreground">Choose your preferred date and time. Same-day appointments available for urgent cases.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                        <div>
                          <h3 className="font-semibold">Technician Arrives</h3>
                          <p className="text-sm text-muted-foreground">Our certified cardiac technician arrives at your home with all necessary equipment.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
                        <div>
                          <h3 className="font-semibold">Assessment Performed</h3>
                          <p className="text-sm text-muted-foreground">Quick, painless ECG recording or monitor setup takes just 15-30 minutes.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
                        <div>
                          <h3 className="font-semibold">Results & Follow-up</h3>
                          <p className="text-sm text-muted-foreground">Results reviewed by cardiologist and sent to you within 24-48 hours. Urgent findings reported immediately.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">What to Prepare</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Wear loose, comfortable clothing with easy access to chest area</li>
                      <li>• Have current medication list available</li>
                      <li>• Avoid caffeine 2 hours before ECG</li>
                      <li>• Remove jewelry and metal objects from chest area</li>
                      <li>• Prepare quiet, private space for the assessment</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ScansECG;