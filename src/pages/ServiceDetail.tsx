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

// Import all service data - treatments, consultations, and scans
const allServicesData: Service[] = [
  // PHYSIOTHERAPY & SPORTS THERAPY
  {
    id: "deep-tissue-massage",
    name: "Deep Tissue Massage",
    description: "Targeted massage therapy focusing on deep muscle layers to relieve chronic tension and pain.",
    detailed: "Our deep tissue massage therapy targets the deeper layers of muscle and connective tissue. Using slow, deliberate strokes and deep finger pressure, our certified therapists work to break up scar tissue and physically break down muscle adhesions that can disrupt circulation and cause pain, limited range of motion, and inflammation. This treatment is particularly effective for chronic pain conditions and sports-related injuries.",
    price: 45,
    duration: "60 min",
    category: "Physiotherapy",
    type: "treatment",
    features: [
      "Deep muscle manipulation",
      "Pain relief focused treatment",
      "Chronic tension release",
      "Improved circulation",
      "Stress reduction benefits",
      "Enhanced flexibility and mobility"
    ],
    suitable: [
      "Chronic muscle pain sufferers",
      "Athletes with muscle tightness",
      "Office workers with tension",
      "Post-injury recovery patients",
      "Stress-related muscle tension"
    ],
    qualifications: ["Certified Massage Therapists", "Sports Therapy Qualified", "Continuing Education Certified"],
    preparation: ["Wear comfortable clothing", "Avoid heavy meals 2 hours before", "Stay hydrated", "Inform therapist of any injuries"]
  },
  {
    id: "sports-massage-joint-mobilisation",
    name: "Sports Massage with Joint Mobilisation",
    description: "Specialised sports massage combined with joint mobilisation techniques for enhanced performance and recovery.",
    detailed: "This comprehensive treatment combines therapeutic sports massage with targeted joint mobilisation techniques. Our sports therapists use evidence-based methods to enhance athletic performance, prevent injuries, and accelerate recovery. The session includes assessment of movement patterns, targeted muscle work, and joint mobilisation to restore optimal function.",
    price: 57,
    duration: "75 min",
    category: "Sports Therapy",
    type: "treatment",
    features: [
      "Performance enhancement focus",
      "Joint mobility improvement",
      "Injury prevention strategies",
      "Recovery acceleration",
      "Movement pattern assessment",
      "Personalised exercise advice"
    ],
    suitable: [
      "Professional athletes",
      "Weekend sports enthusiasts",
      "Pre/post competition care",
      "Joint stiffness issues",
      "Sports injury recovery"
    ],
    qualifications: ["Sports Therapy Degree", "Professional Body Registration", "Continued Professional Development"],
    preparation: ["Wear athletic clothing", "Bring training schedule", "List recent injuries", "Note performance goals"]
  },
  {
    id: "injury-treatment-rehabilitation",
    name: "Injury Treatment & Rehabilitation",
    description: "Comprehensive injury assessment and treatment with personalised rehabilitation programme.",
    detailed: "Our injury rehabilitation service provides complete assessment, treatment, and recovery planning for musculoskeletal injuries. Using evidence-based physiotherapy techniques, we develop personalised rehabilitation programmes that restore function, reduce pain, and prevent re-injury. Each session includes progress monitoring and programme adjustments.",
    price: 70,
    duration: "90 min",
    category: "Physiotherapy",
    type: "treatment",
    features: [
      "Comprehensive injury assessment",
      "Personalised treatment plan",
      "Progressive rehabilitation exercises",
      "Pain management strategies",
      "Functional movement training",
      "Return-to-activity planning"
    ],
    suitable: [
      "Recent injury recovery",
      "Chronic injury management",
      "Post-surgical rehabilitation",
      "Movement dysfunction",
      "Sports injury recovery"
    ],
    qualifications: ["Chartered Physiotherapists", "Specialist Injury Training", "Evidence-Based Practice"],
    preparation: ["Bring medical reports", "Wear suitable clothing", "Note pain levels", "List current limitations"]
  },
  {
    id: "dry-needling-therapy",
    name: "Dry Needling Therapy",
    description: "Precision needle therapy targeting trigger points for effective pain relief and muscle function improvement.",
    detailed: "Dry needling is a skilled intervention using fine needles to treat myofascial trigger points, muscular dysfunction, and pain syndromes. Our qualified practitioners use precise needle placement to deactivate trigger points, reduce muscle tension, and restore normal function. This evidence-based treatment is highly effective for chronic pain conditions.",
    price: 65,
    duration: "45 min",
    category: "Sports Therapy",
    type: "treatment",
    features: [
      "Trigger point deactivation",
      "Pain relief focused",
      "Muscle function improvement",
      "Precision needle placement",
      "Evidence-based technique",
      "Immediate pain relief"
    ],
    suitable: [
      "Trigger point pain",
      "Muscle dysfunction",
      "Chronic pain conditions",
      "Sports injury recovery",
      "Tension headaches"
    ],
    qualifications: ["Dry Needling Certification", "Anatomy Expertise", "Safety Training Certified"],
    preparation: ["Eat light meal before", "Avoid alcohol 24hrs prior", "Wear loose clothing", "Inform of needle phobia"]
  },

  // IV VITAMIN THERAPY & B12 SHOTS
  {
    id: "iv-vitamin-energy-boost",
    name: "Energy Boost IV Drip",
    description: "High-dose vitamin B complex with vitamin C to combat fatigue and boost energy levels naturally.",
    detailed: "Our Energy Boost IV therapy delivers essential vitamins and minerals directly into your bloodstream for maximum absorption and immediate effect. This powerful blend includes B-complex vitamins (B1, B6, B12), high-dose vitamin C, and amino acids that work together to enhance cellular energy production, improve mental clarity, and support overall vitality. Perfect for busy professionals, athletes, or anyone experiencing fatigue.",
    price: 120,
    duration: "45 min",
    category: "IV Vitamin Therapy",
    type: "treatment",
    features: [
      "Vitamin B12, B6, B1 complex",
      "High-dose vitamin C (1000mg)",
      "Immediate energy boost",
      "Enhanced mental clarity",
      "100% bioavailability",
      "Rapid nutrient delivery"
    ],
    suitable: [
      "Chronic fatigue sufferers",
      "Busy professionals",
      "Post-illness recovery",
      "Athletic performance enhancement",
      "Jet lag recovery",
      "Stress management"
    ],
    qualifications: ["Registered Nurses", "IV Therapy Certified", "Medical Supervision Available"],
    preparation: ["Eat light meal beforehand", "Stay well hydrated", "Wear comfortable clothing", "Allow time to relax"],
    equipment: ["Medical-grade IV equipment", "Sterile single-use materials", "Premium vitamin formulations"]
  },
  {
    id: "iv-immunity-booster",
    name: "Immunity Booster IV",
    description: "Powerful immune system support with high-dose vitamin C, zinc, and antioxidants.",
    detailed: "Strengthen your immune system with our comprehensive immunity-boosting IV therapy. This treatment delivers high-dose vitamin C, zinc, selenium, and powerful antioxidants like glutathione directly to your cells. Ideal for preventing illness, supporting recovery, or boosting immunity during stressful periods or seasonal changes.",
    price: 135,
    duration: "60 min",
    category: "IV Vitamin Therapy",
    type: "treatment",
    features: [
      "High-dose vitamin C (2000mg)",
      "Zinc and selenium minerals",
      "Glutathione antioxidant",
      "Immune system enhancement",
      "Stress response support",
      "Seasonal illness prevention"
    ],
    suitable: [
      "Frequent illness susceptibility",
      "Stress-related immunity issues",
      "Seasonal change support",
      "Pre-travel protection",
      "Recovery enhancement",
      "General wellness boost"
    ],
    qualifications: ["Medical Practitioners", "IV Therapy Specialists", "Nutritional Medicine Training"],
    preparation: ["Maintain good hydration", "Avoid alcohol 24 hours", "Light meal recommended", "List any allergies"]
  },
  {
    id: "iv-hangover-recovery",
    name: "Hangover Recovery IV",
    description: "Rapid rehydration and detoxification to relieve hangover symptoms and restore wellness.",
    detailed: "Recover quickly from overindulgence with our targeted hangover recovery IV. This treatment rapidly rehydrates your body, replenishes essential vitamins and minerals, and includes anti-nausea medication to restore you to optimal wellness. The perfect solution for post-celebration recovery or important events.",
    price: 99,
    duration: "30 min",
    category: "IV Vitamin Therapy",
    type: "treatment",
    features: [
      "Rapid rehydration therapy",
      "Anti-nausea medication",
      "B-vitamin replenishment",
      "Electrolyte balance restoration",
      "Headache relief support",
      "Quick symptom resolution"
    ],
    suitable: [
      "Hangover symptom relief",
      "Post-event recovery",
      "Dehydration treatment",
      "Quick wellness restoration",
      "Nausea management"
    ],
    qualifications: ["Registered Nurses", "Emergency Medicine Experience", "IV Therapy Certified"],
    preparation: ["No fasting required", "Comfortable clothing", "Bring sunglasses if light sensitive", "Stay calm and relaxed"]
  },
  {
    id: "b12-injection",
    name: "Vitamin B12 Injection",
    description: "Quick and effective B12 boost for energy, mood, and cognitive function improvement.",
    detailed: "Our vitamin B12 injection provides immediate bioavailable B12 (methylcobalamin) to support energy production, mood regulation, and cognitive function. This quick treatment is ideal for those with B12 deficiency, vegans/vegetarians, or anyone needing an energy boost. Effects are typically felt within hours and can last several weeks.",
    price: 25,
    duration: "10 min",
    category: "B12 Injections",
    type: "treatment",
    features: [
      "1000mcg methylcobalamin B12",
      "Instant absorption",
      "Energy level enhancement",
      "Mood improvement support",
      "Cognitive function boost",
      "Long-lasting effects"
    ],
    suitable: [
      "B12 deficiency diagnosis",
      "Vegetarians and vegans",
      "Low energy levels",
      "Cognitive support needs",
      "Mood enhancement",
      "Regular wellness maintenance"
    ],
    qualifications: ["Registered Nurses", "Injection Training", "Medical Oversight"],
    preparation: ["No special preparation", "Eat normally", "Stay hydrated", "Inform of allergies"]
  },

  // HORMONE THERAPY (HRT & TRT)
  {
    id: "hrt-consultation",
    name: "HRT Consultation & Treatment",
    description: "Comprehensive hormone replacement therapy assessment, monitoring, and ongoing support.",
    detailed: "Our HRT service provides complete hormone replacement therapy care for women experiencing menopausal symptoms or hormonal imbalances. We offer thorough assessment, personalized treatment protocols, and ongoing monitoring to optimize your hormonal health, improve quality of life, and manage symptoms effectively.",
    price: 150,
    duration: "60 min",
    category: "Hormone Therapy",
    type: "consultation",
    features: [
      "Comprehensive hormone assessment",
      "Personalized HRT protocol development",
      "Ongoing monitoring and adjustments",
      "Side effect management",
      "Lifestyle optimization advice",
      "Regular follow-up consultations"
    ],
    suitable: [
      "Menopausal symptoms",
      "Hormonal imbalance",
      "Low estrogen/progesterone",
      "Quality of life concerns",
      "Sleep disturbances",
      "Mood changes"
    ],
    qualifications: ["Hormone Specialist Doctors", "Menopause Society Certified", "Women's Health Expertise"],
    preparation: ["Complete symptom questionnaire", "Bring recent blood work", "List current medications", "Note symptom timeline"]
  },
  {
    id: "trt-consultation",
    name: "TRT Consultation & Treatment",
    description: "Testosterone replacement therapy assessment, treatment planning, and continuous monitoring.",
    detailed: "Our TRT service provides comprehensive testosterone replacement therapy for men with low testosterone levels. We offer detailed assessment, personalized treatment protocols, and continuous monitoring to optimize testosterone levels, improve energy, mood, and overall quality of life while ensuring safety and effectiveness.",
    price: 175,
    duration: "75 min",
    category: "Hormone Therapy",
    type: "consultation",
    features: [
      "Comprehensive testosterone assessment",
      "Treatment protocol design",
      "Regular monitoring and optimization",
      "Lifestyle factors evaluation",
      "Side effect prevention",
      "Long-term health planning"
    ],
    suitable: [
      "Low testosterone diagnosis",
      "Fatigue and low energy",
      "Decreased libido",
      "Muscle mass loss",
      "Mood changes",
      "Sleep quality issues"
    ],
    qualifications: ["Endocrinology Specialists", "Men's Health Experts", "Hormone Therapy Certified"],
    preparation: ["Fast for morning testosterone test", "List symptoms and timeline", "Bring previous results", "Note lifestyle factors"]
  },
  {
    id: "hormone-monitoring",
    name: "Hormone Level Monitoring",
    description: "Regular hormone level checks and treatment adjustments for optimal therapy outcomes.",
    detailed: "Essential monitoring service for patients on hormone replacement therapy. We provide comprehensive hormone panels, progress assessment, and treatment optimization to ensure you achieve the best possible outcomes from your HRT or TRT. Regular monitoring is crucial for safety and effectiveness.",
    price: 85,
    duration: "30 min",
    category: "Hormone Therapy",
    type: "treatment",
    features: [
      "Comprehensive hormone panel testing",
      "Treatment effectiveness evaluation",
      "Dosage optimization recommendations",
      "Side effect assessment",
      "Progress tracking",
      "Safety monitoring"
    ],
    suitable: [
      "Current HRT/TRT patients",
      "Treatment optimization needs",
      "Regular monitoring requirements",
      "Dosage adjustment evaluation",
      "Safety assessment"
    ],
    qualifications: ["Clinical Laboratory Specialists", "Hormone Therapy Experts", "Medical Interpretation"],
    preparation: ["Morning appointment preferred", "Fast if required", "Bring current medication list", "Note any side effects"]
  },

  // CHRONIC CONDITIONS MANAGEMENT
  {
    id: "thyroid-management",
    name: "Thyroid Condition Management",
    description: "Comprehensive thyroid assessment, treatment, and ongoing monitoring for optimal thyroid health.",
    detailed: "Complete thyroid care service including assessment, diagnosis, treatment, and ongoing management of thyroid conditions. We provide comprehensive thyroid function testing, medication optimization, lifestyle guidance, and regular monitoring to ensure optimal thyroid health and symptom management.",
    price: 120,
    duration: "60 min",
    category: "Chronic Conditions",
    type: "consultation",
    features: [
      "Complete thyroid function panel",
      "Medication optimization",
      "Lifestyle and dietary guidance",
      "Symptom management strategies",
      "Regular monitoring protocol",
      "Specialist referral if needed"
    ],
    suitable: [
      "Hypothyroidism diagnosis",
      "Hyperthyroidism management",
      "Hashimoto's disease",
      "Thyroid nodule monitoring",
      "Fatigue and weight issues",
      "Temperature regulation problems"
    ],
    qualifications: ["Endocrinology Specialists", "Thyroid Disorder Experts", "Metabolic Medicine Training"],
    preparation: ["Morning appointment optimal", "List all symptoms", "Bring previous thyroid tests", "Note family history"]
  },
  {
    id: "diabetes-support",
    name: "Diabetes Management Support",
    description: "Comprehensive diabetes care including monitoring, medication management, and lifestyle support.",
    detailed: "Comprehensive diabetes management service providing blood glucose monitoring, HbA1c tracking, medication optimization, and lifestyle support. Our diabetes specialists work with you to achieve optimal blood sugar control, prevent complications, and improve your quality of life through personalized care plans.",
    price: 95,
    duration: "45 min",
    category: "Chronic Conditions",
    type: "consultation",
    features: [
      "Blood glucose monitoring",
      "HbA1c tracking and optimization",
      "Medication review and adjustment",
      "Nutritional guidance",
      "Complication prevention",
      "Self-management education"
    ],
    suitable: [
      "Type 1 diabetes management",
      "Type 2 diabetes control",
      "Pre-diabetes intervention",
      "Gestational diabetes",
      "Blood sugar optimization",
      "Diabetic complication prevention"
    ],
    qualifications: ["Diabetologist Specialists", "Diabetes Educator Certification", "Endocrinology Training"],
    preparation: ["Bring glucose log", "List current medications", "Note dietary habits", "Bring previous HbA1c results"]
  },
  {
    id: "pcos-management",
    name: "PCOS Management Programme",
    description: "Holistic PCOS care including hormone balancing, symptom management, and fertility support.",
    detailed: "Comprehensive PCOS management programme addressing all aspects of polycystic ovary syndrome. We provide hormone assessment, insulin resistance evaluation, weight management support, fertility guidance, and lifestyle interventions to help manage symptoms and improve overall health and wellbeing.",
    price: 135,
    duration: "75 min",
    category: "Chronic Conditions",
    type: "consultation",
    features: [
      "Comprehensive hormone evaluation",
      "Insulin resistance assessment",
      "Weight management strategies",
      "Fertility optimization support",
      "Menstrual cycle regulation",
      "Lifestyle intervention planning"
    ],
    suitable: [
      "PCOS diagnosis and management",
      "Irregular menstrual periods",
      "Fertility challenges",
      "Weight management difficulties",
      "Insulin resistance",
      "Hirsutism and acne"
    ],
    qualifications: ["Reproductive Endocrinologists", "PCOS Specialists", "Women's Health Experts"],
    preparation: ["Track menstrual cycle", "Note weight changes", "List PCOS symptoms", "Bring hormone test results"]
  },

  // SMOKING CESSATION
  {
    id: "smoking-cessation-programme",
    name: "Complete Smoking Cessation Programme",
    description: "Comprehensive 12-week programme combining medical support, behavioral therapy, and ongoing monitoring.",
    detailed: "Our comprehensive smoking cessation programme provides complete support for your quit journey. The 12-week programme includes medical assessment, nicotine replacement therapy, behavioral counseling, weekly support sessions, and relapse prevention strategies. Our evidence-based approach significantly increases your chances of successfully quitting smoking.",
    price: 299,
    duration: "12 weeks",
    category: "Smoking Cessation",
    type: "treatment",
    features: [
      "Initial medical assessment",
      "Nicotine replacement therapy",
      "Weekly behavioral counseling",
      "Support group sessions",
      "Relapse prevention strategies",
      "Long-term follow-up support"
    ],
    suitable: [
      "Heavy smokers (>20/day)",
      "Multiple failed quit attempts",
      "Health concerns requiring cessation",
      "Strong motivation to quit",
      "Need for structured support",
      "Withdrawal management needs"
    ],
    qualifications: ["Smoking Cessation Specialists", "Behavioral Therapists", "Medical Practitioners"],
    preparation: ["Complete smoking history", "Set quit date", "Remove smoking triggers", "Prepare support network"]
  },
  {
    id: "nicotine-replacement-therapy",
    name: "Nicotine Replacement Therapy",
    description: "Medical-grade nicotine replacement therapy with professional monitoring and support.",
    detailed: "Professional nicotine replacement therapy using medical-grade products including patches, gums, lozenges, or inhalers. Our healthcare professionals monitor your progress, adjust dosages, and provide ongoing support to manage withdrawal symptoms and increase your chances of successfully quitting smoking.",
    price: 89,
    duration: "30 min",
    category: "Smoking Cessation",
    type: "treatment",
    features: [
      "Medical-grade NRT options",
      "Personalized dosage optimization",
      "Withdrawal symptom management",
      "Progress monitoring",
      "Side effect assessment",
      "Dosage adjustment support"
    ],
    suitable: [
      "Nicotine dependence",
      "Withdrawal symptom management",
      "Previous failed quit attempts",
      "Need for medical supervision",
      "Gradual cessation approach",
      "Combination therapy candidates"
    ],
    qualifications: ["Pharmacists", "Smoking Cessation Specialists", "Medical Supervision"],
    preparation: ["Complete nicotine assessment", "Stop smoking on start date", "Read product information", "Plan daily routine"]
  },
  {
    id: "quit-smoking-consultation",
    name: "Quit Smoking Consultation",
    description: "Initial assessment and personalized quit plan development with ongoing support options.",
    detailed: "Comprehensive initial consultation to assess your smoking habits, motivation, and health status. We develop a personalized quit plan tailored to your lifestyle, provide education about cessation methods, and connect you with appropriate support resources to maximize your chances of successfully quitting smoking.",
    price: 65,
    duration: "45 min",
    category: "Smoking Cessation",
    type: "consultation",
    features: [
      "Comprehensive smoking assessment",
      "Personalized quit plan development",
      "Cessation method education",
      "Motivation enhancement",
      "Support resource access",
      "Follow-up planning"
    ],
    suitable: [
      "Ready to quit smoking",
      "Need professional guidance",
      "Previous failed attempts",
      "Health-motivated quitting",
      "Want structured approach",
      "Seeking expert advice"
    ],
    qualifications: ["Health Psychologists", "Smoking Cessation Counselors", "Medical Practitioners"],
    preparation: ["Track smoking patterns", "Consider motivation levels", "List previous attempts", "Set realistic goals"]
  },

  // SPECIALIST CONSULTATIONS
  {
    id: "cardiology-consultation",
    name: "Cardiology Consultation",
    description: "Comprehensive heart health assessment with specialist cardiologist.",
    detailed: "Comprehensive cardiovascular assessment with our consultant cardiologist including detailed medical history review, physical examination, ECG interpretation, and cardiovascular risk stratification. We provide evidence-based recommendations for heart disease prevention, management of existing conditions, and lifestyle optimization for optimal heart health.",
    price: 200,
    duration: "45 min",
    category: "Specialist Consultation",
    type: "consultation",
    features: [
      "Comprehensive cardiac assessment",
      "ECG interpretation",
      "Cardiovascular risk analysis",
      "Treatment plan development",
      "Lifestyle recommendations",
      "Follow-up care coordination"
    ],
    suitable: [
      "Chest pain evaluation",
      "High blood pressure management",
      "Family history of heart disease",
      "Abnormal ECG results",
      "Cardiovascular risk assessment",
      "Heart palpitations"
    ],
    qualifications: ["Consultant Cardiologist", "GMC Registered", "Royal College Certified"],
    preparation: ["Bring recent test results", "List current medications", "Note symptom timeline", "Document family history"]
  },
  {
    id: "dermatology-consultation",
    name: "Dermatology Consultation",
    description: "Specialist skin assessment and treatment with consultant dermatologist.",
    detailed: "Expert dermatological consultation providing comprehensive skin assessment, diagnosis, and treatment planning. Our consultant dermatologists specialize in skin conditions, cancer screening, cosmetic concerns, and preventive skin care. We offer evidence-based treatments and ongoing monitoring for optimal skin health.",
    price: 180,
    duration: "30 min",
    category: "Specialist Consultation",
    type: "consultation",
    features: [
      "Complete skin examination",
      "Dermatoscopy assessment",
      "Skin cancer screening",
      "Treatment planning",
      "Cosmetic consultation",
      "Preventive care advice"
    ],
    suitable: [
      "Skin cancer screening",
      "Suspicious moles or lesions",
      "Chronic skin conditions",
      "Acne treatment",
      "Cosmetic concerns",
      "Preventive skin care"
    ],
    qualifications: ["Consultant Dermatologist", "Skin Cancer Specialist", "Cosmetic Dermatology"],
    preparation: ["Avoid makeup on consultation day", "List skin products used", "Note skin changes", "Bring photos of concerns"]
  },

  // DIAGNOSTIC SCANS
  {
    id: "ultrasound-scan",
    name: "Diagnostic Ultrasound Scan",
    description: "High-resolution ultrasound imaging for diagnostic purposes.",
    detailed: "State-of-the-art ultrasound scanning service providing detailed imaging for diagnostic assessment. Our qualified sonographers use advanced ultrasound technology to perform comprehensive scans with immediate preliminary results and consultant radiologist reporting within 24 hours.",
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
      "Soft tissue evaluation",
      "Organ assessment"
    ],
    qualifications: ["Qualified Sonographers", "Consultant Radiologists", "RCCP Accredited"],
    preparation: ["Fasting may be required", "Wear loose clothing", "Arrive 15 minutes early", "Bring referral letter"],
    equipment: ["Latest ultrasound technology", "High-frequency transducers", "Digital imaging systems"]
  },
  {
    id: "ecg-monitoring",
    name: "ECG Monitoring & Assessment",
    description: "Comprehensive heart rhythm monitoring and cardiac assessment.",
    detailed: "Advanced ECG monitoring service providing detailed assessment of heart rhythm and electrical activity. Our cardiac technicians perform comprehensive ECG recordings with immediate interpretation by qualified cardiologists. Ideal for detecting arrhythmias, heart conditions, and monitoring cardiac health.",
    price: 85,
    duration: "20 min",
    category: "Cardiac Monitoring",
    type: "scan",
    features: [
      "12-lead ECG recording",
      "Immediate rhythm analysis",
      "Cardiologist interpretation",
      "Arrhythmia detection",
      "Heart rate variability",
      "Detailed cardiac report"
    ],
    suitable: [
      "Heart palpitations",
      "Chest pain evaluation",
      "Arrhythmia screening",
      "Pre-operative assessment",
      "Cardiac monitoring",
      "Heart health check"
    ],
    qualifications: ["Cardiac Technicians", "Cardiologist Interpretation", "Clinical Physiology"],
    preparation: ["Avoid caffeine 4 hours before", "Wear loose clothing", "Remove chest jewelry", "Stay calm and relaxed"]
  },
  {
    id: "cancer-screening-scan",
    name: "Comprehensive Cancer Screening",
    description: "Advanced imaging and blood tests for early cancer detection.",
    detailed: "Comprehensive cancer screening programme using advanced imaging techniques and tumor marker blood tests for early detection. Our radiologists use state-of-the-art equipment to screen for common cancers, providing peace of mind and early intervention opportunities when needed.",
    price: 350,
    duration: "90 min",
    category: "Cancer Screening",
    type: "scan",
    features: [
      "Multi-organ imaging",
      "Tumor marker blood tests",
      "Early detection focus",
      "Consultant radiologist review",
      "Comprehensive screening report",
      "Follow-up recommendations"
    ],
    suitable: [
      "Family history of cancer",
      "Age-related screening",
      "Risk factor assessment",
      "Peace of mind screening",
      "Preventive health check",
      "Occupational exposure"
    ],
    qualifications: ["Consultant Radiologists", "Oncology Specialists", "Cancer Screening Experts"],
    preparation: ["Fast for 8 hours", "Avoid contrast allergies", "Bring previous scans", "Complete health questionnaire"]
  }
];

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const found = allServicesData.find(s => s.id === id);
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