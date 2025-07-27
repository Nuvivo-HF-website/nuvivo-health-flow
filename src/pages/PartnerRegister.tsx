import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Shield, Check, ArrowLeft, User, Building, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function PartnerRegister() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [accountType, setAccountType] = useState<"individual" | "clinic">("individual");
  const [formData, setFormData] = useState({
    fullName: "",
    clinicName: "",
    email: "",
    mobile: "",
    profession: "",
    registrationNumber: "",
    clinicAddress: "",
    teamSize: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.profession || !formData.registrationNumber || !formData.password) {
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

    // Simulate registration process
    setIsSubmitted(true);
    
    toast({
      title: "Application Submitted!",
      description: "We'll review your details and activate your profile shortly.",
    });
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
            <Button onClick={() => navigate("/")} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
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
              {/* Conditional Fields Based on Account Type */}
              {accountType === "individual" ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Dr. John Smith"
                      required
                    />
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
                      <Label htmlFor="fullName">Admin Contact Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Dr. Sarah Johnson"
                        required
                      />
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
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession *</Label>
                  <Select value={formData.profession} onValueChange={(value) => handleInputChange("profession", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gp">GP (General Practitioner)</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="physio">Physiotherapist</SelectItem>
                      <SelectItem value="psychologist">Psychologist</SelectItem>
                      <SelectItem value="specialist">Medical Specialist</SelectItem>
                      <SelectItem value="therapist">Therapist</SelectItem>
                      <SelectItem value="nutritionist">Nutritionist</SelectItem>
                      <SelectItem value="counsellor">Counsellor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Professional Registration Number *</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                  placeholder="GMC, NMC, HCPC, etc."
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Your GMC, NMC, HCPC or other relevant professional registration number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicAddress">Clinic Address (Optional)</Label>
                <Textarea
                  id="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={(e) => handleInputChange("clinicAddress", e.target.value)}
                  placeholder="Enter your clinic address if you have one"
                  rows={3}
                />
              </div>

              {/* Document Uploads */}
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

              {/* Terms */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  By submitting this application, you agree to our Terms of Service and Privacy Policy. 
                  Your application will be reviewed within 1-2 business days.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                {accountType === "clinic" ? "Submit Clinic Application" : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}