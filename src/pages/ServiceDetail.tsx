import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, Calendar, Clock, CheckCircle, Users, Heart, Zap, Shield, Star, Info, MapPin
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  features: string[];
  suitable: string[];
  type: 'treatment' | 'consultation' | 'scan';
  detailed?: string;
  qualifications?: string[];
  equipment?: string[];
  preparation?: string[];
}

// Import treatment data
const treatmentData: Service[] = [
  {
    id: "deep-tissue-massage",
    name: "Deep Tissue Massage",
    description: "Targeted massage therapy focusing on deep muscle layers to relieve chronic tension and pain.",
    detailed: "Our deep tissue massage therapy is designed to target the deeper layers of muscle and connective tissue. Using slow, deliberate strokes and deep finger pressure, our certified therapists work to break up scar tissue and physically break down muscle adhesions that can disrupt circulation and cause pain, limited range of motion, and inflammation.",
    price: 45,
    duration: "60 min",
    category: "Physiotherapy",
    type: "treatment",
    features: [
      "Deep muscle manipulation",
      "Pain relief focused",
      "Chronic tension treatment",
      "Improved circulation",
      "Stress reduction",
      "Enhanced flexibility"
    ],
    suitable: [
      "Chronic muscle pain sufferers",
      "Athletes with muscle tightness",
      "Office workers with tension",
      "Post-injury recovery",
      "Stress-related muscle tension"
    ],
    qualifications: ["Certified Massage Therapists", "Sports Therapy Qualified", "Continuing Education Certified"],
    preparation: ["Wear comfortable clothing", "Avoid heavy meals 2 hours before", "Stay hydrated", "Inform therapist of any injuries"]
  },
  {
    id: "iv-vitamin-energy-boost",
    name: "Energy Boost IV Drip",
    description: "High-dose vitamin B complex with vitamin C to combat fatigue and boost energy levels naturally.",
    detailed: "Our Energy Boost IV therapy delivers a powerful combination of essential vitamins and minerals directly into your bloodstream for maximum absorption. This treatment includes high-dose B vitamins (B1, B6, B12), vitamin C, and essential amino acids that work synergistically to enhance cellular energy production, improve mental clarity, and support overall vitality.",
    price: 120,
    duration: "45 min",
    category: "IV Vitamin Therapy", 
    type: "treatment",
    features: [
      "Vitamin B12, B6, B1 complex",
      "High-dose vitamin C (1000mg)",
      "Immediate energy boost",
      "Enhanced mental clarity",
      "Immune system support",
      "Faster recovery"
    ],
    suitable: [
      "Chronic fatigue sufferers",
      "Busy professionals",
      "Post-illness recovery",
      "Athletic performance enhancement",
      "Jet lag recovery",
      "Stress management"
    ],
    qualifications: ["Registered Nurses", "IV Therapy Certified", "Medical Supervision"],
    preparation: ["Eat light meal beforehand", "Stay well hydrated", "Wear comfortable clothing", "Bring entertainment for duration"],
    equipment: ["Medical-grade IV equipment", "Sterile single-use needles", "Premium vitamin formulations"]
  },
  {
    id: "hrt-consultation",
    name: "HRT Consultation & Treatment",
    description: "Comprehensive hormone replacement therapy assessment, monitoring, and ongoing support.",
    detailed: "Our comprehensive HRT service provides thorough evaluation, personalized treatment planning, and ongoing monitoring for hormone replacement therapy. Our experienced clinicians assess your symptoms, review comprehensive hormone panels, and develop individualized treatment protocols to optimize your hormonal health and quality of life.",
    price: 150,
    duration: "60 min",
    category: "Hormone Therapy",
    type: "consultation",
    features: [
      "Comprehensive hormone assessment",
      "Personalized HRT protocol",
      "Ongoing monitoring and adjustments",
      "Side effect management",
      "Lifestyle optimization advice",
      "Follow-up consultations included"
    ],
    suitable: [
      "Menopausal symptoms",
      "Hormonal imbalance",
      "Low estrogen/progesterone",
      "Quality of life concerns",
      "Sleep disturbances",
      "Mood changes"
    ],
    qualifications: ["Hormone Specialist Doctors", "Menopause Society Certified", "Continuous Medical Education"],
    preparation: ["Complete symptom questionnaire", "Bring recent blood work if available", "List current medications", "Prepare questions about symptoms"]
  }
];

// Mock consultation data
const consultationData: Service[] = [
  {
    id: "cardiology-consultation",
    name: "Cardiology Consultation",
    description: "Comprehensive heart health assessment with specialist cardiologist.",
    detailed: "Our cardiology consultation provides thorough cardiovascular assessment including detailed medical history review, physical examination, ECG interpretation, and personalized risk stratification. Our consultant cardiologists offer evidence-based recommendations for heart disease prevention, management of existing conditions, and lifestyle optimization.",
    price: 200,
    duration: "45 min",
    category: "Specialist Consultation",
    type: "consultation",
    features: [
      "Comprehensive cardiac assessment",
      "ECG interpretation",
      "Risk factor analysis",
      "Treatment plan development",
      "Lifestyle recommendations",
      "Follow-up care coordination"
    ],
    suitable: [
      "Chest pain concerns",
      "High blood pressure",
      "Family history of heart disease",
      "Abnormal ECG results",
      "Cardiovascular risk assessment"
    ],
    qualifications: ["Consultant Cardiologist", "GMC Registered", "Royal College certified"],
    preparation: ["Bring recent test results", "List current medications", "Prepare symptom timeline", "Note family history"]
  }
];

// Mock scan data  
const scanData: Service[] = [
  {
    id: "ultrasound-scan",
    name: "Diagnostic Ultrasound Scan",
    description: "High-resolution ultrasound imaging for diagnostic purposes.",
    detailed: "Our state-of-the-art ultrasound scanning service provides detailed imaging for diagnostic assessment. Using advanced ultrasound technology, our qualified sonographers perform comprehensive scans with immediate preliminary results and consultant radiologist reporting within 24 hours.",
    price: 180,
    duration: "30 min",
    category: "Diagnostic Imaging",
    type: "scan",
    features: [
      "High-resolution imaging",
      "Immediate preliminary results",
      "Consultant radiologist reporting",
      "Digital image copies provided",
      "Detailed written report",
      "24-hour turnaround"
    ],
    suitable: [
      "Abdominal pain investigation",
      "Pregnancy monitoring",
      "Thyroid assessment",
      "Vascular screening",
      "Soft tissue evaluation"
    ],
    qualifications: ["Qualified Sonographers", "Consultant Radiologists", "RCCP Accredited"],
    preparation: ["Fasting may be required", "Wear loose clothing", "Arrive 15 minutes early", "Bring referral if available"],
    equipment: ["Latest ultrasound technology", "High-frequency transducers", "Digital imaging systems"]
  }
];

const allServices = [...treatmentData, ...consultationData, ...scanData];

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const found = allServices.find(s => s.id === id);
      setService(found || null);
    }
    setLoading(false);
  }, [id]);

  const getBackPath = () => {
    if (!service) return "/";
    switch (service.type) {
      case "treatment": return "/treatments";
      case "consultation": return "/marketplace";
      case "scan": return "/radiology";
      default: return "/";
    }
  };

  const getBackLabel = () => {
    if (!service) return "Home";
    switch (service.type) {
      case "treatment": return "Back to Treatments";
      case "consultation": return "Back to Consultations"; 
      case "scan": return "Back to Scans";
      default: return "Back to Home";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Physiotherapy": return <Heart className="w-5 h-5" />;
      case "Sports Therapy": return <Zap className="w-5 h-5" />;
      case "IV Vitamin Therapy": return <Zap className="w-5 h-5" />;
      case "Hormone Therapy": return <Users className="w-5 h-5" />;
      case "Specialist Consultation": return <Users className="w-5 h-5" />;
      case "Diagnostic Imaging": return <Shield className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  const handleBooking = () => {
    if (!service) return;
    
    toast({
      title: "Booking initiated",
      description: `Starting booking process for ${service.name}`,
    });
    navigate(`/booking?service=${service.id}&type=${service.type}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(getBackPath())}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {getBackLabel()}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getCategoryIcon(service.category)}
                      <Badge variant="secondary" className="text-sm">
                        {service.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl font-bold mb-3">{service.name}</CardTitle>
                    <CardDescription className="text-lg leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="text-2xl font-bold text-primary">£{service.price}</div>
                    <div className="text-muted-foreground">{service.duration}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Detailed Description */}
            {service.detailed && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    Detailed Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{service.detailed}</p>
                </CardContent>
              </Card>
            )}

            {/* Key Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Service Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">£{service.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{service.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{service.type}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Preparation Instructions */}
            {service.preparation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-orange-500" />
                    Preparation Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.preparation.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Suitable For Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Who Should Consider This Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.suitable.map((indication, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{indication}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Qualifications */}
            {service.qualifications && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Professional Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.qualifications.map((qual, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{qual}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Book This Service</CardTitle>
                <CardDescription>Schedule your appointment today</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Price Summary */}
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Cost:</span>
                    <span className="text-2xl font-bold text-primary">£{service.price}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {service.duration} session
                  </div>
                </div>

                <Button onClick={handleBooking} className="w-full" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now - £{service.price}
                </Button>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Professional qualified staff</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Flexible appointment times</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Comprehensive aftercare</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetail;