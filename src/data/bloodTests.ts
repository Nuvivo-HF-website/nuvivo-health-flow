export interface BloodTestOption {
  type: 'clinic' | 'partner' | 'home';
  name: string;
  description: string;
  price: number;
  additionalCost: number;
}

export interface BloodTest {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  duration: string;
  description: string;
  biomarkers: string[];
  features: string[];
  suitableFor: string[];
  turnaroundTime: string;
  fastingRequired: boolean;
  image?: string;
  options: BloodTestOption[];
}

export const bloodTestCategories = [
  "General Health",
  "Performance & Sports",
  "Hormones & Fertility", 
  "Heart Health",
  "Nutrition & Metabolism",
  "Sleep & Fatigue",
  "Cancer Screening",
  "Specialty Testing"
];

export const bloodTests: BloodTest[] = [
  {
    id: "advanced-wellness",
    name: "Advanced Wellness Blood Panel",
    category: "General Health",
    basePrice: 249,
    duration: "30 min",
    description: "Comprehensive health assessment covering all major body systems. Perfect for annual health checks and early detection.",
    biomarkers: [
      "Full Blood Count", "Liver Function", "Kidney Function", "Lipid Profile", 
      "HbA1c", "Vitamin D", "Vitamin B12", "Folate", "Ferritin", "TSH", "Inflammation Markers"
    ],
    features: [
      "65+ biomarkers tested",
      "Doctor-reviewed results", 
      "Personalized health insights",
      "Nutritional recommendations"
    ],
    suitableFor: ["Adults seeking comprehensive health overview", "Preventive health monitoring", "Annual health checks"],
    turnaroundTime: "2-3 business days",
    fastingRequired: true,
    options: [
      {
        type: 'clinic',
        name: 'Livingston Clinic Visit',
        description: 'Visit our main clinic in Livingston',
        price: 249,
        additionalCost: 0
      },
      {
        type: 'partner',
        name: 'Partner Clinic Visit',
        description: 'Visit one of our partner clinics nationwide',
        price: 288,
        additionalCost: 39
      },
      {
        type: 'home',
        name: 'Home Visit',
        description: 'Professional phlebotomist visits your home',
        price: 308,
        additionalCost: 59
      }
    ]
  },
  {
    id: "advanced-athlete",
    name: "Advanced Athlete Health Panel", 
    category: "Performance & Sports",
    basePrice: 240,
    duration: "25 min",
    description: "Specialized testing for athletes and active individuals to optimize performance, recovery, and prevent injury.",
    biomarkers: [
      "Testosterone", "Cortisol", "Growth Hormone", "Iron Studies", "Vitamin D",
      "Magnesium", "CK (Muscle Damage)", "LDH", "Inflammatory Markers", "Metabolic Panel"
    ],
    features: [
      "Performance optimization insights",
      "Recovery monitoring",
      "Injury prevention markers",
      "Nutritional deficiency detection"
    ],
    suitableFor: ["Professional athletes", "Active individuals", "Fitness enthusiasts", "Sports teams"],
    turnaroundTime: "2-3 business days", 
    fastingRequired: true,
    options: [
      {
        type: 'clinic',
        name: 'Livingston Clinic Visit',
        description: 'Visit our main clinic in Livingston',
        price: 240,
        additionalCost: 0
      },
      {
        type: 'partner',
        name: 'Partner Clinic Visit',
        description: 'Visit one of our partner clinics nationwide',
        price: 279,
        additionalCost: 39
      },
      {
        type: 'home',
        name: 'Home Visit',
        description: 'Professional phlebotomist visits your home',
        price: 299,
        additionalCost: 59
      }
    ]
  },
  {
    id: "advanced-thyroid",
    name: "Advanced Thyroid Insight Panel",
    category: "Hormones & Fertility",
    basePrice: 189,
    duration: "20 min", 
    description: "Comprehensive thyroid function assessment including antibodies and reverse T3 for complete thyroid health picture.",
    biomarkers: [
      "TSH", "Free T4", "Free T3", "Reverse T3", "Anti-TPO Antibodies", 
      "Anti-Thyroglobulin Antibodies", "TSI (TSH Receptor Antibodies)"
    ],
    features: [
      "Complete thyroid function analysis",
      "Autoimmune thyroid detection", 
      "Metabolism assessment",
      "Weight management insights"
    ],
    suitableFor: ["Suspected thyroid disorders", "Weight management issues", "Fatigue and energy problems", "Family history of thyroid disease"],
    turnaroundTime: "3-5 business days",
    fastingRequired: false,
    options: [
      {
        type: 'clinic',
        name: 'Livingston Clinic Visit',
        description: 'Visit our main clinic in Livingston',
        price: 189,
        additionalCost: 0
      },
      {
        type: 'partner',
        name: 'Partner Clinic Visit',
        description: 'Visit one of our partner clinics nationwide',
        price: 228,
        additionalCost: 39
      },
      {
        type: 'home',
        name: 'Home Visit',
        description: 'Professional phlebotomist visits your home',
        price: 248,
        additionalCost: 59
      }
    ]
  },
  {
    id: "pregnancy-advanced",
    name: "Advanced Pregnancy Risk Panel",
    category: "Hormones & Fertility",
    basePrice: 300,
    duration: "25 min",
    description: "Comprehensive pre-pregnancy and early pregnancy health assessment to optimize maternal and fetal health.",
    biomarkers: [
      "Full Blood Count", "Blood Group & Rh", "Rubella Immunity", "Hepatitis B", "HIV", 
      "Syphilis", "Folate", "Vitamin D", "Thyroid Function", "Glucose", "Iron Studies"
    ],
    features: [
      "Pre-conception health optimization",
      "Infection screening",
      "Nutritional status assessment", 
      "Risk factor identification"
    ],
    suitableFor: ["Women planning pregnancy", "Early pregnancy screening", "Fertility optimization"],
    turnaroundTime: "3-5 business days",
    fastingRequired: true,
    options: [
      {
        type: 'clinic',
        name: 'Livingston Clinic Visit',
        description: 'Visit our main clinic in Livingston',
        price: 300,
        additionalCost: 0
      },
      {
        type: 'partner',
        name: 'Partner Clinic Visit',
        description: 'Visit one of our partner clinics nationwide',
        price: 339,
        additionalCost: 39
      },
      {
        type: 'home',
        name: 'Home Visit',
        description: 'Professional phlebotomist visits your home',
        price: 359,
        additionalCost: 59
      }
    ]
  },
  {
    id: "pregnancy-basic", 
    name: "Basic Pregnancy Risk Panel",
    category: "Hormones & Fertility",
    basePrice: 230,
    duration: "20 min",
    description: "Essential pregnancy screening tests for maternal and fetal health monitoring.",
    biomarkers: [
      "Full Blood Count", "Blood Group & Rh", "Rubella Immunity", "Hepatitis B", 
      "HIV", "Syphilis", "Glucose", "Thyroid Function"
    ],
    features: [
      "Essential pregnancy screening",
      "Infection detection",
      "Blood compatibility testing",
      "Basic health monitoring"
    ],
    suitableFor: ["Routine pregnancy screening", "Budget-conscious expectant mothers", "Follow-up testing"],
    turnaroundTime: "2-3 business days",
    fastingRequired: true,
    options: [
      {
        type: 'clinic',
        name: 'Livingston Clinic Visit',
        description: 'Visit our main clinic in Livingston',
        price: 230,
        additionalCost: 0
      },
      {
        type: 'partner',
        name: 'Partner Clinic Visit',
        description: 'Visit one of our partner clinics nationwide',
        price: 269,
        additionalCost: 39
      },
      {
        type: 'home',
        name: 'Home Visit',
        description: 'Professional phlebotomist visits your home',
        price: 289,
        additionalCost: 59
      }
    ]
  },
  {
    id: "allergy-intolerance",
    name: "Allergy & Intolerance Insight Panel",
    category: "Specialty Testing", 
    basePrice: 650,
    duration: "15 min",
    description: "Comprehensive testing for food allergies, environmental allergens, and intolerances affecting quality of life.",
    biomarkers: [
      "200+ Food Allergens", "Environmental Allergens", "Pollen Panel", "Dust Mites",
      "Pet Dander", "Mold Panel", "IgE & IgG Testing", "Histamine Levels"
    ],
    features: [
      "200+ allergens tested",
      "Food intolerance identification",
      "Environmental trigger detection",
      "Personalized avoidance recommendations"
    ],
    suitableFor: ["Unexplained symptoms", "Digestive issues", "Skin problems", "Respiratory symptoms"],
    turnaroundTime: "7-10 business days",
    fastingRequired: false,
    options: [
      {
        type: 'clinic',
        name: 'Livingston Clinic Visit',
        description: 'Visit our main clinic in Livingston',
        price: 650,
        additionalCost: 0
      },
      {
        type: 'partner',
        name: 'Partner Clinic Visit',
        description: 'Visit one of our partner clinics nationwide',
        price: 689,
        additionalCost: 39
      },
      {
        type: 'home',
        name: 'Home Visit',
        description: 'Professional phlebotomist visits your home',
        price: 709,
        additionalCost: 59
      }
    ]
  },
  {
    id: "bone-strength",
    name: "Bone Strength & Osteoporosis Risk Panel", 
    category: "General Health",
    basePrice: 169,
    duration: "15 min",
    description: "Assessment of bone health and osteoporosis risk factors for preventive bone care.",
    biomarkers: [
      "Vitamin D", "Calcium", "Phosphate", "Alkaline Phosphatase", "PTH", 
      "Osteocalcin", "CTX (Bone Resorption Marker)", "Magnesium"
    ],
    features: [
      "Bone density risk assessment",
      "Fracture risk evaluation", 
      "Calcium metabolism analysis",
      "Preventive care recommendations"
    ],
    suitableFor: ["Post-menopausal women", "Family history of osteoporosis", "Bone health monitoring", "Athletes with stress fractures"],
    turnaroundTime: "3-5 business days",
    fastingRequired: false,
    options: [
      {
        type: 'clinic',
        name: 'Livingston Clinic Visit',
        description: 'Visit our main clinic in Livingston',
        price: 169,
        additionalCost: 0
      },
      {
        type: 'partner',
        name: 'Partner Clinic Visit',
        description: 'Visit one of our partner clinics nationwide',
        price: 208,
        additionalCost: 39
      },
      {
        type: 'home',
        name: 'Home Visit',
        description: 'Professional phlebotomist visits your home',
        price: 228,
        additionalCost: 59
      }
    ]
  },
  {
    id: "cancer-markers",
    name: "Cancer Marker Awareness Panel",
    category: "Cancer Screening",
    basePrice: 199,
    duration: "20 min",
    description: "Early detection cancer markers for proactive health monitoring and peace of mind.",
    biomarkers: [
      "PSA (Prostate)", "CA 125 (Ovarian)", "CA 15-3 (Breast)", "CA 19-9 (Pancreatic)",
      "CEA (Colorectal)", "AFP (Liver)", "Beta-hCG", "LDH"
    ],
    features: [
      "Multiple cancer marker screening",
      "Early detection potential",
      "Risk assessment", 
      "Peace of mind testing"
    ],
    suitableFor: ["Family history of cancer", "Preventive screening", "High-risk individuals", "Regular monitoring"],
    turnaroundTime: "3-5 business days",
    fastingRequired: false,
    options: [
      {
        type: 'clinic',
        name: 'Livingston Clinic Visit',
        description: 'Visit our main clinic in Livingston',
        price: 199,
        additionalCost: 0
      },
      {
        type: 'partner',
        name: 'Partner Clinic Visit',
        description: 'Visit one of our partner clinics nationwide',
        price: 238,
        additionalCost: 39
      },
      {
        type: 'home',
        name: 'Home Visit',
        description: 'Professional phlebotomist visits your home',
        price: 258,
        additionalCost: 59
      }
    ]
  },
  {
    id: "sleep-fatigue",
    name: "Deep Sleep & Fatigue Investigation Panel",
    category: "Sleep & Fatigue",
    basePrice: 139,
    duration: "20 min",
    description: "Comprehensive investigation of sleep disorders and chronic fatigue causes.",
    biomarkers: [
      "Cortisol", "Melatonin", "Growth Hormone", "Thyroid Function", "Iron Studies",
      "Vitamin D", "B12", "Folate", "Inflammatory Markers", "Blood Sugar"
    ],
    features: [
      "Sleep quality assessment",
      "Fatigue cause identification",
      "Hormone balance evaluation",
      "Energy optimization insights"
    ],
    suitableFor: ["Chronic fatigue", "Sleep disorders", "Energy optimization", "Stress management"],
    turnaroundTime: "3-5 business days", 
    fastingRequired: true,
    options: [
      {
        type: 'clinic',
        name: 'Livingston Clinic Visit',
        description: 'Visit our main clinic in Livingston',
        price: 139,
        additionalCost: 0
      },
      {
        type: 'partner',
        name: 'Partner Clinic Visit',
        description: 'Visit one of our partner clinics nationwide',
        price: 178,
        additionalCost: 39
      },
      {
        type: 'home',
        name: 'Home Visit',
        description: 'Professional phlebotomist visits your home',
        price: 198,
        additionalCost: 59
      }
    ]
  },
  {
    id: "detox-toxin",
    name: "Detox & Toxin Exposure Panel",
    category: "Specialty Testing",
    basePrice: 179,
    duration: "15 min",
    description: "Assessment of toxic load and detoxification capacity for environmental health optimization.",
    biomarkers: [
      "Heavy Metals Panel", "Liver Detox Markers", "Glutathione", "Oxidative Stress Markers",
      "Phase I & II Detox Enzymes", "Environmental Toxin Markers"
    ],
    features: [
      "Heavy metal detection",
      "Detox capacity assessment", 
      "Environmental exposure evaluation",
      "Liver function optimization"
    ],
    suitableFor: ["Environmental exposure concerns", "Detox program monitoring", "Occupational health", "Wellness optimization"],
    turnaroundTime: "5-7 business days",
    fastingRequired: false,
    options: [
      {
        type: 'clinic',
        name: 'Livingston Clinic Visit',
        description: 'Visit our main clinic in Livingston',
        price: 179,
        additionalCost: 0
      },
      {
        type: 'partner',
        name: 'Partner Clinic Visit',
        description: 'Visit one of our partner clinics nationwide',
        price: 218,
        additionalCost: 39
      },
      {
        type: 'home',
        name: 'Home Visit',
        description: 'Professional phlebotomist visits your home',
        price: 238,
        additionalCost: 59
      }
    ]
  }
];

export const getTestsByCategory = (category: string): BloodTest[] => {
  if (category === "All") return bloodTests;
  return bloodTests.filter(test => test.category === category);
};

export const getTestById = (id: string): BloodTest | undefined => {
  return bloodTests.find(test => test.id === id);
};