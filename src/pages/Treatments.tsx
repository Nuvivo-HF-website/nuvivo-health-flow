import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Calendar, Clock, Users, Zap, Heart, Shield, CheckCircle, Star, MapPin
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface Treatment {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  features: string[];
  suitable: string[];
  image?: string;
}

const treatments: Treatment[] = [
  {
    id: "deep-tissue-massage",
    name: "Deep Tissue Massage",
    description: "Targeted massage therapy focusing on deep muscle layers to relieve chronic tension and pain.",
    price: 45,
    duration: "60 min",
    category: "Massage Therapy",
    features: [
      "Deep muscle manipulation",
      "Pain relief focused",
      "Chronic tension treatment",
      "Improved circulation"
    ],
    suitable: [
      "Chronic muscle pain sufferers",
      "Athletes with muscle tightness",
      "Office workers with tension",
      "Post-injury recovery"
    ]
  },
  {
    id: "sports-massage-joint-mobilisation",
    name: "Sports Massage with Joint Mobilisation",
    description: "Specialised sports massage combined with joint mobilisation techniques for enhanced performance and recovery.",
    price: 57,
    duration: "75 min",
    category: "Sports Therapy",
    features: [
      "Performance enhancement",
      "Joint mobility improvement",
      "Injury prevention",
      "Recovery acceleration"
    ],
    suitable: [
      "Professional athletes",
      "Weekend sports enthusiasts",
      "Pre/post competition care",
      "Joint stiffness issues"
    ]
  },
  {
    id: "therapeutic-massage",
    name: "Therapeutic Massage",
    description: "Holistic massage therapy designed to promote overall wellness and stress relief.",
    price: 60,
    duration: "60 min",
    category: "Wellness Therapy",
    features: [
      "Stress reduction",
      "Overall wellness focus",
      "Relaxation therapy",
      "Improved sleep quality"
    ],
    suitable: [
      "Stress management needs",
      "General wellness maintenance",
      "Sleep improvement goals",
      "Mental health support"
    ]
  },
  {
    id: "injury-treatment-rehabilitation",
    name: "Injury Treatment & Rehabilitation",
    description: "Comprehensive injury assessment and treatment with personalised rehabilitation programme.",
    price: 70,
    duration: "90 min",
    category: "Rehabilitation",
    features: [
      "Injury assessment",
      "Personalised treatment plan",
      "Rehabilitation exercises",
      "Progress monitoring"
    ],
    suitable: [
      "Recent injury recovery",
      "Chronic injury management",
      "Post-surgical rehabilitation",
      "Movement dysfunction"
    ]
  },
  {
    id: "dry-needling-therapy",
    name: "Dry Needling Therapy",
    description: "Precision needle therapy targeting trigger points for effective pain relief and muscle function improvement.",
    price: 65,
    duration: "45 min",
    category: "Specialist Therapy",
    features: [
      "Trigger point release",
      "Pain relief focused",
      "Muscle function improvement",
      "Precision treatment"
    ],
    suitable: [
      "Trigger point pain",
      "Muscle dysfunction",
      "Chronic pain conditions",
      "Sports injury recovery"
    ]
  },
  {
    id: "cryotherapy-session",
    name: "Cryotherapy Session",
    description: "Advanced cold therapy treatment for recovery, pain relief, and performance enhancement.",
    price: 40,
    duration: "15 min",
    category: "Recovery Therapy",
    features: [
      "Rapid recovery",
      "Inflammation reduction",
      "Pain relief",
      "Performance boost"
    ],
    suitable: [
      "Post-workout recovery",
      "Inflammation management",
      "Athletic performance",
      "Pain management"
    ]
  }
];

const Treatments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(treatments.map(t => t.category)))];
  
  const filteredTreatments = selectedCategory === "All" 
    ? treatments 
    : treatments.filter(t => t.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Massage Therapy": return <Heart className="w-5 h-5" />;
      case "Sports Therapy": return <Zap className="w-5 h-5" />;
      case "Wellness Therapy": return <Star className="w-5 h-5" />;
      case "Rehabilitation": return <Shield className="w-5 h-5" />;
      case "Specialist Therapy": return <Users className="w-5 h-5" />;
      case "Recovery Therapy": return <Zap className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  const handleBookTreatment = (treatment: Treatment) => {
    toast({
      title: "Booking initiated",
      description: `Starting booking process for ${treatment.name}`,
    });
    navigate(`/booking?treatment=${treatment.id}&type=treatment`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Professional Treatment Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our comprehensive range of musculoskeletal therapy treatments designed to relieve pain, 
            aid recovery, and improve mobility. Each session is tailored to support your body's needs and performance goals.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Treatments Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {filteredTreatments.map((treatment) => (
            <Card key={treatment.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getCategoryIcon(treatment.category)}
                      <Badge variant="secondary" className="text-sm">
                        {treatment.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold mb-2">{treatment.name}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {treatment.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-2xl font-bold text-primary">£{treatment.price}</div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{treatment.duration}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Features */}
                <div>
                  <h4 className="font-medium mb-2 text-sm">What's Included:</h4>
                  <ul className="space-y-1">
                    {treatment.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suitable For */}
                <div>
                  <h4 className="font-medium mb-2 text-sm">Suitable For:</h4>
                  <div className="text-xs text-muted-foreground">
                    {treatment.suitable[0]}
                    {treatment.suitable.length > 1 && ` and ${treatment.suitable.length - 1} more...`}
                  </div>
                </div>

                <Button 
                  onClick={() => handleBookTreatment(treatment)}
                  className="w-full"
                  size="lg"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now - £{treatment.price}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quality Assurance Section */}
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-center">Quality & Accreditation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Shield className="w-8 h-8 text-primary mx-auto" />
                <h3 className="font-semibold">Qualified Practitioners</h3>
                <p className="text-sm text-muted-foreground">
                  All treatments delivered by certified and experienced therapists
                </p>
              </div>
              <div className="space-y-2">
                <Star className="w-8 h-8 text-primary mx-auto" />
                <h3 className="font-semibold">Evidence-Based Practice</h3>
                <p className="text-sm text-muted-foreground">
                  Treatments based on latest research and clinical evidence
                </p>
              </div>
              <div className="space-y-2">
                <MapPin className="w-8 h-8 text-primary mx-auto" />
                <h3 className="font-semibold">Professional Environment</h3>
                <p className="text-sm text-muted-foreground">
                  Clean, comfortable, and fully equipped treatment facilities
                </p>
              </div>
            </div>
            
            {/* Certification badges */}
            <div className="flex justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">HIS Registered</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">ACAS Accredited</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Treatments;