import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scan, 
  Shield, 
  Eye, 
  Brain, 
  Heart, 
  Users, 
  Clock, 
  CheckCircle, 
  Calendar,
  MapPin,
  Star
} from "lucide-react";

const cancerScreeningServices = [
  {
    id: 1,
    name: "CT Cancer Screening",
    category: "Computed Tomography",
    description: "Low-dose CT scan designed for early detection of lung, liver, and other organ cancers",
    detailedDescription: "Our advanced low-dose CT cancer screening uses state-of-the-art technology to detect cancer at its earliest stages. This comprehensive scan examines the chest, abdomen, and pelvis to identify potential abnormalities before symptoms appear.",
    price: "£450",
    duration: "45 minutes",
    preparation: "No eating 4 hours before scan, wear comfortable clothing without metal",
    icon: Scan,
    features: [
      "Low-dose radiation technology",
      "AI-assisted image analysis",
      "Same-day preliminary results",
      "Expert radiologist review",
      "3D image reconstruction",
      "Follow-up consultation included"
    ],
    coverageAreas: ["Lungs", "Liver", "Kidneys", "Pancreas", "Lymph nodes"],
    suitableFor: ["Smokers over 50", "Family history of cancer", "High-risk individuals", "Annual health screening"],
    accuracy: "95%+",
    cancerTypes: ["Lung cancer", "Liver cancer", "Kidney cancer", "Pancreatic cancer"]
  },
  {
    id: 2,
    name: "MRI Full Body Cancer Screen",
    category: "Magnetic Resonance Imaging",
    description: "Comprehensive MRI screening covering all major organs for cancer detection without radiation",
    detailedDescription: "Our whole-body MRI cancer screening provides detailed images of soft tissues throughout the body without using ionizing radiation. This advanced technique can detect tumors, cysts, and other abnormalities across multiple organ systems.",
    price: "£795",
    duration: "60-90 minutes",
    preparation: "Remove all metal objects, inform us of any implants or claustrophobia",
    icon: Eye,
    features: [
      "No radiation exposure",
      "3Tesla high-field MRI",
      "Multi-organ assessment",
      "Advanced contrast imaging",
      "AI-enhanced detection",
      "Comprehensive report with images"
    ],
    coverageAreas: ["Brain", "Spine", "Chest", "Abdomen", "Pelvis", "Extremities"],
    suitableFor: ["Comprehensive health screening", "BRCA gene carriers", "Strong family history", "Previous cancer survivors"],
    accuracy: "97%+",
    cancerTypes: ["Brain tumors", "Breast cancer", "Prostate cancer", "Liver cancer", "Bone cancer"]
  },
  {
    id: 3,
    name: "PET-CT Cancer Scan",
    category: "Metabolic Imaging",
    description: "Advanced metabolic imaging combining PET and CT for precise cancer detection and staging",
    detailedDescription: "PET-CT combines positron emission tomography with computed tomography to provide both metabolic and anatomical information. This powerful combination can detect cancer cells by their increased glucose uptake and provide precise staging information.",
    price: "£1,250",
    duration: "2-3 hours",
    preparation: "Fasting 6 hours before scan, diabetic patients need special preparation",
    icon: Brain,
    features: [
      "Metabolic cancer detection",
      "Whole-body assessment",
      "Cancer staging capability",
      "Treatment response monitoring",
      "High sensitivity detection",
      "Radiologist and nuclear medicine physician review"
    ],
    coverageAreas: ["Whole body metabolic survey", "Lymph node assessment", "Bone metastases", "Organ involvement"],
    suitableFor: ["Cancer staging", "Treatment monitoring", "Recurrence detection", "High-risk screening"],
    accuracy: "98%+",
    cancerTypes: ["Lymphoma", "Melanoma", "Lung cancer", "Colorectal cancer", "Head & neck cancer"]
  },
  {
    id: 4,
    name: "Comprehensive Cancer Prevention Package",
    category: "Multi-Modal Screening",
    description: "Complete cancer screening combining imaging, blood tests, and specialist consultation",
    detailedDescription: "Our most comprehensive cancer prevention package combines advanced imaging with tumor marker blood tests and specialist oncology consultation. This thorough approach provides the highest level of cancer detection and prevention planning.",
    price: "£1,650",
    duration: "Half day (4-5 hours)",
    preparation: "Fasting 12 hours for blood tests, follow imaging preparation guidelines",
    icon: Shield,
    features: [
      "CT and MRI imaging",
      "Comprehensive tumor markers",
      "Genetic cancer risk assessment",
      "Oncologist consultation",
      "Personalized risk report",
      "Follow-up care plan"
    ],
    coverageAreas: ["Full body imaging", "Blood cancer markers", "Genetic testing", "Risk assessment"],
    suitableFor: ["Family history of cancer", "BRCA carriers", "Previous cancer patients", "Executive health screening"],
    accuracy: "99%+",
    cancerTypes: ["All major cancer types", "Hereditary cancers", "Early-stage detection"]
  },
  {
    id: 5,
    name: "Mammography & Breast MRI",
    category: "Women's Cancer Screening",
    description: "Specialized breast cancer screening with 3D mammography and MRI",
    detailedDescription: "Advanced breast cancer screening combining 3D digital mammography with contrast-enhanced breast MRI for the highest sensitivity in breast cancer detection, particularly in dense breast tissue.",
    price: "£385",
    duration: "60 minutes",
    preparation: "Schedule for week after menstrual period, no deodorant or powder",
    icon: Heart,
    features: [
      "3D digital mammography",
      "Contrast-enhanced breast MRI",
      "Dense breast tissue assessment",
      "Female radiographer",
      "Immediate preliminary results",
      "BRCA screening specialist review"
    ],
    coverageAreas: ["Breast tissue", "Lymph nodes", "Chest wall", "Axillary regions"],
    suitableFor: ["Annual screening over 40", "Dense breast tissue", "Family history", "BRCA gene carriers"],
    accuracy: "96%+",
    cancerTypes: ["Invasive breast cancer", "Ductal carcinoma in situ", "Lobular carcinoma"]
  },
  {
    id: 6,
    name: "Prostate Cancer Screening",
    category: "Men's Cancer Screening",
    description: "Comprehensive prostate cancer screening with MRI and biomarker testing",
    detailedDescription: "Advanced prostate cancer screening combining multiparametric MRI with PSA testing and new biomarkers for accurate detection while minimizing unnecessary biopsies.",
    price: "£495",
    duration: "45 minutes",
    preparation: "No special preparation required, inform of previous biopsies",
    icon: Users,
    features: [
      "Multiparametric prostate MRI",
      "PSA and PHI testing",
      "4K Score biomarker panel",
      "PI-RADS scoring system",
      "Urologist consultation",
      "Biopsy guidance if needed"
    ],
    coverageAreas: ["Prostate gland", "Seminal vesicles", "Pelvic lymph nodes", "Surrounding structures"],
    suitableFor: ["Men over 50", "Family history", "African descent", "Elevated PSA"],
    accuracy: "94%+",
    cancerTypes: ["Prostate adenocarcinoma", "Aggressive prostate cancer"]
  }
];

const locations = [
  {
    name: "London Cancer Centre",
    address: "123 Harley Street, London W1G 6BA",
    distance: "2.1 miles",
    rating: 4.9,
    services: ["CT", "MRI", "PET-CT", "Mammography", "All packages"],
    specialties: ["Oncology", "Radiology", "Nuclear Medicine"],
    equipment: ["Siemens 3T MRI", "GE PET-CT", "Hologic 3D Mammography"]
  },
  {
    name: "Birmingham Cancer Institute",
    address: "456 Queen Elizabeth Drive, Birmingham B15 2TH",
    distance: "95.2 miles",
    rating: 4.8,
    services: ["CT", "MRI", "PET-CT", "Prevention packages"],
    specialties: ["Cancer Prevention", "Early Detection", "Genetic Counseling"],
    equipment: ["Philips 3T MRI", "Siemens PET-CT", "AI Detection Software"]
  },
  {
    name: "Manchester Oncology Centre",
    address: "789 Oxford Road, Manchester M13 9WL",
    distance: "162.5 miles",
    rating: 4.7,
    services: ["CT", "MRI", "Prostate screening", "Breast screening"],
    specialties: ["Breast Cancer", "Prostate Cancer", "Lung Cancer"],
    equipment: ["GE 3T MRI", "Canon CT Scanner", "Breast MRI Suite"]
  },
  {
    name: "Edinburgh Cancer Detection",
    address: "234 Royal Mile, Edinburgh EH1 1PJ",
    distance: "345.2 miles",
    rating: 4.9,
    services: ["All cancer screening services"],
    specialties: ["Comprehensive Cancer Care", "Research Partnership"],
    equipment: ["Latest MRI Technology", "Advanced PET-CT", "Genetic Testing Lab"]
  }
];

const ScansCancer = () => {
  const navigate = useNavigate();

  const handleBooking = (serviceId: number) => {
    navigate(`/service/cancer-screening-${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Cancer Screening & Detection</h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Early detection saves lives. Our advanced cancer screening services use cutting-edge imaging technology 
              and AI-assisted analysis to detect cancer at its earliest, most treatable stages.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Badge variant="secondary" className="px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                99%+ Accuracy
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Same-day Results
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Expert Oncologists
              </Badge>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {cancerScreeningServices.map((service) => {
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
                          {service.cancerTypes.slice(0, 2).map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                          {service.cancerTypes.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{service.cancerTypes.length - 2} more
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
                          <span className="text-sm font-medium">Accuracy:</span>
                          <Badge variant="secondary">{service.accuracy}</Badge>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleBooking(service.id)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book {service.name}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About Cancer Screening</TabsTrigger>
              <TabsTrigger value="locations">Our Locations</TabsTrigger>
              <TabsTrigger value="preparation">Preparation Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Why Early Cancer Detection Matters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Cancer detection at Stage 1 offers survival rates of over 90% for most cancer types, 
                    compared to 10-30% when detected at Stage 4. Our advanced screening programs are designed 
                    to catch cancer at its earliest, most treatable stages.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Who Should Get Screened?</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Adults over 40 for general screening
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Family history of cancer
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          BRCA gene carriers
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Previous cancer survivors
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          High-risk lifestyle factors
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Our Technology Advantage</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          AI-assisted image analysis
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Latest 3T MRI technology
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Low-dose radiation protocols
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Expert oncologist review
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Same-day preliminary results
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="locations" className="space-y-6">
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

                        <div>
                          <p className="text-sm font-medium mb-2">Specialties:</p>
                          <div className="flex flex-wrap gap-1">
                            {location.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => navigate('/booking')}
                        >
                          Book at {location.name}
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
                  <CardTitle>How to Prepare for Your Cancer Screening</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Before Your Appointment</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span>Bring all previous medical records and imaging</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span>List all current medications and supplements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span>Wear comfortable, loose-fitting clothing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span>Remove all jewelry and metal objects</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span>Inform us of any allergies or claustrophobia</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Specific Preparations</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <h4 className="font-medium text-sm">CT Scans</h4>
                          <p className="text-xs text-muted-foreground">No eating 4 hours before. Drink plenty of water.</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <h4 className="font-medium text-sm">MRI Scans</h4>
                          <p className="text-xs text-muted-foreground">Remove all metal. Inform of implants or pacemakers.</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <h4 className="font-medium text-sm">PET-CT</h4>
                          <p className="text-xs text-muted-foreground">Fast 6 hours. Diabetics need special preparation.</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <h4 className="font-medium text-sm">Mammography</h4>
                          <p className="text-xs text-muted-foreground">No deodorant or powder. Schedule after menstrual period.</p>
                        </div>
                      </div>
                    </div>
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

export default ScansCancer;