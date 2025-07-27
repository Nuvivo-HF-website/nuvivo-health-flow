import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  // Physiotherapy & Sports Therapy
  {
    id: "deep-tissue-massage",
    name: "Deep Tissue Massage",
    description: "Targeted massage therapy focusing on deep muscle layers to relieve chronic tension and pain.",
    price: 45,
    duration: "60 min",
    category: "Physiotherapy",
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
    id: "injury-treatment-rehabilitation",
    name: "Injury Treatment & Rehabilitation",
    description: "Comprehensive injury assessment and treatment with personalised rehabilitation programme.",
    price: 70,
    duration: "90 min",
    category: "Physiotherapy",
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
    category: "Sports Therapy",
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

  // IV Vitamin Drips & B12 Shots
  {
    id: "iv-vitamin-energy-boost",
    name: "Energy Boost IV Drip",
    description: "High-dose vitamin B complex with vitamin C to combat fatigue and boost energy levels naturally.",
    price: 120,
    duration: "45 min",
    category: "IV Vitamin Therapy",
    features: [
      "Vitamin B12, B6, B1 complex",
      "High-dose vitamin C",
      "Immediate energy boost",
      "Enhanced mental clarity"
    ],
    suitable: [
      "Chronic fatigue sufferers",
      "Busy professionals",
      "Post-illness recovery",
      "Athletic performance"
    ]
  },
  {
    id: "iv-immunity-booster",
    name: "Immunity Booster IV",
    description: "Powerful immune system support with high-dose vitamin C, zinc, and antioxidants.",
    price: 135,
    duration: "60 min",
    category: "IV Vitamin Therapy",
    features: [
      "High-dose vitamin C (2000mg)",
      "Zinc and selenium",
      "Glutathione antioxidant",
      "Immune system enhancement"
    ],
    suitable: [
      "Frequent illness",
      "Stress-related immunity",
      "Seasonal support",
      "Pre-travel protection"
    ]
  },
  {
    id: "iv-hangover-recovery",
    name: "Hangover Recovery IV",
    description: "Rapid rehydration and detoxification to relieve hangover symptoms and restore wellness.",
    price: 99,
    duration: "30 min",
    category: "IV Vitamin Therapy",
    features: [
      "Rapid rehydration",
      "Anti-nausea medication",
      "B-vitamin replenishment",
      "Electrolyte balance"
    ],
    suitable: [
      "Hangover relief",
      "Event recovery",
      "Dehydration treatment",
      "Quick wellness boost"
    ]
  },
  {
    id: "b12-injection",
    name: "Vitamin B12 Injection",
    description: "Quick and effective B12 boost for energy, mood, and cognitive function improvement.",
    price: 25,
    duration: "10 min",
    category: "B12 Injections",
    features: [
      "1000mcg methylcobalamin",
      "Instant absorption",
      "Energy enhancement",
      "Mood improvement"
    ],
    suitable: [
      "B12 deficiency",
      "Vegetarians/vegans",
      "Low energy levels",
      "Cognitive support"
    ]
  },

  // HRT & TRT Support
  {
    id: "hrt-consultation",
    name: "HRT Consultation & Treatment",
    description: "Comprehensive hormone replacement therapy assessment, monitoring, and ongoing support.",
    price: 150,
    duration: "60 min",
    category: "Hormone Therapy",
    features: [
      "Hormone level assessment",
      "Personalised HRT plan",
      "Ongoing monitoring",
      "Side effect management"
    ],
    suitable: [
      "Menopausal symptoms",
      "Hormonal imbalance",
      "Low estrogen/progesterone",
      "Quality of life issues"
    ]
  },
  {
    id: "trt-consultation",
    name: "TRT Consultation & Treatment",
    description: "Testosterone replacement therapy assessment, treatment planning, and continuous monitoring.",
    price: 175,
    duration: "75 min",
    category: "Hormone Therapy",
    features: [
      "Testosterone level testing",
      "Treatment protocol design",
      "Regular monitoring",
      "Lifestyle optimization"
    ],
    suitable: [
      "Low testosterone",
      "Fatigue and low energy",
      "Decreased libido",
      "Muscle mass loss"
    ]
  },
  {
    id: "hormone-monitoring",
    name: "Hormone Level Monitoring",
    description: "Regular hormone level checks and treatment adjustments for optimal therapy outcomes.",
    price: 85,
    duration: "30 min",
    category: "Hormone Therapy",
    features: [
      "Comprehensive hormone panel",
      "Treatment adjustment",
      "Progress tracking",
      "Side effect assessment"
    ],
    suitable: [
      "Current HRT/TRT patients",
      "Treatment optimization",
      "Ongoing monitoring",
      "Dosage adjustments"
    ]
  },

  // Chronic Conditions Management
  {
    id: "thyroid-management",
    name: "Thyroid Condition Management",
    description: "Comprehensive thyroid assessment, treatment, and ongoing monitoring for optimal thyroid health.",
    price: 120,
    duration: "60 min",
    category: "Chronic Conditions",
    features: [
      "Complete thyroid panel",
      "Medication optimization",
      "Lifestyle guidance",
      "Regular monitoring"
    ],
    suitable: [
      "Hypothyroidism",
      "Hyperthyroidism",
      "Hashimoto's disease",
      "Thyroid nodules"
    ]
  },
  {
    id: "diabetes-support",
    name: "Diabetes Management Support",
    description: "Comprehensive diabetes care including monitoring, medication management, and lifestyle support.",
    price: 95,
    duration: "45 min",
    category: "Chronic Conditions",
    features: [
      "Blood glucose monitoring",
      "HbA1c tracking",
      "Medication review",
      "Dietary guidance"
    ],
    suitable: [
      "Type 1 diabetes",
      "Type 2 diabetes",
      "Pre-diabetes",
      "Gestational diabetes"
    ]
  },
  {
    id: "pcos-management",
    name: "PCOS Management Programme",
    description: "Holistic PCOS care including hormone balancing, symptom management, and fertility support.",
    price: 135,
    duration: "75 min",
    category: "Chronic Conditions",
    features: [
      "Hormone level assessment",
      "Insulin resistance testing",
      "Weight management support",
      "Fertility guidance"
    ],
    suitable: [
      "PCOS diagnosis",
      "Irregular periods",
      "Fertility issues",
      "Metabolic syndrome"
    ]
  },

  // Smoking Cessation
  {
    id: "smoking-cessation-programme",
    name: "Complete Smoking Cessation Programme",
    description: "Comprehensive 12-week programme combining medical support, behavioral therapy, and ongoing monitoring.",
    price: 299,
    duration: "12 weeks",
    category: "Smoking Cessation",
    features: [
      "Medical assessment",
      "Nicotine replacement therapy",
      "Behavioral counseling",
      "Weekly support sessions"
    ],
    suitable: [
      "Heavy smokers",
      "Multiple quit attempts",
      "Health concerns",
      "Strong motivation to quit"
    ]
  },
  {
    id: "nicotine-replacement-therapy",
    name: "Nicotine Replacement Therapy",
    description: "Medical-grade nicotine replacement therapy with professional monitoring and support.",
    price: 89,
    duration: "30 min",
    category: "Smoking Cessation",
    features: [
      "Prescription NRT options",
      "Dosage optimization",
      "Side effect monitoring",
      "Progress tracking"
    ],
    suitable: [
      "Nicotine dependence",
      "Withdrawal symptoms",
      "Previous failed attempts",
      "Medical supervision needed"
    ]
  },
  {
    id: "quit-smoking-consultation",
    name: "Quit Smoking Consultation",
    description: "Initial assessment and personalized quit plan development with ongoing support options.",
    price: 65,
    duration: "45 min",
    category: "Smoking Cessation",
    features: [
      "Smoking habit assessment",
      "Personalized quit plan",
      "Medication options review",
      "Support resource access"
    ],
    suitable: [
      "Ready to quit smoking",
      "Need professional guidance",
      "Previous failed attempts",
      "Health motivation"
    ]
  }
];

const Treatments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(treatments.map(t => t.category)))];
  
  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Map URL parameter to actual category names
      const categoryMap: { [key: string]: string } = {
        'iv-drips': 'IV Vitamin Therapy',
        'b12-shots': 'B12 Injections', 
        'hormones': 'Hormone Therapy',
        'chronic': 'Chronic Conditions',
        'smoking': 'Smoking Cessation',
        'physio': 'Physiotherapy',
        'sports': 'Sports Therapy'
      };
      
      const mappedCategory = categoryMap[categoryParam];
      if (mappedCategory && categories.includes(mappedCategory)) {
        setSelectedCategory(mappedCategory);
      }
    }
  }, [searchParams, categories]);
  
  const filteredTreatments = selectedCategory === "All" 
    ? treatments 
    : treatments.filter(t => t.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Physiotherapy": return <Heart className="w-5 h-5" />;
      case "Sports Therapy": return <Zap className="w-5 h-5" />;
      case "IV Vitamin Therapy": return <Zap className="w-5 h-5" />;
      case "B12 Injections": return <Zap className="w-5 h-5" />;
      case "Hormone Therapy": return <Users className="w-5 h-5" />;
      case "Chronic Conditions": return <Shield className="w-5 h-5" />;
      case "Smoking Cessation": return <CheckCircle className="w-5 h-5" />;
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
            Comprehensive Treatment Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From physiotherapy and sports therapy to IV vitamin treatments, hormone support, and chronic condition management. 
            Our expert practitioners provide personalized care to optimize your health and wellbeing.
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
                  onClick={() => navigate(`/service/${treatment.id}`)}
                  className="w-full"
                  size="lg"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Details - £{treatment.price}
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