import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Stethoscope, Building, Plus, Minus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function PartnerRegister() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<"individual" | "clinic">("individual");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    clinicName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const [collapsibleStates, setCollapsibleStates] = useState({
    pricing: false,
    professional: false,
    patientCare: false,
    support: false
  });

  const toggleCollapsible = (key: keyof typeof collapsibleStates) => {
    setCollapsibleStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    // Store form data in sessionStorage and navigate to next step
    sessionStorage.setItem('partnerRegisterData', JSON.stringify({
      ...formData,
      accountType
    }));

    if (accountType === 'individual') {
      navigate('/partner-professional-details');
    } else {
      // For clinic registration, we can navigate to a different page or handle differently
      navigate('/partner-professional-details');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      {/* Simple Header with Logo */}
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

      <div className="container mx-auto px-4 max-w-2xl pt-8">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            Partner Registration
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Join Nuvivo as a Healthcare Professional</h1>
          <p className="text-muted-foreground">Complete your application to start offering services on our platform</p>
        </div>


        {/* Account Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Choose Account Type</CardTitle>
            <CardDescription>Are you joining as an individual or representing a clinic?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={accountType} 
              onValueChange={(value: "individual" | "clinic") => setAccountType(value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Label htmlFor="individual" className="cursor-pointer">
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="individual" id="individual" />
                  <div className="flex items-center gap-3 flex-1">
                    <Stethoscope className="h-6 w-6 text-primary" />
                    <div>
                      <div className="font-medium">
                        Individual Professional
                      </div>
                      <p className="text-sm text-muted-foreground">Doctor, nurse, therapist, or specialist</p>
                    </div>
                  </div>
                </div>
              </Label>
              <Label htmlFor="clinic" className="cursor-pointer">
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="clinic" id="clinic" />
                  <div className="flex items-center gap-3 flex-1">
                    <Building className="h-6 w-6 text-primary" />
                    <div>
                      <div className="font-medium">
                        Clinic or Health Centre
                      </div>
                      <p className="text-sm text-muted-foreground">Manage multiple professionals & locations</p>
                    </div>
                  </div>
                </div>
              </Label>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter your basic details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Conditional Fields Based on Account Type */}
              {accountType === "individual" ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Smith"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john.smith@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      placeholder="+44 7XXX XXXXXX"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Clinic Name *</Label>
                    <Input
                      id="clinicName"
                      value={formData.clinicName}
                      onChange={(e) => handleInputChange("clinicName", e.target.value)}
                      placeholder="Active Health Clinic"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Admin First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Sarah"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Admin Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Johnson"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="admin@activehealthclinic.co.uk"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      placeholder="+44 7XXX XXXXXX"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Account Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Security</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Create a strong password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Continue to Professional Details
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}