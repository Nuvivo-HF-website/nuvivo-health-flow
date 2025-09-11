import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Shield, Check } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  fullName: string;
  clinicName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  accountType: "individual" | "clinic";
}

interface ProfessionalData {
  profession: string;
  specializations: string[];
  gmcNumber: string;
  availability: Record<string, { enabled: boolean; startTime: string; endTime: string }>;
  servicePrice: string;
  clinicAddress: string;
  bio: string;
}

export default function PartnerProfessionalDetails() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [basicData, setBasicData] = useState<FormData | null>(null);
  const [professionalData, setProfessionalData] = useState<ProfessionalData>({
    profession: "",
    specializations: [],
    gmcNumber: "",
    availability: {
      monday: { enabled: false, startTime: "09:00", endTime: "17:00" },
      tuesday: { enabled: false, startTime: "09:00", endTime: "17:00" },
      wednesday: { enabled: false, startTime: "09:00", endTime: "17:00" },
      thursday: { enabled: false, startTime: "09:00", endTime: "17:00" },
      friday: { enabled: false, startTime: "09:00", endTime: "17:00" },
      saturday: { enabled: false, startTime: "09:00", endTime: "17:00" },
      sunday: { enabled: false, startTime: "09:00", endTime: "17:00" }
    },
    servicePrice: "",
    clinicAddress: "",
    bio: ""
  });

  const professions = [
    "GP (General Practitioner)",
    "Nurse",
    "Physiotherapist", 
    "Psychologist",
    "Medical Specialist",
    "Therapist",
    "Nutritionist",
    "Counsellor"
  ];

  const specializationsByProfession = {
    "GP (General Practitioner)": [
      "Family Medicine",
      "Preventive Care",
      "Chronic Disease Management",
      "Minor Surgery",
      "Women's Health",
      "Men's Health",
      "Elderly Care",
      "Travel Medicine"
    ],
    "Nurse": [
      "Critical Care",
      "Pediatric Nursing", 
      "Geriatric Nursing",
      "Mental Health Nursing",
      "Community Nursing",
      "Surgical Nursing",
      "Emergency Nursing",
      "Oncology Nursing"
    ],
    "Physiotherapist": [
      "Sports Therapy",
      "Neurological Physiotherapy",
      "Orthopedic Physiotherapy",
      "Pediatric Physiotherapy",
      "Geriatric Physiotherapy",
      "Respiratory Physiotherapy",
      "Women's Health Physiotherapy",
      "Manual Therapy"
    ],
    "Psychologist": [
      "Clinical Psychology",
      "Counseling Psychology",
      "Child Psychology",
      "Health Psychology",
      "Neuropsychology",
      "Forensic Psychology",
      "Educational Psychology",
      "Occupational Psychology"
    ],
    "Medical Specialist": [
      "Cardiology",
      "Dermatology",
      "Endocrinology",
      "Gastroenterology",
      "General Medicine",
      "Geriatrics",
      "Hematology",
      "Infectious Disease",
      "Nephrology",
      "Neurology",
      "Oncology",
      "Orthopedics",
      "Psychiatry",
      "Pulmonology",
      "Rheumatology",
      "Urology"
    ],
    "Therapist": [
      "Occupational Therapy",
      "Speech Therapy",
      "Art Therapy",
      "Music Therapy",
      "Behavioral Therapy",
      "Cognitive Behavioral Therapy",
      "Family Therapy",
      "Group Therapy"
    ],
    "Nutritionist": [
      "Clinical Nutrition",
      "Sports Nutrition",
      "Pediatric Nutrition",
      "Geriatric Nutrition",
      "Weight Management",
      "Eating Disorders",
      "Community Nutrition",
      "Food Allergies & Intolerances"
    ],
    "Counsellor": [
      "Marriage Counseling",
      "Addiction Counseling",
      "Grief Counseling",
      "Career Counseling",
      "Trauma Counseling",
      "Youth Counseling",
      "Family Counseling",
      "Mental Health Counseling"
    ]
  };

  const getCurrentSpecializations = () => {
    return specializationsByProfession[professionalData.profession as keyof typeof specializationsByProfession] || [];
  };

  const getRegistrationBodyInfo = () => {
    switch (professionalData.profession) {
      case "GP (General Practitioner)":
      case "Medical Specialist":
        return { label: "GMC Number", placeholder: "Enter your GMC number" };
      case "Nurse":
        return { label: "NMC Number", placeholder: "Enter your NMC number" };
      case "Physiotherapist":
      case "Psychologist":
      case "Therapist":
      case "Nutritionist":
        return { label: "HCPC Registration Number", placeholder: "Enter your HCPC registration number" };
      case "Counsellor":
        return { label: "BACP/UKCP Registration Number", placeholder: "Enter your BACP/UKCP registration number" };
      default:
        return { label: "Professional Registration Number", placeholder: "Enter your registration number" };
    }
  };

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" }
  ];

  useEffect(() => {
    // Get basic data from sessionStorage
    const storedData = sessionStorage.getItem('partnerRegisterData');
    if (!storedData) {
      navigate('/partner-register');
      return;
    }
    setBasicData(JSON.parse(storedData));
  }, [navigate]);

  const handleInputChange = (field: keyof ProfessionalData, value: any) => {
    setProfessionalData(prev => {
      // Clear specializations when profession changes
      if (field === 'profession' && prev.profession !== value) {
        return { ...prev, [field]: value, specializations: [] };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSpecializationToggle = (specialization: string) => {
    setProfessionalData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setProfessionalData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicData) return;
    
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!professionalData.profession || !professionalData.gmcNumber || !professionalData.servicePrice) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      // Create user account
      const userType = basicData.accountType === 'clinic' ? 'clinic_staff' : 'doctor';
      const { error: signUpError } = await signUp(basicData.email, basicData.password, {
        full_name: basicData.fullName,
        user_type: userType
      });

      if (signUpError) {
        toast({
          title: "Registration Failed",
          description: signUpError.message,
          variant: "destructive"
        });
        return;
      }

      // Update profile with professional information
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            user_type: userType,
            full_name: basicData.fullName
          })
          .eq('user_id', user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }

        // Add appropriate role
        const role = basicData.accountType === 'clinic' ? 'clinic_staff' : 'doctor';
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: role
          });

        if (roleError) {
          console.error('Role assignment error:', roleError);
        }

        // Create specialist profile if individual account
        if (basicData.accountType === 'individual') {
          const availableDays = Object.entries(professionalData.availability)
            .filter(([_, config]) => config.enabled)
            .map(([day]) => day);

          const { error: specialistError } = await supabase
            .from('specialists')
            .insert({
              user_id: user.id,
              specialty: professionalData.specializations.join(', '),
              experience_years: 0,
              bio: professionalData.bio || `${professionalData.profession} specializing in ${professionalData.specializations.join(', ')}`,
              consultation_fee: parseFloat(professionalData.servicePrice),
              available_days: availableDays,
              is_active: false // Will be activated after verification
            });

          if (specialistError) {
            console.error('Specialist profile error:', specialistError);
          }
        }
      }

      // Clear session storage
      sessionStorage.removeItem('partnerRegisterData');
      
      setIsSubmitted(true);
      
      toast({
        title: "Registration Successful!",
        description: "Your professional account has been created. You can now access the staff dashboard.",
      });

      // Redirect to portal after a short delay
      setTimeout(() => {
        navigate('/portal');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
            <CardDescription>
              Thanks for applying! We'll review your details and activate your profile shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>What happens next:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Document verification (1-2 business days)</li>
                <li>• Profile activation</li>
                <li>• Welcome email with dashboard access</li>
              </ul>
            </div>
            <Button onClick={() => navigate("/portal")} className="w-full">
              Go to Staff Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!basicData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity w-fit">
            <img 
              src="/lovable-uploads/d10bf310-8418-438d-af09-376e2c242db8.png" 
              alt="Nuvivo Health Logo" 
              className="w-12 h-12 object-contain"
            />
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-3xl pt-8">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            Partner Registration
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Join Nuvivo as a Healthcare Professional</h1>
          <p className="text-muted-foreground">Complete your application to start offering services on our platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Professional Information
            </CardTitle>
            <CardDescription>
              All information will be verified before account activation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profession Selection */}
              <div className="space-y-2">
                <Label htmlFor="profession">Profession *</Label>
                <Select 
                  value={professionalData.profession} 
                  onValueChange={(value) => handleInputChange("profession", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map(profession => (
                      <SelectItem key={profession} value={profession}>
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specializations */}
              {professionalData.profession && getCurrentSpecializations().length > 0 && (
                <div className="space-y-4">
                  <Label>Specializations (Select multiple) *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {getCurrentSpecializations().map(specialization => (
                      <div key={specialization} className="flex items-center space-x-2">
                        <Checkbox 
                          id={specialization}
                          checked={professionalData.specializations.includes(specialization)}
                          onCheckedChange={() => handleSpecializationToggle(specialization)}
                        />
                        <Label htmlFor={specialization} className="text-sm">
                          {specialization}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration Number */}
              <div className="space-y-2">
                <Label htmlFor="gmcNumber">{getRegistrationBodyInfo().label} *</Label>
                <Input
                  id="gmcNumber"
                  value={professionalData.gmcNumber}
                  onChange={(e) => handleInputChange("gmcNumber", e.target.value)}
                  placeholder={getRegistrationBodyInfo().placeholder}
                  required
                />
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <Label>Availability *</Label>
                <div className="space-y-3">
                  {days.map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <Checkbox 
                        id={key}
                        checked={professionalData.availability[key].enabled}
                        onCheckedChange={(checked) => 
                          handleAvailabilityChange(key, "enabled", checked)
                        }
                      />
                      <Label htmlFor={key} className="w-20">
                        {label}
                      </Label>
                      {professionalData.availability[key].enabled && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={professionalData.availability[key].startTime}
                            onChange={(e) => 
                              handleAvailabilityChange(key, "startTime", e.target.value)
                            }
                            className="w-24"
                          />
                          <span className="text-sm text-muted-foreground">to</span>
                          <Input
                            type="time"
                            value={professionalData.availability[key].endTime}
                            onChange={(e) => 
                              handleAvailabilityChange(key, "endTime", e.target.value)
                            }
                            className="w-24"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price of Service */}
              <div className="space-y-2">
                <Label htmlFor="servicePrice">Price of Service (£ per consultation) *</Label>
                <Input
                  id="servicePrice"
                  type="number"
                  value={professionalData.servicePrice}
                  onChange={(e) => handleInputChange("servicePrice", e.target.value)}
                  placeholder="150"
                  required
                />
              </div>

              {/* Required Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Required Documents</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Indemnity Insurance *</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (max 10MB)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>DBS / PVG Check *</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (max 10MB)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinic Address */}
              <div className="space-y-2">
                <Label htmlFor="clinicAddress">Clinic Address (Optional)</Label>
                <Textarea
                  id="clinicAddress"
                  value={professionalData.clinicAddress}
                  onChange={(e) => handleInputChange("clinicAddress", e.target.value)}
                  placeholder="Enter your clinic address if you have one"
                  rows={3}
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={professionalData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself and your experience"
                  rows={4}
                />
              </div>

              {/* Payment Setup */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Setup</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Payment processing will be set up via Stripe Connect after your application is approved. 
                    You'll receive a secure link to complete your payment details.
                  </p>
                </div>
              </div>

              {/* Terms */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  By submitting this application, you agree to our Terms of Service and Privacy Policy. 
                  Your application will be reviewed within 1-2 business days.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Creating Partnered Account..." : "Create Partnered Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}