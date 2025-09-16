import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building, Check, Upload } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  firstName: string;
  lastName: string;
  clinicName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  accountType: "individual" | "clinic";
}

interface ClinicData {
  clinicType: string;
  address: string;
  phone: string;
  website: string;
  nhsNumber: string;
  operatingHours: string;
  servicesOffered: string;
  staffCount: string;
  description: string;
}

export default function PartnerClinicDetails() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [basicData, setBasicData] = useState<FormData | null>(null);
  const [clinicData, setClinicData] = useState<ClinicData>({
    clinicType: "",
    address: "",
    phone: "",
    website: "",
    nhsNumber: "",
    operatingHours: "",
    servicesOffered: "",
    staffCount: "",
    description: ""
  });

  const clinicTypes = [
    "GP Practice",
    "Private Clinic", 
    "Dental Practice",
    "Physiotherapy Clinic",
    "Mental Health Centre",
    "Diagnostic Centre",
    "Specialist Clinic",
    "Multi-Specialty Centre",
    "Walk-in Centre",
    "Other"
  ];

  useEffect(() => {
    // Get basic data from sessionStorage
    const storedData = sessionStorage.getItem('partnerRegisterData');
    if (!storedData) {
      navigate('/partner-register');
      return;
    }
    const data = JSON.parse(storedData);
    if (data.accountType !== 'clinic') {
      navigate('/partner-register');
      return;
    }
    setBasicData(data);
  }, [navigate]);

  const handleInputChange = (field: keyof ClinicData, value: string) => {
    setClinicData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicData) return;
    
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!clinicData.clinicType || !clinicData.address || !clinicData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Create user account with clinic_staff user type
      const { error: signUpError } = await signUp(basicData.email, basicData.password, {
        full_name: `${basicData.firstName} ${basicData.lastName}`,
        user_type: 'clinic_staff'
      });

      if (signUpError) {
        toast({
          title: "Registration Failed",
          description: signUpError.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Update profile with clinic information
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update profiles table with clinic admin info
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            user_type: 'clinic_staff',
            full_name: `${basicData.firstName} ${basicData.lastName}`
          })
          .eq('user_id', user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }

        // Add clinic staff role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'clinic_staff'
          });

        if (roleError) {
          console.error('Role assignment error:', roleError);
        }

        // Store basic clinic info for future development
        // For now, clinic data is collected but stored in session/local storage
        // This can be extended when clinic management tables are added to the database
      }

      // Clear session storage
      sessionStorage.removeItem('partnerRegisterData');
      
      setIsSubmitted(true);
      
      toast({
        title: "Clinic Registration Successful!",
        description: "Your clinic account has been created. You can now access the clinic dashboard.",
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
            <CardTitle className="text-2xl">Clinic Application Submitted!</CardTitle>
            <CardDescription>
              Thanks for registering your clinic! We'll review your details and activate your profile shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>What happens next:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Document verification (1-2 business days)</li>
                <li>• Clinic profile activation</li>
                <li>• Welcome email with dashboard access</li>
                <li>• Set up staff profiles and services</li>
              </ul>
            </div>
            <Button onClick={() => navigate("/portal")} className="w-full">
              Go to Clinic Dashboard
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
            Clinic Registration
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Register Your Clinic</h1>
          <p className="text-muted-foreground">Complete your clinic profile to start offering services on our platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Clinic Information
            </CardTitle>
            <CardDescription>
              All information will be verified before account activation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Clinic Type */}
              <div className="space-y-2">
                <Label htmlFor="clinicType">Clinic Type *</Label>
                <select
                  id="clinicType"
                  value={clinicData.clinicType}
                  onChange={(e) => handleInputChange("clinicType", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select clinic type</option>
                  {clinicTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Clinic Address *</Label>
                <Textarea
                  id="address"
                  value={clinicData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter full clinic address including postcode"
                  className="min-h-[80px]"
                  required
                />
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Clinic Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={clinicData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+44 20 XXXX XXXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={clinicData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://www.yourclinic.co.uk"
                  />
                </div>
              </div>

              {/* NHS Number */}
              <div className="space-y-2">
                <Label htmlFor="nhsNumber">NHS Practice Code (if applicable)</Label>
                <Input
                  id="nhsNumber"
                  value={clinicData.nhsNumber}
                  onChange={(e) => handleInputChange("nhsNumber", e.target.value)}
                  placeholder="Enter NHS practice code"
                />
              </div>

              {/* Operating Hours */}
              <div className="space-y-2">
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Textarea
                  id="operatingHours"
                  value={clinicData.operatingHours}
                  onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                  placeholder="e.g., Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM"
                  className="min-h-[60px]"
                />
              </div>

              {/* Services Offered */}
              <div className="space-y-2">
                <Label htmlFor="servicesOffered">Services Offered</Label>
                <Textarea
                  id="servicesOffered"
                  value={clinicData.servicesOffered}
                  onChange={(e) => handleInputChange("servicesOffered", e.target.value)}
                  placeholder="List the main services your clinic provides"
                  className="min-h-[80px]"
                />
              </div>

              {/* Staff Count */}
              <div className="space-y-2">
                <Label htmlFor="staffCount">Number of Healthcare Staff</Label>
                <Input
                  id="staffCount"
                  type="number"
                  value={clinicData.staffCount}
                  onChange={(e) => handleInputChange("staffCount", e.target.value)}
                  placeholder="Approximate number of healthcare professionals"
                  min="1"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Clinic Description</Label>
                <Textarea
                  id="description"
                  value={clinicData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your clinic, specialties, and what makes you unique"
                  className="min-h-[100px]"
                />
              </div>

              {/* Document Upload Section */}
              <div className="space-y-4 p-4 border border-dashed rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Upload className="h-4 w-4" />
                  Required Documents
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Please prepare the following documents for verification:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Business registration certificate</li>
                    <li>Professional indemnity insurance</li>
                    <li>CQC registration (if applicable)</li>
                    <li>NHS contract (if applicable)</li>
                    <li>Public liability insurance</li>
                  </ul>
                  <p className="text-xs">Documents can be uploaded after initial registration</p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Submitting Application..." : "Submit Clinic Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}