export interface BiomarkerDetail {
  name: string;
  description: string;
  normalRange?: string;
  significance: string;
}

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
  biomarkerDetails: BiomarkerDetail[];
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
    description: "Comprehensive health assessment covering all major body systems. Perfect for annual health checks and early detection of potential health issues.",
    biomarkers: [
      "Full Blood Count", "Liver Function", "Kidney Function", "Lipid Profile", 
      "HbA1c", "Vitamin D", "Vitamin B12", "Folate", "Ferritin", "TSH", "Inflammation Markers"
    ],
    biomarkerDetails: [
      {
        name: "Full Blood Count (FBC)",
        description: "Comprehensive analysis of blood cells including red blood cells, white blood cells, and platelets",
        normalRange: "RBC: 4.5-5.5 x10¹²/L, WBC: 4-11 x10⁹/L, Platelets: 150-400 x10⁹/L",
        significance: "Detects anemia, infections, clotting disorders, blood cancers, and immune system disorders"
      },
      {
        name: "Liver Function Tests (LFTs)",
        description: "ALT, AST, GGT, Bilirubin, and Albumin levels to assess liver health and function",
        normalRange: "ALT: 7-56 U/L, AST: 10-40 U/L, GGT: 6-42 U/L",
        significance: "Identifies liver damage, hepatitis, fatty liver disease, and monitors medication effects"
      },
      {
        name: "Kidney Function Tests",
        description: "Creatinine, eGFR, and Urea levels to evaluate kidney filtration capacity",
        normalRange: "Creatinine: 60-110 μmol/L, eGFR: >90 mL/min, Urea: 2.5-7.5 mmol/L",
        significance: "Detects chronic kidney disease, acute kidney injury, and monitors kidney health"
      },
      {
        name: "Lipid Profile",
        description: "Total cholesterol, LDL, HDL, and triglycerides for cardiovascular risk assessment",
        normalRange: "Total cholesterol: <5.0 mmol/L, LDL: <3.0 mmol/L, HDL: >1.2 mmol/L",
        significance: "Assesses cardiovascular disease risk and guides preventive treatments"
      },
      {
        name: "HbA1c (Glycated Hemoglobin)",
        description: "Average blood glucose levels over the past 2-3 months",
        normalRange: "Non-diabetic: <42 mmol/mol (6.0%), Pre-diabetic: 42-47 mmol/mol",
        significance: "Diagnoses diabetes, pre-diabetes, and monitors long-term glucose control"
      },
      {
        name: "Vitamin D (25-OH)",
        description: "25-hydroxyvitamin D level indicating vitamin D status and bone health",
        normalRange: "Optimal: 75-200 nmol/L (30-80 ng/mL), Deficient: <50 nmol/L",
        significance: "Essential for bone health, immune function, muscle strength, and mood regulation"
      },
      {
        name: "Vitamin B12 (Cobalamin)",
        description: "Essential vitamin for nerve function and red blood cell formation",
        normalRange: "Normal: 200-900 ng/L, Deficient: <200 ng/L",
        significance: "Prevents pernicious anemia, supports nervous system, and energy metabolism"
      },
      {
        name: "Folate (Folic Acid)",
        description: "B-vitamin essential for DNA synthesis and red blood cell production",
        normalRange: "Normal: 4.0-18.0 μg/L, Deficient: <4.0 μg/L",
        significance: "Prevents birth defects, supports cell division, and prevents megaloblastic anemia"
      },
      {
        name: "Ferritin",
        description: "Iron storage protein indicating body's iron reserves",
        normalRange: "Men: 30-400 μg/L, Women: 15-150 μg/L",
        significance: "Diagnoses iron deficiency anemia and iron overload conditions (hemochromatosis)"
      },
      {
        name: "TSH (Thyroid Stimulating Hormone)",
        description: "Hormone that regulates thyroid function and metabolism",
        normalRange: "Normal: 0.27-4.2 mIU/L",
        significance: "Screens for hyperthyroidism, hypothyroidism, and thyroid disorders"
      },
      {
        name: "Inflammation Markers (CRP & ESR)",
        description: "C-Reactive Protein and Erythrocyte Sedimentation Rate indicating inflammation",
        normalRange: "CRP: <3.0 mg/L, ESR: <30 mm/hr",
        significance: "Detects infections, autoimmune diseases, and chronic inflammatory conditions"
      }
    ],
    features: [
      "65+ biomarkers tested",
      "Doctor-reviewed results with detailed analysis", 
      "Personalized health insights and recommendations",
      "Nutritional guidance and supplement advice"
    ],
    suitableFor: ["Adults seeking comprehensive health overview", "Preventive health monitoring", "Annual health checks", "Executive health screenings"],
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
    description: "Specialized testing for athletes and active individuals to optimize performance, enhance recovery, and prevent sports-related injuries through comprehensive biomarker analysis.",
    biomarkers: [
      "Testosterone", "Cortisol", "Growth Hormone", "Iron Studies", "Vitamin D",
      "Magnesium", "CK (Muscle Damage)", "LDH", "Inflammatory Markers", "Metabolic Panel"
    ],
    biomarkerDetails: [
      {
        name: "Testosterone (Total & Free)",
        description: "Primary male hormone essential for muscle mass, strength, and recovery",
        normalRange: "Men: 8.64-29.0 nmol/L, Women: 0.3-1.7 nmol/L",
        significance: "Critical for muscle protein synthesis, bone density, and athletic performance"
      },
      {
        name: "Cortisol",
        description: "Stress hormone that affects recovery, inflammation, and energy metabolism",
        normalRange: "Morning: 140-700 nmol/L, Evening: <280 nmol/L",
        significance: "Indicates training stress, recovery status, and overtraining syndrome risk"
      },
      {
        name: "Growth Hormone (IGF-1)",
        description: "Hormone essential for muscle growth, repair, and recovery",
        normalRange: "Age-dependent: 13-40 nmol/L (adults)",
        significance: "Promotes muscle recovery, fat metabolism, and tissue repair after exercise"
      },
      {
        name: "Iron Studies (Ferritin, Iron, TIBC)",
        description: "Comprehensive iron status assessment for oxygen transport and energy",
        normalRange: "Ferritin: 30-400 μg/L, Iron: 14-28 μmol/L",
        significance: "Essential for oxygen delivery to muscles and energy production"
      },
      {
        name: "Vitamin D (25-OH)",
        description: "Hormone crucial for bone health, muscle function, and immune system",
        normalRange: "Optimal for athletes: 75-200 nmol/L",
        significance: "Supports muscle strength, bone density, and reduces injury risk"
      },
      {
        name: "Magnesium",
        description: "Essential mineral for muscle function, energy production, and recovery",
        normalRange: "0.75-1.05 mmol/L",
        significance: "Prevents muscle cramps, supports energy metabolism, and aids recovery"
      },
      {
        name: "Creatine Kinase (CK)",
        description: "Enzyme released from muscles indicating muscle damage or breakdown",
        normalRange: "Men: 39-308 U/L, Women: 26-192 U/L",
        significance: "Monitors training intensity, muscle damage, and recovery needs"
      },
      {
        name: "Lactate Dehydrogenase (LDH)",
        description: "Enzyme indicating tissue damage and energy metabolism",
        normalRange: "120-246 U/L",
        significance: "Assesses muscle damage, fatigue levels, and metabolic stress"
      },
      {
        name: "Inflammatory Markers (CRP, IL-6)",
        description: "Proteins indicating inflammation and recovery status",
        normalRange: "CRP: <3.0 mg/L, IL-6: <2.0 pg/mL",
        significance: "Monitors training stress, injury risk, and recovery adequacy"
      },
      {
        name: "Metabolic Panel",
        description: "Glucose, electrolytes, and acid-base balance for energy metabolism",
        normalRange: "Glucose: 3.9-7.8 mmol/L, Sodium: 136-145 mmol/L",
        significance: "Optimizes energy utilization, hydration status, and performance"
      }
    ],
    features: [
      "Performance optimization insights",
      "Recovery monitoring and guidance",
      "Injury prevention markers and analysis",
      "Nutritional deficiency detection and correction"
    ],
    suitableFor: ["Professional athletes", "Active individuals", "Fitness enthusiasts", "Sports teams", "Endurance athletes"],
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
    description: "Comprehensive thyroid function assessment including antibodies and reverse T3 for complete thyroid health evaluation and metabolism optimization.",
    biomarkers: [
      "TSH", "Free T4", "Free T3", "Reverse T3", "Anti-TPO Antibodies", 
      "Anti-Thyroglobulin Antibodies", "TSI (TSH Receptor Antibodies)"
    ],
    biomarkerDetails: [
      {
        name: "TSH (Thyroid Stimulating Hormone)",
        description: "Pituitary hormone that regulates thyroid gland function",
        normalRange: "0.27-4.2 mIU/L, Optimal: 1.0-2.5 mIU/L",
        significance: "First-line screening for thyroid disorders; elevated in hypothyroidism"
      },
      {
        name: "Free T4 (Thyroxine)",
        description: "Active thyroid hormone that regulates metabolism and energy production",
        normalRange: "12-22 pmol/L",
        significance: "Assesses thyroid gland function and metabolic rate regulation"
      },
      {
        name: "Free T3 (Triiodothyronine)",
        description: "Most active thyroid hormone affecting metabolism and cellular function",
        normalRange: "3.1-6.8 pmol/L",
        significance: "Evaluates active thyroid hormone levels and conversion efficiency"
      },
      {
        name: "Reverse T3 (rT3)",
        description: "Inactive form of T3 that can block thyroid hormone activity",
        normalRange: "0.14-0.54 nmol/L",
        significance: "Indicates thyroid hormone resistance and metabolic dysfunction"
      },
      {
        name: "Anti-TPO Antibodies",
        description: "Antibodies against thyroid peroxidase enzyme indicating autoimmune activity",
        normalRange: "<34 kIU/L",
        significance: "Diagnoses Hashimoto's thyroiditis and autoimmune thyroid disease"
      },
      {
        name: "Anti-Thyroglobulin Antibodies",
        description: "Antibodies against thyroglobulin protein in thyroid tissue",
        normalRange: "<115 kIU/L",
        significance: "Detects autoimmune thyroid conditions and monitors thyroid cancer"
      },
      {
        name: "TSI (TSH Receptor Antibodies)",
        description: "Antibodies that stimulate thyroid hormone production",
        normalRange: "<140% of baseline",
        significance: "Diagnoses Graves' disease and monitors hyperthyroid treatment"
      }
    ],
    features: [
      "Complete thyroid function analysis",
      "Autoimmune thyroid detection", 
      "Metabolism assessment and optimization",
      "Weight management insights and guidance"
    ],
    suitableFor: ["Suspected thyroid disorders", "Weight management issues", "Fatigue and energy problems", "Family history of thyroid disease", "Fertility concerns"],
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
    description: "Comprehensive pre-pregnancy and early pregnancy health assessment to optimize maternal and fetal health through detailed screening and risk evaluation.",
    biomarkers: [
      "Full Blood Count", "Blood Group & Rh", "Rubella Immunity", "Hepatitis B", "HIV", 
      "Syphilis", "Folate", "Vitamin D", "Thyroid Function", "Glucose", "Iron Studies"
    ],
    biomarkerDetails: [
      {
        name: "Full Blood Count (FBC)",
        description: "Complete blood cell analysis for anemia detection and general health",
        normalRange: "Hemoglobin: 110-140 g/L (pregnancy)",
        significance: "Detects anemia, infections, and blood disorders affecting pregnancy"
      },
      {
        name: "Blood Group & Rh Factor",
        description: "ABO blood group and Rhesus factor determination",
        normalRange: "A/B/AB/O with Rh positive/negative",
        significance: "Prevents hemolytic disease and ensures safe blood transfusion"
      },
      {
        name: "Rubella Immunity (IgG)",
        description: "Antibodies against rubella virus indicating immunity status",
        normalRange: "Immune: >15 IU/mL",
        significance: "Prevents congenital rubella syndrome and birth defects"
      },
      {
        name: "Hepatitis B Surface Antigen",
        description: "Screening for hepatitis B virus infection",
        normalRange: "Negative",
        significance: "Prevents mother-to-child transmission of hepatitis B"
      },
      {
        name: "HIV Antibodies",
        description: "Screening for human immunodeficiency virus",
        normalRange: "Negative",
        significance: "Essential for preventing mother-to-child HIV transmission"
      },
      {
        name: "Syphilis (VDRL/RPR)",
        description: "Screening for syphilis bacterial infection",
        normalRange: "Non-reactive",
        significance: "Prevents congenital syphilis and pregnancy complications"
      },
      {
        name: "Folate (Folic Acid)",
        description: "Essential B-vitamin for fetal neural tube development",
        normalRange: "Optimal: >20 nmol/L",
        significance: "Prevents neural tube defects and supports fetal development"
      },
      {
        name: "Vitamin D (25-OH)",
        description: "Vitamin D status affecting maternal and fetal bone health",
        normalRange: "Optimal: 75-200 nmol/L",
        significance: "Supports fetal bone development and maternal immune function"
      },
      {
        name: "Thyroid Function (TSH, T4)",
        description: "Thyroid hormones affecting pregnancy and fetal development",
        normalRange: "TSH: 0.1-2.5 mIU/L (first trimester)",
        significance: "Prevents pregnancy complications and supports fetal brain development"
      },
      {
        name: "Glucose (Random/Fasting)",
        description: "Blood sugar levels for gestational diabetes screening",
        normalRange: "Fasting: <5.1 mmol/L",
        significance: "Detects gestational diabetes and prevents pregnancy complications"
      },
      {
        name: "Iron Studies (Ferritin, Iron)",
        description: "Iron status assessment for anemia prevention",
        normalRange: "Ferritin: >30 μg/L",
        significance: "Prevents iron deficiency anemia during pregnancy"
      }
    ],
    features: [
      "Pre-conception health optimization",
      "Comprehensive infection screening",
      "Nutritional status assessment", 
      "Risk factor identification and management"
    ],
    suitableFor: ["Women planning pregnancy", "Early pregnancy screening", "Fertility optimization", "High-risk pregnancy monitoring"],
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
    description: "Essential pregnancy screening tests for maternal and fetal health monitoring, covering fundamental health markers and infection screening.",
    biomarkers: [
      "Full Blood Count", "Blood Group & Rh", "Rubella Immunity", "Hepatitis B", 
      "HIV", "Syphilis", "Glucose", "Thyroid Function"
    ],
    biomarkerDetails: [
      {
        name: "Full Blood Count (FBC)",
        description: "Complete blood cell analysis including hemoglobin and platelet count",
        normalRange: "Hemoglobin: 110-140 g/L (pregnancy)",
        significance: "Screens for anemia, infections, and blood clotting disorders"
      },
      {
        name: "Blood Group & Rh Factor",
        description: "ABO blood typing and Rhesus factor determination",
        normalRange: "A/B/AB/O with Rh positive/negative",
        significance: "Critical for emergency care and preventing Rh incompatibility"
      },
      {
        name: "Rubella Immunity (IgG)",
        description: "Protective antibodies against rubella (German measles)",
        normalRange: "Immune: >15 IU/mL",
        significance: "Ensures protection against congenital rubella syndrome"
      },
      {
        name: "Hepatitis B Surface Antigen",
        description: "Active hepatitis B infection screening",
        normalRange: "Negative",
        significance: "Prevents vertical transmission to baby during delivery"
      },
      {
        name: "HIV Antibodies",
        description: "Human immunodeficiency virus screening test",
        normalRange: "Negative",
        significance: "Enables interventions to prevent mother-to-child transmission"
      },
      {
        name: "Syphilis (VDRL/RPR)",
        description: "Screening for Treponema pallidum bacterial infection",
        normalRange: "Non-reactive",
        significance: "Prevents congenital syphilis and stillbirth"
      },
      {
        name: "Glucose (Random)",
        description: "Blood sugar measurement for diabetes screening",
        normalRange: "Random: <11.1 mmol/L",
        significance: "Early detection of gestational diabetes mellitus"
      },
      {
        name: "Thyroid Function (TSH)",
        description: "Thyroid stimulating hormone for metabolic assessment",
        normalRange: "0.1-2.5 mIU/L (first trimester)",
        significance: "Maintains optimal metabolism for maternal and fetal health"
      }
    ],
    features: [
      "Essential pregnancy screening",
      "Infection detection and prevention",
      "Blood compatibility testing",
      "Basic metabolic health monitoring"
    ],
    suitableFor: ["Routine pregnancy screening", "Budget-conscious expectant mothers", "Follow-up testing", "Early pregnancy confirmation"],
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
    description: "Comprehensive testing for food allergies, environmental allergens, and intolerances affecting quality of life through advanced IgE and IgG analysis.",
    biomarkers: [
      "200+ Food Allergens", "Environmental Allergens", "Pollen Panel", "Dust Mites",
      "Pet Dander", "Mold Panel", "IgE & IgG Testing", "Histamine Levels"
    ],
    biomarkerDetails: [
      {
        name: "Food Allergen Panel (200+)",
        description: "Comprehensive testing for common and uncommon food allergens",
        normalRange: "Class 0-1: Negative/Low, Class 2+: Significant",
        significance: "Identifies specific foods causing allergic reactions and symptoms"
      },
      {
        name: "Environmental Allergens",
        description: "Outdoor and indoor environmental triggers including grasses and trees",
        normalRange: "IgE <0.35 kU/L: Negative",
        significance: "Determines seasonal and perennial allergy triggers"
      },
      {
        name: "Pollen Panel (Trees, Grasses, Weeds)",
        description: "Specific IgE testing for pollens causing hay fever",
        normalRange: "Class 0-1: Minimal reactivity",
        significance: "Guides seasonal allergy management and treatment timing"
      },
      {
        name: "Dust Mite Allergens",
        description: "Der p1, Der f1, and other house dust mite proteins",
        normalRange: "IgE <0.35 kU/L: Negative",
        significance: "Major cause of year-round allergic rhinitis and asthma"
      },
      {
        name: "Pet Dander (Cat, Dog, Others)",
        description: "Animal proteins causing allergic reactions",
        normalRange: "IgE <0.35 kU/L: Negative",
        significance: "Helps determine pet ownership compatibility and exposure management"
      },
      {
        name: "Mold Panel (Aspergillus, Alternaria, etc.)",
        description: "Fungal allergens from indoor and outdoor molds",
        normalRange: "IgE <0.35 kU/L: Negative",
        significance: "Identifies mold sensitivities affecting respiratory health"
      },
      {
        name: "IgE (Immediate Hypersensitivity)",
        description: "Antibodies causing immediate allergic reactions",
        normalRange: "Total IgE: <100 kU/L",
        significance: "Mediates acute allergic reactions including anaphylaxis"
      },
      {
        name: "IgG (Food Intolerance)",
        description: "Antibodies indicating delayed food sensitivity reactions",
        normalRange: "Varies by specific food",
        significance: "Identifies foods causing delayed symptoms like digestive issues"
      },
      {
        name: "Histamine Levels",
        description: "Chemical mediator of allergic reactions and inflammation",
        normalRange: "<1.0 ng/mL",
        significance: "Indicates mast cell activation and histamine intolerance"
      }
    ],
    features: [
      "200+ allergens tested comprehensively",
      "Food intolerance identification and guidance",
      "Environmental trigger detection",
      "Personalized avoidance recommendations and management plans"
    ],
    suitableFor: ["Unexplained symptoms", "Digestive issues", "Skin problems", "Respiratory symptoms", "Eczema and dermatitis"],
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
    description: "Assessment of bone health and osteoporosis risk factors for preventive bone care and fracture risk evaluation through comprehensive bone metabolism analysis.",
    biomarkers: [
      "Vitamin D", "Calcium", "Phosphate", "Alkaline Phosphatase", "PTH", 
      "Osteocalcin", "CTX (Bone Resorption Marker)", "Magnesium"
    ],
    biomarkerDetails: [
      {
        name: "Vitamin D (25-OH)",
        description: "Essential hormone for calcium absorption and bone mineralization",
        normalRange: "Optimal: 75-200 nmol/L (30-80 ng/mL)",
        significance: "Critical for bone strength, muscle function, and fracture prevention"
      },
      {
        name: "Calcium (Total & Ionized)",
        description: "Primary mineral component of bones and teeth",
        normalRange: "Total: 2.20-2.60 mmol/L, Ionized: 1.15-1.29 mmol/L",
        significance: "Essential for bone structure, muscle function, and nerve transmission"
      },
      {
        name: "Phosphate",
        description: "Mineral working with calcium for bone and teeth formation",
        normalRange: "0.80-1.50 mmol/L",
        significance: "Maintains bone mineralization and energy metabolism"
      },
      {
        name: "Alkaline Phosphatase (Bone-specific)",
        description: "Enzyme indicating bone formation and osteoblast activity",
        normalRange: "30-130 U/L (varies with age/gender)",
        significance: "Measures bone formation rate and metabolic bone disease"
      },
      {
        name: "PTH (Parathyroid Hormone)",
        description: "Hormone regulating calcium and phosphate balance",
        normalRange: "1.6-6.9 pmol/L",
        significance: "Controls calcium homeostasis and bone remodeling"
      },
      {
        name: "Osteocalcin",
        description: "Protein produced by osteoblasts during bone formation",
        normalRange: "Men: 5.8-14.0 ng/mL, Women: 1.5-11.0 ng/mL",
        significance: "Specific marker of bone formation and turnover"
      },
      {
        name: "CTX (C-Terminal Telopeptide)",
        description: "Collagen breakdown product indicating bone resorption",
        normalRange: "Men: 0.142-0.584 ng/mL, Women: 0.112-0.738 ng/mL",
        significance: "Measures bone destruction rate and osteoporosis risk"
      },
      {
        name: "Magnesium",
        description: "Essential mineral for bone structure and calcium metabolism",
        normalRange: "0.75-1.05 mmol/L",
        significance: "Supports bone mineralization and calcium absorption"
      }
    ],
    features: [
      "Bone density risk assessment",
      "Fracture risk evaluation and prediction", 
      "Calcium metabolism analysis",
      "Preventive care recommendations and monitoring"
    ],
    suitableFor: ["Post-menopausal women", "Family history of osteoporosis", "Bone health monitoring", "Athletes with stress fractures", "Long-term steroid users"],
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
    description: "Early detection cancer markers for proactive health monitoring and peace of mind through comprehensive tumor marker analysis and risk assessment.",
    biomarkers: [
      "PSA (Prostate)", "CA 125 (Ovarian)", "CA 15-3 (Breast)", "CA 19-9 (Pancreatic)",
      "CEA (Colorectal)", "AFP (Liver)", "Beta-hCG", "LDH"
    ],
    biomarkerDetails: [
      {
        name: "PSA (Prostate Specific Antigen)",
        description: "Protein produced by prostate gland cells, elevated in prostate conditions",
        normalRange: "Age 40-49: <2.5 ng/mL, Age 50-59: <3.5 ng/mL, Age 60+: <4.0 ng/mL",
        significance: "Screening for prostate cancer and monitoring treatment response"
      },
      {
        name: "CA 125 (Cancer Antigen 125)",
        description: "Protein elevated in ovarian and other gynecological cancers",
        normalRange: "<35 U/mL",
        significance: "Ovarian cancer screening and monitoring, also elevated in endometriosis"
      },
      {
        name: "CA 15-3 (Cancer Antigen 15-3)",
        description: "Mucin protein elevated in breast cancer and metastases",
        normalRange: "<30 U/mL",
        significance: "Breast cancer monitoring and treatment response evaluation"
      },
      {
        name: "CA 19-9 (Cancer Antigen 19-9)",
        description: "Carbohydrate antigen elevated in pancreatic and biliary cancers",
        normalRange: "<37 U/mL",
        significance: "Pancreatic cancer screening and monitoring digestive tract tumors"
      },
      {
        name: "CEA (Carcinoembryonic Antigen)",
        description: "Protein elevated in colorectal and other gastrointestinal cancers",
        normalRange: "Non-smokers: <3.0 ng/mL, Smokers: <5.0 ng/mL",
        significance: "Colorectal cancer monitoring and treatment response assessment"
      },
      {
        name: "AFP (Alpha-Fetoprotein)",
        description: "Protein elevated in liver cancer and certain testicular cancers",
        normalRange: "<10 ng/mL",
        significance: "Liver cancer screening and monitoring, testicular cancer detection"
      },
      {
        name: "Beta-hCG (Human Chorionic Gonadotropin)",
        description: "Hormone elevated in certain cancers and pregnancy",
        normalRange: "Men: <2.0 mIU/mL, Non-pregnant women: <5.0 mIU/mL",
        significance: "Testicular and ovarian cancer detection and monitoring"
      },
      {
        name: "LDH (Lactate Dehydrogenase)",
        description: "Enzyme elevated in various cancers and tissue damage",
        normalRange: "120-246 U/L",
        significance: "General tumor marker for various cancers and treatment monitoring"
      }
    ],
    features: [
      "Multiple cancer marker screening",
      "Early detection potential assessment",
      "Risk assessment and trending", 
      "Peace of mind testing with expert interpretation"
    ],
    suitableFor: ["Family history of cancer", "Preventive screening", "High-risk individuals", "Regular monitoring", "Cancer survivors"],
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
    description: "Comprehensive investigation of sleep disorders and chronic fatigue causes through detailed hormone and nutritional analysis to optimize energy and sleep quality.",
    biomarkers: [
      "Cortisol", "Melatonin", "Growth Hormone", "Thyroid Function", "Iron Studies",
      "Vitamin D", "B12", "Folate", "Inflammatory Markers", "Blood Sugar"
    ],
    biomarkerDetails: [
      {
        name: "Cortisol (Morning & Evening)",
        description: "Stress hormone following circadian rhythm, affecting sleep-wake cycles",
        normalRange: "Morning: 140-700 nmol/L, Evening: <280 nmol/L",
        significance: "Regulates sleep patterns, energy levels, and stress response"
      },
      {
        name: "Melatonin",
        description: "Sleep hormone regulating circadian rhythms and sleep quality",
        normalRange: "Nighttime: 10-80 pg/mL, Daytime: <10 pg/mL",
        significance: "Controls sleep-wake cycle and sleep quality optimization"
      },
      {
        name: "Growth Hormone (IGF-1)",
        description: "Hormone essential for tissue repair and recovery during sleep",
        normalRange: "13-40 nmol/L (age-dependent)",
        significance: "Promotes deep sleep, tissue repair, and energy restoration"
      },
      {
        name: "Thyroid Function (TSH, T3, T4)",
        description: "Hormones regulating metabolism and energy production",
        normalRange: "TSH: 0.27-4.2 mIU/L, T4: 12-22 pmol/L",
        significance: "Controls metabolic rate, energy levels, and sleep quality"
      },
      {
        name: "Iron Studies (Ferritin, Iron, TIBC)",
        description: "Iron status affecting oxygen transport and energy metabolism",
        normalRange: "Ferritin: 15-150 μg/L, Iron: 14-28 μmol/L",
        significance: "Prevents fatigue from iron deficiency and restless leg syndrome"
      },
      {
        name: "Vitamin D (25-OH)",
        description: "Hormone affecting sleep regulation and energy production",
        normalRange: "Optimal: 75-200 nmol/L",
        significance: "Supports sleep quality, mood regulation, and energy levels"
      },
      {
        name: "Vitamin B12 (Cobalamin)",
        description: "Essential vitamin for nerve function and energy metabolism",
        normalRange: "200-900 ng/L",
        significance: "Prevents fatigue, supports nervous system, and energy production"
      },
      {
        name: "Folate (Folic Acid)",
        description: "B-vitamin essential for energy metabolism and neurotransmitter synthesis",
        normalRange: "4.0-18.0 μg/L",
        significance: "Supports energy production and nervous system function"
      },
      {
        name: "Inflammatory Markers (CRP, ESR)",
        description: "Proteins indicating inflammation affecting sleep and energy",
        normalRange: "CRP: <3.0 mg/L, ESR: <30 mm/hr",
        significance: "Chronic inflammation disrupts sleep and causes fatigue"
      },
      {
        name: "Blood Sugar (Glucose, HbA1c)",
        description: "Glucose levels affecting energy stability and sleep quality",
        normalRange: "Fasting glucose: 3.9-7.8 mmol/L, HbA1c: <42 mmol/mol",
        significance: "Stabilizes energy levels and prevents sleep disruptions"
      }
    ],
    features: [
      "Sleep quality assessment and optimization",
      "Fatigue cause identification and treatment",
      "Hormone balance evaluation and correction",
      "Energy optimization insights and protocols"
    ],
    suitableFor: ["Chronic fatigue", "Sleep disorders", "Energy optimization", "Stress management", "Insomnia and sleep issues"],
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
    description: "Assessment of toxic load and detoxification capacity for environmental health optimization through comprehensive analysis of toxin exposure and elimination pathways.",
    biomarkers: [
      "Heavy Metals Panel", "Liver Detox Markers", "Glutathione", "Oxidative Stress Markers",
      "Phase I & II Detox Enzymes", "Environmental Toxin Markers"
    ],
    biomarkerDetails: [
      {
        name: "Heavy Metals Panel (Lead, Mercury, Cadmium, Arsenic)",
        description: "Toxic metals accumulated from environmental and occupational exposure",
        normalRange: "Lead: <10 μg/dL, Mercury: <5 μg/L, Cadmium: <1 μg/L",
        significance: "Identifies heavy metal toxicity affecting neurological and organ function"
      },
      {
        name: "Liver Detoxification Markers (ALT, AST, GGT)",
        description: "Enzymes indicating liver function and detoxification capacity",
        normalRange: "ALT: 7-56 U/L, AST: 10-40 U/L, GGT: 6-42 U/L",
        significance: "Assesses liver's ability to process and eliminate toxins"
      },
      {
        name: "Glutathione (GSH)",
        description: "Master antioxidant essential for detoxification and cellular protection",
        normalRange: "5.9-50.0 μmol/L",
        significance: "Primary cellular detoxifier and antioxidant protection system"
      },
      {
        name: "Oxidative Stress Markers (8-OHdG, MDA)",
        description: "Indicators of cellular damage from free radicals and toxins",
        normalRange: "8-OHdG: <15 ng/mL, MDA: <2.5 μmol/L",
        significance: "Measures cellular damage and antioxidant system effectiveness"
      },
      {
        name: "Phase I Detox Enzymes (CYP450)",
        description: "Liver enzymes responsible for initial toxin breakdown",
        normalRange: "Activity varies by specific enzyme",
        significance: "First step in toxin metabolism and elimination"
      },
      {
        name: "Phase II Detox Enzymes (GST, SULT, UGT)",
        description: "Conjugation enzymes making toxins water-soluble for elimination",
        normalRange: "Activity varies by specific enzyme",
        significance: "Final step in toxin processing for safe elimination"
      },
      {
        name: "Environmental Toxin Markers (PCBs, Pesticides)",
        description: "Persistent organic pollutants from environmental contamination",
        normalRange: "Varies by specific compound",
        significance: "Identifies exposure to environmental chemicals and pollutants"
      }
    ],
    features: [
      "Heavy metal detection and quantification",
      "Detoxification capacity assessment", 
      "Environmental exposure evaluation",
      "Liver function optimization and support protocols"
    ],
    suitableFor: ["Environmental exposure concerns", "Detox program monitoring", "Occupational health screening", "Wellness optimization", "Chronic illness investigation"],
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