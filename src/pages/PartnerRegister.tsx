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
    fullName: "",
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
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.password) {
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

        {/* Partnership Benefits & Rules */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Partnership Benefits
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subscription & Pricing Structure */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Partnership Investment & White-Label Solutions</h3>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                <h4 className="font-medium text-primary mb-3">Monthly Partnership Fee</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">Platform Access & Tools</span>
                  <span className="text-2xl font-bold text-primary">£29/month</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span>Commission on Sales</span>
                  <span className="font-medium">+ Percentage fee</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete access to the world's most advanced health platform with white-label solutions, 
                  drop-shipping services, and full lab partnership management.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">White-Label Kit Solutions</h4>
                <p className="text-sm text-green-700 mb-3">
                  We provide complete white-label blood test kits branded with your practice identity. 
                  Our team handles all printing, packaging, and drop-shipping directly to your patients. 
                  You simply place orders through your dashboard, and we take care of everything else.
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Custom branded test kits with your practice logo</li>
                  <li>• Direct drop-shipping to your patients nationwide</li>
                  <li>• All lab contracts and partnerships managed for you</li>
                  <li>• Professional result delivery and reporting</li>
                  <li>• Complete fulfillment and logistics handling</li>
                </ul>
              </div>
            </div>

            {/* How It Works */}
            <div>
              <h3 className="font-semibold text-lg mb-3">How the Partnership Works</h3>
              <p className="text-muted-foreground mb-4">
                Our partnership model is designed to be straightforward and profitable. You simply order blood tests through your dedicated 
                dashboard at partner prices, customize the pricing for your patients based on your practice needs, and keep the difference 
                as additional revenue. We handle all the laboratory processing, result delivery, and technical aspects while you focus on 
                patient care and growing your practice.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                  <h4 className="font-medium mb-2">Order Tests</h4>
                  <p className="text-sm text-muted-foreground">Access wholesale pricing through your partner dashboard</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                  <h4 className="font-medium mb-2">Set Your Prices</h4>
                  <p className="text-sm text-muted-foreground">Customize patient pricing with our recommended guidelines</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                  <h4 className="font-medium mb-2">Earn Revenue</h4>
                  <p className="text-sm text-muted-foreground">Generate additional income for your practice</p>
                </div>
              </div>
            </div>

            {/* Partnership Rules */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Partnership Terms & Standards</h3>
              <div className="space-y-4">
                <Collapsible open={collapsibleStates.pricing} onOpenChange={() => toggleCollapsible('pricing')}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 border-l-4 border-primary bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                      <h4 className="font-medium">Pricing Guidelines</h4>
                      {collapsibleStates.pricing ? (
                        <Minus className="h-5 w-5 text-primary" />
                      ) : (
                        <Plus className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 border-l-4 border-primary bg-muted/30">
                      <p className="text-sm">
                        To maintain market integrity and professional standards, partners must adhere to our pricing guidelines. 
                        You're free to set competitive prices but cannot advertise below our recommended retail prices without prior approval. 
                        Payment terms are flexible and will be discussed individually based on your practice requirements and partnership agreement.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={collapsibleStates.professional} onOpenChange={() => toggleCollapsible('professional')}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 border-l-4 border-orange-500 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                      <h4 className="font-medium">Professional Requirements</h4>
                      {collapsibleStates.professional ? (
                        <Minus className="h-5 w-5 text-orange-500" />
                      ) : (
                        <Plus className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 border-l-4 border-orange-500 bg-orange-25">
                      <p className="text-sm">
                        All partners must maintain current professional registration with relevant bodies (GMC, NMC, HCPC, etc.) and 
                        hold valid indemnity insurance. We require compliance with NICE guidelines for test recommendations and regular 
                        CPD participation. These standards ensure we maintain the highest quality of care across our partner network 
                        and protect both patients and practitioners.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={collapsibleStates.patientCare} onOpenChange={() => toggleCollapsible('patientCare')}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 border-l-4 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                      <h4 className="font-medium">Patient Care Excellence</h4>
                      {collapsibleStates.patientCare ? (
                        <Minus className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Plus className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 border-l-4 border-blue-500 bg-blue-25">
                      <p className="text-sm">
                        Our partnership is built on delivering exceptional patient care. Partners are expected to provide thorough 
                        consultations before recommending tests, explain results clearly and comprehensively, and offer appropriate 
                        follow-up care or specialist referrals when needed. All patient interactions must maintain strict confidentiality 
                        and full GDPR compliance to protect sensitive health information.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={collapsibleStates.support} onOpenChange={() => toggleCollapsible('support')}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 border-l-4 border-green-500 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                      <h4 className="font-medium">Comprehensive Support</h4>
                      {collapsibleStates.support ? (
                        <Minus className="h-5 w-5 text-green-500" />
                      ) : (
                        <Plus className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 border-l-4 border-green-500 bg-green-25">
                      <p className="text-sm">
                        When you join Nuvivo, you gain access to our extensive support network. This includes our nationwide laboratory 
                        infrastructure, automated result delivery systems, professional reporting tools, marketing support with co-branded 
                        materials, and a dedicated partner support team available to assist with any questions or technical issues you may encounter.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            {/* Agreement Confirmation */}
            <div className="p-4 bg-muted border rounded-lg">
              <p className="text-sm font-medium mb-2">Partnership Commitment</p>
              <p className="text-sm text-muted-foreground">
                By proceeding with registration, you agree to maintain the highest professional standards in all patient interactions, 
                use our services ethically and in patients' best interests, comply with all relevant medical regulations and guidelines, 
                and participate in quarterly partner reviews to ensure continuous improvement of our shared service quality.
              </p>
            </div>
          </CardContent>
        </Card>

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